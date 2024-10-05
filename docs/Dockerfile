FROM imbios/bun-node:22-slim AS base

# Install dependencies only when needed
FROM base AS deps

WORKDIR /app/docs

# Install dependencies
COPY docs/package.json docs/bun.lockb ./
RUN bun install  --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app/docs
COPY --from=deps /app/docs/node_modules ./node_modules
COPY docs .

# Copy dist folder
COPY dist ../dist

# Disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED=true

# Build the application
RUN bunx next build

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
