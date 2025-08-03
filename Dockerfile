# --- Build Stage ---
FROM node:24-alpine AS builder

# Update system packages and install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy only dependency files first for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --force

# Copy the rest of your app
COPY . .

# Build your app (uses Vite, TanStack, etc.)
RUN pnpm build

# --- Production Stage ---
FROM node:24-alpine AS production

# Update system packages and install pnpm
RUN npm install -g pnpm

# Set the working directory
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
