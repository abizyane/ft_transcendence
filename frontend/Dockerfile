FROM node:20.17-alpine3.20 AS builder

WORKDIR /app

COPY app/. .

RUN npm install --loglevel=error
RUN npx shadcn@latest init -d

RUN npm run build



FROM node:20.17-alpine3.20

WORKDIR /app

# COPY --from=builder /app ./
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# RUN npx next telemetry disable


CMD ["npm", "start"]
# CMD ['npx',"next", "dev"]

# FROM node:20.17-alpine3.20 AS builder

# WORKDIR /app

# COPY app/. .

# RUN npm install --loglevel=error

# FROM node:20.17-alpine3.20

# WORKDIR /app

# COPY --from=builder /app ./

# RUN npx next telemetry disable

# RUN npx shadcn@latest init -d

# CMD ["npx", "next", "dev"]