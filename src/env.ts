import { EnvType, load } from 'ts-dotenv';

export const schema = {
  DEBUG: { type: String, default: 'epaypool:*' },
  EPAYPOOL_USER: String,
  EPAYPOOL_PASSWORD: String,
  EPAYPOOL_HARVESTER_NAME: { type: String, default: 'unknown' },
  EPAYPOOL_GRAPHQL: { type: String, default: '' },
  NODE_ENV: { type: String, default: 'development' },
  CHIA_ROOT: { type: String, default: '/root/.chia/mainnet/' },
  CHIA_HOST: { type: String, default: 'localhost' },
  CHIA_PORT: { type: Number, default: 55400 },
  KEYCLOAK_DOMAIN: { type: String, default: 'https://auth.epaypool.com/auth/realms/epaypool.com' },
  REFRESH_TIMEOUT_SECS: { type: Number, default: 10 * 60 },
};

export type Env = EnvType<typeof schema>;
export let env: Env;

export const loadEnv = async (): Promise<void> => {
  if (process.env.ENV_FILE) {
    env = load(schema, process.env.ENV_FILE);
  } else {
    env = load(schema);
  }
};
