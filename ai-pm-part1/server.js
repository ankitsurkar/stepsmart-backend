import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = Number(process.env.PORT || 3030);

// Host protection: set HOST_KEY env var to a secret PIN in production.
// The host UI sends it via X-Host-Key header on every protected POST.
// Leave unset to disable protection (local dev only — never leave unset in prod).
const HOST_KEY = process.env.HOST_KEY || '';

function requireHostKey(req, res) {
  if (!HOST_KEY) return true; // no key configured — allow (dev mode)
  const provided = req.headers['x-host-key'] || '';
  if (provided === HOST_KEY) return true;
  sendJson(res, 403, { error: 'Forbidden: invalid host key' });
  return false;
}

// CORS origin for the proxied landing site (set ALLOWED_ORIGIN env var in prod)
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// In-memory live session state (privacy-first: stores ONLY host stage + anonymous Round 1 slice tallies)
const sessionState = {
  stageIndex: 0,
  stageId: 'opening_1',
  updatedAt: Date.now(),
  // Optional anonymous Round 1 room tally (slice category counts only — never stores setup answers or text)
  round1Tally: {
    Stay: 0,
    'Technical PM': 0,
    'Data PM': 0,
    'Product Manager': 0,
    'Growth PM': 0,
    'AI PM': 0,
  },
};

const clients = new Set(); // { res, role: 'host' | 'phone' }

function getConnectedCounts() {
  let phones = 0;
  let hosts = 0;
  for (const c of clients) {
    if (c.role === 'phone') phones++;
    if (c.role === 'host') hosts++;
  }
  return { phones, hosts };
}

function buildPayload() {
  const counts = getConnectedCounts();
  return {
    stageIndex: sessionState.stageIndex,
    stageId: sessionState.stageId,
    updatedAt: sessionState.updatedAt,
    round1Tally: sessionState.round1Tally,
    connectedPhones: counts.phones,
    connectedHosts: counts.hosts,
  };
}

function broadcast(eventName, data) {
  const msg = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    try {
      client.res.write(msg);
    } catch {
      clients.delete(client);
    }
  }
}

function getLocalNetworkUrls(port) {
  const nets = os.networkInterfaces();
  const urls = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        urls.push(`http://${net.address}:${port}`);
      }
    }
  }
  return urls;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 32_768) {
        req.destroy();
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function addCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Host-Key');
}

function sendJson(res, status, data) {
  addCorsHeaders(res);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(data));
}

