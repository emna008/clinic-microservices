FROM node:20-alpine
WORKDIR /app/microservice-medical-records
COPY microservice-medical-records/package*.json ./
RUN npm install
COPY microservice-medical-records/ .
COPY proto/ ../proto/
EXPOSE 50053
CMD ["node", "index.js"]
