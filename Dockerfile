FROM node:alpine

ENV NODE_ENV=production
ENV PORT=3000

# Create app directory
RUN mkdir /app
WORKDIR /app

RUN npm install -g npm@v6.0.1 typescript@next ts-node

COPY package.json package-lock.json tsconfig.json /app/
RUN npm ci 

COPY . /app/
RUN npm run build

CMD [ "npm", "start" ]