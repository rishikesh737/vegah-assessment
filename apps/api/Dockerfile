# ---- Builder Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@8.12.0 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

RUN pnpm --filter @starter/shared build
RUN pnpm --filter api db:generate
RUN pnpm --filter api build

# Keep the pnpm workspace layout, but remove development-only packages before
# transferring dependencies to the runtime image.
FROM builder AS production-deps
RUN pnpm prune --prod

# ---- Runner Stage ----
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl
ENV NODE_ENV=production
ENV PORT=4000
ENV NODE_PATH=/app/apps/api/node_modules:/app/node_modules

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy the compiled application and runtime files.
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=production-deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
# Nest's Swagger compiler plugin emits metadata imports relative to the
# original workspace path for enums used in decorated DTOs.
COPY --from=builder /app/packages/shared/dist /packages/shared/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

USER nestjs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:4000/api/v1/health/ping || exit 1

CMD ["node", "dist/src/main.js"]
