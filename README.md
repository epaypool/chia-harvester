# chia-plots-monitor

small service to monitor harvester plots

## Harvester Setup

```shell
version: '3.4'

services:
  harvester:
   image: epaypool/chia-harvester
    environment:
      - LOG_LEVEL=INFO
      - EPAYPOOL_HARVESTER_NAME=<your_harvester_name>
      - EPAYPOOL_USER=<user>
      - EPAYPOOL_PASSWORD=<password>
      - plots_dir=/plot1
    volumes:
      - /your/local/plots/folder:/plot1
```

## Technologies

- [TypeScript GraphQL-Request](https://www.graphql-code-generator.com/docs/plugins/typescript-graphql-request)
