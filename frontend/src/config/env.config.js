import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const {
  DB_HOST,
  DB_PORT,
  PORT,
  CLOUD_WEB_URL,
  CLOUD_NAME,
  API_BASE_URL,
} = process.env;
