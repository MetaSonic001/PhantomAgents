from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import asyncio
import asyncpg
import hashlib
import json
import os
from datetime import datetime
import httpx
import time
from cryptography.fernet import Fernet

app = FastAPI(title="PhantomAgents Backend API")

# ==========================================
# CONFIGURATION
# ==========================================
MOCK_BLOCKCHAIN = os.getenv("MOCK_BLOCKCHAIN", "true").lower() == "true"

# Ensure the ENCRYPTION_KEY is bytes for Fernet
_encryption_env = os.getenv("ENCRYPTION_KEY")
if _encryption_env:
    ENCRYPTION_KEY = _encryption_env.encode()
else:
    ENCRYPTION_KEY = Fernet.generate_key()
cipher = Fernet(ENCRYPTION_KEY)

STARKNET_RPC = os.getenv("STARKNET_RPC", "https://starknet-sepolia.public.blastapi.io")
# Database (Postgres / Supabase). If None, the app uses in-memory fallback stores.
DATABASE_URL = os.getenv("DATABASE_URL")
# asyncpg pool (initialized on startup if DATABASE_URL provided)
db_pool: Optional[asyncpg.pool.Pool] = None
scheduler_task: Optional[asyncio.Task] = None
REGISTRY_CONTRACT = os.getenv("REGISTRY_CONTRACT", "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7")
VERIFIER_CONTRACT = os.getenv("VERIFIER_CONTRACT", "0x04a8f2e9c36f5b8d3e1234567890abcdef1234567890abcdef1234567890abcd")
MARKETPLACE_CONTRACT = os.getenv("MARKETPLACE_CONTRACT", "0x05b9e3d0f47a6c8e2d3456789abcdef0123456789abcdef0123456789abcdef")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# IN-MEMORY STORAGE
# ==========================================
agents_db = {}
proofs_db = {}
api_keys_db = {}
subscriptions_db = {}
actions_db = {}
listings_db = {}
purchases_db = {}
schedules_db = {}
events_db = {}

# ==========================================
# MODELS
# ==========================================
class AgentCreate(BaseModel):
    name: str
    description: str
    personality: str
    capabilities: List[str]
    data_sources: Optional[List[str]] = []
    rules: Optional[Dict[str, Any]] = {}
    visibility: str = "private"
    pricing: Optional[Dict[str, Any]] = None

class LLMRequest(BaseModel):
    agent_id: str
    prompt: str
    provider: str = "groqcloud"
    model: Optional[str] = None

class ProofRequest(BaseModel):
    agent_id: str
    action_type: str
    action_data: Dict[str, Any]

class APIKeyStore(BaseModel):
    provider: str
    api_key: str

# ==========================================
# HELPER FUNCTIONS
# ==========================================
def compute_hash(data: str) -> str:
    """Compute deterministic hash"""
    return hashlib.sha256(data.encode()).hexdigest()

def encrypt_data(data: str) -> str:
    """Encrypt sensitive data"""
    return cipher.encrypt(data.encode()).decode()

def decrypt_data(encrypted: str) -> str:
    """Decrypt sensitive data"""
    return cipher.decrypt(encrypted.encode()).decode()

def generate_mock_tx_hash(data: str) -> str:
    """Generate realistic-looking transaction hash"""
    return "0x" + compute_hash(f"{data}{time.time()}")[:64]

def generate_mock_block_number() -> int:
    """Generate realistic block number"""
    return int(time.time()) % 1000000 + 500000

async def call_llm(prompt: str, provider: str, api_key: str, model: Optional[str] = None) -> str:
    """Call LLM provider (GroqCloud or Gemini)"""
    try:
        if provider == "groqcloud":
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": model or "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                if response.status_code != 200:
                    raise HTTPException(500, f"GroqCloud API error: {response.text}")
                data = response.json()
                return data["choices"][0]["message"]["content"]
        
        elif provider == "gemini":
            model_name = model or "gemini-1.5-flash"
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{"parts": [{"text": prompt}]}]
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                if response.status_code != 200:
                    raise HTTPException(500, f"Gemini API error: {response.text}")
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
        
        else:
            raise HTTPException(400, f"Unsupported provider: {provider}")
    
    except httpx.TimeoutException:
        raise HTTPException(504, "LLM provider timeout")
    except Exception as e:
        raise HTTPException(500, f"LLM call failed: {str(e)}")


