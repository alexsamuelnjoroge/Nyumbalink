import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import { errorHandler } from './middleware/errorHandler';
import { registerRoutes } from './handlers/routes';

export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS — allow only the frontend origin
  app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  registerRoutes(app);

  // Global error handler — must be last
  app.use(errorHandler);

  return app;
}
