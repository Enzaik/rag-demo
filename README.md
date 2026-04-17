# RAG Showcase

A Turborepo app demonstrating retrieval-augmented generation end-to-end.

- **Web**: Next.js 15 (App Router), Vercel AI SDK, TanStack Query.
- **API**: NestJS — ingestion, retrieval, auth (`better-auth`), chat persistence.
- **DB**: Postgres with `pgvector`, managed by Drizzle.
- **Corpus**: a seeded product catalog plus a folder of markdown docs.

## Quick start

```bash
cp .env.example .env   # fill in OPENAI_API_KEY
docker compose up -d postgres
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm --filter api ingest
pnpm dev
```

Open http://localhost:3000.
