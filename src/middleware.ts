import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AGE_COOKIE_NAME, AGE_DENIED_COOKIE_NAME } from '@/config/constants';
import { verifyAgeGateToken } from '@/lib/age-gate';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/auth';

// Allow-listed routes that must never trigger the age gate redirect
const ALLOW_LIST = [
  '/age-gate',
  '/access-denied',
  '/disclaimer',
  '/terms',
  '/privacy',
  '/content-policy',
  '/contact',
  '/report',
  '/robots.txt',
  '/sitemap.xml',
  '/api/health',
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Always ignore internal Next.js assets, static files, and favicons
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. ADMIN ROUTE PROTECTION
  if (pathname.startsWith('/admin')) {
    const isPublicAdminRoute =
      pathname === '/admin/login' ||
      pathname === '/admin/forgot-password' ||
      pathname === '/admin/reset-password';

    if (!isPublicAdminRoute) {
      const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      const session = await verifyAdminSessionToken(sessionCookie);

      if (!session) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  }

  // 2. AGE DENIED PROTECTION
  const deniedCookie = request.cookies.get(AGE_DENIED_COOKIE_NAME);
  if (deniedCookie && pathname !== '/access-denied') {
    const isLegalPage = [
      '/disclaimer',
      '/terms',
      '/privacy',
      '/content-policy',
      '/contact',
    ].includes(pathname);
    if (!isLegalPage) {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }
  }

  // 3. AGE GATE ENFORCEMENT IN REDIRECT MODE
  const mode = process.env.AGE_GATE_MODE || 'overlay';
  if (mode === 'redirect') {
    const isAllowed = ALLOW_LIST.some((route) => pathname.startsWith(route));
    if (!isAllowed) {
      const ageCookie = request.cookies.get(AGE_COOKIE_NAME);
      const isAdult = await verifyAgeGateToken(ageCookie?.value);

      if (!isAdult) {
        const returnTo = `${pathname}${search}`;
        const redirectUrl = new URL('/age-gate', request.url);
        redirectUrl.searchParams.set('returnTo', returnTo);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
