import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendUnauthorized } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  userId: string;
  userRole: string;
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendUnauthorized(res, 'Missing or invalid authorization header');
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    (req as AuthenticatedRequest).userId   = payload.userId;
    (req as AuthenticatedRequest).userRole = payload.role;
    next();
  } catch {
    sendUnauthorized(res, 'Invalid or expired token');
  }
}
