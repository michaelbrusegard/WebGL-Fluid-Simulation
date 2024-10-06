FROM imbios/bun-node:22-slim AS base

FROM base AS deps

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install  --frozen-lockfile

WORKDIR /app/docs

COPY docs/package.json docs/bun.lockb ./
RUN bun install  --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=true

RUN bun run build
RUN bun run docs:build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app/docs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=true

RUN addgroup --system --gid 1002 nodejs && \
  adduser --system --uid 1002 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/docs/.next/standalone ./

USER nextjs

EXPOSE 3000

# server.js is created by next build from the standalone output
CMD ["bun", "run", "server.js"]