async def make_tx_receipt(action_desc: str) -> Dict[str, Any]:
    tx_hash = generate_mock_tx_hash(action_desc)
    return {
        "tx_hash": tx_hash,
        "status": "ACCEPTED",
        "timestamp": int(time.time())
    }


async def run_agent_action(agent_id: str, user_id: str, payload: Dict[str, Any], trigger: str = "manual") -> Dict[str, Any]:
    """Core runner used by endpoints and scheduler. Calls the agent's LLM provider, stores action, proof, and returns tx receipt."""
    # load agent
    agent = None
    if db_pool:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("SELECT data FROM agents WHERE id = $1", agent_id)
            if not row:
                raise HTTPException(404, "Agent not found")
            agent = row["data"]
    else:
        if agent_id not in agents_db:
            raise HTTPException(404, "Agent not found")
        agent = agents_db[agent_id]

    # determine provider and api key
    provider = payload.get("provider", "groqcloud")
    api_key = None
    if db_pool:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("SELECT encrypted_key FROM api_keys WHERE user_id = $1 AND provider = $2", user_id, provider)
            if not row:
                raise HTTPException(400, f"API key not configured for {provider}")
            api_key = decrypt_data(row["encrypted_key"])
    else:
        if user_id not in api_keys_db or provider not in api_keys_db[user_id]:
            raise HTTPException(400, f"API key not configured for {provider}")
        api_key = decrypt_data(api_keys_db[user_id][provider])

    # build prompt
    prompt = payload.get("prompt", "")
    enhanced_prompt = f"Agent {agent.get('name')} executing trigger={trigger}: {prompt}"

    # Call LLM
    result_text = await call_llm(enhanced_prompt, provider, api_key, payload.get("model"))

    # generate proof
    proof = generate_noir_proof_mock(agent, result_text, payload.get("action_type", "run"))

    # persist action, proof, and event
    action_id = compute_hash(f"{agent_id}{user_id}{time.time()}")[:16]
    action_record = {
        "id": action_id,
        "agent_id": agent_id,
        "user_id": user_id,
        "payload": payload,
        "result": result_text,
        "proof_hash": proof["proof_hash"],
        "created_at": datetime.utcnow().isoformat()
    }

    if db_pool:
        async with db_pool.acquire() as conn:
            await conn.execute("INSERT INTO actions (agent_id, user_id, action_type, payload) VALUES ($1,$2,$3,$4)", agent_id, user_id, payload.get("action_type","run"), json.dumps(action_record))
            await conn.execute("INSERT INTO proofs (proof_hash, agent_id, action_payload_hash, proof) VALUES ($1,$2,$3,$4) ON CONFLICT (proof_hash) DO NOTHING;", proof["proof_hash"], agent_id, proof["action_payload_hash"], json.dumps(proof))
            await conn.execute("INSERT INTO events (type, payload) VALUES ($1, $2)", "action", json.dumps({"action_id": action_id, "agent_id": agent_id}))
    else:
        actions_db[action_id] = action_record
        proofs_db[proof["proof_hash"]] = {"id": proof["proof_hash"], "agent_id": agent_id, "proof": proof, "created_at": datetime.utcnow().isoformat(), "verified": True}

    # mock tx
    tx = await make_tx_receipt(f"run:{agent_id}:{action_id}")

    return {
        "action_id": action_id,
        "result": result_text,
        "proof": proof,
        "tx": tx
    }

