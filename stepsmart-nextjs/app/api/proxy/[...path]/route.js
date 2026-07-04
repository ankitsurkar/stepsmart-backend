import { cookies } from 'next/headers';

const BASE_URL = process.env.API_URL || 'https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod';

const COGNITO_REGION   = 'eu-north-1';
const COGNITO_CLIENT_ID = '4hjlo8ssb3p17dr4bnk19cmgqk';

/**
 * Returns true if the JWT is present and has > 5 minutes of life remaining.
 */
function isTokenValid(token) {
  if (!token) return false;
  try {
    const [, payload] = token.split('.');
    if (!payload) return false;
    const { exp } = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    if (!exp) return false;
    return exp > Math.floor(Date.now() / 1000) + 300; // 5-min buffer
  } catch {
    return false;
  }
}

/**
 * Calls Cognito's REFRESH_TOKEN_AUTH flow to get a new ID token.
 * Returns the new IdToken string, or null on failure.
 */
async function refreshIdToken(refreshToken) {
  try {
    const res = await fetch(`https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      },
      body: JSON.stringify({
        ClientId: COGNITO_CLIENT_ID,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: { REFRESH_TOKEN: refreshToken },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.AuthenticationResult?.IdToken || null;
  } catch {
    return null;
  }
}

/**
 * Wildcard proxy handler that forwards client-side requests to the AWS Lambda API.
 * Automatically injects the Cognito ID token from secure cookies.
 * If the stored ID token is expired but a refresh token is present, it refreshes
 * the session inline so dashboard loads after a hard refresh always succeed.
 */
async function handleProxy(request, { params }) {
  const pathParams = await params;
  const pathStr = pathParams.path.join('/');
  const { search } = new URL(request.url);

  const cookieStore = await cookies();
  let idToken = cookieStore.get('id_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  // If ID token is expired/missing but we have a refresh token, get a fresh one.
  // This covers the case where the middleware refreshed the cookie in the response
  // but this server-action hasn't received the updated cookie yet.
  let freshToken = null;
  if (!isTokenValid(idToken) && refreshToken) {
    freshToken = await refreshIdToken(refreshToken);
    if (freshToken) {
      idToken = freshToken;
    }
  }

  const headers = {
    ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
  };

  let body;
  const method = request.method;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    body = await request.text();
    headers['Content-Type'] = request.headers.get('content-type') || 'application/json';
  }

  try {
    const res = await fetch(`${BASE_URL}/${pathStr}${search}`, {
      method,
      headers,
      body,
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (_) {
      data = text;
    }

    const response = Response.json(data, { status: res.status });

    // If we obtained a fresh token, persist it to the browser so subsequent
    // requests don't need to refresh again.
    if (freshToken) {
      response.headers.append(
        'Set-Cookie',
        `id_token=${freshToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600${
          process.env.NODE_ENV === 'production' ? '; Secure' : ''
        }`
      );
    }

    return response;
  } catch (error) {
    console.error(`Proxy error for ${method} /${pathStr}:`, error);
    return Response.json({ error: 'Failed to proxy request to backend.' }, { status: 500 });
  }
}

export {
  handleProxy as GET,
  handleProxy as POST,
  handleProxy as PUT,
  handleProxy as PATCH,
  handleProxy as DELETE,
};
