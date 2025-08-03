# --- Build Stage ---
FROM node:24.5.0 AS builder

# Update system packages and install pnpm globally
RUN apt-get update && apt-get upgrade -y && npm install -g pnpm && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only dependency files first for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of your app
COPY . .

# Build your app (uses Vite, TanStack, etc.)
RUN pnpm build

# --- Production Stage ---
FROM node:24.5.0 AS production

# Update system packages and install pnpm
RUN apt-get update && apt-get upgrade -y && npm install -g pnpm && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist      
COPY --from=builder /app/.tanstack ./.tanstack 
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose the port your app runs on
EXPOSE 3000

# Start the server (adjust if your start script is different)
CMD ["pnpm", "start"]