def generate_noir_proof_mock(agent_config: Dict, action_output: str, action_type: str) -> Dict[str, Any]:
    """Generate mock ZK proof (simulates Noir circuit)"""
    proof_input = {
        "agent_id": agent_config["id"],
        "config_hash": agent_config["metadata_hash"],
        "action_type": action_type,
        "output": action_output,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    proof_hash = compute_hash(json.dumps(proof_input, sort_keys=True))
    action_payload_hash = compute_hash(action_output)
    
    return {
        "proof_hash": proof_hash,
        "action_payload_hash": action_payload_hash,
        "public_inputs": {
            "agent_id": agent_config["id"],
            "action_type": action_type,
            "action_payload_hash": action_payload_hash
        },
        "circuit_used": "phantom_agent_circuit",
        "prover": "garaga_mock"
    }

async def submit_to_starknet_mock(contract_address: str, function: str, calldata: Dict) -> Dict[str, Any]:
    """Mock Starknet transaction submission"""
    # Simulate blockchain delay
    await httpx.AsyncClient().get("http://httpbin.org/delay/2", timeout=3)  # 2 second delay
    
    tx_hash = generate_mock_tx_hash(f"{function}{json.dumps(calldata)}")
    block_number = generate_mock_block_number()
    
    return {
        "transaction_hash": tx_hash,
        "block_number": block_number,
        "contract_address": contract_address,
        "function": function,
        "status": "ACCEPTED_ON_L2",
        "explorer_url": f"https://sepolia.starkscan.co/tx/{tx_hash}"
    }


    # ---------------------------
    # Database helper and startup
    # ---------------------------
    async def init_db():
        global db_pool
        if not DATABASE_URL:
            return

        db_pool = await asyncpg.create_pool(DATABASE_URL)

        # Create minimal schema if it doesn't exist
        create_sql = [
            """
            CREATE TABLE IF NOT EXISTS agents (
                id TEXT PRIMARY KEY,
                owner TEXT NOT NULL,
                data JSONB NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                status TEXT
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS api_keys (
                user_id TEXT NOT NULL,
                provider TEXT NOT NULL,
                encrypted_key TEXT NOT NULL,
                PRIMARY KEY (user_id, provider)
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS actions (
                id SERIAL PRIMARY KEY,
                agent_id TEXT,
                user_id TEXT,
                action_type TEXT,
                payload JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS proofs (
                id SERIAL PRIMARY KEY,
                proof_hash TEXT UNIQUE,
                agent_id TEXT,
                action_payload_hash TEXT,
                proof JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS listings (
                id TEXT PRIMARY KEY,
                seller TEXT NOT NULL,
                data JSONB NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS purchases (
                id SERIAL PRIMARY KEY,
                listing_id TEXT,
                buyer TEXT,
                data JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS schedules (
                id TEXT PRIMARY KEY,
                owner TEXT,
                cron TEXT,
                data JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
            """,
            """
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                type TEXT,
                payload JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
            """,
        ]

        async with db_pool.acquire() as conn:
            for sql in create_sql:
                await conn.execute(sql)


    @app.on_event("startup")
    async def on_startup():
        await init_db()
        # start scheduler loop
        global scheduler_task
        if not scheduler_task:
            scheduler_task = asyncio.create_task(scheduler_loop())


    @app.on_event("shutdown")
    async def on_shutdown():
        global db_pool
        if db_pool:
            await db_pool.close()
        global scheduler_task
        if scheduler_task:
            scheduler_task.cancel()
            try:
                await scheduler_task
            except asyncio.CancelledError:
                pass


    async def scheduler_loop():
        """Background loop that triggers scheduled runs."""
        while True:
            try:
                # read schedules from DB or in-memory
                schedules = []
                if db_pool:
                    async with db_pool.acquire() as conn:
                        rows = await conn.fetch("SELECT data FROM schedules")
                        schedules = [r["data"] for r in rows]
                else:
                    schedules = list(schedules_db.values())

                for sched in schedules:
                    # sched expected to have agent_id and interval seconds
                    agent_id = sched.get("agent_id")
                    interval = int(sched.get("interval", 60))
                    last_run = sched.get("_last_run", 0)
                    now_ts = int(time.time())
                    if now_ts - last_run >= interval:
                        # mark last run
                        sched["_last_run"] = now_ts
                        # trigger run, run as background fire-and-forget
                        asyncio.create_task(run_agent_action(agent_id, sched.get("owner","system"), {"prompt": "scheduled run", "provider": "groqcloud"}, trigger="scheduled"))

            except Exception:
                pass

            await asyncio.sleep(5)

# ==========================================
# AUTH HELPER
# ==========================================
async def get_user_id(authorization: Optional[str] = Header(None)) -> str:
    """Extract user ID from authorization header"""
    if not authorization:
        return "demo_user"
    return authorization.replace("Bearer ", "")

# ==========================================
# API ROUTES
# ==========================================

@app.get("/")
def root():
    return {
        "status": "PhantomAgents Backend Running",
        "version": "1.0.0",
        "mode": "MOCK" if MOCK_BLOCKCHAIN else "PRODUCTION",
        "starknet_rpc": STARKNET_RPC if not MOCK_BLOCKCHAIN else "MOCK",
        "contracts": {
            "registry": REGISTRY_CONTRACT,
            "verifier": VERIFIER_CONTRACT,
            "marketplace": MARKETPLACE_CONTRACT
        }
    }

@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# ==========================================
# API KEYS MANAGEMENT
# ==========================================

@app.post("/api/keys/store")
async def store_api_key(key_data: APIKeyStore, user_id: str = Depends(get_user_id)):
    """Store encrypted API key for LLM provider"""
    encrypted_key = encrypt_data(key_data.api_key)

    # Persist to Postgres if pool available
    if db_pool:
        async with db_pool.acquire() as conn:
            await conn.execute(
                "INSERT INTO api_keys (user_id, provider, encrypted_key) VALUES ($1, $2, $3) "
                "ON CONFLICT (user_id, provider) DO UPDATE SET encrypted_key = EXCLUDED.encrypted_key;",
                user_id,
                key_data.provider,
                encrypted_key,
            )
    else:
        if user_id not in api_keys_db:
            api_keys_db[user_id] = {}
        api_keys_db[user_id][key_data.provider] = encrypted_key

    return {
        "success": True,
        "message": f"{key_data.provider} API key stored securely",
        "provider": key_data.provider,
    }

@app.get("/api/keys/list")
async def list_api_keys(user_id: str = Depends(get_user_id)):
    """List configured API key providers"""
    if db_pool:
        async with db_pool.acquire() as conn:
            rows = await conn.fetch("SELECT provider FROM api_keys WHERE user_id = $1", user_id)
            providers = [r["provider"] for r in rows]
            return {"providers": providers}

    if user_id not in api_keys_db:
        return {"providers": []}

    return {"providers": list(api_keys_db[user_id].keys())}

# ==========================================
# AGENT MANAGEMENT
# ==========================================

@app.post("/api/agents/create")
async def create_agent(agent: AgentCreate, user_id: str = Depends(get_user_id)):
    """Create new AI agent"""
    agent_id = compute_hash(f"{user_id}{agent.name}{datetime.utcnow()}")[:16]
    
    # Compute metadata hash (commitment)
    metadata_string = json.dumps({
        "name": agent.name,
        "personality": agent.personality,
        "capabilities": agent.capabilities,
        "rules": agent.rules
    }, sort_keys=True)
    
    metadata_hash = compute_hash(metadata_string)
    
    agent_config = {
        "id": agent_id,
        "name": agent.name,
        "description": agent.description,
        "personality": agent.personality,
        "capabilities": agent.capabilities,
        "data_sources": agent.data_sources,
        "rules": agent.rules,
        "visibility": agent.visibility,
        "pricing": agent.pricing,
        "creator": user_id,
        "metadata_hash": metadata_hash,
        "created_at": datetime.utcnow().isoformat(),
        "status": "draft",
        "action_count": 0,
        "proof_count": 0
    }
    
    agents_db[agent_id] = agent_config

    # Persist agent to DB if available
    if db_pool:
        async with db_pool.acquire() as conn:
            await conn.execute(
                "INSERT INTO agents (id, owner, data, created_at, status) VALUES ($1, $2, $3, $4, $5) "
                "ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, status = EXCLUDED.status;",
                agent_id,
                user_id,
                json.dumps(agent_config),
                datetime.utcnow(),
                agent_config["status"],
            )

    return {
        "success": True,
        "agent_id": agent_id,
        "metadata_hash": metadata_hash,
        "message": "Agent created successfully",
    }

@app.get("/api/agents")
async def list_agents(user_id: str = Depends(get_user_id)):
    """List user's agents"""
    if db_pool:
        async with db_pool.acquire() as conn:
            rows = await conn.fetch("SELECT data FROM agents WHERE owner = $1", user_id)
            user_agents = [r["data"] for r in rows]
            return {"agents": user_agents, "count": len(user_agents)}

    user_agents = [a for a in agents_db.values() if a["creator"] == user_id]
    return {"agents": user_agents, "count": len(user_agents)}

@app.get("/api/agents/{agent_id}")
async def get_agent(agent_id: str, user_id: str = Depends(get_user_id)):
    """Get agent details"""
    if db_pool:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("SELECT data FROM agents WHERE id = $1", agent_id)
            if not row:
                raise HTTPException(404, "Agent not found")
            agent = row["data"]
            if agent.get("creator") != user_id and agent.get("visibility") == "private":
                raise HTTPException(403, "Access denied")
            return agent

    if agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")

    agent = agents_db[agent_id]
    if agent["creator"] != user_id and agent["visibility"] == "private":
        raise HTTPException(403, "Access denied")

    return agent

@app.post("/api/agents/{agent_id}/register")
async def register_agent(agent_id: str, user_id: str = Depends(get_user_id)):
    """Register agent on Starknet"""
    if agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")
    
    agent = agents_db[agent_id]
    
    if agent["creator"] != user_id:
        raise HTTPException(403, "Not authorized")
    
    # Prepare calldata
    calldata = {
        "agent_id": agent_id,
        "metadata_hash": agent["metadata_hash"],
        "capabilities_count": len(agent["capabilities"]),
        "creator": user_id
    }
    
    # Submit to Starknet (mock or real)
    if MOCK_BLOCKCHAIN:
        result = await submit_to_starknet_mock(REGISTRY_CONTRACT, "register_agent", calldata)
    else:
        # Real Starknet submission would go here
        result = await submit_to_starknet_mock(REGISTRY_CONTRACT, "register_agent", calldata)
    
    # Update agent status
    agent["status"] = "registered"
    agent["tx_hash"] = result["transaction_hash"]
    agent["block_number"] = result["block_number"]
    agent["on_chain_id"] = agent_id

    # Persist updated agent to DB if enabled
    if db_pool:
        async with db_pool.acquire() as conn:
            await conn.execute(
                "UPDATE agents SET data = $1 WHERE id = $2",
                json.dumps(agent),
                agent_id,
            )
    
    return {
        "success": True,
        "agent_id": agent_id,
        "tx_hash": result["transaction_hash"],
        "block_number": result["block_number"],
        "explorer_url": result["explorer_url"],
        "contract_address": REGISTRY_CONTRACT,
        "message": "✅ Agent registered on Starknet"
    }

# ==========================================
# LLM EXECUTION
# ==========================================

@app.post("/api/llm/execute")
async def execute_llm(request: LLMRequest, user_id: str = Depends(get_user_id)):
    """Execute LLM with agent context"""
    if request.agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")
    
    agent = agents_db[request.agent_id]
    
    # Check API key
    api_key = None
    if db_pool:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT encrypted_key FROM api_keys WHERE user_id = $1 AND provider = $2",
                user_id,
                request.provider,
            )
            if not row:
                raise HTTPException(400, f"API key not configured for {request.provider}")
            api_key = decrypt_data(row["encrypted_key"])
    else:
        if user_id not in api_keys_db or request.provider not in api_keys_db[user_id]:
            raise HTTPException(400, f"API key not configured for {request.provider}")
        api_key = decrypt_data(api_keys_db[user_id][request.provider])
    
    # Build enhanced prompt with agent context
    enhanced_prompt = f"""You are {agent['name']}, an AI agent with the following profile:

**Personality:** {agent['personality']}
**Description:** {agent['description']}
**Capabilities:** {', '.join(agent['capabilities'])}

**User Request:** {request.prompt}

Respond according to your personality and capabilities. Be helpful, accurate, and stay in character."""
    
    # Call LLM
    response = await call_llm(enhanced_prompt, request.provider, api_key, request.model)
    
    # Generate proof hash
    proof_hash = compute_hash(f"{request.agent_id}{request.prompt}{response}{datetime.utcnow()}")
    # Persist proof and update agent stats
    if db_pool:
        async with db_pool.acquire() as conn:
            # store proof record
            await conn.execute(
                "INSERT INTO proofs (proof_hash, agent_id, action_payload_hash, proof) VALUES ($1, $2, $3, $4) ON CONFLICT (proof_hash) DO NOTHING;",
                proof_hash,
                request.agent_id,
                compute_hash(response),
                json.dumps({"provider": request.provider, "response": response}),
            )

            # update agent action_count
            row = await conn.fetchrow("SELECT data FROM agents WHERE id = $1", request.agent_id)
            if row:
                agent_data = row["data"]
                agent_data["action_count"] = agent_data.get("action_count", 0) + 1
                await conn.execute("UPDATE agents SET data = $1 WHERE id = $2", json.dumps(agent_data), request.agent_id)
    else:
        agent["action_count"] = agent.get("action_count", 0) + 1

    return {
        "success": True,
        "response": response,
        "proof_hash": proof_hash,
        "agent_id": request.agent_id,
        "provider": request.provider,
        "timestamp": datetime.utcnow().isoformat(),
    }

