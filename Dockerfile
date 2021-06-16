FROM epaypool/chia-blockchain:latest AS builder

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN apt-get install -y nodejs

ADD ./ca ./ca

COPY entrypoint.sh ./
COPY ./src/ ./monitor/src/
COPY package.json package-lock.json tsconfig.json codegen.yml ./monitor/
RUN ls -al ./monitor/
RUN cd monitor && npm install && npm run build
ENV NODE_ENV production
RUN cd monitor && npm install

FROM nikolaik/python-nodejs:python3.9-nodejs16-alpine as runner
WORKDIR /chia-blockchain/

COPY --from=builder /chia-blockchain/ /chia-blockchain/

ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
