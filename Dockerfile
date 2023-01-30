FROM node:lts-alpine

# Defining environment variables
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN yarn install

# Prisma source
COPY prisma/ /usr/src/app/prisma

# Prisma generate
RUN yarn prisma:generate

# Prisma migrate
RUN yarn prisma:migrate

# Copy app source
COPY . .

# Bundle app source
RUN yarn build

# Start app
CMD [ "yarn", "start" ]