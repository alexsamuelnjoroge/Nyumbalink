import { Request, Response } from 'express';
import { z } from 'zod';
import { normalizeKenyanPhone } from '../utils/phone';
import { sendSuccess, sendError, sendUnauthorized } from '../utils/response';
import * as AuthService from '../services/auth.service';

const requestOTPSchema = z.object({
  phone: z.string().min(9),
});

const verifyOTPSchema = z.object({
  phone: z.string().min(9),
  otp:   z.string().length(6),
});

export async function requestOTP(req: Request, res: Response): Promise<void> {
  const result = requestOTPSchema.safeParse(req.body);
  if (!result.success) {
    sendError(res, 'A valid phone number is required');
    return;
  }

  const phone = normalizeKenyanPhone(result.data.phone);
  if (!phone) {
    sendError(res, 'Invalid Kenyan phone number');
    return;
  }

  try {
    await AuthService.sendOTP(phone);
    sendSuccess(res, { message: 'OTP sent successfully' });
  } catch {
    sendError(res, 'Failed to send OTP. Please try again.', 500);
  }
}

export async function verifyOTP(req: Request, res: Response): Promise<void> {
  const result = verifyOTPSchema.safeParse(req.body);
  if (!result.success) {
    sendError(res, 'Phone number and 6-digit OTP are required');
    return;
  }

  const phone = normalizeKenyanPhone(result.data.phone);
  if (!phone) {
    sendError(res, 'Invalid Kenyan phone number');
    return;
  }

  try {
    const { accessToken, refreshToken, user } = await AuthService.verifyOTPAndLogin(
      phone,
      result.data.otp,
    );

    // Refresh token in HttpOnly cookie — JS cannot read it
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   30 * 24 * 60 * 60 * 1000, // 30 days
    });

    sendSuccess(res, { accessToken, user });
  } catch {
    sendUnauthorized(res, 'Invalid or expired OTP');
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies?.refresh_token as string | undefined;

  if (!refreshToken) {
    sendUnauthorized(res, 'No session found');
    return;
  }

  try {
    const accessToken = await AuthService.refreshAccessToken(refreshToken);
    sendSuccess(res, { accessToken });
  } catch {
    sendUnauthorized(res, 'Session expired. Please log in again.');
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies?.refresh_token as string | undefined;

  if (refreshToken) {
    await AuthService.revokeRefreshToken(refreshToken);
  }

  res.clearCookie('refresh_token');
  sendSuccess(res, { message: 'Logged out successfully' });
}
