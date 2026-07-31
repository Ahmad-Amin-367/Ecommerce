import { NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/cart', '/checkout', '/orders', '/profile'];
// Routes that require ADMIN role
const ADMIN_ROUTES = ['/admin'];
// Routes that redirect authenticated users away
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Read user info from cookie set by the app (we store a flag in a readable cookie)
  // Note: actual JWT validation happens on the server (API). This is UI-level protection.
  const isAuthCookie = request.cookies.get('auth-status')?.value === 'authenticated';
  const userRole = request.cookies.get('user-role')?.value;

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protect customer routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
