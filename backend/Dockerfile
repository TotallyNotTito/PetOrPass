FROM node:18-alpine AS base

# TODO: replace http-server
RUN npm i -g pnpm http-server

# Stage 1 - download and prep dependencies
FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Stage 2 - Build project after copying deps from S1
FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
RUN pnpm prune --prod

# Stage 3 - Deploy after copying build
FROM base AS deploy
WORKDIR /app
COPY --from=build /app/build/ ./build/
COPY --from=build /app/node_modules/ ./node_modules/
# TODO: Replace this with a "real" http server (nginx) before prod!
EXPOSE 8080

WORKDIR /app/build
# This can be overridden with `docker run -it petorpass/backend /bin/sh
# Later will be removed, as this will be served by nginx
CMD [ "http-server", "-p",  "8080", "." ]

