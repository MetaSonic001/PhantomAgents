from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import hashlib
import json
import os
from datetime import datetime
import httpx
from starknet_py.net.full_node_client import FullNodeClient
from starknet_py.net.account.account import Account
from starknet_py.net.signer.stark_curve_signer import KeyPair
from starknet_py.contract import Contract
from starknet_py.net.models import StarknetChainId
from cryptography.fernet import Fernet
import subprocess
import tempfile

app = FastAPI(title="PhantomAgents Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (use Redis/PostgreSQL in production)
agents_db = {}
proofs_db = {}
api_keys_db = {}

# Encryption key for storing sensitive data
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", Fernet.generate_key())
cipher = Fernet(ENCRYPTION_KEY)

# Starknet config
STARKNET_RPC = os.getenv("STARKNET_RPC", "https://starknet-sepolia.public.blastapi.io")
REGISTRY_CONTRACT = os.getenv("REGISTRY_CONTRACT", "0x...")
VERIFIER_CONTRACT = os.getenv("VERIFIER_CONTRACT", "0x...")
MARKETPLACE_CONTRACT = os.getenv("MARKETPLACE_CONTRACT", "0x...")

# Models
class AgentCreate(BaseModel):
    name: str
    description: str
    personality: str
    capabilities: List[str]
    data_sources: Optional[List[str]] = []
    rules: Optional[Dict[str, Any]] = {}
    visibility: str = "private"
    pricing: Optional[Dict[str, Any]] = None

class AgentUpdate(BaseModel):
    description: Optional[str] = None
    personality: Optional[str] = None
    capabilities: Optional[List[str]] = None
    rules: Optional[Dict[str, Any]] = None

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

# Helper functions
def compute_hash(data: str) -> str:
    """Compute Poseidon-compatible hash (simplified)"""
    return hashlib.sha256(data.encode()).hexdigest()

def encrypt_data(data: str) -> str:
    """Encrypt sensitive data"""
    return cipher.encrypt(data.encode()).decode()

def decrypt_data(encrypted: str) -> str:
    """Decrypt sensitive data"""
    return cipher.decrypt(encrypted.encode()).decode()

async def call_llm(prompt: str, provider: str, api_key: str, model: Optional[str] = None) -> str:
    """Call LLM provider"""
    if provider == "groqcloud":
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        payload = {
            "model": model or "llama-3.3-70b-versatile",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }
    elif provider == "gemini":
        model = model or "gemini-1.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
    else:
        raise HTTPException(400, "Unsupported provider")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload, headers=headers)
        if response.status_code != 200:
            raise HTTPException(500, f"LLM call failed: {response.text}")
        
        data = response.json()
        if provider == "groqcloud":
            return data["choices"][0]["message"]["content"]
        else:
            return data["candidates"][0]["content"]["parts"][0]["text"]

def generate_noir_proof(agent_config: Dict, action_output: str, action_type: str) -> Dict[str, Any]:
    """Generate ZK proof using Noir (simplified for hackathon)"""
    # In production, this would compile and run actual Noir circuits
    # For hackathon, we'll generate a deterministic proof hash
    
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
        }
    }

async def submit_to_starknet(contract_address: str, function: str, calldata: List[int]) -> str:
    """Submit transaction to Starknet"""
    # This is a simplified version - in production use proper account abstraction
    try:
        client = FullNodeClient(node_url=STARKNET_RPC)
        # For hackathon: return mock tx hash
        tx_hash = f"0x{compute_hash(f'{function}{calldata}')[:64]}"
        return tx_hash
    except Exception as e:
        print(f"Starknet error: {e}")
        return f"0x{compute_hash(str(datetime.utcnow()))[:64]}"

# Auth helper
async def get_user_id(authorization: Optional[str] = Header(None)) -> str:
    """Extract user ID from auth header"""
    if not authorization:
        return "anonymous"
    # In production: verify JWT/signature
    return authorization.replace("Bearer ", "")

# API Routes

@app.get("/")
def root():
    return {"status": "PhantomAgents Backend Running", "version": "1.0.0"}

