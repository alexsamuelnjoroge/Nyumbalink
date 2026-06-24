import { Express, Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import * as AuthHandler from './auth.handler';

export function registerRoutes(app: Express): void {
  const api = Router();

  // ── Auth (public) ──────────────────────────────────────────
  const auth = Router();
  auth.post('/request-otp', AuthHandler.requestOTP);
  auth.post('/verify-otp',  AuthHandler.verifyOTP);
  auth.post('/refresh',     AuthHandler.refresh);
  auth.post('/logout',      AuthHandler.logout);
  api.use('/auth', auth);

  // ── Protected routes placeholder ──────────────────────────
  // Listings, agents, areas, viewings, reviews, transactions
  // will be wired here as each module is built
  const protected_ = Router();
  protected_.use(authenticate);
  api.use('/', protected_);

  app.use('/api', api);
}
