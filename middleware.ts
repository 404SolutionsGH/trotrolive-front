import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const accessToken = req.cookies.get('access_token')?.value;
  const isAuthRoute = pathname.startsWith('/auth');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isPublicRoute = pathname === '/' || pathname.startsWith('/about') || pathname.startsWith('/contact');
  
  // Check if we're in iframe display mode
  let isIframeMode = false;
  const stateParam = searchParams.get('state');
  
  if (stateParam) {
    try {
      const decodedState = JSON.parse(atob(stateParam));
      isIframeMode = decodedState.displayMode === 'iframe';
    } catch (e) {
      console.error('Failed to parse state parameter:', e);
    }
  }
  
  // Skip middleware for public routes and static assets
  if (isPublicRoute || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Skip certain middleware checks for iframe mode authentication
  if (isAuthRoute && isIframeMode) {
    console.log('Middleware: Detected iframe authentication mode, bypassing redirects');
    return NextResponse.next();
  }

  // Handle authentication routes
  if (isAuthRoute && accessToken) {
    try {
      // Verify token with backend
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/api/token/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken }),
      });

      if (verifyResponse.ok) {
        // Token is valid, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }

    // Token is invalid or verification failed, clear cookies
    const response = NextResponse.next();
    response.cookies.set('access_token', '', { maxAge: 0, path: '/' });
    response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' });
    return response;
  }

  // Handle dashboard routes
  if (isDashboardRoute) {
    if (!accessToken) {
      // No token, redirect to login
      const url = new URL('/auth/login', req.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    try {
      // Verify token with backend
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/api/token/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken }),
      });

      if (!verifyResponse.ok) {
        // Token is invalid, redirect to login
        const url = new URL('/auth/login', req.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      // On error, redirect to login
      const url = new URL('/auth/login', req.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Add cache control headers for better performance
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
