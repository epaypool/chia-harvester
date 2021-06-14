import { Connection, Harvester, Message, PlotsResponse, SERVICE } from '@epaypool/chia-client';
// import * as Sentry from '@sentry/node';
import * as crypto from 'crypto';
import Debug from 'debug';
import * as fs from 'fs';
import { readFileSync } from 'fs';
import { GraphQLClient } from 'graphql-request';
import KcAdminClient from 'keycloak-admin';
import { env, loadEnv } from './env';
import { getSdk, InputPlot, InputPlots } from './generated.graphql';

const debug = Debug('epaypool:index.ts');

// if (process.env.NODE_ENV === 'production')
// {
//   Sentry.init({
//     dsn: 'https://46c16f7448054444ba0479ee738e1ab6@sentry.epaypool.com/2',
//
//     // We recommend adjusting this value in production, or using tracesSampler
//     // for finer control
//     tracesSampleRate: 1.0,
//   });
// }

// const transaction = Sentry.startTransaction({
//   op: 'test',
//   name: 'My First Test Transaction',
// });
//
// setTimeout(() => {
//   try {
//     foo();
//   } catch (e) {
//     Sentry.captureException(e);
//   } finally {
//     transaction.finish();
//   }
// }, 99);

function harvesterKey(filename: string) {
  const certificate = fs
    .readFileSync(filename, { flag: 'r' })
    .toString()
    .split('\n')
    .filter((line) => !line.includes('-----'))
    .map((line) => line.trim())
    .join('');

  const shasum = crypto.createHash('sha256');
  shasum.update(certificate, 'base64');
  return shasum.digest('hex');
}

async function processPlots(harvester_key: string, plots: PlotsResponse) {
  const baseUrl = 'https://auth.epaypool.com/auth';
  const kcAdminClient = new KcAdminClient({ baseUrl, realmName: 'epaypool.com' });

  try {
    await kcAdminClient.auth({
      username: env.EPAYPOOL_USER,
      password: env.EPAYPOOL_PASSWORD,
      grantType: 'password',
      clientId: 'epaypool.com',
    });
  } catch (error) {
    debug('keycloak login failed with Status %o', error.toString());
    throw new Error('Failed to authentication. Please check your EPAYPOOL_USER and EPAYPOOL_PASSWORD');
  }

  const token = await kcAdminClient.getAccessToken();
  debug('token=', token);

  const client = new GraphQLClient('http://localhost:8888/graphql', {
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  const inputPlots: InputPlots = {
    harvester_key,
    harvester_name: env.EPAYPOOL_HARVESTER_NAME,
    plots: [],
  };
  for (const inputPlot of plots.plots) {
    const plot: InputPlot = {
      plot_public_key: inputPlot.plot_public_key,
      file_size: inputPlot.file_size,
      size: inputPlot.size,
      filename: inputPlot.filename,
      plot_seed: inputPlot['plot-seed'],
      pool_public_key: inputPlot.plot_public_key,
    };
    inputPlots.plots.push(plot);
  }
  const res = await getSdk(client).addHarvesterPlots({ data: inputPlots });
  debug('Total plots added for user = ', res);
}

async function main() {
  debug('Starting version 1.0');
  await loadEnv(); // Executed synchronously before the rest of your app loads

  const timeoutInSeconds = 30;
  const certFileName = `${env.CHIA_ROOT}config/ssl/daemon/private_daemon.crt`;
  const keyFileName = `${env.CHIA_ROOT}config/ssl/daemon/private_daemon.key`;
  const harvester_key = await harvesterKey(`${env.CHIA_ROOT}config/ssl/harvester/private_harvester.crt`);
  debug('harvester_key = %s', harvester_key);

  const conn = new Connection(
    `${env.CHIA_HOST}:${env.CHIA_PORT}`,
    {
      cert: readFileSync(certFileName),
      key: readFileSync(keyFileName),
      rejectUnauthorized: false,
    },
    timeoutInSeconds
  );
  conn.onError((error) => {
    debug(
      'Monitor failed to connect to Harvester onError=%s. Sleep for %d seconds...',
      error.toString(),
      timeoutInSeconds
    );
  });

  conn.addService(SERVICE.walletUi);
  conn.addService(SERVICE.daemon);
  conn.onMessage(async (message: Message) => {
    if (
      // message.command !== 'register_service' &&
      // message.command !== 'get_connections' &&
      // message.command !== 'get_plots' &&
      message.command !== 'get_blockchain_state'
    ) {
      // debug('onMessage: %j', message);
    }
  });
  // try {
  //   const harvester = new Harvester( { conn, origin: 'my-service'}, env.CHIA_ROOT);
  //   await harvester.init();
  //   const plots = await harvester.getPlots();
  //   harvester.onGetPlots((message) => {
  //       debug('plots=%o', message);
  //   })
  try {
    const monitor = new Harvester({ conn, origin: 'my-cool-service' }, env.CHIA_ROOT);
    await monitor.init();
    debug('connected');
    const plots = await monitor.getPlots();
    debug('total plots=%o', plots.plots.length);
    await processPlots(harvester_key, plots);
    debug('finished');
  } catch (error) {
    // Sentry.captureException(error);
    debug('error=%o', error);
    await conn.close();
  }
}

main();
