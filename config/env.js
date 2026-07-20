import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);const environment = process.env.NODE_ENV || 'development';

const envCandidates = [
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../.env.local'),
  path.resolve(__dirname, `../.env.${environment}.local`),
  path.resolve(__dirname, `../config/.env.${environment}.local`),
  path.resolve(__dirname, `.env.${environment}.local`),
];

for (const envPath of envCandidates) {
  config({ path: envPath });
}

const databaseUrl = process.env.DATABASE_URL || process.env.MONGODB_URI;

export const {
    PORT, NODE_ENV,
    DATABASE_URL,
    JWT_SECRET, JWT_EXPIRES_IN,
} = process.env;
export const DATABASE_URL = databaseUrl;
