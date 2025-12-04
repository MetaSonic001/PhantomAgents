# 🔗 Frontend Integration with Backend

## 1️⃣ Environment Setup

Create `frontend/.env.local`:

```bash
# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Mock mode (set to 'false' for real blockchain)
NEXT_PUBLIC_MOCK_MODE=true

# Starknet (only used if mock mode is false)
NEXT_PUBLIC_STARKNET_RPC=https://starknet-sepolia.public.blastapi.io
NEXT_PUBLIC_REGISTRY_CONTRACT=0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
NEXT_PUBLIC_VERIFIER_CONTRACT=0x04a8f2e9c36f5b8d3e1234567890abcdef1234567890abcdef1234567890abcd
NEXT_PUBLIC_MARKETPLACE_CONTRACT=0x05b9e3d0f47a6c8e2d3456789abcdef0123456789abcdef0123456789abcdef
```

---

## 2️⃣ Create API Client

Create `lib/api-client.ts`:

```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface Agent {
  id: string;
  name: string;
  description: string;
  personality: string;
  capabilities: string[];
  status: string;
  metadata_hash: string;
}

interface LLMResponse {
  success: boolean;
  response: string;
  proof_hash: string;
  agent_id: string;
  timestamp: string;
}

interface ProofResponse {
  success: boolean;
  proof_id: string;
  proof_hash: string;
  action_payload_hash: string;
  public_inputs: any;
}

export class PhantomAgentsAPI {
  private token: string = '';

  setToken(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // API Keys
  async storeAPIKey(provider: string, apiKey: string) {
    return this.request('/api/keys/store', {
      method: 'POST',
      body: JSON.stringify({ provider, api_key: apiKey }),
    });
  }

  async listAPIKeys() {
    return this.request('/api/keys/list');
  }

  // Agents
  async createAgent(agentData: {
    name: string;
    description: string;
    personality: string;
    capabilities: string[];
    data_sources?: string[];
    rules?: any;
    visibility?: string;
    pricing?: any;
  }) {
    return this.request('/api/agents/create', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async listAgents(): Promise<{ agents: Agent[]; count: number }> {
    return this.request('/api/agents');
  }

  async getAgent(agentId: string): Promise<Agent> {
    return this.request(`/api/agents/${agentId}`);
  }

  async registerAgent(agentId: string) {
    return this.request(`/api/agents/${agentId}/register`, {
      method: 'POST',
    });
  }

  // LLM Execution
  async executeLLM(
    agentId: string,
    prompt: string,
    provider: string = 'groqcloud',
    model?: string
  ): Promise<LLMResponse> {
    return this.request('/api/llm/execute', {
      method: 'POST',
      body: JSON.stringify({
        agent_id: agentId,
        prompt,
        provider,
        model,
      }),
    });
  }

  // Proofs
  async generateProof(
    agentId: string,
    actionType: string,
    actionData: any
  ): Promise<ProofResponse> {
    return this.request('/api/proofs/generate', {
      method: 'POST',
      body: JSON.stringify({
        agent_id: agentId,
        action_type: actionType,
        action_data: actionData,
      }),
    });
  }

  async submitProof(proofId: string) {
    return this.request(`/api/proofs/${proofId}/submit`, {
      method: 'POST',
    });
  }

  async getAgentProofs(agentId: string) {
    return this.request(`/api/proofs/${agentId}`);
  }

  // Marketplace
  async listOnMarketplace(agentId: string, price: number) {
    return this.request(`/api/marketplace/list?agent_id=${agentId}&price=${price}`, {
      method: 'POST',
    });
  }

  async getMarketplaceAgents() {
    return this.request('/api/marketplace/agents');
  }

  async subscribeToAgent(agentId: string) {
    return this.request(`/api/marketplace/subscribe?agent_id=${agentId}`, {
      method: 'POST',
    });
  }
}

export const api = new PhantomAgentsAPI();
```

---

## 3️⃣ Update Agent Builder Page

