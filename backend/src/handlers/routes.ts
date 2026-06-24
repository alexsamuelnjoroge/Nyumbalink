import { Express, Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import * as AuthHandler     from './auth.handler';
import * as ListingsHandler from './listings.handler';

export function registerRoutes(app: Express): void {
  const api = Router();

  // ── Auth (public) ──────────────────────────────────────────
  const auth = Router();
  auth.post('/request-otp', AuthHandler.requestOTP);
  auth.post('/verify-otp',  AuthHandler.verifyOTP);
  auth.post('/refresh',     AuthHandler.refresh);
  auth.post('/logout',      AuthHandler.logout);
  api.use('/auth', auth);

  // ── Listings — public reads ────────────────────────────────
  api.get('/listings',                   ListingsHandler.search);
  api.get('/listings/:id',               ListingsHandler.getOne);
  api.post('/listings/:id/whatsapp-tap', ListingsHandler.recordWhatsappTap);

  // ── Protected routes ──────────────────────────────────────
  const guard = Router();
  guard.use(authenticate);

  // Listings — agent/landlord writes
  guard.post(
    '/listings/:id/confirm',
    authorize('AGENT', 'LANDLORD', 'ADMIN'),
    ListingsHandler.confirmAvailability,
  );

  api.use('/', guard);

  app.use('/api', api);
}
