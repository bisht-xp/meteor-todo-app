# Stage 1: Build the Meteor app
FROM geoffreybooth/meteor-base:3.0 AS builder

# Copy package.json and install dependencies
COPY package*.json $APP_SOURCE_FOLDER/
RUN bash $SCRIPTS_FOLDER/build-app-npm-dependencies.sh

# Copy the rest of the application code and build the bundle
COPY . $APP_SOURCE_FOLDER/
RUN bash $SCRIPTS_FOLDER/build-meteor-bundle.sh

# Stage 2: Run the built Node.js app
FROM node:20-alpine

ENV APP_BUNDLE_FOLDER /opt/bundle
ENV SCRIPTS_FOLDER /docker

# Copy the built scripts and bundle from the builder stage
COPY --from=builder $SCRIPTS_FOLDER $SCRIPTS_FOLDER/
COPY --from=builder $APP_BUNDLE_FOLDER/bundle $APP_BUNDLE_FOLDER/bundle/

# Install the production NPM dependencies for the server
RUN bash $SCRIPTS_FOLDER/build-meteor-npm-dependencies.sh

# Expose the port Railway will route to
EXPOSE 3000

# Start the Node app
CMD ["node", "/opt/bundle/bundle/main.js"]