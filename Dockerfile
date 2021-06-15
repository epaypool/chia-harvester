FROM epaypool/chia-blockchain:latest AS runner

RUN curl -fsSL https://deb.nodesource.com/setup_15.x | sudo -E bash -
RUN apt-get install -y nodejs

COPY entrypoint.sh ./
COPY ./src/ ./monitor/src/
COPY package.json package-lock.json tsconfig.json codegen.yml ./monitor/
RUN ls -al ./monitor/
RUN cd monitor && npm install && npm run build
ENV NODE_ENV production
RUN cd monitor && npm install

ENTRYPOINT ["bash", "./entrypoint.sh"]
