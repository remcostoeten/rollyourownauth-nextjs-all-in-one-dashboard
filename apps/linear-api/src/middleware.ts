import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { refreshLinearToken } from './lib/auth/linear';

// Paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/api/auth/linear/callback',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for Linear access token
  const linearAccessToken = request.cookies.get('linear_access_token');
  const linearRefreshToken = request.cookies.get('linear_refresh_token');

  if (!linearAccessToken) {
    if (linearRefreshToken) {
      try {
        // Try to refresh the token
        const { access_token, refresh_token } = await refreshLinearToken(linearRefreshToken.value);
        
        // Create response with new tokens
        const response = NextResponse.redirect(request.url);
        
        response.cookies.set('linear_access_token', access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        response.cookies.set('linear_refresh_token', refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return response;
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    }

    // Redirect to login if no valid tokens
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/linear/callback (OAuth callback)
     * 2. /_next (Next.js internals)
     * 3. /fonts (static resources)
     * 4. /favicon.ico (favicon file)
     */
    '/((?!api/auth/linear/callback|_next|fonts|favicon.ico).*)',
  ],
}; 