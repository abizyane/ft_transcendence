FROM node:20.17-alpine3.20

WORKDIR /app

COPY app/package*.json ./

RUN npm install && npm install -g next

COPY app/. .

CMD ["next", "dev"]