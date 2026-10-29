# syntax=docker/dockerfile:1
# One image definition for the three services. Build a service with
#   docker build --target server|worker|indexer -t dome-<service> .

FROM node:22.20.0-alpine3.22 AS build
RUN npm install --global --ignore-scripts pnpm@12.3.4
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.base.json ./
COPY packages ./packages
# Install scripts are disabled for every dependency (see pnpm-workspace.yaml).
RUN pnpm install --frozen-lockfile \
 && pnpm build \
 && pnpm install --frozen-lockfile --prod \
 && rm -rf packages/*/src packages/*/tsconfig*.json packages/action

FROM node:22.20.0-alpine3.22 AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=root:root /app /app
USER node

FROM runtime AS server
EXPOSE 8080
CMD ["node", "packages/server/dist/bin/server.js"]

FROM runtime AS indexer
CMD ["node", "packages/indexer/dist/bin/indexer.js"]

# Workers need git to read repositories as objects. They run as an
# unprivileged user with no credentials; see docker-compose.yml and
# docs/deployment.md for the sandbox they are expected to run in.
FROM runtime AS worker
USER root
RUN apk add --no-cache git=2.49.1-r0 || apk add --no-cache git
USER node
ENV HOME=/tmp
CMD ["node", "packages/worker/dist/bin/worker.js"]

# The only route off the workers' isolated network: an HTTPS proxy that tunnels
# to github.com and refuses everything else (deploy/egress-proxy).
FROM node:22.20.0-alpine3.22 AS egress-proxy
RUN apk add --no-cache tinyproxy
COPY deploy/egress-proxy/tinyproxy.conf /etc/tinyproxy/tinyproxy.conf
COPY deploy/egress-proxy/allowed-hosts /etc/tinyproxy/allowed-hosts
USER tinyproxy
EXPOSE 8888
CMD ["tinyproxy", "-d", "-c", "/etc/tinyproxy/tinyproxy.conf"]