# ==========================================
# ZERO-KNOWLEDGE PROOFS
# ==========================================

@app.post("/api/proofs/generate")
async def generate_proof(request: ProofRequest, user_id: str = Depends(get_user_id)):
    """Generate ZK proof for agent action"""
    if request.agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")
    
    agent = agents_db[request.agent_id]
    
    if agent["creator"] != user_id:
        raise HTTPException(403, "Not authorized")
    
    # Generate proof (mock Noir circuit)
    action_output = json.dumps(request.action_data)
    proof = generate_noir_proof_mock(agent, action_output, request.action_type)
    
    # Store proof
    proof_id = compute_hash(f"{request.agent_id}{datetime.utcnow()}")[:16]
    proofs_db[proof_id] = {
        "id": proof_id,
        "agent_id": request.agent_id,
        "proof": proof,
        "action_type": request.action_type,
        "action_data": request.action_data,
        "created_at": datetime.utcnow().isoformat(),
        "verified": False
    }
    
    # Update agent stats
    agent["proof_count"] = agent.get("proof_count", 0) + 1
    
    return {
        "success": True,
        "proof_id": proof_id,
        "proof_hash": proof["proof_hash"],
        "action_payload_hash": proof["action_payload_hash"],
        "public_inputs": proof["public_inputs"],
        "circuit": proof["circuit_used"],
        "prover": proof["prover"]
    }

