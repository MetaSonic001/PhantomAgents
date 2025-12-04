# PhantomAgents

> Privacy-preserving AI platform for creating, deploying, and monetizing agents.

This repository is a Next.js 16 app (React 19) scaffolded with a component-first UI. It includes an initial set of pages, UI components, client API helpers, and a few example API routes.
# PhantomAgents

**Privacy-preserving AI platform for creating, deploying, and monetizing autonomous agents (with a marketplace and NFT-backed ownership model).**

This repository is a Next.js (App Router) application that demonstrates a full-stack UI for building, sharing, and monetizing AI agents. It contains a component-first design system, demo pages (marketplace, seller dashboard, test sandbox, checkout demo), and client helpers. Many production concepts are scaffolded as frontend demos; server-side persistence and security hardening are intentionally left for the next integration steps.

--

## Quick Highlights
- Next.js + React (App Router)
- Tailwind CSS + Radix primitives for UI
- Marketplace with listing pages, reviews, seller demo pages
- BYO-API-KEY (Bring-Your-Own) pattern implemented as a frontend helper (localStorage demo) — production approach requires KMS/encrypted server storage
- Client API helper in `lib/` and many reusable UI components in `components/`

--

## Table of Contents
- [Overview](#overview)
- [What’s Included](#whats-included)
- [Architecture & Diagrams](#architecture--diagrams)
- [Blockchain & NFTs — How they fit in](#blockchain--nfts---how-they-fit-in)
- [Security & Production Recommendations](#security--production-recommendations)
- [Developer Setup](#developer-setup)
- [Project Structure](#project-structure)
- [Roadmap & Suggested Next Steps](#roadmap--suggested-next-steps)
- [Contributing](#contributing)
- [License](#license)

--

## Overview

PhantomAgents is a platform concept that lets developers create AI agents (scripts that orchestrate LLMs, tools, and logic), publish them to a marketplace, and optionally attach on-chain ownership using NFTs. The project is intentionally scaffolded so teams can iterate quickly on UX and integration patterns while planning a secure server-side rollout for real keys, billing, and persistent storage.

Key user flows demonstrated in this repo:
- Create / configure agents in the builder UI
- Publish a listing to the marketplace (demo flows)
- Buyers can test an agent in a sandbox and perform a simulated checkout
- Sellers can manage listings via a seller dashboard
- Reviews are stored client-side for demo purposes (localStorage)

Note: This repo contains many demo and frontend-only implementations (localStorage-backed examples). Treat server-side persistence and secret management as required steps before production.

--

## What’s Included

- `app/` — Next.js app routes, dashboard pages, builder, onboarding, and demo marketplace pages
- `components/` — UI primitives and composed components used across the app
- `components/ui/` — low-level primitives (Radix wrappers)
- `lib/` — client helpers such as API client wrappers and the BYO keys helper
- `app/api/` — example API route skeletons (demo/mock endpoints)

--

## Architecture & Diagrams

Below are compact, readable ASCII diagrams describing the typical architecture and flows in PhantomAgents. These diagrams are intentionally text-first so they render in terminals and in GitHub.

1) High-level system layout

```
                  +---------------------+
                  |   Browser / Client  |
                  | (Next.js UI, Buyer) |
                  +----------+----------+
                                  |
                                  | HTTPS
                                  v
                  +---------------------+
                  |   Next.js Server    | <-- optional serverless functions (API)
                  |  (app/api/* routes) |
                  +--+------------------+
                      |        |   ^
                      |        |   |
    REST/Proxy  |        |   | Web3 events / indexing
                      v        |   |
    +----------------+   |   |
    |  Database (SQL)|   |   |
    |  Postgres (P)  |   |   |
    +----------------+   |   |
                      |        |   |
                      |        v   |
                  +--+---------------+
                  |  Blockchain /     |
                  |  NFT Contracts    |
                  |  (EVM / ERC-721)  |
                  +-------------------+

```

2) Marketplace listing & purchase flow (simplified)

```
 Seller UI (publish listing)
         |
         | create listing metadata (off-chain DB)
         v
   Mint NFT (optional) ------> Blockchain: ERC-721 token (owner = seller)
         |
         | listing appears in Marketplace (indexer + DB)
         v
 Buyer UI (click buy)
         |
   Test sandbox (off-chain call to LLM via server proxy)
         | 
   Checkout (off-chain payment) -> transfer NFT via contract / update DB
         |
   Ownership / access granted to buyer (on-chain + off-chain entitlement)

```

3) BYO Keys + LLM Proxy pattern (recommended)

```
 [Frontend] --POST /api/keys--> [Server Store (encrypted)]
 [Frontend] --POST /api/llm/proxy (user selects key id)--> [Server] --call--> LLM Provider

Server responsibilities:
- Decrypt key safely via KMS
- Apply rate limits & quotas
- Audit & redact logs
- Return LLM response to client

```

--

## Blockchain & NFTs — How they fit in

PhantomAgents is designed to optionally support on-chain ownership models for agents. The ideas below describe a recommended architecture and key considerations:

- Token model: use ERC-721 (one NFT per unique agent) or ERC-1155 (if you need fungible/batched listings). The smart contract holds the token and ownership maps to a wallet address.
- Metadata: store canonical agent metadata (manifest, thumbnail, pricing link) off-chain (Postgres + CDN/IPFS) and store the metadata URI in the NFT. This keeps on-chain costs low and allows rich descriptions.
- Marketplace duties:
   - A traditional marketplace keeps a canonical off-chain listing record with price and NFT tokenId mapping.
   - To buy: buyer transfers stablecoin / payment; marketplace relayer or smart contract transfers NFT to buyer and records sale off-chain for searchability.
- Security & UX:
   - Escrow pattern: implement an escrow or atomic swap via a contract or a trusted relayer to prevent loss during payments.
   - Signature-based listings: optionally use signed off-chain listing messages (EIP-712) so sellers can publish listings without on-chain gas until sale.
- Indexing & events: use a service like The Graph or a simple webhook indexer that watches events to keep your DB in sync with on-chain transfers.

Practical integration options (incremental):
1. Start with off-chain listings (Postgres) and optional on-chain minting when a seller opts in.
2. Use IPFS for immutable agent assets (code blob, icon, README). Store the IPFS CID in the listing and NFT metadata.
3. Add relayer or marketplace contract once you have demand for on-chain transfers.

--

## Security & Production Recommendations

This repository contains many client-side demo patterns (localStorage-backed reviews and BYO keys helper). Before you operate in production, please follow these hard requirements:

- Never store raw provider API keys on the client. Use a KMS + encrypted DB field and server-side proxy for LLM calls.
- Use HTTPS and set strict CORS and CSP policies.
- Rate-limit LLM calls and protect endpoints with authentication and per-user quotas.
- For blockchain interactions, protect private keys and use secure relayers or wallet integrations (MetaMask, WalletConnect). Do not embed private keys in server code.
- Implement input validation (Zod) on all API routes and CSRF protection where relevant.
- Consider auditing any smart contracts (reentrancy, access control, upgradeability concerns).

Recommended stack for production:
- Postgres for relational data + Prisma for migrations and type-safety
- Redis for rate-limiting and short-lived caches
- Cloud KMS (AWS KMS / Azure Key Vault / GCP KMS) for root secrets
- A small Node/Next backend for server-side key handling and the LLM proxy

--

## Developer Setup

Minimum: Node 18+ or Bun (this repo includes a `bun.lockb`). Use either `bun` or `npm`/`pnpm` depending on your preference.

Install dependencies and run dev server:

```cmd
:: Using npm
npm install
npm run dev

:: Using bun
bun install
bun dev
```

Build for production:

```cmd
npm run build
npm run start
```

Environment variables (examples):
- `NEXT_PUBLIC_API_URL` — API base used by `lib/api-client.ts` (defaults to local `/api`)
- `DATABASE_URL` — Postgres connection (if you wire a DB)
- `KMS_KEY_ID` or provider-specific KMS config (for production secrets)

Quick env setup:
- Copy `.env.local.example` to `.env.local` and adjust `NEXT_PUBLIC_BACKEND_URL` to point at your running backend (default: `http://localhost:8000`).
      The backend also includes a `backend/.env` file for mock/demo settings (e.g. `MOCK_BLOCKCHAIN=true`).

Local testing tips:
- Many demo pages use localStorage (keys, reviews, seller listings). Clearing localStorage will reset demo data.
- To test blockchain flows locally, use Hardhat or Anvil and connect MetaMask to the local network; configure contract addresses via env vars.

--

## Project Structure (short)

- `app/` — Next app router routes and pages (landing, dashboard, marketplace)
- `components/` — UI building blocks and composables
- `components/ui/` — low-level primitives (Radix wrappers)
- `lib/` — `api-client.ts`, `keys-client.ts` (BYO helper), utils
- `styles/` — global CSS & Tailwind config

--

## Roadmap & Suggested Next Steps

Short-term (high priority):
- Implement server-side BYO keys storage (encrypted DB + KMS) and an LLM proxy endpoint
- Add a Postgres + Prisma schema and basic migrations for `users`, `agents`, `listings`, `keys`
- Implement real auth (signup/login, sessions or JWT)

Medium-term:
- Integrate a smart contract (ERC-721) for agent NFTs and add a relayer or escrow-based marketplace flow
- Add The Graph or an event indexer so on-chain state and off-chain DB remain consistent

Long-term:
- Monitoring/observability around LLM usage and costs, billing integrations, and multi-tenant security

--

## Contributing

Contributions are welcome. A suggested workflow:

1. Fork the repo and create a feature branch: `git checkout -b feat/your-change`
2. Run tests and lint locally (add CI if not present)
3. Open a PR with a clear description and link to any design docs or screenshots

Please open issues for large architectural changes so they can be discussed first.

--

## License

This repository does not currently include a LICENSE file. For open source contributions, we recommend adding an OSI-approved license (MIT or Apache-2.0) and documenting contributor expectations.

--

If you'd like, I can:
- scaffold a Prisma schema + initial migration
- implement the BYO keys server endpoints and an encrypted DB field (with KMS integration hints)
- add a sample ERC-721 contract + Hardhat testing harness

Tell me which of the above you want next and I will proceed.
