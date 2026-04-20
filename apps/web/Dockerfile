FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN pnpm install --frozen-lockfile --prod=false

RUN pnpm --filter @rag/db build
RUN pnpm --filter @rag/web build

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["pnpm", "start"]
