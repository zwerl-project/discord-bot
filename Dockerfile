FROM node:lts-alphine

# Defining environment variables
ENV NODE_ENV=production

# Token for the bot
ARG token
ENV TOKEN=$token

ARG client_id
ENV CLIENT_ID=$client_id

ARG guild_id
ENV GUILD_ID=$guild_id

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN yarn install

# Bundle app source
COPY . .
RUN yawrn build

# Start app
CMD [ "yarn", "start" ]