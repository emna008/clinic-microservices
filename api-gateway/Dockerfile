FROM node:20-alpine
WORKDIR /app/api-gateway
COPY api-gateway/package*.json ./
RUN npm install
COPY api-gateway/ .
COPY proto/ ../proto/
EXPOSE 3000
CMD ["node", "index.js"]
