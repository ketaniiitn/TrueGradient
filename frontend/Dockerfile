# Frontend Dockerfile for TrueGradient
# 1. Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies (only package*.json for caching)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source
COPY . .

# Build with an optional API base URL override at build time
# Provide at build: --build-arg VITE_API_BASE_URL=http://localhost:5001
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# 2. Runtime stage (nginx)
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

# Copy custom nginx config (file is in the frontend build context root)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default static content
RUN rm -rf ./*

# Copy compiled dist
COPY --from=build /app/dist ./

# Expose HTTP port
EXPOSE 80

# Simple healthcheck (index availability)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O - http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
