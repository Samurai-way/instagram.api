FROM node:16.15.1-alpine

WORKDIR /my-app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]
