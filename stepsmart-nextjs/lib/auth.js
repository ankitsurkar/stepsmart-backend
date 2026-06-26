import { jwtVerify, createRemoteJWKSet } from 'jose';
import { cookies } from 'next/headers';

const COGNITO_REGION = 'eu-north-1';
const USER_POOL_ID = 'eu-north-1_jnwEn55p2';
const CLIENT_ID = '4hjlo8ssb3p17dr4bnk19cmgqk';

const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;
const ISSUER = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}`;

// Remote JWK Set with automatic caching and refetching
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

/**
 * Retrieves and validates the server session from the HTTP cookies.
 * Resolves the user identity via the Cognito ID token.
 * 
 * @returns {Promise<{ username: string, email: string, sub: string, groups: string[], isAdmin: boolean } | null>}
 */
export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('id_token')?.value;
    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: CLIENT_ID,
    });

    const groups = payload['cognito:groups'] || [];
    return {
      username: payload['cognito:username'] || payload.sub,
      email: payload.email || '',
      sub: payload.sub,
      groups,
      isAdmin: Array.isArray(groups) ? groups.includes('admins') : groups === 'admins',
    };
  } catch (error) {
    console.error('getServerSession: JWT verification failed:', error);
    return null;
  }
}
