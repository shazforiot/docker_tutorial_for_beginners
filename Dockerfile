# ── Stage: Build ──────────────────────────────────────────
# Use official Node.js 18 on Alpine Linux (tiny ~5MB base image)
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files FIRST — enables Docker layer caching.
# If only source code changes (not dependencies), this layer is cached
# and npm install is skipped on the next build. Much faster!
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Document that the app listens on port 3000
# (This is informational — use -p in docker run to actually publish it)
EXPOSE 3000

# Default command to start the app
CMD ["node", "app.js"]
