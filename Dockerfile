FROM node:25-slim AS builder
WORKDIR /app

# Copy package.json first for layer cache efficiency
COPY package*.json ./
RUN yarn

COPY . .
RUN yarn build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]