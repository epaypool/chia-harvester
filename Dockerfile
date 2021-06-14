# Install dependencies only when needed
FROM node:15-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:15-alpine AS builder
WORKDIR /app
COPY ./src/ ./src/
COPY package.json tsconfig.json codegen.yml ./
COPY --from=deps /app/node_modules ./node_modules
#RUN ls -al /app/src/
RUN npm run build
#RUN ls -al /app/dist/

FROM node:15-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup -g 1001 -S nonroot
RUN adduser -S nonroot -u 1001

COPY --from=builder --chown=nonroot:nonroot /app/dist/ ./dist/
COPY --from=builder /app/node_modules ./node_modules
#RUN ls -al /app/dist/

USER nonroot

CMD ["node", "./dist/index.js"]
