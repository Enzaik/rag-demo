FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont postgresql-client

WORKDIR /app

# ── Install ──────────────────────────────────────────────
FROM base AS deps

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN pnpm install --frozen-lockfile --prod=false

# ── Build ────────────────────────────────────────────────
FROM deps AS build

RUN pnpm --filter @rag/db build
RUN pnpm --filter @rag/shared build
RUN pnpm --filter @rag/api build

# ── Production ───────────────────────────────────────────
FROM base AS runner

COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
# Markdown corpus consumed by `node dist/seed/ingest-markdown.js`.
COPY content ./content
# Postgres init scripts (pgvector extension etc.) — run on API startup so
# the extension exists before drizzle migrations run, even on DBs that
# weren't initialised by the pgvector image's /docker-entrypoint-initdb.d.
COPY docker/postgres/init ./docker/postgres/init

# Keep full node_modules (drizzle-kit needed for migrations)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules

WORKDIR /app/apps/api

EXPOSE 4000

CMD ["sh", "-c", "\
  for f in /app/docker/postgres/init/*.sql; do \
    echo \"[init] applying $f\"; \
    psql \"$DATABASE_URL\" -v ON_ERROR_STOP=1 -f \"$f\"; \
  done && \
  cd /app/packages/db && npx drizzle-kit migrate && \
  cd /app/apps/api && node dist/main\
"]
