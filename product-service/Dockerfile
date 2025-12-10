FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# Development Stage
FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD [ "npm", "run", "dev" ]

# Production Stage
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
EXPOSE 3001
USER node
CMD [ "node", "server.js" ]