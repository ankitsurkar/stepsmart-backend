import { cookies } from 'next/headers';
import { jwtVerify, createRemoteJWKSet } from 'jose';

const COGNITO_REGION = 'eu-north-1';
const USER_POOL_ID = 'eu-north-1_jnwEn55p2';
const CLIENT_ID = '4hjlo8ssb3p17dr4bnk19cmgqk';

const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;
const ISSUER = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}`;

// Remote JWK Set with automatic caching and refetching
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export async function POST(request) {
  try {
    const { idToken, refreshToken } = await request.json();

    if (!idToken) {
      return Response.json({ error: 'Missing ID Token' }, { status: 400 });
    }

    // Verify token authenticity before establishing session cookies
    await jwtVerify(idToken, JWKS, {
      issuer: ISSUER,
      audience: CLIENT_ID,
    });

    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };

    // Set Cognito ID Token cookie (valid for 1 hour)
    cookieStore.set('id_token', idToken, {
      ...cookieOptions,
      maxAge: 60 * 60, // 1 hour
    });

    // Set Cognito Refresh Token cookie if present (valid for 30 days)
    if (refreshToken) {
      cookieStore.set('refresh_token', refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Login exchange error:', error);
    return Response.json({ error: 'Invalid or expired token session.' }, { status: 401 });
  }
}
