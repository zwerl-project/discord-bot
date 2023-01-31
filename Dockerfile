FROM node:19-bullseye-slim

# Defining environment variables
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Debugging
RUN pwd
RUN ls -la
RUN ls -la /usr/src/app
RUN ls -la /usr/src/app/node_modules

# Prisma source
COPY prisma ./prisma

# Prisma generate
RUN yarn prisma:generate

# Copy app source
COPY . .

# Bundle app source
RUN yarn build

# Start app
CMD [ "yarn", "deploy" ]