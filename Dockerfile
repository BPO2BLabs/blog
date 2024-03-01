# Stage 1: Build the application
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "start"]
