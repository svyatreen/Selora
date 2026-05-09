import * as dotenv from 'dotenv';
import * as path from 'path';
import { logger } from './logger';

// Load .env file from backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
  },
  
  gmail: {
    appPassword: process.env.GMAIL_APP_PASSWORD || '',
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
