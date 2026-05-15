# BookFactory backend — Node 22 LTS, Fastify + WebSocket
# Multi-stage so the runtime image is small and reproducible.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
RUN apk add --no-cache bash git tini
# The Claude Code CLI is mounted from the host so this image stays slim and
# uses whatever auth the operator already has. See docker-compose volumes.
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json .
EXPOSE 8787
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
