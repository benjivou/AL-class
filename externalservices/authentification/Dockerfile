FROM node:10

WORKDIR  /app

COPY package.json /app

RUN npm install

RUN npm test

COPY . /app

CMD ["npm", "start"]


