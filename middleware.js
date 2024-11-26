import { NextResponse } from 'next/server';

export async function middleware(req) {
  console.log('Middleware invoked for path:', req.nextUrl.pathname);

  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get('access_token')?.value;

  if (pathname === '/login' && accessToken) {
    console.log('Authenticated user trying to access login. Redirecting to home.');
    return NextResponse.redirect(new URL('/admin', req.url)); // Redirect to home or dashboard
  }

  if (pathname.startsWith('/admin')) {
    console.log('Admin route detected');

    const refreshToken = req.cookies.get('refresh_token')?.value;

    console.log('Access token from cookies:', accessToken);
    console.log('Refresh token from cookies:', refreshToken);

    if (!accessToken) {
      console.log('No access token found, redirecting to login');
      return redirectToLogin(req, pathname);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/api/token/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken }),
      });

      const verificationResult = await response.json();
      console.log('Token verification response:', verificationResult);
      console.log('Token verification response status:', response.status);

      if (response.ok) {
        console.log('Token is valid, proceeding to admin');
        const nextResponse = NextResponse.next();

        // Add cache control headers
        addCacheControlHeaders(nextResponse);

        return nextResponse;
      }

      console.log('Token invalid, attempting refresh');
      if (refreshToken) {
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/api/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
          const newTokens = await refreshResponse.json();
          console.log('Refreshed tokens:', newTokens);

          const refreshedResponse = NextResponse.next();
          refreshedResponse.cookies.set('access_token', newTokens.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'lax',
            path: '/',
          });

          // Add cache control headers
          addCacheControlHeaders(refreshedResponse);

          console.log('Token refreshed, proceeding to admin');
          return refreshedResponse;
        } else {
          console.error('Failed to refresh token:', await refreshResponse.text());
        }
      }

      console.log('No valid tokens, redirecting to login');
      return redirectToLogin(req, pathname);
    } catch (error) {
      console.error('Error during token verification:', error);
      return redirectToLogin(req, pathname);
    }
  }

  // For non-admin routes, still add cache control headers
  const response = NextResponse.next();
  addCacheControlHeaders(response);
  return response;
}

function addCacheControlHeaders(response) {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
}

function redirectToLogin(req, pathname) {
  const url = new URL('/login', req.url);
  url.searchParams.set('redirect', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/login'], // Ensure login page is included in middleware matching
};
