import config from '../config/index.js';
import paths from './paths/index.js';
import components from './schemas/index.js';

const servers = [
  { url: config.baseUrl, description: 'Current environment' },
  { url: 'http://localhost:' + config.port, description: 'Local' },
];

const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'GPS resilient navigation API',
    version: '1.0.0',
  },
  servers,
  components,
  security: [{ bearerAuth: [] }],
  paths,
};

export default openapi;
