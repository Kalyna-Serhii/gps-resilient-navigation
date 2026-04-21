import axios from 'axios';

import config from '../config/index.js';

import { POLL_INTERVAL_MS } from '../utils/constants.js';
import logger from '../utils/logger.js';

const alertsClient = axios.create({
  baseURL: 'https://api.alerts.in.ua/v1',
  headers: { Authorization: `Bearer ${config.alertsApiToken}` },
});

let cache = new Map();
let intervalId = null;

async function fetchAndUpdate() {
  try {
    const { data } = await alertsClient.get('/alerts/active.json');

    const alerts = Array.isArray(data.alerts) ? data.alerts : [];

    const next = new Map();
    for (const a of alerts) {
      if (a.location_oblast && !next.has(a.location_oblast)) {
        next.set(a.location_oblast, a);
      }
    }

    cache = next;
    logger.info(`Alert cache updated: ${cache.size} active region alert(s)`);
  } catch (err) {
    logger.error({ err }, 'Failed to update alert cache');
  }
}

export function getCache() {
  return cache;
}

export async function startAlertPolling() {
  await fetchAndUpdate();
  intervalId = setInterval(fetchAndUpdate, POLL_INTERVAL_MS);
  logger.info('Alert polling started');
}

export function stopAlertPolling() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    logger.info('Alert polling stopped');
  }
}
