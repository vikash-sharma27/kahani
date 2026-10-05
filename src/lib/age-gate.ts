import { SignJWT, jwtVerify } from 'jose';
import { AGE_COOKIE_DAYS } from '@/config/constants';

function getSecretKey(): Uint8Array {
  const secret = process.env.AGE_GATE_SECRET || 'dev-age-gate-secret-key-at-least-32-chars-long-abcdef123456';
  return new TextEncoder().encode(secret);
}

export interface AgeGatePayload {
  adult: boolean;
  iat?: number;
  exp?: number;
}

/**
 * Creates a signed JWT for 18+ age verification valid for 30 days
 */
export async function createAgeGateToken(): Promise<string> {
  const secretKey = getSecretKey();
  return new SignJWT({ adult: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${AGE_COOKIE_DAYS}d`)
    .sign(secretKey);
}

/**
 * Verifies the age_ok JWT token. Returns true if valid and not expired.
 */
export async function verifyAgeGateToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload.adult === true;
  } catch {
    return false;
  }
}

/**
 * Validates returnTo path to strictly prevent Open Redirect vulnerabilities.
 * Must be a same-site relative path starting with a single '/' and not '//'.
 */
export function sanitizeReturnTo(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return '/';
  }

  const trimmed = url.trim();

  // Disallow external URLs, protocol relative URLs (//), javascript:, data:, etc.
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('\\')) {
    return '/';
  }

  // Disallow forbidden destinations
  const forbidden = ['/age-gate', '/access-denied'];
  if (forbidden.some((prefix) => trimmed.startsWith(prefix))) {
    return '/';
  }

  return trimmed;
}
