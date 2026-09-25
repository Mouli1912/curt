# -----------------------------------------------------------------------------
# SkillPath Multi-Stage Dockerfile
# Builds Python ML skill graph -> React client static build -> Express server
# -----------------------------------------------------------------------------

# --- STAGE 1: Python ML Extractor ---
FROM python:3.12-slim AS ml-builder
WORKDIR /app

# Copy ML requirements & install dependencies
COPY ml-service/requirements.txt ./ml-service/requirements.txt
RUN pip install --no-cache-dir -r ml-service/requirements.txt

# Copy raw data & extractor code
COPY data/ ./data/
COPY ml-service/ ./ml-service/

# Execute graph builder to produce /app/data/skill_graph.json
RUN python ml-service/extractor/graph_builder.py

# --- STAGE 2: React Frontend Builder ---
FROM node:22-alpine AS client-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
# Build production bundle
RUN npm run build

# --- STAGE 3: Production Server ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV SKIP_DB=true

# Copy server package files & install production dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy server source code
COPY server/ ./server/

# Pre-generate ECDSA key pair for credential signing
RUN node server/scripts/generateKeys.js

# Copy generated skill graph from STAGE 1
COPY --from=ml-builder /app/data/skill_graph.json ./data/skill_graph.json

# Copy static frontend build from STAGE 2 into server static directory
COPY --from=client-builder /app/client/dist ./server/public

EXPOSE 5000

CMD ["node", "server/src/index.js"]
