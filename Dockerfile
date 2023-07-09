FROM node:18-bullseye-slim

# Set environment variables
ARG COMMIT_SHA
ENV COMMIT_SHA=${COMMIT_SHA}

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
RUN yarn install

# Prisma source
COPY prisma ./prisma

# Prisma generate
RUN yarn prisma:generate

# Copy app source
COPY . .

# Bundle app source
RUN yarn build

# Start app
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=4096
CMD [ "yarn", "deploy" ]