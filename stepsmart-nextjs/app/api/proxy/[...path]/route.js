import { cookies } from 'next/headers';

const BASE_URL = process.env.API_URL || 'https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod';

/**
 * Wildcard proxy handler that forwards client-side requests to the AWS Lambda API.
 * Automatically injects the Cognito ID token from secure cookies.
 */
async function handleProxy(request, { params }) {
  const pathParams = await params;
  const pathStr = pathParams.path.join('/');
  const { search } = new URL(request.url);

  const cookieStore = await cookies();
  const token = cookieStore.get('id_token')?.value;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

    return Response.json(data, { status: res.status });
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
