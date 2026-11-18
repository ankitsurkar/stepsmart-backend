# Deployment Handover: The AI PM, Part 1 — “The Making”

Use this handover to deploy the built live two-screen experience (`ai-pm-part1/`) onto the website.

---

## 1. Source Location & Stack
- **Directory:** `/Users/sanket_74/Library/CloudStorage/GoogleDrive-sanket.stepsmart@gmail.com/My Drive/PM - X Raw/Ramayana - The experience/ai-pm-part1`
- **Dependencies:** **Zero external npm packages.** Pure Node.js (`v18+`, tested on `v24.12.0`) + Vanilla HTML5 / CSS3 / ES Modules / HTML5 Canvas.
- **No build step required.**

### File Structure
```text
ai-pm-part1/
├── server.js               # Native Node HTTP + Server-Sent Events (SSE) live sync server
└── public/
    ├── index.html          # Session launcher / hub
    ├── host.html           # HOST SCREEN (shared screen, >= 28px text, keyboard nav, stage jump)
    ├── phone.html          # LIVE PHONE (follows host via SSE, no Next/Back/Skip, private)
    ├── preview.html        # Side-by-side Host + Phone preview for dry runs (optional in prod)
    ├── replay.html         # REPLAY EDITION (100% static self-paced version, zero backend needed)
    ├── styles.css          # Light & dark mode design system (color-scheme + light-dark() + fallbacks)
    └── js/
        ├── data.js         # All 61 stages, verbatim copy, resume lines, Spot It, Your Map, signup URL
        ├── scoring.js      # Personal wheel scoring, Round 2–6 calculations & statement generators
        ├── wheel.js        # High-DPI Canvas wheel renderer + smooth morphing (zero audio)
        ├── theme.js        # Light/dark theme persistence & cross-tab sync
        ├── host.js         # Host Screen controller + POST /api/host/stage broadcaster
        ├── phone.js        # Live Phone controller + SSE client + 10s disconnect timeout + Retry
        └── replay.js       # Self-paced Replay controller
```

---

## 2. Routes to Expose on the Website
| Route | Audience | Notes |
|---|---|---|
| `/host` | Sanket (shared screen) | **Protect in production** with a host secret/PIN so participants cannot advance stages. |
| `/phone` | Live session participants | Public join URL (QR code / Zoom chat link). Syncs to host automatically. |
| `/replay` | People who missed live | Separate self-paced edition. 100% static — works with zero backend. |
| `/preview` | Internal dry-run testing | Side-by-side Host + Phone + disconnect tester. Keep internal or behind host secret. |
| `/` | Internal launcher | Optional; redirect or hide behind host secret in production. |

> **Subpath vs. Subdomain:** Current HTML/JS use root-relative paths (`/styles.css`, `/js/...`, `/api/...`).
> - **Cleanest option:** Mount on a dedicated subdomain (e.g., `live.yourdomain.com/phone`, `live.yourdomain.com/host`, `live.yourdomain.com/replay`) — works with zero path edits.
> - **If mounting under a subpath** (e.g., `yourdomain.com/ai-pm/...`): prefix asset links in the HTML files and `/api/...` fetches in `host.js` and `phone.js` with a `BASE_PATH` constant.

---

## 3. Live Sync API Contract (`server.js`)
The entire backend is 5 tiny endpoints:

1. `GET /api/events?role=host|phone` — Server-Sent Events (SSE) stream.
   - Sends `event: state` immediately on connect with `{ stageIndex, stageId, updatedAt, round1Tally, connectedPhones, connectedHosts }`.
   - Broadcasts `event: state` on host stage change, `event: presence` on phone connect/disconnect, and `event: tally` on anonymous Round 1 spin.
   - Sends `: ping\n\n` heartbeat every 15s.
2. `GET /api/state` — Snapshot JSON of current state.
3. `POST /api/host/stage` — Body: `{ stageIndex: number, stageId: string, resetTally?: boolean }`. Broadcasts new stage to all phones.
4. `POST /api/host/reset-tally` — Clears anonymous Round 1 tally.
5. `POST /api/phone/tally` — Body: `{ bucket: "Stay" | "Technical PM" | "Data PM" | "Product Manager" | "Growth PM" | "AI PM" }`. Increments anonymous room counter only.

---

## 4. Production Deployment Guide (Choose Based on Website Stack)

### Option A: Persistent Node Host (Railway, Render, Fly.io, VPS, Cloud Run single-instance) — *Fastest*
1. Copy `ai-pm-part1/` into the deployment repo or run `node server.js` (`PORT` env var is already supported).
2. **Add Host Protection:** Require an env var `HOST_KEY` on `POST /api/host/stage` and `POST /api/host/reset-tally` (e.g. pass `?key=...` on `/host` and send it in `X-Host-Key` header from `host.js`).
3. **Proxy / Reverse Proxy SSE Header:** Add `'X-Accel-Buffering': 'no'` to `/api/events` headers in `server.js` so Nginx/Cloudflare does not buffer SSE frames.
4. Keep **1 active instance** during the 60-minute live session (a single Node process easily handles 500–1,000+ concurrent SSE phones).

### Option B: Existing Static / Serverless Website (Next.js on Vercel, Netlify, Firebase Hosting)
- `/replay` and all static assets (`public/*`) deploy directly as static files.
- Because serverless functions cannot hold long-lived shared SSE state in memory, replace the 3 sync calls in `host.js` and `phone.js` with your website’s realtime store (e.g., **Firestore `onSnapshot` / Firebase Realtime Database**, **Supabase Realtime**, **PartyKit**, or **Upstash Redis**):
  - Store a single document/key: `sessions/part1 = { stageIndex, stageId, updatedAt, round1Tally }`.
  - `host.js` writes `stageIndex` / `stageId` (protected by host auth/rule).
  - `phone.js` subscribes to `sessions/part1`, keeps its exact 10-second offline timeout (`“Reconnecting. Look at the main screen.”` → `“Waiting for your host”` + Retry), and jumps directly to `stageIndex`.

---

## 5. Pre-Launch Content Updates (`public/js/data.js`)
Before going live, check these two constants in `public/js/data.js`:
1. **`SANKET_BEFORE_LINES`** (lines 139–145): Replace with Sanket’s exact 5 verbatim “before” resume lines from the handover document if any phrasing differs.
2. **`PROGRAMME_SIGNUP_URL`** (line 8): Paste the final curriculum/registration URL. Leaving it empty shows *“Your hosts will share the curriculum and the sign-up link now.”*; setting a URL automatically activates the **“See the curriculum and register interest”** button on E4.

---

## 6. Non-Negotiable Product & Privacy Guardrails (Do Not Break)
- **Privacy:** Setup answers (`aipm_part1_phone_profile_v1`) and Round 2 proof chips / typed resume line (`aipm_part1_phone_extras_v1`) stay strictly in browser `localStorage` on the participant’s phone. Never transmit or log them.
- **Live phone control:** Never add Next, Back, or Skip buttons to `/phone`, and never fall back to self-paced play on disconnect.
- **No sound:** Keep audio completely absent.
- **Wording rules:** Keep curly quotes/apostrophes, never name any employer, never add AI jargon before its reveal panel, never say “become an AI PM”, “learn AI in an hour”, or “masterclass”, and keep “on our wheel” / “illustrative sample, not real data” honesty labels intact.
