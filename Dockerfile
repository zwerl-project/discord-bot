FROM node:lts-alphine

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