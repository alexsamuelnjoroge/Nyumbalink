import { redis } from '../database/redis';

const OTP_TTL_SECONDS = 600; // 10 minutes
const OTP_PREFIX = 'otp:';

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOTP(phone: string, otp: string): Promise<void> {
  await redis.set(`${OTP_PREFIX}${phone}`, otp, 'EX', OTP_TTL_SECONDS);
}

export async function verifyOTP(phone: string, otp: string): Promise<boolean> {
  const stored = await redis.get(`${OTP_PREFIX}${phone}`);
  if (!stored) return false;

  const isValid = stored === otp;
  if (isValid) {
    // Delete immediately — one-time use
    await redis.del(`${OTP_PREFIX}${phone}`);
  }
  return isValid;
}
