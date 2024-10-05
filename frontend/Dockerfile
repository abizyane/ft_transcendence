FROM node:20.17-alpine3.20 AS builder

WORKDIR /app

COPY app/. .

RUN npm install --loglevel=error

FROM node:20.17-alpine3.20

WORKDIR /app

COPY --from=builder /app ./

RUN npx next telemetry disable

CMD ["npx", "next", "dev"]