FROM node:25-slim AS builder
WORKDIR /app

RUN npm install -g corepack@latest --force && \
        corepack enable && \
        corepack prepare yarn@3.6.1 --activate

RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*
COPY . .
RUN yarn
RUN yarn build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]