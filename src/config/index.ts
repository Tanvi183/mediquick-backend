import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  appUrl: process.env.APP_URL || 'http://localhost:5000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mediquick?schema=public',
  jwt: {
    secret: process.env.JWT_SECRET || 'mediquick_super_secret_jwt_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'mediquick_super_refresh_jwt_key_2026',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock_secret_key_mediquick',
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_publishable_key',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock_webhook_secret',
  },
};
