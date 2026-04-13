import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredVars = [
  'BASE_URL',
  'PORT',
  'SWAGGER_USER',
  'SWAGGER_PASSWORD',
  'MONGODB_URI',
];
for (const v of requiredVars) {
  if (!process.env[v]) {
    console.error(`❌ Required environment variable is missing: ${v}`);
    process.exit(1);
  }
}

export default {
  baseUrl: process.env.BASE_URL,
  port: parseInt(process.env.PORT, 10),
  swaggerUser: process.env.SWAGGER_USER,
  swaggerPass: process.env.SWAGGER_PASSWORD,
  mongodbUri: process.env.MONGODB_URI,
};
