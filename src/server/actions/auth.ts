'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';
import { createAdminSessionToken, ADMIN_SESSION_COOKIE } from '@/lib/auth';
import { createPasswordResetToken, sendPasswordResetEmail } from '@/server/services/password-reset';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
});

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

export async function loginAdmin(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const headersList = headers();
  const clientIp =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headersList.get('x-real-ip') ||
    '127.0.0.1';

  // 1. Rate Limiting: 5 attempts per 15 minutes per IP
  const rateLimitKey = `admin_login:${clientIp}`;
  const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

  if (!rateLimit.allowed) {
    const minutesLeft = Math.ceil((rateLimit.resetAt - Date.now()) / (60 * 1000));
    return {
      success: false,
      error: `Too many failed login attempts. Please try again in ${minutesLeft} minutes.`,
    };
  }

  // 2. Validate Input
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid credentials. Password must be at least 12 characters.',
    };
  }

  // 3. Database Lookup & Password Verification
  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
  });

  const isPasswordValid = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;

  if (!user || !isPasswordValid) {
    return {
      success: false,
      error: 'Invalid email or password.',
    };
  }

  if (user.isBanned) {
    return {
      success: false,
      error: 'This account has been suspended. Please contact the administrator.',
    };
  }

  // Reset rate limit on success
  resetRateLimit(rateLimitKey);

  // 4. Update last login & create AuditLog
  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: 'LOGIN',
      entity: 'USER',
      entityId: user.id,
    },
  });

  // 5. Create Signed JWT Session
  const sessionToken = await createAdminSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  cookies().set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  redirect('/admin');
}

export async function logoutAdmin(): Promise<void> {
  cookies().delete(ADMIN_SESSION_COOKIE);
  redirect('/admin/login');
}

export async function requestPasswordReset(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get('email') as string;

  if (!email || !z.string().email().safeParse(email).success) {
    return {
      success: false,
      error: 'Please enter a valid email address.',
    };
  }

  const token = await createPasswordResetToken(email);
  if (token) {
    await sendPasswordResetEmail(email, token);
  }

  // Generic success message to prevent account enumeration
  return {
    success: true,
    error: undefined,
  };
}
