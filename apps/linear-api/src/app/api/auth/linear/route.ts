import { NextRequest, NextResponse } from 'next/server';
import { LinearClient } from '@linear/sdk';
import { cookies } from 'next/headers';

const LINEAR_CLIENT_ID = process.env.NEXT_PUBLIC_LINEAR_CLIENT_ID!;
const LINEAR_CLIENT_SECRET = process.env.LINEAR_CLIENT_SECRET!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linear/callback`;

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    const tokenResponse = await fetch('https://api.linear.app/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: LINEAR_CLIENT_ID,
        client_secret: LINEAR_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      }),
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    // Store tokens in HTTP-only cookies
    const cookieStore = cookies();
    cookieStore.set('linear_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    cookieStore.set('linear_refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Linear auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    url: `https://linear.app/oauth/authorize?client_id=${LINEAR_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=read,write,issues:create,issues:update&state=random_state_string&prompt=consent`
  });
} 