@app.post("/api/proofs/{proof_id}/submit")
async def submit_proof(proof_id: str, user_id: str = Depends(get_user_id)):
    """Submit proof to Starknet verifier"""
    if proof_id not in proofs_db:
        raise HTTPException(404, "Proof not found")
    
    proof_data = proofs_db[proof_id]
    proof = proof_data["proof"]
    
    # Prepare calldata
    calldata = {
        "agent_id": proof_data["agent_id"],
        "proof_hash": proof["proof_hash"],
        "action_payload_hash": proof["action_payload_hash"],
        "submitter": user_id
    }
    
    # Submit to Starknet (mock or real)
    if MOCK_BLOCKCHAIN:
        result = await submit_to_starknet_mock(VERIFIER_CONTRACT, "submit_action_proof", calldata)
    else:
        # Real Starknet submission
        result = await submit_to_starknet_mock(VERIFIER_CONTRACT, "submit_action_proof", calldata)
    
    # Update proof status
    proof_data["tx_hash"] = result["transaction_hash"]
    proof_data["block_number"] = result["block_number"]
    proof_data["verified"] = True
    proof_data["verified_at"] = datetime.utcnow().isoformat()
    
    return {
        "success": True,
        "proof_id": proof_id,
        "tx_hash": result["transaction_hash"],
        "block_number": result["block_number"],
        "explorer_url": result["explorer_url"],
        "message": "✅ Proof verified on Starknet"
    }

