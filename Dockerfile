FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1. Match the WORKDIR to your Compose volume
WORKDIR /srv

# 2. Use an Argument for the app name
ARG APP_NAME

COPY . .

# Install and build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter ${APP_NAME} build

# Final Stage
FROM node:20-slim AS runner
WORKDIR /srv
RUN corepack enable
COPY --from=base /srv /srv

# Use the ARG to start the correct service
ARG APP_NAME
ENV SERVICE_NAME=${APP_NAME}

# Dynamic start command
CMD pnpm --filter ${SERVICE_NAME} start
