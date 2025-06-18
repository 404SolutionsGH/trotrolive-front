import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('access_token')?.value;

  // Only block /auth/login if the token is present AND valid
  if (pathname === '/auth/login' && accessToken) {
    // Verify token with backend
    const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/api/token/verify/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: accessToken }),
    });

    if (verifyResponse.ok) {
      // Token is valid, redirect to home
      return NextResponse.redirect(new URL('/', req.url));
    } else {
      // Token is invalid, clear the cookie
      const response = NextResponse.next();
      response.cookies.set('access_token', '', { maxAge: 0, path: '/' });
      response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export const config = {
  matcher: ['/:path*'],
};