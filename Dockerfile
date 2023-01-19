FROM node:14-alpine

# Create app directory
WORKDIR /app/electronics/server

# Copy backend, package and package-json
COPY backend/ .
COPY package*.json ./

# Install app dependencies
RUN npm install

EXPOSE 5000

CMD [ "npm", "run", "start" ]
