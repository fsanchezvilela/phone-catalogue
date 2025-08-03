# --- Build Stage ---
FROM node:24-alpine AS builder

# Install the SAME pnpm version as used locally!
RUN npm install -g pnpm@8.15.6

WORKDIR /app

# Copy dependency files first for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (fail if lockfile is incompatible)
RUN pnpm install --frozen-lockfile

# Copy rest of the code
COPY . .

# Build app
RUN pnpm build

# --- Production Stage ---
FROM node:24-alpine

# Install same pnpm version
RUN npm install -g pnpm@8.15.6

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.tanstack ./.tanstack
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD ["pnpm", "start"]
