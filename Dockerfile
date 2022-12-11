FROM node:lts-alpine

# Defining environment variables
ENV NODE_ENV=production

# Token for the bot
ARG token
ENV TOKEN=$token

ARG client_id
ENV CLIENT_ID=$client_id

ARG GUILD_ID
ENV GUILD_ID=$GUILD_ID

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN yarn install

# Bundle app source
COPY . .
RUN yarn build

# Start app
CMD [ "yarn", "start" ]