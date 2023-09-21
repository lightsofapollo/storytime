FROM node:lts AS base

RUN apt-get update && \
    apt-get install -y && \
    corepack enable && \
    corepack prepare pnpm@8.7.6 --activate

WORKDIR /app

FROM base AS installer
COPY . .
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=installer /app/ .
RUN pnpm build

FROM base AS app
COPY --from=installer /app/ .

EXPOSE 3000
CMD ["pnpm", "start"]