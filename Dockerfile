FROM epaypool/chia-blockchain:latest AS builder

COPY ./src/ ./monitor/src/
COPY package.json package-lock.json tsconfig.json codegen.yml ./monitor/
RUN ls -al ./monitor/
RUN cd monitor && npm install && npm run build
ENV NODE_ENV production
RUN cd monitor && npm install

FROM epaypool/chia-blockchain:latest AS runner

VOLUME /root/.chia

ADD ./ca ./ca

COPY entrypoint.sh ./
COPY --from=builder /chia-blockchain/monitor/ /chia-blockchain/monitor/

ENTRYPOINT ["bash", "./entrypoint.sh"]
