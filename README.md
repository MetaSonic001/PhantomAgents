# PhantomAgents

> Privacy-preserving AI platform for creating, deploying, and monetizing agents.

This repository is a Next.js 16 app (React 19) scaffolded with a component-first UI. It includes an initial set of pages, UI components, client API helpers, and a few example API routes.

## What’s in this repo (summary)
- **Framework**: `Next.js` (app router) + React
- **UI**: component library under `components/` and `components/ui/` (Radix + custom components)
- **Pages & App**: top-level app routes live in `app/` (including `dashboard/`, `builder/`, `api/`)
- **Client API**: `lib/api-client.ts` — central client for calling `/api` routes
- **Example API routes**: `app/api/agents/route.ts` (GET, POST example) and other api folders (auth, analytics, marketplace, competitions)

## Quick start
Prerequisites: Node 18+ recommended.

Install & run development server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

Environment note:
- `NEXT_PUBLIC_API_URL` is used by `lib/api-client.ts` (defaults to `http://localhost:3000`).

## Project structure (high level)
- `app/` — Next.js app routes, layouts, API route skeletons.
- `components/` — reusable UI components and builder-specific components.
- `lib/` — API client, types, utilities.
- `public/` — static assets.

## Notable files to inspect
- `package.json` — scripts & deps
- `app/layout.tsx` — global layout and theme provider
- `lib/api-client.ts` — client wrappers for agents, marketplace, competitions, analytics, auth
- `app/api/agents/route.ts` — example in-memory GET/POST for agents

## Current functionality (what exists now)
- Static UI components across many common patterns (buttons, inputs, dialogs, etc.)
- Basic app skeleton and dashboard sections
- Example `GET` and `POST` for `/api/agents` returning mock data
- Client-side API wrapper for common endpoints (`agentApi`, `marketplaceApi`, etc.)

## Short technical notes / implications
- The example API routes return mock data (no DB). Real persistence is not yet implemented.
- `lib/api-client.ts` expects a REST backend at `NEXT_PUBLIC_API_URL` or will call the same Next app under `/api`.
- Authentication flow routes exist in the frontend structure (`app/auth/` and `app/api/auth`) but need server-side implementations (session/JWT, password hashing).

## BYO-API-KEY (Bring-Your-Own keys) — design & implementation notes
Recommended server-side approach:

1. Store provider credentials in a server-side encrypted store (DB field encrypted with a server KMS key or using libs like `node-jose`/`crypto`).
2. Expose secure endpoints for managing keys:
   - `POST /api/keys` — store a new provider key (user-only)
   - `GET /api/keys` — list keys (masked)
   - `DELETE /api/keys/:id` — remove a key
3. Associate keys to users and/or specific agents (`agent_key` table linking user, agent, provider, key_id`).
4. For runtime LLM calls, provide a server-side proxy endpoint (e.g. `POST /api/llm/proxy`) that:
   - Reads the selected stored key, injects it into the provider request, forwards the prompt, and returns the response
   - Enforces rate-limits, per-user quotas, and auditing for billing/usage
5. Frontend: provide a secure flow to add provider keys in settings (validate by performing a lightweight test call), allow selecting a default key per agent.

Security & ops notes:
- Do not store raw keys in client-side storage. Keep keys server-only.
- Use environment variables for a server KMS root key in dev, and use a cloud KMS (AWS KMS / Azure Key Vault / GCP KMS) in production.
- Log requests for auditing but redact secrets.

## Immediate UI & functionality suggestions (prioritized)
1. **BYO API Keys**: Implement backend storage and frontend management UI (high priority). This unlocks actual LLM usage.
2. **Auth & Ownership**: Add real auth (JWT or session), user model, and per-user agent ownership and permissions.
3. **Agents CRUD**: Implement `GET/PUT/DELETE` for `app/api/agents/[id]` and connect to a DB (Postgres recommended). Add validation (Zod) and access checks.
4. **Sidebar cleanup**: audit `components/sidebar.tsx` and `dashboard/` sections — merge or remove duplicate pages (`analytics` vs `advanced-analytics`, `agent-runs` vs `agents` listing if overlapping). Consolidate navigation into logical groups: Agents, Marketplace, Analytics, Builder, Settings.
5. **Marketplace & NFT pages**: decide relationship between `agent-nfts` and `marketplace` — if both show listings, consolidate into a single marketplace area with tabs for NFTs vs offerings.
6. **UX polish**: add skeleton loaders, form validation, clearer empty states, consistent action buttons, and mobile responsiveness tests.

## Backend & API recommendations
- Use a small REST API or Next.js server routes backed by a DB (Postgres). Use Prisma or TypeORM for schema + migrations.
- Schema suggestions: `users`, `agents`, `agent_keys`, `marketplace_listings`, `agent_runs`, `analytics_events`.
- Implement token-based auth / sessions and role checks (admin vs user).
- Add server-side rate limiting, CORS and request validation.

## Suggested roadmap (next 90 days)
- Week 1: Auth + DB + Agents CRUD + BYO keys backend + basic UI pages
- Week 2: Integrate LLM proxy endpoint, tests, marketplace skeleton, and analytics events
- Week 3: Polishing, mobile, accessibility, deploy to Vercel (or chosen provider), configure KMS for keys

## Developer checklist (quick)
- [ ] Add `README.md` (this file)
- [ ] Implement DB & migrations (Prisma recommended)
- [ ] Add Auth (signup/login) server implementation
- [ ] Implement BYO keys endpoints + UI
- [ ] Implement agent detail routes and frontend pages
- [ ] Remove/merge duplicate sidebar entries and tidy navigation
- [ ] Add CI (lint, build, test) and deploy config

---
If you want, I can: create an initial DB schema (Prisma), implement the BYO keys API routes with an encrypted field, wire a simple UI for adding provider keys, or open a PR with the first auth endpoints. Which task should I start with next?
