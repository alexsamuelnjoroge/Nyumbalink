import { config } from './config/config';
import { connectDatabase, disconnectDatabase } from './database/postgres';
import { connectRedis, redis } from './database/redis';
import { createApp } from './app';

async function main() {
  await connectDatabase();
  await connectRedis();

  const app = createApp();

  const server = app.listen(config.PORT, () => {
    console.log(`NyumbaLink API running on port ${config.PORT} [${config.NODE_ENV}]`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      await redis.quit();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
