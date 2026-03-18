# No Meteor image needed — we use the pre-built bundle
FROM node:20-alpine

WORKDIR /app

# Install tools needed to extract and build native modules
RUN apk add --no-cache bash python3 make g++

# Copy the pre-built Meteor bundle
COPY bundle.tar.gz .

# Extract it
RUN tar -xzf bundle.tar.gz && rm bundle.tar.gz

# Install production dependencies inside the bundle
WORKDIR /app/bundle/programs/server
RUN npm install --production

WORKDIR /app/bundle

EXPOSE 3000

CMD ["node", "main.js"]