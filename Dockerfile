FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash python3 make g++

COPY bundle.tar.gz .

RUN tar -xzf bundle.tar.gz && rm bundle.tar.gz

WORKDIR /app/bundle/programs/server
RUN npm install --production

WORKDIR /app/bundle

EXPOSE 3000

# Render injects these at runtime via environment variables
CMD ["node", "main.js"]