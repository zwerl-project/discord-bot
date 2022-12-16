FROM node:lts-alpine

# Defining environment variables
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN yarn install

# Prisma generate
RUN yarn prisma generate

# Prisma migrate
RUN yarn prisma migrate deploy

# Bundle app source
COPY . .
RUN yarn build

# Start app
CMD [ "yarn", "start" ]