@app.post("/api/keys/store")
async def store_api_key(key_data: APIKeyStore, user_id: str = Depends(get_user_id)):
    """Store encrypted API key"""
    encrypted_key = encrypt_data(key_data.api_key)
    if user_id not in api_keys_db:
        api_keys_db[user_id] = {}
    api_keys_db[user_id][key_data.provider] = encrypted_key
    return {"success": True, "message": "API key stored securely"}

@app.post("/api/agents/create")
async def create_agent(agent: AgentCreate, user_id: str = Depends(get_user_id)):
    """Create new agent"""
    agent_id = compute_hash(f"{user_id}{agent.name}{datetime.utcnow()}")[:16]
    
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
        "created_at": datetime.utcnow().isoformat(),
        "status": "draft"
    }
    
    # Compute metadata hash
    metadata_string = json.dumps({
        "name": agent.name,
        "personality": agent.personality,
        "capabilities": agent.capabilities,
        "rules": agent.rules
    }, sort_keys=True)
    
    agent_config["metadata_hash"] = compute_hash(metadata_string)
    
    agents_db[agent_id] = agent_config
    
    return {
        "agent_id": agent_id,
        "metadata_hash": agent_config["metadata_hash"],
        "message": "Agent created successfully"
    }

@app.get("/api/agents/{agent_id}")
async def get_agent(agent_id: str, user_id: str = Depends(get_user_id)):
    """Get agent details"""
    if agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")
    
    agent = agents_db[agent_id]
    if agent["creator"] != user_id and agent["visibility"] == "private":
        raise HTTPException(403, "Access denied")
    
    return agent

@app.get("/api/agents")
async def list_agents(user_id: str = Depends(get_user_id)):
    """List user's agents"""
    user_agents = [a for a in agents_db.values() if a["creator"] == user_id]
    return {"agents": user_agents, "count": len(user_agents)}

@app.put("/api/agents/{agent_id}")
async def update_agent(agent_id: str, update: AgentUpdate, user_id: str = Depends(get_user_id)):
    """Update agent configuration"""
    if agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")
    
    agent = agents_db[agent_id]
    if agent["creator"] != user_id:
        raise HTTPException(403, "Not authorized")
    
    if update.description:
        agent["description"] = update.description
    if update.personality:
        agent["personality"] = update.personality
    if update.capabilities:
        agent["capabilities"] = update.capabilities
    if update.rules:
        agent["rules"] = update.rules
    
    # Recompute hash
    metadata_string = json.dumps({
        "name": agent["name"],
        "personality": agent["personality"],
        "capabilities": agent["capabilities"],
        "rules": agent["rules"]
    }, sort_keys=True)
    agent["metadata_hash"] = compute_hash(metadata_string)
    
    return {"success": True, "metadata_hash": agent["metadata_hash"]}

@app.post("/api/agents/{agent_id}/register")
async def register_agent(agent_id: str, user_id: str = Depends(get_user_id)):
    """Register agent on Starknet"""
    if agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")
    
    agent = agents_db[agent_id]
    if agent["creator"] != user_id:
        raise HTTPException(403, "Not authorized")
    
    # Submit to Starknet Registry
    calldata = [
        int(agent["metadata_hash"][:16], 16),  # Simplified
        len(agent["capabilities"])
    ]
    
    tx_hash = await submit_to_starknet(REGISTRY_CONTRACT, "register_agent", calldata)
    
    agent["status"] = "registered"
    agent["tx_hash"] = tx_hash
    agent["on_chain_id"] = agent_id
    
    return {
        "success": True,
        "tx_hash": tx_hash,
        "agent_id": agent_id,
        "explorer_url": f"https://sepolia.starkscan.co/tx/{tx_hash}"
    }

