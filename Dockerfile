# AestheticAI clinical web app for Cloud Run (me-west1).
# Serves the Vite build plus /api/analyze and /api/simulate on 0.0.0.0:$PORT (default 8080).
# Do not set GITHUB_PAGES here — Cloud Run is rooted at /.
# Do not bake GEMINI_API_KEY or other secrets into this image.
# Vertex uses Application Default Credentials (Cloud Run service account).
# Cloud Run does not inject GOOGLE_CLOUD_PROJECT — set it plus GOOGLE_CLOUD_LOCATION=global
# on the service. The runtime also resolves project id from metadata if env is unset.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY scripts/server.mjs ./scripts/server.mjs
USER node
EXPOSE 8080
CMD ["node", "scripts/server.mjs"]
