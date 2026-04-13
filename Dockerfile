# ── Stage 1: build the React app ─────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

ARG REACT_APP_EMAILJS_SERVICE_ID
ARG REACT_APP_EMAILJS_TEMPLATE_ID
ARG REACT_APP_EMAILJS_PUBLIC_KEY

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: serve with Caddy ─────────────────────────────────────────────────
FROM caddy:2-alpine
COPY --from=build /app/build /srv
COPY Caddyfile /etc/caddy/Caddyfile
