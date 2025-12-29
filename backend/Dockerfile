# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy prisma schema
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy generated prisma client from builder
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy prisma schema (for migrations)
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Copy source code
COPY src ./src
COPY index.js ./

# Set ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]
