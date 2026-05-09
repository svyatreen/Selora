import * as dotenv from 'dotenv';
import * as path from 'path';
import { logger } from './logger';

// Load .env file - try multiple locations for dev/production
const envPaths = [
  path.resolve(process.cwd(), '.env'),           // Railway: run from backend/
  path.resolve(process.cwd(), '../.env'),        // Alternative
  path.resolve(__dirname, '../../.env'),         // Development from src/lib/
  path.resolve(__dirname, '../.env'),            // From dist/
];

let envLoaded = false;
for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    logger.info({ path: envPath }, 'Environment loaded from');
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  logger.warn('No .env file found, using system environment variables');
}

export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
  },
  
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
  },
  
  session: {
    secret: process.env.SESSION_SECRET || 'default-secret-change-me',
  },
  
  urls: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8080',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  },
  
  get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  },
  
  get isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  },
} as const;

// Validation function to check required env vars
export function validateConfig(): void {
  const required = [
    { key: 'DATABASE_URL', value: config.database.url },
    { key: 'STRIPE_SECRET_KEY', value: config.stripe.secretKey },
    { key: 'SESSION_SECRET', value: config.session.secret },
  ];
  
  const missing = required.filter(item => !item.value);
  
  if (missing.length > 0) {
    const missingKeys = missing.map(item => item.key).join(', ');
    throw new Error(`Missing required environment variables: ${missingKeys}`);
  }
  
  logger.info({ 
    port: config.port,
    baseUrl: config.urls.baseUrl,
    clientUrl: config.urls.clientUrl,
    isProduction: config.isProduction 
  }, 'Configuration loaded');
}
