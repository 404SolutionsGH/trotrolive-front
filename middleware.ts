import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Optional: Prevent access to /auth/login if access token exists
  const accessToken = req.cookies.get('access_token')?.value;
  if (pathname === '/auth/login' && accessToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const response = NextResponse.next();
  addCacheControlHeaders(response);
  return response;
}

function addCacheControlHeaders(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
}

// Match all routes, or customize as needed
export const config = {
  matcher: ['/:path*'],
};



// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const accessToken = req.cookies.get('access_token')?.value;

//   // Redirect any authenticated user trying to access login page to homepage
//   if (pathname === '/auth/login' && accessToken) {
//     return NextResponse.redirect(new URL('/', req.url)); // redirect to home
//   }

//   // Only perform token verification for admin routes
//   if (pathname.startsWith('/admin')) {
//     const refreshToken = req.cookies.get('refresh_token')?.value;

//     if (!accessToken) {
//       return redirectToLogin(req, pathname);
//     }

//     try {
//       const verificationPromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/api/token/verify/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token: accessToken }),
//       });

//       const response = NextResponse.next();
//       addCacheControlHeaders(response);

//       verificationPromise.then(async (verifyResponse) => {
//         if (!verifyResponse.ok) {
//           if (refreshToken) {
//             const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/api/token/refresh/`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ refresh: refreshToken }),
//             });

//             if (refreshResponse.ok) {
//               const newTokens = await refreshResponse.json();
//               response.cookies.set('access_token', newTokens.access, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV !== 'development',
//                 sameSite: 'lax',
//                 path: '/',
//               });
//             } else {
//               return redirectToLogin(req, pathname);
//             }
//           }
//         }
//       }).catch(console.error);

//       return response;
//     } catch (error) {
//       console.error('Error during token verification:', error);
//       return redirectToLogin(req, pathname);
//     }
//   }

//   const response = NextResponse.next();
//   addCacheControlHeaders(response);
//   return response;
// }

// function addCacheControlHeaders(response: NextResponse) {
//   response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//   response.headers.set('Pragma', 'no-cache');
//   response.headers.set('Expires', '0');
// }

// function redirectToLogin(req: NextRequest, pathname: string) {
//   const url = new URL('/auth/login', req.url);
//   url.searchParams.set('redirect', pathname);
//   return NextResponse.redirect(url);
// }

// export const config = {
//   matcher: ['/admin/:path*', '/admin', '/auth/login'],
// };



// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export async function middleware(req: NextRequest) {
//   console.log('Middleware invoked for path:', req.nextUrl.pathname);

//   const { pathname } = req.nextUrl;

//   const accessToken = req.cookies.get('access_token')?.value;

//   // If trying to access login page while authenticated, redirect to admin
//   if (pathname === '/auth/login' && accessToken) {
//     return NextResponse.redirect(new URL('/dashboard', req.url));
//   }

//   // Only perform token verification for admin routes
//   if (pathname.startsWith('/admin')) {
//     const refreshToken = req.cookies.get('refresh_token')?.value;

//     // If no access token, redirect to login
//     if (!accessToken) {
//       return redirectToLogin(req, pathname);
//     }

//     try {
//       // Verify token without blocking the current page
//       const verificationPromise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/api/token/verify/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token: accessToken }),
//       });

//       // Create a response that allows continuing to the current page
//       const response = NextResponse.next();
//       addCacheControlHeaders(response);

//       // Run token verification in the background
//       verificationPromise.then(async (verifyResponse) => {
//         if (!verifyResponse.ok) {
//           // If token is invalid, try to refresh
//           if (refreshToken) {
//             const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/api/token/refresh/`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ refresh: refreshToken }),
//             });

//             if (refreshResponse.ok) {
//               const newTokens = await refreshResponse.json();
//               // Update cookies with new access token (this won't affect the current request)
//               response.cookies.set('access_token', newTokens.access, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV !== 'development',
//                 sameSite: 'lax',
//                 path: '/',
//               });
//             } else {
//               // Redirect to login if refresh fails
//               return redirectToLogin(req, pathname);
//             }
//           }
//         }
//       }).catch(console.error);

//       return response;
//     } catch (error) {
//       console.error('Error during token verification:', error);
//       return redirectToLogin(req, pathname);
//     }
//   }

//   // For non-admin routes, add cache control headers
//   const response = NextResponse.next();
//   addCacheControlHeaders(response);
//   return response;
// }

// function addCacheControlHeaders(response: NextResponse) {
//   response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//   response.headers.set('Pragma', 'no-cache');
//   response.headers.set('Expires', '0');
// }

// function redirectToLogin(req: NextRequest, pathname: string) {
//   const url = new URL('/auth/login', req.url);
//   url.searchParams.set('redirect', pathname);
//   return NextResponse.redirect(url);
// }

// export const config = {
//   matcher: ['/admin/:path*', '/admin', '/auth/login'],
// };