FROM node:20-alpine

RUN apk add --no-cache git python3 make g++

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000