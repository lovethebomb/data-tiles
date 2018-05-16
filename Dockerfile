FROM node:alpine

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

# Create app directory
RUN mkdir /app
WORKDIR /app

RUN npm install -g npm@v6.0.1 tsc typescript

COPY package.json package-lock.json tsconfig.json /app/
RUN npm ci 

RUN node --version 
RUN npm --version 
RUN tsc --version 

COPY . /app/
RUN npm run build

CMD [ "npm", "start" ]