@app.post("/api/llm/execute")
async def execute_llm(request: LLMRequest, user_id: str = Depends(get_user_id)):
    """Execute LLM call with agent context"""
    if request.agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")
    
    agent = agents_db[request.agent_id]
    
    # Get API key
    if user_id not in api_keys_db or request.provider not in api_keys_db[user_id]:
        raise HTTPException(400, "API key not configured for this provider")
    
    api_key = decrypt_data(api_keys_db[user_id][request.provider])
    
    # Build enhanced prompt with agent context
    enhanced_prompt = f"""You are {agent['name']}, an AI agent with the following characteristics:

Personality: {agent['personality']}
Description: {agent['description']}
Capabilities: {', '.join(agent['capabilities'])}

User request: {request.prompt}

Respond according to your personality and capabilities."""
    
    # Call LLM
    response = await call_llm(enhanced_prompt, request.provider, api_key, request.model)
    
    # Generate deterministic proof hash
    proof_hash = compute_hash(f"{request.agent_id}{request.prompt}{response}")
    
    return {
        "response": response,
        "proof_hash": proof_hash,
        "agent_id": request.agent_id,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/proofs/generate")
async def generate_proof(request: ProofRequest, user_id: str = Depends(get_user_id)):
    """Generate ZK proof for agent action"""
    if request.agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")
    
    agent = agents_db[request.agent_id]
    if agent["creator"] != user_id:
        raise HTTPException(403, "Not authorized")
    
    # Generate proof
    action_output = json.dumps(request.action_data)
    proof = generate_noir_proof(agent, action_output, request.action_type)
    
    # Store proof
    proof_id = compute_hash(f"{request.agent_id}{datetime.utcnow()}")[:16]
    proofs_db[proof_id] = {
        "id": proof_id,
        "agent_id": request.agent_id,
        "proof": proof,
        "action_type": request.action_type,
        "created_at": datetime.utcnow().isoformat()
    }
    
    return {
        "proof_id": proof_id,
        "proof_hash": proof["proof_hash"],
        "action_payload_hash": proof["action_payload_hash"],
        "public_inputs": proof["public_inputs"]
    }

@app.post("/api/proofs/{proof_id}/submit")
async def submit_proof(proof_id: str, user_id: str = Depends(get_user_id)):
    """Submit proof to Starknet verifier"""
    if proof_id not in proofs_db:
        raise HTTPException(404, "Proof not found")
    
    proof_data = proofs_db[proof_id]
    proof = proof_data["proof"]
    
    # Submit to Starknet Verifier
    calldata = [
        int(proof_data["agent_id"][:16], 16),
        int(proof["proof_hash"][:16], 16),
        int(proof["action_payload_hash"][:16], 16)
    ]
    
    tx_hash = await submit_to_starknet(VERIFIER_CONTRACT, "submit_action_proof", calldata)
    
    proof_data["tx_hash"] = tx_hash
    proof_data["verified"] = True
    
    return {
        "success": True,
        "tx_hash": tx_hash,
        "explorer_url": f"https://sepolia.starkscan.co/tx/{tx_hash}"
    }

@app.get("/api/proofs/{agent_id}")
async def get_agent_proofs(agent_id: str):
    """Get all proofs for an agent"""
    agent_proofs = [p for p in proofs_db.values() if p["agent_id"] == agent_id]
    return {"proofs": agent_proofs, "count": len(agent_proofs)}

@app.post("/api/marketplace/list")
async def list_on_marketplace(agent_id: str, price: int, user_id: str = Depends(get_user_id)):
    """List agent on marketplace"""
    if agent_id not in agents_db:
        raise HTTPException(404, "Agent not found")
    
    agent = agents_db[agent_id]
    if agent["creator"] != user_id:
        raise HTTPException(403, "Not authorized")
    
    calldata = [
        int(agent_id[:16], 16),
        price
    ]
    
    tx_hash = await submit_to_starknet(MARKETPLACE_CONTRACT, "list_agent", calldata)
    
    agent["marketplace_listed"] = True
    agent["price"] = price
    
    return {
        "success": True,
        "tx_hash": tx_hash,
        "agent_id": agent_id
    }

@app.get("/api/marketplace/agents")
async def get_marketplace_agents():
    """Get all marketplace listed agents"""
    listed = [a for a in agents_db.values() if a.get("marketplace_listed", False)]
    return {"agents": listed, "count": len(listed)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)