@app.get("/api/proofs/{agent_id}")
async def get_agent_proofs(agent_id: str):
    """Get all proofs for an agent"""
    agent_proofs = [p for p in proofs_db.values() if p["agent_id"] == agent_id]
    return {
        "proofs": agent_proofs,
        "count": len(agent_proofs)
    }

# ==========================================
# MARKETPLACE
# ==========================================

@app.post("/api/marketplace/list")
async def list_on_marketplace(
    agent_id: str,
    price: int,
    user_id: str = Depends(get_user_id)
):
    """List agent on marketplace"""
    if agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")
    
    agent = agents_db[agent_id]
    
    if agent["creator"] != user_id:
        raise HTTPException(403, "Not authorized")
    
    # Prepare calldata
    calldata = {
        "agent_id": agent_id,
        "price": price,
        "creator": user_id
    }
    
    # Submit to Starknet
    if MOCK_BLOCKCHAIN:
        result = await submit_to_starknet_mock(MARKETPLACE_CONTRACT, "list_agent", calldata)
    else:
        result = await submit_to_starknet_mock(MARKETPLACE_CONTRACT, "list_agent", calldata)
    
    # Update agent
    agent["marketplace_listed"] = True
    agent["price"] = price
    agent["listing_tx_hash"] = result["transaction_hash"]
    
    return {
        "success": True,
        "agent_id": agent_id,
        "price": price,
        "tx_hash": result["transaction_hash"],
        "explorer_url": result["explorer_url"],
        "message": "✅ Agent listed on marketplace"
    }


# ---------------------------
# Non-/api compatibility endpoints (user requested paths)
# ---------------------------


@app.post("/agents/register")
async def agents_register(body: Dict[str, Any], user_id: str = Depends(get_user_id)):
    """Create and register an agent in one call.
    Expects: { name, description, personality, capabilities, data_sources, rules, visibility, pricing }
    """
    agent_payload = AgentCreate(**body)
    # create agent
    resp = await create_agent(agent_payload, user_id=user_id)
    agent_id = resp["agent_id"]
    # register on-chain (mock)
    reg = await register_agent(agent_id, user_id=user_id)
    return {"success": True, "agent_id": agent_id, "register": reg}


