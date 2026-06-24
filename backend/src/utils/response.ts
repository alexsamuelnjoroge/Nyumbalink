import { Response } from 'express';

export const sendSuccess = (res: Response, data: unknown, statusCode = 200) => {
  res.status(statusCode).json({ success: true, data });
};

export const sendCreated = (res: Response, data: unknown) => {
  sendSuccess(res, data, 201);
};

export const sendError = (res: Response, message: string, statusCode = 400) => {
  res.status(statusCode).json({ success: false, error: message });
};

export const sendUnauthorized = (res: Response, message = 'Unauthorized') => {
  sendError(res, message, 401);
};

export const sendForbidden = (res: Response, message = 'Forbidden') => {
  sendError(res, message, 403);
};

export const sendNotFound = (res: Response, message = 'Not found') => {
  sendError(res, message, 404);
};

export const sendServerError = (res: Response, message = 'Internal server error') => {
  sendError(res, message, 500);
};
