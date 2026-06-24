import { prisma } from '../database/postgres';
import { generateOTP, storeOTP, verifyOTP } from '../utils/otp';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendSMS } from '../external/africasTalking';

export async function sendOTP(phone: string): Promise<void> {
  const otp = generateOTP();
  await storeOTP(phone, otp);
  await sendSMS(phone, `Your NyumbaLink verification code is: ${otp}. Valid for 10 minutes.`);
}

export async function verifyOTPAndLogin(phone: string, otp: string) {
  const isValid = await verifyOTP(phone, otp);
  if (!isValid) throw new Error('Invalid or expired OTP');

  // Find or create user
  let user = await prisma.user.findUnique({ where: { phoneNumber: phone } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phoneNumber:     phone,
        fullName:        '',
        isPhoneVerified: true,
      },
    });
  } else if (!user.isPhoneVerified) {
    user = await prisma.user.update({
      where: { id: user.id },
      data:  { isPhoneVerified: true, lastActiveAt: new Date() },
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data:  { lastActiveAt: new Date() },
    });
  }

  const accessToken  = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken(user.id);

  // Persist refresh token (expires in 30 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  return { accessToken, refreshToken, user };
}

export async function refreshAccessToken(token: string): Promise<string> {
  const record = await prisma.refreshToken.findUnique({ where: { token } });

  if (!record || record.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  const user = await prisma.user.findUnique({ where: { id: record.userId } });
  if (!user) throw new Error('User not found');

  return generateAccessToken({ userId: user.id, role: user.role });
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { token } });
}

// Cleanup: remove expired refresh tokens (called by cron job)
export async function purgeExpiredTokens(): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}
