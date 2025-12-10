FROM node:18-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Development stage
FROM base as development
WORKDIR /app
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]

# Build stage
FROM base as build
WORKDIR /app
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine as production
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon-off;" ]