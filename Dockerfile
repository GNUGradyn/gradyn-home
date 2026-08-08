FROM node:25-slim AS builder
WORKDIR /app

# https://stackoverflow.com/questions/79928398/how-to-install-a-specific-yarn-version-3-x-4-x-in-node25-alpine-docker-image
RUN npm install -g corepack@latest --force && \
        corepack enable && \
        corepack prepare yarn@3.6.1 --activate

# install git and clean cache before everything else for layer cache efficiency
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*
COPY . .
RUN yarn build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]