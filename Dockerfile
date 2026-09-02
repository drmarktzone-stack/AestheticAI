# AestheticAI clinical web app for Cloud Run (me-west1).
# Serves the Vite static build on 0.0.0.0:$PORT (default 8080).
# Do not set GITHUB_PAGES here — Cloud Run is rooted at /.
# Do not bake GEMINI_API_KEY or other secrets into this image.

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
COPY --from=build /app/dist ./dist
COPY scripts/serve-static.mjs ./scripts/serve-static.mjs
USER node
EXPOSE 8080
CMD ["node", "scripts/serve-static.mjs"]
