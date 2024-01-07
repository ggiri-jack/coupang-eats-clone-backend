FROM node:lts-buster
LABEL author Jaeho Kim <kms01226@gmail.com>

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 4001
CMD npm run start

