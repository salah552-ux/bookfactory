# BookFactory frontend — Vite build served by nginx with WS proxy.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time env: backend URL baked into the bundle. Override with
# --build-arg in CI/CD when targeting a different backend host.
ARG VITE_WS_URL=/ws
ARG VITE_API_URL=/api
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
