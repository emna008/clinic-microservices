FROM node:20-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app/microservice-patients
COPY microservice-patients/package*.json ./
RUN npm install
COPY microservice-patients/ .
COPY proto/ ../proto/
EXPOSE 50051
CMD ["node", "index.js"]
