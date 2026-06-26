import { NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

const COGNITO_REGION = 'eu-north-1';
const CLIENT_ID = '4hjlo8ssb3p17dr4bnk19cmgqk';
const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout'];

// Helper to check if token is valid and not expired (with 5-minute safety buffer)
function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = decodeJwt(token);
    if (!payload || !payload.exp) return false;
    
    const bufferSeconds = 300; // 5 minutes
    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp > nowSeconds + bufferSeconds;
  } catch (error) {
    return false;
  }
}

// Cognito REFRESH_TOKEN_AUTH initiator
async function refreshCognitoTokens(refreshToken) {
  try {
    const response = await fetch(`https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      },
      body: JSON.stringify({
        ClientId: CLIENT_ID,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('refreshCognitoTokens: Cognito refresh request failed:', errorText);
      return null;
    }

    const data = await response.json();
    return data.AuthenticationResult || null;
  } catch (error) {
    console.error('refreshCognitoTokens: fetch error:', error);
    return null;
  }
}

// Reconstruct Cookie header to propagate fresh tokens upstream
function updateRequestCookies(request, newIdToken, newRefreshToken) {
  const requestHeaders = new Headers(request.headers);
  const originalCookies = request.headers.get('cookie') || '';
  const cookieList = originalCookies.split(';').map(c => c.trim()).filter(Boolean);
  const otherCookies = cookieList.filter(c => !c.startsWith('id_token=') && !c.startsWith('refresh_token='));
  otherCookies.push(`id_token=${newIdToken}`);
  otherCookies.push(`refresh_token=${newRefreshToken}`);
  requestHeaders.set('cookie', otherCookies.join('; '));
  return requestHeaders;
}

// Clear cookies and redirect/reject session
function clearCookiesAndRedirect(request, pathname) {
  let response;
  if (pathname.startsWith('/api/')) {
    response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } else {
    const loginUrl = new URL('/login', request.url);
    response = NextResponse.redirect(loginUrl);
  }
  
  response.cookies.delete('id_token');
  response.cookies.delete('refresh_token');
  return response;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Allow public paths, static assets, and auth API endpoints
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const idToken = request.cookies.get('id_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // Case 1: ID token is valid and not near expiry
  if (isTokenValid(idToken)) {
    return NextResponse.next();
  }

  // Case 2: ID token is missing/expired, try to refresh via refresh_token
  if (refreshToken) {
    const refreshResult = await refreshCognitoTokens(refreshToken);
    if (refreshResult && refreshResult.IdToken) {
      const newIdToken = refreshResult.IdToken;
      const newRefreshToken = refreshResult.RefreshToken || refreshToken;

      const requestHeaders = updateRequestCookies(request, newIdToken, newRefreshToken);
      
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      };

      response.cookies.set('id_token', newIdToken, {
        ...cookieOptions,
        maxAge: 60 * 60, // 1 hour
      });

      if (refreshResult.RefreshToken) {
        response.cookies.set('refresh_token', newRefreshToken, {
          ...cookieOptions,
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });
      }

      console.log('proxy: Cognito tokens successfully auto-refreshed');
      return response;
    }
  }

  // Case 3: Both tokens are invalid/expired/missing
  return clearCookiesAndRedirect(request, pathname);
}

export const config = {
  /*
   * Match all request paths except for:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - public assets (images, etc.)
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images|assets).*)'],
};

