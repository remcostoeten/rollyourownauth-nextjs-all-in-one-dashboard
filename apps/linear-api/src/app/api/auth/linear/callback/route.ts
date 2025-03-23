import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    // Redirect to the dashboard or home page after successful authentication
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Linear callback error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
} 