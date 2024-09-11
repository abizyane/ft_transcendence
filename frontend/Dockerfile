FROM node:20.17-alpine3.20

WORKDIR /app

COPY app/. .

RUN npm install && npm install -g next


CMD ["next", "dev"]