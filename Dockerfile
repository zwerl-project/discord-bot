FROM node:18-bullseye-slim

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
CMD [ "yarn", "deploy" ]