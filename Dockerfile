# syntax=docker/dockerfile:1

FROM docker.io/library/node:24.22.2-bookworm-slim@sha256:c86ecead9e55a5210ac1727de38a4ca840bf03dcaf34dc9749addbf383b1920c AS base
WORKDIR /app

FROM base AS builder
RUN npm install -g pnpm@9.10.0

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG PUBLIC_PLAUSIBLE_HOST=https://plausible.bergereenchantee.fr
ENV PUBLIC_PLAUSIBLE_HOST=${PUBLIC_PLAUSIBLE_HOST}

RUN pnpm build && pnpm prune --prod

FROM base AS runtime
ENV NODE_ENV=production \
	HOST=0.0.0.0 \
	PORT=3000

COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/build ./build

USER node
EXPOSE 3000

CMD ["node", "build/index.js"]