function serveFile(res, filePath) {
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.readFile(resolved, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(resolved);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // Handle CORS pre-flight from the main domain
  if (req.method === 'OPTIONS') {
    addCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // API: Server info (for showing LAN IP on Host/Launcher)
  if (req.method === 'GET' && pathname === '/api/info') {
    sendJson(res, 200, {
      port: PORT,
      lanUrls: getLocalNetworkUrls(PORT),
      state: buildPayload(),
    });
    return;
  }

  // API: Current state snapshot
  if (req.method === 'GET' && pathname === '/api/state') {
    sendJson(res, 200, buildPayload());
    return;
  }

  // API: SSE stream for real-time sync
  if (req.method === 'GET' && pathname === '/api/events') {
    const role = url.searchParams.get('role') === 'host' ? 'host' : 'phone';
    addCorsHeaders(res);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      // Prevent Nginx / Cloudflare / Railway proxy from buffering SSE frames
      'X-Accel-Buffering': 'no',
    });
    res.flushHeaders?.();

    const client = { res, role };
    clients.add(client);

    // Immediately send current state to the newly connected client
    res.write(`event: state\ndata: ${JSON.stringify(buildPayload())}\n\n`);
    // Notify everyone (especially Host) of updated phone count
    broadcast('presence', buildPayload());

    const heartbeat = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch {
        clearInterval(heartbeat);
        clients.delete(client);
      }
    }, 15_000);

    req.on('close', () => {
      clearInterval(heartbeat);
      clients.delete(client);
      broadcast('presence', buildPayload());
    });
    return;
  }

  // API: Host updates current stage  [PROTECTED — requires X-Host-Key header]
  if (req.method === 'POST' && pathname === '/api/host/stage') {
    if (!requireHostKey(req, res)) return;
    try {
      const body = await readJsonBody(req);
      if (typeof body.stageIndex === 'number' && typeof body.stageId === 'string') {
        sessionState.stageIndex = body.stageIndex;
        sessionState.stageId = body.stageId;
        sessionState.updatedAt = Date.now();
        if (body.resetTally) {
          for (const k of Object.keys(sessionState.round1Tally)) {
            sessionState.round1Tally[k] = 0;
          }
        }
        const payload = buildPayload();
        broadcast('state', payload);
        sendJson(res, 200, payload);
        return;
      }
      sendJson(res, 400, { error: 'Invalid stage payload' });
    } catch {
      sendJson(res, 400, { error: 'Bad JSON' });
    }
    return;
  }

  // API: Host resets anonymous Round 1 tally  [PROTECTED — requires X-Host-Key header]
  if (req.method === 'POST' && pathname === '/api/host/reset-tally') {
    if (!requireHostKey(req, res)) return;
    for (const k of Object.keys(sessionState.round1Tally)) {
      sessionState.round1Tally[k] = 0;
    }
    const payload = buildPayload();
    broadcast('state', payload);
    sendJson(res, 200, payload);
    return;
  }

  // API: Anonymous Round 1 spin tally (slice bucket only — never receives setup answers or text)
  if (req.method === 'POST' && pathname === '/api/phone/tally') {
    try {
      const body = await readJsonBody(req);
      const bucket = typeof body.bucket === 'string' ? body.bucket : '';
      if (Object.prototype.hasOwnProperty.call(sessionState.round1Tally, bucket)) {
        sessionState.round1Tally[bucket] += 1;
        const payload = buildPayload();
        broadcast('tally', payload);
        sendJson(res, 200, { ok: true });
        return;
      }
      sendJson(res, 400, { error: 'Invalid bucket' });
    } catch {
      sendJson(res, 400, { error: 'Bad JSON' });
    }
    return;
  }

  // Clean routes
  if (pathname === '/' || pathname === '/index.html') {
    serveFile(res, path.join(PUBLIC_DIR, 'index.html'));
    return;
  }
  if (pathname === '/host') {
    serveFile(res, path.join(PUBLIC_DIR, 'host.html'));
    return;
  }
  if (pathname === '/phone') {
    serveFile(res, path.join(PUBLIC_DIR, 'phone.html'));
    return;
  }
  if (pathname === '/preview') {
    serveFile(res, path.join(PUBLIC_DIR, 'preview.html'));
    return;
  }
  if (pathname === '/replay') {
    serveFile(res, path.join(PUBLIC_DIR, 'replay.html'));
    return;
  }

  // Static files under public/
  serveFile(res, path.join(PUBLIC_DIR, pathname));
});

server.listen(PORT, '0.0.0.0', () => {
  const lanUrls = getLocalNetworkUrls(PORT);
  console.log(`\nThe AI PM, Part 1: “The Making” is running locally:`);
  console.log(`  Launcher:     http://localhost:${PORT}/`);
  console.log(`  Side-by-Side: http://localhost:${PORT}/preview`);
  console.log(`  Host Screen:  http://localhost:${PORT}/host`);
  console.log(`  Phone (Live): http://localhost:${PORT}/phone`);
  console.log(`  Replay Mode:  http://localhost:${PORT}/replay`);
  if (lanUrls.length > 0) {
    console.log(`\nOn the same Wi-Fi (real phones):`);
    for (const u of lanUrls) {
      console.log(`  Phone: ${u}/phone`);
    }
  }
  console.log('');
});
