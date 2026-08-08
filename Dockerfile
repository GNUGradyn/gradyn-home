FROM node:25-slim AS builder
WORKDIR /app

# https://stackoverflow.com/questions/79928398/how-to-install-a-specific-yarn-version-3-x-4-x-in-node25-alpine-docker-image
RUN npm install -g corepack@latest --force && \
        corepack enable && \
        corepack prepare yarn@3.6.1 --activate

# Copy package.json first for layer cache efficiency
COPY package*.json ./
RUN yarn

COPY . .
RUN yarn build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]