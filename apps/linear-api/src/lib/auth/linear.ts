'use server'

import { LinearClient } from "@linear/sdk";


const LINEAR_CLIENT_ID = process.env.NEXT_PUBLIC_LINEAR_CLIENT_ID!;
const LINEAR_CLIENT_SECRET = process.env.LINEAR_CLIENT_SECRET!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linear/callback`;

export const LINEAR_AUTH_URL = `https://linear.app/oauth/authorize?client_id=${LINEAR_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=read,write,issues:create,issues:update&state=random_state_string&prompt=consent`;

export async function getLinearAccessToken(code: string): Promise<{ access_token: string; refresh_token: string }> {
  const response = await fetch('https://api.linear.app/oauth/token', {
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

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  return response.json();
}

export async function refreshLinearToken(refresh_token: string): Promise<{ access_token: string; refresh_token: string }> {
  const response = await fetch('https://api.linear.app/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: LINEAR_CLIENT_ID,
      client_secret: LINEAR_CLIENT_SECRET,
      refresh_token,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

// Move SDK-dependent functions to a separate file that won't be used in middleware
export async function validateToken(access_token: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        query: `
          query ValidateToken {
            viewer {
              id
            }
          }
        `,
      }),
    });

    const data = await response.json();
    return !data.errors && data.data?.viewer?.id;
  } catch {
    return false;
  }
}

export async function getLinearUserInfo(access_token: string) {
  const client = new LinearClient({ accessToken: access_token });
  const viewer = await client.viewer;
  const organization = await viewer.organization;
  
  return {
    id: viewer.id,
    name: viewer.name,
    email: viewer.email,
    avatarUrl: viewer.avatarUrl,
    organization: organization ? {
      id: organization.id,
      name: organization.name,
      urlKey: organization.urlKey,
    } : null,
  };
} 