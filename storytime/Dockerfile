# syntax=docker/dockerfile:1
FROM node:lts as base

RUN <<EOT
#!/usr/bin/env bash
set -euo pipefail
apt-get update
apt-get install -y dumb-init

declare -A PLATFORMS=([aarch64]=arm64 [x86_64]=amd64)
EOT

ARG PNPM_VERSION=8.7.6
ENV PNPM_HOME=/usr/local/bin
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /usr/app

FROM base AS installer
WORKDIR /usr/app
RUN pnpm add -g turbo
COPY . .
RUN pnpm install

#FROM base AS builder
#WORKDIR /usr/app
#COPY --from=installer /usr/app/ .
#RUN pnpm build

FROM base AS app
WORKDIR /usr/app
COPY --from=builder /usr/app/ .

WORKDIR /usr/app/code
EXPOSE 3000
CMD ["pnpm", "start"]
