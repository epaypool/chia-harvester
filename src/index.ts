import { Connection, Harvester, Message, PlotsResponse, SERVICE } from '@epaypool/chia-client';
import { getChiaConfig } from '@epaypool/chia-client/dist/src/ChiaNodeUtils';
// import * as Sentry from '@sentry/node';
import * as crypto from 'crypto';
import Debug from 'debug';
import * as fs from 'fs';
import { readFileSync } from 'fs';
import { GraphQLClient } from 'graphql-request';
import KcAdminClient from 'keycloak-admin';
import { env, loadEnv } from './env';
import { getSdk, InputPlot, InputPlots } from './generated.graphql';
import { logger } from './logger';

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

async function processPlots(harvester_key: string, monitor: Harvester) {
  const plots = await monitor.getPlots();

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
    logger.error('KEYCLOAK LOGIN FAILED WITH STATUS %o', error.toString());
    throw new Error(
      'Please check your EPAYPOOL_USER and EPAYPOOL_PASSWORD. Visit: https://wiki.epaypool.com/troubleshooting:harvester#keycloak'
    );
  }

  const token = await kcAdminClient.getAccessToken();

  let url = env.EPAYPOOL_GRAPHQL;
  if (url === '') {
    const chiaConfig = getChiaConfig(env.CHIA_ROOT);
    if (chiaConfig.selected_network === 'mainnet') {
      url = 'https://epaypool.com/graphql';
    } else {
      url = 'https://xcht.epaypool.com/graphql';
    }
  }
  logger.debug('Using %s endpoint', url);
  const client = new GraphQLClient(url, {
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
  logger.info('Sending information about %d plots', inputPlots.plots.length);
  const res = await getSdk(client).addHarvesterPlots({ data: inputPlots });
  logger.info('Total new plots added %o', res);
}

async function main() {
  debug('init debug');
  logger.info('Starting version 1.0.0');
  await loadEnv(); // Executed synchronously before the rest of your app loads

  const timeoutInSeconds = 30;
  const certFileName = `${env.CHIA_ROOT}config/ssl/daemon/private_daemon.crt`;
  const keyFileName = `${env.CHIA_ROOT}config/ssl/daemon/private_daemon.key`;
  const harvester_key = await harvesterKey(`${env.CHIA_ROOT}config/ssl/harvester/private_harvester.crt`);
  logger.info('harvester_key = %s', harvester_key);

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
    logger.error(
      'FAILED TO CONNECT TO HARVESTER: %s. Sleep for %d seconds... Visit https://wiki.epaypool.com/troubleshooting:harvester#harvester',
      error.toString(),
      timeoutInSeconds
    );
  });

  conn.addService(SERVICE.walletUi);
  conn.addService(SERVICE.daemon);

  try {
    const monitor = new Harvester({ conn, origin: 'chia-plots-monitor' }, env.CHIA_ROOT);
    setInterval(function () {
      processPlots(harvester_key, monitor);
    }, 10 * 60 * 1000);
    await monitor.init();
    conn.onConnected(() => {
      processPlots(harvester_key, monitor);
    });
    conn.onMessage(async (message: Message) => {
      if (message.command === 'get_plots') {
        const data: PlotsResponse = message.data;
        logger.info('New plot just was added as we have message from harvester %d', data.plots.length);
        await processPlots(harvester_key, monitor);
      }
    });
  } catch (error) {
    // Sentry.captureException(error);
    logger.error('error %s', error.toString());
    await conn.close();
  }
}

main();
