# --- Base Image ---
# Use a specific version for reproducible builds
FROM oven/bun:1.3 AS base
WORKDIR /usr/src/app

# --- Builder Stage ---
# This stage installs all dependencies (including dev) and runs tests.
FROM base AS builder
# Copy the root lockfile and the app's package definition
COPY bun.lock .
COPY package.json .

# Install all dependencies for building and testing
RUN bun install --frozen-lockfile

# Copy the application source code
COPY . .

# Run tests
ENV NODE_ENV=production
RUN bun test


# --- Production Stage ---
# This is the final, lean image that will be deployed.
FROM base AS release
WORKDIR /usr/src/app

# Set runtime environment variables
ENV NODE_ENV=production
ENV KL_SERVER_PORT=5501

# Copy the root lockfile and the app's package definition again
COPY bun.lock .
COPY package.json .

# Install ONLY production dependencies to keep the image small
RUN bun install --frozen-lockfile --production

# Copy the tested application code from the 'builder' stage
COPY --from=builder /usr/src/app/ .

# Run the app as a non-root user for security
USER bun
EXPOSE 5501/tcp

# The command to run your application
ENTRYPOINT [ "bun", "run", "src/main.ts" ]