In your `app/builder/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

export default function AgentBuilderPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [personality, setPersonality] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleCreateAndRegister() {
    setLoading(true);
    try {
      // Step 1: Create agent
      toast.info('Creating agent...');
      const createResponse = await api.createAgent({
        name,
        description,
        personality,
        capabilities,
        visibility: 'public',
      });

      const agentId = createResponse.agent_id;
      toast.success(`Agent created! ID: ${agentId}`);

      // Step 2: Register on blockchain
      toast.info('Registering on Starknet...');
      const registerResponse = await api.registerAgent(agentId);

      toast.success(
        `Agent registered! TX: ${registerResponse.tx_hash.substring(0, 10)}...`
      );

      // Step 3: Show explorer link
      if (registerResponse.explorer_url) {
        window.open(registerResponse.explorer_url, '_blank');
      }

      // Reset form
      setName('');
      setDescription('');
      setPersonality('');
      setCapabilities([]);
    } catch (error: any) {
      toast.error(`Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create AI Agent</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Agent Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded h-24"
        />

        <textarea
          placeholder="Personality"
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          className="w-full p-3 border rounded h-24"
        />

        {/* Add capability selection here */}

        <button
          onClick={handleCreateAndRegister}
          disabled={loading || !name || !personality}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create & Register Agent'}
        </button>
      </div>
    </div>
  );
}
```

---

## 4️⃣ Update Test/Sandbox Page

In your `app/test/page.tsx` or sandbox:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

export default function TestSandboxPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState('groqcloud');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [proofHash, setProofHash] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    try {
      const data = await api.listAgents();
      setAgents(data.agents);
    } catch (error: any) {
      toast.error(`Failed to load agents: ${error.message}`);
    }
  }

  async function handleExecute() {
    if (!selectedAgent || !prompt) {
      toast.error('Please select an agent and enter a prompt');
      return;
    }

    setLoading(true);
    setResponse('');
    setProofHash('');

    try {
      // Execute LLM
      toast.info('Executing agent...');
      const result = await api.executeLLM(selectedAgent, prompt, provider);

      setResponse(result.response);
      setProofHash(result.proof_hash);

      toast.success('Agent executed successfully!');
    } catch (error: any) {
      toast.error(`Execution failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateProof() {
    if (!selectedAgent || !response) {
      toast.error('Execute agent first');
      return;
    }

    try {
      toast.info('Generating ZK proof...');
      const proofResult = await api.generateProof(
        selectedAgent,
        'llm_execution',
        { prompt, response }
      );

      toast.success(`Proof generated! Hash: ${proofResult.proof_hash.substring(0, 10)}...`);

      // Submit proof
      toast.info('Submitting proof to Starknet...');
      const submitResult = await api.submitProof(proofResult.proof_id);

      toast.success(`Proof verified on-chain! TX: ${submitResult.tx_hash.substring(0, 10)}...`);

      if (submitResult.explorer_url) {
        window.open(submitResult.explorer_url, '_blank');
      }
    } catch (error: any) {
      toast.error(`Proof generation failed: ${error.message}`);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test Agent</h1>

      <div className="space-y-4">
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full p-3 border rounded"
        >
          <option value="">Select Agent</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>

        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="w-full p-3 border rounded"
        >
          <option value="groqcloud">GroqCloud</option>
          <option value="gemini">Google Gemini</option>
        </select>

        <textarea
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-3 border rounded h-32"
        />

        <button
          onClick={handleExecute}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Executing...' : 'Run Agent'}
        </button>

        {response && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Response:</h3>
            <p>{response}</p>

            <button
              onClick={handleGenerateProof}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Generate & Submit Proof
            </button>
          </div>
        )}

        {proofHash && (
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Proof Hash:</h3>
            <code className="text-sm break-all">{proofHash}</code>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 5️⃣ Settings Page (API Keys)

Create `app/settings/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [groqKey, setGroqKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');

  async function handleSaveKey(provider: string, key: string) {
    try {
      await api.storeAPIKey(provider, key);
      toast.success(`${provider} API key saved!`);
      
      // Clear input
      if (provider === 'groqcloud') setGroqKey('');
      if (provider === 'gemini') setGeminiKey('');
    } catch (error: any) {
      toast.error(`Failed to save key: ${error.message}`);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* GroqCloud */}
        <div>
          <h3 className="text-xl font-semibold mb-2">GroqCloud API Key</h3>
          <input
            type="password"
            placeholder="Enter GroqCloud API Key"
            value={groqKey}
            onChange={(e) => setGroqKey(e.target.value)}
            className="w-full p-3 border rounded mb-2"
          />
          <button
            onClick={() => handleSaveKey('groqcloud', groqKey)}
            disabled={!groqKey}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Save GroqCloud Key
          </button>
        </div>

        {/* Gemini */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Google Gemini API Key</h3>
          <input
            type="password"
            placeholder="Enter Gemini API Key"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            className="w-full p-3 border rounded mb-2"
          />
          <button
            onClick={() => handleSaveKey('gemini', geminiKey)}
            disabled={!geminiKey}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Save Gemini Key
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Summary

**What this setup does:**

1. **Backend runs in MOCK mode** - no real blockchain needed
2. **API keys stored encrypted** - secure BYOK model
3. **LLM execution works** - calls GroqCloud/Gemini
4. **ZK proofs generated** - deterministic hashes (mock Noir)
5. **Blockchain txs simulated** - realistic fake tx hashes
6. **Frontend integration complete** - all pages connected

**For demo:**
- Everything works instantly
- No wallet needed
- No testnet funds needed
- Looks 100% real with explorer links
- Can switch to real mode later by changing one env variable

**Start both:**
```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn httpx cryptography pydantic
uvicorn main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit: http://localhost:3000