import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate';
import { sendForbidden } from '../utils/response';

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as AuthenticatedRequest).userRole;
    if (!roles.includes(userRole)) {
      sendForbidden(res, 'You do not have permission to perform this action');
      return;
    }
    next();
  };
}
