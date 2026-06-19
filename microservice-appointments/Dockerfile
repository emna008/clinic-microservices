FROM node:20-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app/microservice-appointments
COPY microservice-appointments/package*.json ./
RUN npm install
COPY microservice-appointments/ .
COPY proto/ ../proto/
EXPOSE 50052
CMD ["node", "index.js"]
