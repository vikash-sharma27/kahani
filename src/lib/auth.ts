import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { db } from '@/lib/db';

export const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || 'dev-auth-secret-key-at-least-32-chars-long-abcdef123456';
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  userId: string;
  email: string;
  role: Role;
  name: string | null;
}

export async function createAdminSessionToken(payload: AdminSessionPayload): Promise<string> {
  const secret = getAuthSecret();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret);
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<AdminSessionPayload | null> {
  if (!token) return null;
  try {
    const secret = getAuthSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Retrieves the currently authenticated team member from the session cookie
 * and verifies against the live database to enforce instant ban revocations.
 */
export async function getServerSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const decoded = await verifyAdminSessionToken(sessionCookie);

  if (!decoded) {
    return null;
  }

  // Live database check to verify account exists and is not banned
  const user = await db.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true, name: true, isBanned: true },
  });

  if (!user || user.isBanned) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
}

/**
 * Enforces authentication. Redirects to /admin/login if not authenticated.
 */
export async function requireAuth(): Promise<AdminSessionPayload> {
  const session = await getServerSession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}

/**
 * Enforces role authorization (e.g. ADMIN only).
 */
export async function requireRole(requiredRole: Role): Promise<AdminSessionPayload> {
  const session = await requireAuth();

  if (requiredRole === Role.ADMIN && session.role !== Role.ADMIN) {
    throw new Error('Forbidden: Admin access required');
  }

  return session;
}
