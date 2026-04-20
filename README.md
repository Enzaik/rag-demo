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

## Environment variables

See `.env.example` for the full list. Highlights:

- `DATABASE_URL` — shared by the API and Drizzle CLI.
- `OPENAI_API_KEY` — required by ingestion and the chat route.
- `BETTER_AUTH_SECRET` — sign cookies. Rotate to invalidate all sessions.
- `WEB_ORIGIN` — CORS allow-list on the API (and `trustedOrigins` in better-auth).
- `NEXT_PUBLIC_API_URL` / `API_INTERNAL_URL` — browser vs. server-side base URLs for the Nest API.
- `RAG_COMPONENT_REGISTRY` — base URL for the custom shadcn registry used by `pnpm shadcn:web`.
