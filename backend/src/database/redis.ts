import Redis from 'ioredis';
import { config } from '../config/config';

export const redis = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.error('Redis error:', err.message);
});

export async function connectRedis(): Promise<void> {
  await redis.connect();
  console.log('Redis connected');
}
