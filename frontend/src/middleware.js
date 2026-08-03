import { NextResponse } from 'next/server';

// Pass all requests through; authentication state is managed in client state via /me
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
