FROM node:18-alpine

WORKDIR /app

COPY ./package*.json ./

RUN npm i --force

COPY . .

CMD ["npm", "run", "dev"]