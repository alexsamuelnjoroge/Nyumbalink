import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV:               z.enum(['development', 'production', 'test']).default('development'),
  PORT:                   z.string().default('4000'),
  FRONTEND_URL:           z.string().default('http://localhost:3000'),

  DATABASE_URL:           z.string(),
  REDIS_URL:              z.string().default('redis://localhost:6379'),

  JWT_ACCESS_SECRET:      z.string(),
  JWT_REFRESH_SECRET:     z.string(),

  AT_API_KEY:             z.string(),
  AT_USERNAME:            z.string(),
  AT_SENDER_ID:           z.string().default('NyumbaLink'),

  MPESA_CONSUMER_KEY:     z.string(),
  MPESA_CONSUMER_SECRET:  z.string(),
  MPESA_SHORTCODE:        z.string(),
  MPESA_PASSKEY:          z.string(),
  MPESA_CALLBACK_URL:     z.string(),

  CLOUDINARY_CLOUD_NAME:  z.string(),
  CLOUDINARY_API_KEY:     z.string(),
  CLOUDINARY_API_SECRET:  z.string(),

  GOOGLE_MAPS_API_KEY:    z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Missing or invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;
