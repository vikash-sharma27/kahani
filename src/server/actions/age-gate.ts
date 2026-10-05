'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { AGE_COOKIE_NAME, AGE_DENIED_COOKIE_NAME, AGE_COOKIE_DAYS, AGE_DENIED_HOURS } from '@/config/constants';
import { createAgeGateToken, sanitizeReturnTo } from '@/lib/age-gate';
import { hashIp, hashUserAgent } from '@/lib/security';
import { db } from '@/lib/db';
import { AgeConsentResult } from '@prisma/client';

export async function acceptAgeGate(formData?: FormData) {
  const cookieStore = cookies();
  const deniedCookie = cookieStore.get(AGE_DENIED_COOKIE_NAME);

  // If age_denied cookie exists and is active, deny acceptance attempt
  if (deniedCookie?.value) {
    redirect('/access-denied');
  }

  const rawReturnTo = formData ? (formData.get('returnTo') as string) : '/';
  const targetUrl = sanitizeReturnTo(rawReturnTo);

  // Generate signed JWT
  const token = await createAgeGateToken();

  // Set 30-day httpOnly cookie
  cookieStore.set(AGE_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: AGE_COOKIE_DAYS * 24 * 60 * 60,
    path: '/',
  });

  // Remove denied cookie if present
  cookieStore.delete(AGE_DENIED_COOKIE_NAME);

  // Asynchronously record consent log with hashed privacy values
  try {
    const headersList = headers();
    const forwardedFor = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || 'unknown';

    await db.ageConsentLog.create({
      data: {
        result: AgeConsentResult.ACCEPTED,
        ipHash: hashIp(forwardedFor.split(',')[0].trim()),
        userAgentHash: hashUserAgent(userAgent),
      },
    });
  } catch (err) {
    console.error('Failed to log age acceptance:', err);
  }

  redirect(targetUrl);
}

export async function denyAgeGate() {
  const cookieStore = cookies();

  // Set 24-hour denial cookie
  cookieStore.set(AGE_DENIED_COOKIE_NAME, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: AGE_DENIED_HOURS * 60 * 60,
    path: '/',
  });

  // Delete age_ok cookie if existing
  cookieStore.delete(AGE_COOKIE_NAME);

  // Record denial log
  try {
    const headersList = headers();
    const forwardedFor = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || 'unknown';

    await db.ageConsentLog.create({
      data: {
        result: AgeConsentResult.DENIED,
        ipHash: hashIp(forwardedFor.split(',')[0].trim()),
        userAgentHash: hashUserAgent(userAgent),
      },
    });
  } catch (err) {
    console.error('Failed to log age denial:', err);
  }

  redirect('/access-denied');
}
