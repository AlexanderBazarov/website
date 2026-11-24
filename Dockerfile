# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app

# сначала только манифесты — слой с зависимостями кэшируется, пока они не меняются
COPY package.json package-lock.json ./
COPY packages/core/package.json packages/core/
COPY packages/tui/package.json packages/tui/
COPY apps/site/package.json apps/site/
RUN npm ci --no-audit --no-fund

COPY tsconfig.json tsconfig.base.json ./
COPY packages packages
COPY apps/site apps/site
RUN npm run build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/site/dist /usr/share/nginx/html
EXPOSE 80
