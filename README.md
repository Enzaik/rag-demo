# RAG Showcase

A full-stack retrieval-augmented chat application. Ask questions against a seeded corpus (product catalog + markdown knowledge base) and get streaming, cited answers.

## Stack

- **Web** — Next.js 15 (App Router, React 19), Tailwind v4, Vercel AI SDK v4, TanStack Query v5, shadcn components served from a custom registry.
- **API** — NestJS. Owns ingestion, retrieval, auth (`better-auth`) and conversation persistence. LLM calls happen in the Next route handler, not on the API.
- **DB** — Postgres + `pgvector`, managed with Drizzle ORM.
- **LLM** — OpenAI `gpt-4o-mini` for chat, `text-embedding-3-small` for embeddings.

## How it works

```
user ──▶ Next /api/chat ──▶ Nest /conversations/:id/messages (persist user msg)
                   │
                   ├──▶ Nest /retrieve (pgvector cosine top-K)
                   │
                   └──▶ OpenAI streamText(system = grounded context, messages)
                          │
                          ├──▶ stream tokens back to the browser
                          └──▶ onFinish: Nest /conversations/:id/messages (persist assistant msg + citations)
```

Citations are stored alongside the assistant message (chunk id, score, source, content snippet). Clicking a citation in the UI reveals the retrieved passage.

## Prerequisites

- Node 20+, pnpm 9+
- Docker (for the Postgres + pgvector container)
- An OpenAI API key

## Setup

```bash
cp .env.example .env
# fill in OPENAI_API_KEY and generate BETTER_AUTH_SECRET:
#   openssl rand -hex 32

docker compose up -d postgres
pnpm install
pnpm db:migrate       # create tables + pgvector extension
pnpm seed             # insert the product catalog rows
pnpm ingest           # chunk + embed products and markdown docs
pnpm dev              # api on :3001, web on :3000
```

Open `http://localhost:3000`, register, and start a chat.

## Try it out

The seeded corpus is **Alpine Forge**, a fictional outdoor gear company. A few questions that exercise different parts of the retrieval graph:

**Products (catalog rows):**
- *what products do you have?*
- *tell me about the Summit Shell Jacket*
- *what's the warmest sleeping bag you sell?*
- *do you make anything with RDS-certified down?*

**Policies & support (markdown corpus):**
- *how do I create an account?*
- *what's your return policy?*
- *do you ship internationally?*
- *what payment methods do you accept?*
- *how do I start a warranty claim?*

**Deeper knowledge (spans multiple docs):**
- *how should I layer for a cold, wet trip?*
- *how do I wash a waterproof shell?*
- *I'm between sizes on a jacket — what should I do?*

Answers cite the retrieved passages inline as `[1]`, `[2]`, etc. Click a citation to reveal the source snippet.

## Project layout

```
apps/
  api/                NestJS: auth, ingestion, retrieval, conversations
    src/seed/         product catalog + markdown ingestors
  web/                Next.js: auth forms, chat UI, /api/chat route
packages/
  db/                 Drizzle schema + migrations
  shared/             Zod contracts (retrieve, conversations, citations)
  eslint-config/      shared ESLint preset
  tsconfig/           shared TypeScript presets
```

## Useful commands

| command | does |
| --- | --- |
| `pnpm dev` | run api + web together (turbo) |
| `pnpm db:migrate` | apply Drizzle migrations |
| `pnpm db:generate` | author a new migration from schema changes |
| `pnpm db:studio` | open Drizzle Studio |
| `pnpm seed` | insert product catalog rows |
| `pnpm ingest` | (re)embed the full corpus |
| `pnpm typecheck` | repo-wide `tsc --noEmit` |
| `pnpm lint` | repo-wide ESLint |
| `pnpm shadcn:web -- add <component>` | install a shadcn component into the web app |

## Seeding / ingesting in production

When the Postgres instance isn't reachable from your laptop (e.g. Dokploy on a private docker network), run the seeds inside the deployed API container. The runtime image ships the compiled `dist/seed/*.js` bundles and the `/content` corpus, so no source or `pnpm` is needed.

```bash
# on the host
API=$(sudo docker ps --format '{{.Names}}' | grep rag-demo-backend)

# one-time: populate the products table
sudo docker exec -it $API sh -c 'cd /app/apps/api && node dist/seed/products.seed.js'

# chunk + embed products
sudo docker exec -it $API sh -c 'cd /app/apps/api && node dist/seed/ingest-products.js'

# chunk + embed the markdown corpus in /content
sudo docker exec -it $API sh -c 'cd /app/apps/api && node dist/seed/ingest-markdown.js'
```

`DATABASE_URL` and `OPENAI_API_KEY` are inherited from the container env, so no extra flags.

The API startup also applies every `/app/docker/postgres/init/*.sql` (idempotent — `CREATE EXTENSION IF NOT EXISTS vector`) before drizzle migrations, so a fresh Postgres without initdb mounts still ends up with pgvector.

## Environment variables

See `.env.example` for the full list. Highlights:

- `DATABASE_URL` — shared by the API and Drizzle CLI.
- `OPENAI_API_KEY` — required by ingestion and the chat route.
- `BETTER_AUTH_SECRET` — sign cookies. Rotate to invalidate all sessions.
- `WEB_ORIGIN` — CORS allow-list on the API (and `trustedOrigins` in better-auth).
- `NEXT_PUBLIC_API_URL` / `API_INTERNAL_URL` — browser vs. server-side base URLs for the Nest API.
- `RAG_COMPONENT_REGISTRY` — base URL for the custom shadcn registry used by `pnpm shadcn:web`.