@app.post("/agents/{agent_id}/run")
async def agents_run(agent_id: str, payload: Dict[str, Any], user_id: str = Depends(get_user_id)):
    """Run an agent: triggers LLM, stores action, proof, returns tx receipt"""
    result = await run_agent_action(agent_id, user_id, payload, trigger=payload.get("trigger","manual"))
    return result


@app.get("/agents/{agent_id}/actions")
async def agents_actions(agent_id: str):
    # Return actions for agent
    if db_pool:
        async with db_pool.acquire() as conn:
            rows = await conn.fetch("SELECT payload FROM actions WHERE agent_id = $1 ORDER BY created_at DESC", agent_id)
            actions = [r["payload"] for r in rows]
            return {"actions": actions}

    agent_actions = [a for a in actions_db.values() if a["agent_id"] == agent_id]
    return {"actions": agent_actions}


@app.get("/proofs/{proof_id}")
async def get_proof(proof_id: str):
    # Try DB first
    if db_pool:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("SELECT proof FROM proofs WHERE proof_hash = $1 OR id::text = $1", proof_id)
            if not row:
                raise HTTPException(404, "Proof not found")
            return {"proof": row["proof"]}

    # fallback
    if proof_id not in proofs_db:
        raise HTTPException(404, "Proof not found")
    return {"proof": proofs_db[proof_id]}


@app.post("/marketplace/{listing_id}/purchase")
async def marketplace_purchase(listing_id: str, user_id: str = Depends(get_user_id)):
    # Simulate purchase and create tx
    if db_pool:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("SELECT data FROM listings WHERE id = $1", listing_id)
            if not row:
                raise HTTPException(404, "Listing not found")
            purchase_id = compute_hash(f"{listing_id}{user_id}{time.time()}")[:16]
            await conn.execute("INSERT INTO purchases (listing_id, buyer, data) VALUES ($1,$2,$3)", listing_id, user_id, json.dumps({"purchase_id": purchase_id}))
            await conn.execute("INSERT INTO events (type, payload) VALUES ($1,$2)", "purchase", json.dumps({"purchase_id": purchase_id, "listing_id": listing_id}))
            tx = await make_tx_receipt(f"purchase:{listing_id}:{purchase_id}")
            return {"success": True, "purchase_id": purchase_id, "tx": tx}

    if listing_id not in listings_db:
        raise HTTPException(404, "Listing not found")
    purchase_id = compute_hash(f"{listing_id}{user_id}{time.time()}")[:16]
    purchases_db[purchase_id] = {"id": purchase_id, "listing_id": listing_id, "buyer": user_id, "created_at": datetime.utcnow().isoformat()}
    events_db[purchase_id] = {"type": "purchase", "payload": {"purchase_id": purchase_id, "listing_id": listing_id}}
    tx = await make_tx_receipt(f"purchase:{listing_id}:{purchase_id}")
    return {"success": True, "purchase_id": purchase_id, "tx": tx}


@app.post("/keys/store")
async def keys_store(key_data: APIKeyStore, user_id: str = Depends(get_user_id)):
    return await store_api_key(key_data, user_id=user_id)


@app.get("/keys/{agent_id}")
async def keys_for_agent(agent_id: str):
    # return encrypted key(s) for owner of agent
    owner = None
    if db_pool:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("SELECT owner FROM agents WHERE id = $1", agent_id)
            if not row:
                raise HTTPException(404, "Agent not found")
            owner = row["owner"]
            rows = await conn.fetch("SELECT provider, encrypted_key FROM api_keys WHERE user_id = $1", owner)
            return {"keys": [{"provider": r["provider"], "encrypted_key": r["encrypted_key"]} for r in rows]}

    if agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")
    owner = agents_db[agent_id]["creator"]
    if owner not in api_keys_db:
        return {"keys": []}
    return {"keys": [{"provider": p, "encrypted_key": api_keys_db[owner][p]} for p in api_keys_db[owner].keys()]}


@app.post("/keys/delete")
async def keys_delete(body: Dict[str, Any], user_id: str = Depends(get_user_id)):
    provider = body.get("provider")
    if not provider:
        raise HTTPException(400, "provider required")
    if db_pool:
        async with db_pool.acquire() as conn:
            await conn.execute("DELETE FROM api_keys WHERE user_id = $1 AND provider = $2", user_id, provider)
            return {"success": True}
    if user_id in api_keys_db and provider in api_keys_db[user_id]:
        del api_keys_db[user_id][provider]
    return {"success": True}


