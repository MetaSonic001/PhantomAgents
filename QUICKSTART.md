# PhantomAgents - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Python 3.9+ (for backend)
- Node.js 18+ (for frontend)
- pip or conda for Python packages

### Backend Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
pip install fastapi uvicorn httpx cryptography asyncpg pydantic
```

Or with conda:
```bash
conda install fastapi uvicorn httpx cryptography asyncpg pydantic -c conda-forge
```

3. **Start the backend server:**
```bash
python main.py
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend folder (from project root):**
```bash
cd ..  # if you're in backend folder
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
bun install
```

3. **Start the development server:**
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The frontend will run on `http://localhost:3000`

## 🎭 Demo Features

### Pre-configured Agents
The platform comes with 3 demo agents ready to explore:
- **Crypto Trader Pro** - Trading agent with market analysis
- **Market Analysis Bot** - Research assistant (private)
- **Governance Voter** - DAO delegate for governance

### What You Can Do

#### 1. **Browse Agents** (`/dashboard/agents`)
- View all your agents
- Run agents manually
- Monitor performance metrics
- Share agents

#### 2. **Marketplace** (`/dashboard/marketplace`)
- Browse available agents
- Subscribe to agents
- View ratings and reviews

#### 3. **Agent Builder** (`/builder`)
- Create new agents from scratch
- Configure identity, capabilities, and rules
- Register agents on mock blockchain
- Set up API keys (BYO Keys)

#### 4. **Dashboard** (`/dashboard`)
- Overview of all agents
- Activity feed
- Revenue tracking
- Action history

## 🔑 API Keys Setup

To run agents with real LLM providers:

1. Go to Builder → Testing & Deploy section
2. Find "Bring Your Own API Key" section
3. Select provider (GroqCloud or Gemini)
4. Enter your API key
5. Click "Save Key"

Keys are encrypted and stored on the backend.

## 🧪 Mock Blockchain

The platform runs with a **mock blockchain** by default:
- All transactions return mock hashes
- Proofs are generated instantly
- No real blockchain interaction needed
- Perfect for demos and testing

## 📊 Key Endpoints

### Backend API
- `http://localhost:8000/` - API info
- `http://localhost:8000/health` - Health check
- `http://localhost:8000/api/agents` - List agents
- `http://localhost:8000/api/marketplace/agents` - Marketplace listings

### Frontend Routes
- `/` - Landing page
- `/dashboard` - Main dashboard
- `/dashboard/agents` - Agent management
- `/dashboard/marketplace` - Agent marketplace
- `/builder` - Agent builder

## 🎨 Theme Support

Toggle between light and dark modes using the theme switcher in the navigation bar.

## 🐛 Troubleshooting

### Backend won't start
- Make sure all dependencies are installed
- Check Python version (3.9+)
- Try: `pip install --upgrade fastapi uvicorn`

### Frontend build errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Check Node version (18+)

### "Failed to load agents" error
- Make sure backend is running on port 8000
- Check browser console for CORS errors
- Verify `NEXT_PUBLIC_BACKEND_URL` in `.env.local`

### Agent run fails
- Ensure you've configured API keys in the builder
- Check backend logs for detailed errors
- Verify the agent is registered (status: "registered")

## 🎯 Demo Flow

1. **Start backend and frontend** (see above)
2. **Browse marketplace** - See pre-configured agents
3. **Subscribe to an agent** - Click "Subscribe" button
4. **View your agents** - Go to `/dashboard/agents`
5. **Run an agent** - Click "Run" button (requires API key)
6. **Create new agent** - Go to `/builder`
7. **Configure agent** - Fill in identity, capabilities, rules
8. **Set API keys** - Add GroqCloud or Gemini key
9. **Register agent** - Click "Register Agent" button
10. **Monitor activity** - View actions and proofs in dashboard

## 📝 Notes

- All data is stored in-memory by default (resets on restart)
- To persist data, configure `DATABASE_URL` environment variable
- Mock blockchain mode is enabled by default for instant demos
- API keys are encrypted before storage
- Scheduler runs every 5 seconds for automated agent runs

---

**Ready to build private, verifiable AI agents!** 🚀

