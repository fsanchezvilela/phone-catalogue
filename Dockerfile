# ---- Build Stage ----
FROM node:24-alpine AS builder

# 1. Match your local pnpm version for perfect parity
RUN npm install -g pnpm@8.15.6

WORKDIR /app

# 2. Copy dependency manifests for cache optimization
COPY package.json pnpm-lock.yaml ./

# 3. Install dependencies with lockfile strictness
RUN pnpm install --frozen-lockfile

# 4. Copy ONLY source code (exclude .git, node_modules via .dockerignore!)
COPY . .

# 5. Build the application
RUN pnpm build

# ---- Production Stage ----
FROM node:24-alpine

# 6. Reinstall pnpm (exact version)
RUN npm install -g pnpm@8.15.6

WORKDIR /app

# 7. Copy prod-only files and built output (avoid test/dev files)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/.tanstack ./.tanstack
COPY --from=builder /app/.nitro ./.nitro
COPY --from=builder /app/public ./public
# Copy config files if required for runtime (keep minimal!)
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# 8. Drop privileges for better security
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -G appgroup -u 1001
USER appuser

# 9. Set environment
ENV NODE_ENV=production

# 10. Expose port and set the start command
EXPOSE 3000
CMD ["pnpm", "start"]