@app.post("/scheduler/set")
async def scheduler_set(body: Dict[str, Any], user_id: str = Depends(get_user_id)):
    # body should include agent_id and cron or interval (we'll store simple interval seconds)
    agent_id = body.get("agent_id")
    interval = int(body.get("interval", 60))
    sched_id = compute_hash(f"{agent_id}{user_id}{time.time()}")[:16]
    record = {"id": sched_id, "agent_id": agent_id, "owner": user_id, "interval": interval, "created_at": datetime.utcnow().isoformat()}
    if db_pool:
        async with db_pool.acquire() as conn:
            await conn.execute("INSERT INTO schedules (id, owner, cron, data) VALUES ($1,$2,$3,$4)", sched_id, user_id, str(interval), json.dumps(record))
            return {"success": True, "schedule_id": sched_id}
    schedules_db[sched_id] = record
    return {"success": True, "schedule_id": sched_id}


@app.get("/scheduler/{agent_id}")
async def scheduler_for_agent(agent_id: str):
    if db_pool:
        async with db_pool.acquire() as conn:
            rows = await conn.fetch("SELECT data FROM schedules WHERE data->>'agent_id' = $1", agent_id)
            return {"schedules": [r["data"] for r in rows]}
    return {"schedules": [s for s in schedules_db.values() if s["agent_id"] == agent_id]}


@app.get("/analytics/agent/{agent_id}")
async def analytics_agent(agent_id: str):
    # Return usage_count, mock accuracy, ROI, run_history
    usage_count = 0
    run_history = []
    if db_pool:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("SELECT count(*)::int FROM actions WHERE agent_id = $1", agent_id)
            usage_count = row["count"] if row else 0
            rows = await conn.fetch("SELECT payload FROM actions WHERE agent_id = $1 ORDER BY created_at DESC LIMIT 50", agent_id)
            run_history = [r["payload"] for r in rows]
    else:
        entries = [a for a in actions_db.values() if a["agent_id"] == agent_id]
        usage_count = len(entries)
        run_history = entries

    return {
        "usage_count": usage_count,
        "accuracy_score": 0.9,  # mocked
        "roi": 1.5,  # mocked
        "run_history": run_history
    }

@app.get("/api/marketplace/agents")
async def get_marketplace_agents():
    """Get all marketplace listed agents"""
    listed = [a for a in agents_db.values() if a.get("marketplace_listed", False) and a["visibility"] == "public"]
    return {
        "agents": listed,
        "count": len(listed)
    }


@app.get("/api/marketplace/{listing_id}")
async def get_marketplace_listing(listing_id: str):
    """Get a single marketplace listing by id"""
    if db_pool:
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow("SELECT data FROM listings WHERE id = $1", listing_id)
            if not row:
                raise HTTPException(404, "Listing not found")
            return {"listing": row["data"]}

    if listing_id not in listings_db:
        raise HTTPException(404, "Listing not found")
    return {"listing": listings_db[listing_id]}

@app.post("/api/marketplace/subscribe")
async def subscribe_to_agent(
    agent_id: str,
    user_id: str = Depends(get_user_id)
):
    """Subscribe to agent on marketplace"""
    if agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")
    
    agent = agents_db[agent_id]
    
    if not agent.get("marketplace_listed"):
        raise HTTPException(400, "Agent not listed on marketplace")
    
    # Create subscription
    sub_id = compute_hash(f"{user_id}{agent_id}{datetime.utcnow()}")[:16]
    subscriptions_db[sub_id] = {
        "id": sub_id,
        "agent_id": agent_id,
        "subscriber": user_id,
        "price": agent.get("price", 0),
        "created_at": datetime.utcnow().isoformat(),
        "active": True
    }
    
    return {
        "success": True,
        "subscription_id": sub_id,
        "agent_id": agent_id,
        "message": "✅ Subscribed to agent"
    }

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Run PhantomAgents FastAPI app")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload (dev)")
    args = parser.parse_args()

    try:
        import uvicorn
    except Exception:
        print("uvicorn is not installed in the current environment.")
        print("Install with: pip install 'uvicorn[standard]'")
        raise

    # When run as a script, start uvicorn programmatically so `python main.py` works
    # Use the app instance directly to avoid import path problems when running from the backend folder.
    uvicorn.run(app, host=args.host, port=args.port, reload=args.reload)