FROM node:latest AS base

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --only=production

# Bundle app source
COPY . .

# Google's Distroless image
FROM node:13.12.0-alpine
WORKDIR /app
COPY --from=base /app /app

EXPOSE 4000
CMD [ "npm", "run", "prod" ]