# CourseLab — Deep Technical Architecture Guide
# For someone who knows AWS and wants to understand every moving part

---

## TABLE OF CONTENTS

1. The Big Picture — How all pieces connect
2. How Vercel + GitHub deployment works
3. React Router and the /learn route
4. Authentication Flow — Cognito end to end
5. The Video Player — How YouTube, the overlay, and heartbeats work
6. Progress Tracking — The segment coverage system
7. Data Flow: Heartbeat → Lambda → DynamoDB
8. Quiz System — Grading, security, retry logic
9. DynamoDB Design — Tables, keys, data shapes
10. Lambda Functions — What each one does line by line
11. API Gateway — How HTTP requests reach Lambda
12. Admin System — Week release, student management
13. The complete request lifecycle (one full example)
14. Deployment steps with explanation of each

---

## 1. THE BIG PICTURE

```
BROWSER (stepsmart.net/learn)
│
│  React App (JavaScript running in the user's browser)
│  ├── Renders UI components
│  ├── Manages local state (what video is playing, answers selected)
│  ├── Sends API calls to AWS
│  └── Reads JWT token from Cognito to authenticate
│
│  Two outbound connections:
│  A) YouTube IFrame API (to embed and control video)
│  B) Your AWS API Gateway (for all data operations)
│
▼
AWS REGION: us-east-1
│
├── COGNITO USER POOL
│   └── Manages who can log in, issues JWT tokens
│
├── API GATEWAY
│   └── Single HTTPS endpoint — routes requests to Lambda functions
│
├── LAMBDA FUNCTIONS (6 of them)
│   ├── heartbeat.js      — records video watching progress
│   ├── getProgress.js    — returns how far a student has gotten
│   ├── submitQuiz.js     — grades quiz answers
│   ├── getCourseWeeks.js — returns course content for a student
│   ├── getMyCourses.js   — returns list of courses
│   └── adminHandler.js   — everything admins can do
│
└── DYNAMODB (2 tables)
    ├── lms-courses  — course structure, week data, quiz questions + answers
    └── lms-progress — per-student video coverage, quiz results
```

**Why this split?**
- Frontend on Vercel = zero config, auto-deploy on git push, free SSL, global CDN
- Backend on AWS = serverless, scales automatically, free tier covers you for years at 20 students
- The two never need to know about each other's infrastructure — they communicate only via HTTPS

---

## 2. HOW VERCEL + GITHUB DEPLOYMENT WORKS

### The mental model

Vercel watches your GitHub repository. Every time you push code to the `main` branch, Vercel automatically:
1. Pulls the latest code
2. Runs `npm run build` (compiles your React app into static HTML/CSS/JS files)
3. Deploys those files to its global CDN (100+ edge locations worldwide)
4. Makes them available at your domain within ~30 seconds

You never manually copy files anywhere. The CI/CD pipeline is: `git push` → done.

### What "building" React means

When you write React code, you write JSX like `<VideoPlayer youtubeUrl="..." />`. Browsers cannot run JSX — they only understand plain JavaScript. The build step (via webpack inside `react-scripts`) does this:

```
Your code (JSX, ES6+, imports)
        │
        ▼  webpack + babel (run by npm run build)
        │
Static files in build/ folder:
├── index.html          ← single HTML file, just loads JS
├── static/js/main.abc123.js   ← ALL your React code, minified
└── static/css/main.abc123.css ← ALL your CSS
```

The hash (abc123) in filenames is a content hash — it changes whenever the file content changes. This is how browser caching works: if the file hasn't changed, the browser uses its cached copy; if it has, the new hash forces a fresh download.

### Why the /learn prefix needs special handling

Your existing stepsmart.net site has routes like `/`, `/about`, `/pricing`. Your LMS lives at `/learn`. The problem: React Router manages routes in JavaScript (client-side), but Vercel serves files from a filesystem (server-side).

When a user directly navigates to `stepsmart.net/learn/dashboard`, Vercel receives a request for `/learn/dashboard`. It looks for a file at that path — there is no file. It would return a 404 unless you tell it otherwise.

The `vercel.json` file solves this:

```json
{
  "rewrites": [
    {
      "source": "/learn/(.*)",
      "destination": "/learn/index.html"
    }
  ]
}
```

**What this says:** Any request to `/learn/anything` should serve the `/learn/index.html` file. The browser receives `index.html`, loads the React app, and React Router reads the URL (`/learn/dashboard`) and renders the right component. The server never needs to know about React's internal routes.

### Two repos, one domain — how?

Your main site repo deploys to `stepsmart.net`.
Your LMS repo deploys to... where?

Two approaches:

**Option A: Vercel Subdirectory (recommended)**
Add the LMS repo as a second Vercel project. In its settings, set the deployment path to `/learn`. Vercel lets you have multiple projects under one domain — you just configure each project to own a different path prefix.

In Vercel dashboard:
- Main site project → handles `stepsmart.net/` and all existing routes
- LMS project → handles `stepsmart.net/learn/*`

**Option B: Git Submodule / Monorepo**
Less ideal for your case since you want separate repos.

**Linking to the LMS from your main site** is then just a normal link:
```jsx
// In your main site's navigation
<a href="/learn">Course Portal →</a>
```
No cross-repo magic needed. It's just a URL.

---

## 3. REACT ROUTER AND THE /learn ROUTE

### What basename does

In `App.js`:
```jsx
<BrowserRouter basename="/learn">
```

This single prop tells React Router: "strip `/learn` from every URL before processing it."

**Without basename:**
- URL: `stepsmart.net/learn/dashboard`
- React Router sees: `/learn/dashboard`
- No route matches → blank page

**With basename="/learn":**
- URL: `stepsmart.net/learn/dashboard`
- React Router sees: `/dashboard` ← matches your route definition
- Correct component renders

And when React Router generates links internally (e.g., `<Navigate to="/dashboard">`), it automatically prepends `/learn` to produce the correct real URL.

### package.json "homepage" field

```json
"homepage": "/learn"
```

This tells Create React App's build tool (webpack) to prefix all asset paths with `/learn`. Without this, the built `index.html` would reference assets like `/static/js/main.js`. With it, they become `/learn/static/js/main.js` — which is where Vercel actually serves them from.

---

## 4. AUTHENTICATION FLOW — COGNITO END TO END

### What Cognito is

AWS Cognito is an identity provider. It stores usernames, hashed passwords, group memberships, and handles the cryptographic challenge-response of authentication. You never store passwords yourself.

### The JWT token

When a user logs in, Cognito returns three tokens:
- **ID Token** — contains the user's identity claims (email, name, groups). This is what you send to your API.
- **Access Token** — for calling Cognito APIs directly
- **Refresh Token** — used to get new ID/Access tokens when they expire (after 1 hour)

The ID Token is a **JWT (JSON Web Token)**. Structure:
```
header.payload.signature
```

The payload (middle part, base64 decoded) looks like:
```json
{
  "sub": "abc-123-uuid",
  "email": "student@example.com",
  "cognito:groups": ["admins"],
  "exp": 1735000000
}
```

This token is **cryptographically signed by Cognito** using its private key. API Gateway verifies the signature using Cognito's public key. This verification happens automatically — you never write code to verify signatures yourself.

### The flow step by step

```
1. User enters email + password in LoginPage.js
   └── calls: signIn({ username: email, password })
              (from aws-amplify/auth library)

2. Amplify sends a Secure Remote Password (SRP) challenge to Cognito
   └── SRP means the password is never sent in plaintext, not even encrypted
       The browser proves it knows the password without revealing it

3. Cognito validates, returns JWT tokens

4. Amplify stores tokens in memory (not localStorage — more secure)

5. Every API call in api.js does this:
   const session = await fetchAuthSession();
   const token = session.tokens?.idToken?.toString();
   config.headers.Authorization = `Bearer ${token}`;

6. API Gateway receives the request with the Authorization header
   └── Verifies the JWT signature against Cognito's public JWKS endpoint
   └── If valid: passes request to Lambda with decoded claims attached
   └── If invalid/expired: returns 401 immediately, Lambda never runs

7. Lambda reads the user's identity from the verified claims:
   const userId = event.requestContext.authorizer.claims.sub;
   const groups = event.requestContext.authorizer.claims['cognito:groups'];
```

### First login — forced password reset

When you create a student in Cognito via the admin panel, Cognito sets their status to `FORCE_CHANGE_PASSWORD`. Their temp password only works once. The login flow detects this:

```js
// In AuthContext.js
const result = await signIn({ username: email, password });
if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
  return { requiresNewPassword: true };
}
```

LoginPage.js then switches to the `newPassword` mode and calls:
```js
await confirmSignIn({ challengeResponse: newPassword });
```

Cognito accepts the new password, completes the sign-in, and the student is now fully authenticated.

### Admin group enforcement — two layers

**Layer 1 — Frontend (UI only, not security):**
```js
// In ProtectedRoute.js
export function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
```
This just hides the admin UI from non-admins. A determined user could bypass this in DevTools.

**Layer 2 — Backend (actual security):**
```js
// In adminHandler.js — runs in Lambda, cannot be bypassed
const groups = event.requestContext?.authorizer?.claims?.['cognito:groups'];
if (!groups.includes('admins')) {
  return { statusCode: 403, body: JSON.stringify({ message: 'Forbidden' }) };
}
```
Even if someone bypasses the React UI, their JWT doesn't have the `admins` group claim. The Lambda rejects them. The JWT cannot be forged because it's signed by Cognito.

---

## 5. THE VIDEO PLAYER — HOW IT ALL WORKS

### Why not just use a `<video>` tag?

HTML5 `<video>` gives you full control — you can disable seeking in the API directly. But then you'd need to host the video files yourself (expensive bandwidth) or encode them (complex). YouTube gives you free global video hosting, adaptive bitrate streaming, and transcoding for every resolution. The tradeoff: you're embedding via their IFrame API, so you work within their API surface.

### YouTube IFrame API — the initialization sequence

```js
// Step 1: Script injection (runs once on mount)
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
document.head.appendChild(tag);
```

This dynamically loads YouTube's JavaScript library. When it finishes loading, YouTube calls a global function you define:

```js
window.onYouTubeIframeAPIReady = initPlayer;
```

```js
// Step 2: Player instantiation
playerInstanceRef.current = new window.YT.Player(playerRef.current, {
  videoId,
  playerVars: {
    controls: 0,      // hides YouTube's native UI completely
    disablekb: 1,     // disables keyboard shortcuts (space, arrow keys)
    fs: 0,            // removes fullscreen button
    rel: 0,           // no "related videos" at end
  },
  events: {
    onReady: onPlayerReady,
    onStateChange: onStateChange,
  },
});
```

`playerRef.current` is a React ref pointing to a `<div>`. YouTube replaces that div with an `<iframe>` containing the video.

### Why we use refs instead of state for the player

```js
const playerInstanceRef = useRef(null);
const watchedSegmentsRef = useRef(new Set());
```

React `useRef` stores a mutable value that **does not trigger re-renders when it changes**. The player object and the set of watched segments change constantly (every 10 seconds), but you don't want React to re-render the entire component on each heartbeat — that would destroy and recreate the YouTube player. Refs let you mutate values silently.

`useState` (like `completionPct`, `isPlaying`) is used for values that **should update the UI** when they change.

### The seekbar blocking overlay

```jsx
<div style={{
  position: 'absolute',
  bottom: 0, left: 0, right: 0,
  height: '80px',      // covers the YouTube control bar
  zIndex: 10,          // sits on top of the iframe
  cursor: 'not-allowed',
  background: 'transparent',
}} />
```

**How it works:** An absolutely-positioned transparent `<div>` sits directly on top of the YouTube player's control bar area (bottom 80px). Mouse clicks hit this div, not the iframe underneath. The div does nothing with the click — it just absorbs it.

**What students can still do:** They can click the custom Play/Pause button you built, which calls the YouTube Player API programmatically (`playerInstanceRef.current.playVideo()`). The YouTube API itself is not blocked — only direct mouse interaction with the native YouTube UI is.

**The known limitation:** A technically skilled student can open DevTools → Elements panel → find the overlay div → delete it in the DOM → now they can click the YouTube seekbar. This is a client-side limitation inherent to YouTube embeds. For a cohort of 20 paid professionals with a financial refund incentive, this is an acceptable tradeoff vs. the complexity of self-hosting video. The server-side heartbeat tracking means even if they skip, the backend won't record 90% completion.

**Why not build your own seekbar entirely?**
You did — the custom progress bar is purely visual and read-only. It shows position and covered segments. The player controls (play/pause, rewind) all call the YouTube API directly, bypassing the native YouTube UI entirely.

### The attention check

```js
// Fires 3 minutes after video starts playing
attentionTimerRef.current = setTimeout(() => {
  playerInstanceRef.current.pauseVideo();
  setAttentionCheck(true); // shows modal
}, 3 * 60 * 1000);
```

This solves the "hit play and walk away" problem. The video pauses and a modal appears that requires a click to dismiss. The heartbeat timer is not running while the video is paused, so unattended time doesn't count as watched. When the student clicks "Yes, continue watching", the video resumes and a new 3-minute timer starts.

---

## 6. PROGRESS TRACKING — THE SEGMENT COVERAGE SYSTEM

### Why not just track "has the video been watched to the end"?

A simple end-detection approach (`currentTime >= duration - 5`) has a fatal flaw: a student opens the video, fast-forwards to the 95% mark (if they bypass the overlay), waits 5 seconds, and "completes" it.

The segment coverage system solves this:

### How segments work

The video duration is divided into 10-second chunks. Each chunk is a **segment**.

```
Video: 40 minutes = 2400 seconds

Segment 0:    0s –   10s
Segment 1:   10s –   20s
Segment 2:   20s –   30s
...
Segment 239: 2390s – 2400s

Total segments: 240
```

Every 10 seconds while the video plays, the heartbeat fires:

```js
const segment = Math.floor(currentTime / HEARTBEAT_INTERVAL);
// If currentTime = 47s: Math.floor(47/10) = segment 4
// If currentTime = 150s: Math.floor(150/10) = segment 15

watchedSegmentsRef.current.add(segment);
// This is a JavaScript Set — duplicates are ignored automatically
// If you rewatch segment 4, adding 4 again changes nothing
```

### Calculating completion percentage

```js
const totalSegments = Math.ceil(duration / HEARTBEAT_INTERVAL);
const watchedCount = watchedSegmentsRef.current.size;
const pct = Math.min(watchedCount / totalSegments, 1);
```

If a student watches segments 0–200 (skipping 201–239), they've watched 201/240 = 83.75%. Not enough. They need to go back and watch the rest to hit 90%.

If a student watches at 2x speed, the currentTime advances 2 seconds per real second. After 10 real seconds, the currentTime has moved 20 seconds — two segments. Both get recorded on each heartbeat. So 2x speed works fine; the student just finishes in half the time but every segment still gets covered.

### What DynamoDB stores for a segment set

DynamoDB has a native `Set` data type. In the Lambda:

```js
ADD watchedSegments :seg
// where :seg = new Set([segment])
```

`ADD` on a DynamoDB Set is an **atomic union operation** — it adds elements to the existing set without overwriting it. This is concurrency-safe: if two heartbeats from different devices arrive simultaneously, both get merged correctly.

In DynamoDB, the stored item looks like:
```json
{
  "pk": "USER#abc-uuid",
  "sk": "PROGRESS#course-001#week-001",
  "watchedSegments": {4, 5, 6, 7, 8, 15, 16},
  "duration": 2400,
  "videoComplete": false,
  "lastSeen": "2026-02-21T10:30:00Z"
}
```

When `videoComplete` flips to `true`, it's written once and never unset. The next Lambda invocation checks:

```js
if (videoComplete && !updateResult.Attributes?.videoComplete) {
  // Only runs the first time completion is detected
  // Prevents redundant writes on every subsequent heartbeat
}
```

---

## 7. DATA FLOW: HEARTBEAT → LAMBDA → DYNAMODB

Let's trace one heartbeat ping from browser to database and back.

### Browser side (VideoPlayer.js)

```js
// Every 10 seconds, this fires:
heartbeatTimerRef.current = setInterval(() => {
  const current = playerInstanceRef.current.getCurrentTime();
  const dur = playerInstanceRef.current.getDuration();

  sendHeartbeat(courseId, weekId, Math.floor(current), Math.floor(dur));
}, HEARTBEAT_INTERVAL * 1000);
```

`sendHeartbeat` is from `utils/api.js`:

```js
export const sendHeartbeat = (courseId, weekId, currentTime, duration) =>
  api.post('/progress/heartbeat', { courseId, weekId, currentTime, duration });
```

`api` is an axios instance with an interceptor that automatically attaches the JWT:

```js
api.interceptors.request.use(async (config) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**The HTTP request that leaves the browser:**
```
POST https://abc123.execute-api.us-east-1.amazonaws.com/prod/progress/heartbeat
Authorization: Bearer eyJhbGciOiJSUzI1NiJ9...
Content-Type: application/json

{
  "courseId": "course-001",
  "weekId": "week-001",
  "currentTime": 150,
  "duration": 2400
}
```

### API Gateway layer

API Gateway receives this request. Before forwarding to Lambda, it:

1. Checks the `Authorization` header
2. Fetches Cognito's public keys from: `https://cognito-idp.us-east-1.amazonaws.com/{userPoolId}/.well-known/jwks.json`
3. Verifies the JWT signature (RS256 algorithm)
4. Decodes the JWT payload
5. Attaches it to the event as `requestContext.authorizer.claims`

The Lambda then receives this full event object:

```json
{
  "httpMethod": "POST",
  "path": "/progress/heartbeat",
  "headers": { "Authorization": "Bearer ..." },
  "body": "{\"courseId\":\"course-001\",\"weekId\":\"week-001\",\"currentTime\":150,\"duration\":2400}",
  "requestContext": {
    "authorizer": {
      "claims": {
        "sub": "abc-uuid-123",
        "email": "student@example.com",
        "cognito:groups": "students"
      }
    }
  }
}
```

Note that `body` is a **string**, not an object — Lambda proxy integration passes the raw HTTP body. That's why every Lambda starts with `JSON.parse(event.body)`.

### Lambda layer (heartbeat.js)

```js
const userId = event.requestContext.authorizer.claims.sub;
// userId = "abc-uuid-123"

const { courseId, weekId, currentTime, duration } = JSON.parse(event.body);
// courseId = "course-001", currentTime = 150

const segment = Math.floor(currentTime / 10);
// segment = 15

const pk = `USER#${userId}`;   // "USER#abc-uuid-123"
const sk = `PROGRESS#${courseId}#${weekId}`;  // "PROGRESS#course-001#week-001"
```

Then the DynamoDB write:

```js
await ddb.send(new UpdateCommand({
  TableName: 'lms-progress',
  Key: { pk, sk },
  UpdateExpression: `
    ADD watchedSegments :seg          ← atomic set union
    SET lastSeen = :now,              ← timestamp
        duration = :dur,              ← store video length
        userId = :uid,                ← redundant but useful for scans
        courseId = :cid,
        weekId = :wid
  `,
  ExpressionAttributeValues: {
    ':seg': new Set([15]),            ← segment 15
    ':now': '2026-02-21T10:30:00Z',
    ':dur': 2400,
    ':uid': 'abc-uuid-123',
    ':cid': 'course-001',
    ':wid': 'week-001',
  },
  ReturnValues: 'ALL_NEW',           ← return the updated item
}));
```

**Why UpdateCommand instead of PutCommand?**
`PutCommand` replaces the entire item — it would wipe the existing `watchedSegments` set. `UpdateCommand` with `ADD` merges the new segment into the existing set. This is critical.

**Why ReturnValues: 'ALL_NEW'?**
The Lambda needs to check the current completion percentage after the write, without making a second read request. `ALL_NEW` returns the post-write state of the item in the same response. This saves a round trip to DynamoDB.

### Response back to the browser

```js
return {
  statusCode: 200,
  headers: { 'Access-Control-Allow-Origin': 'https://stepsmart.net' },
  body: JSON.stringify({
    videoPct: 62,
    videoComplete: false,
    segmentsWatched: 15,
    totalSegments: 240,
  }),
};
```

The browser receives this, but the VideoPlayer doesn't actually use the response — it calculates `completionPct` locally from its in-memory Set. The backend response is just a sanity check. The source of truth is always the backend.

---

## 8. QUIZ SYSTEM — GRADING, SECURITY, RETRY LOGIC

### The security design — correct answers never leave the server

When `getCourseWeeks.js` sends week data to the browser, it intentionally strips the correct answers:

```js
week.quiz = {
  questions: w.quiz.questions.map(q => ({
    id: q.id,
    text: q.text,
    options: q.options,
    explanation: q.explanation,
    // correctIndex: q.correctIndex  ← INTENTIONALLY OMITTED
  })),
};
```

DynamoDB stores: `{ id: "q1", text: "What is...", options: [...], correctIndex: 2, explanation: "..." }`

The browser receives: `{ id: "q1", text: "What is...", options: [...], explanation: "..." }`

A student who opens Network DevTools sees the question text and options, but not which answer is correct. The `correctIndex` only ever exists in DynamoDB and inside Lambda functions — never in any HTTP response to a student.

### The grading flow

```js
// submitQuiz.js Lambda

// 1. Verify the student has watched the video first
const progressItem = await ddb.send(new GetCommand({
  Key: { pk: 'USER#abc-uuid', sk: 'PROGRESS#course-001#week-001' }
}));

if (!progressItem.Item?.videoComplete) {
  return { statusCode: 403, body: '{"message": "Complete the video first"}' };
}

// 2. Fetch the correct answers from DynamoDB
const weekItem = await ddb.send(new GetCommand({
  Key: { pk: 'COURSE#course-001', sk: 'WEEK#week-001' }
}));
const questions = weekItem.Item.quiz.questions;

// 3. Grade: compare submitted answers against stored correctIndex
let correct = 0;
for (const q of questions) {
  if (answers[q.id] === q.correctIndex) correct++;
}

// answers looks like: { "q1": 2, "q2": 0, "q3": 1 }
// q.correctIndex is the stored correct option index (0-3)
```

**Why can't a student fake their answers?** Because the Lambda doesn't trust the browser's claim of which answer is correct. The Lambda fetches the answer key from DynamoDB independently. The browser only sends `{ "q1": 2 }` — the answer it chose. The Lambda looks up "the correct answer for q1 is 2" from DynamoDB and compares them.

### Retry design

```js
// Always save results, never block retries
await ddb.send(new UpdateCommand({
  UpdateExpression: `
    SET quizPassed = :passed,
        quizScore = :score
    ADD quizAttempts :one        ← increment attempt counter
  `,
}));
```

There's no "lock out after N attempts" logic — students can retry indefinitely. Why? Because this is a learning course, not a certification exam. The goal is mastery, not pressure. The attempt counter lets you (as admin) see if a student is struggling (10 attempts on week 2 is a signal to reach out).

---

## 9. DYNAMODB DESIGN — TABLES, KEYS, DATA SHAPES

### Why DynamoDB over RDS (Postgres/MySQL)?

For this use case:
- **No complex joins** — progress data and course data are always fetched independently
- **Serverless** — no database server to manage, scales to zero when idle
- **Free tier** — 25GB and 25 read/write capacity units forever free
- **Native Set type** — perfect for storing the watched segments

### The single-table vs. two-table choice

Many DynamoDB experts advocate single-table design. Here, two tables are used for **operational clarity** — you're learning the system, and separating "course definitions" from "student progress" makes it immediately obvious where each type of data lives. Performance difference at 20 students: zero.

### Table 1: lms-courses

**Access patterns this table must support:**
1. Get a specific course's metadata (by courseId)
2. Get all weeks in a course (list by courseId)
3. Get a specific week (by courseId + weekId)

**Key design:**

| pk | sk | What it is |
|---|---|---|
| COURSE#course-001 | METADATA | Course name, description |
| COURSE#course-001 | WEEK#week-001 | Week 1 definition |
| COURSE#course-001 | WEEK#week-002 | Week 2 definition |
| COURSE#course-001 | WEEK#week-003 | Week 3 definition |

**Why this pattern?** All items for course-001 share the same `pk`. DynamoDB's `Query` operation can fetch ALL of them with `pk = 'COURSE#course-001' AND begins_with(sk, 'WEEK#')` in a single request. This is more efficient than running separate GetItem calls for each week.

**A week item looks like:**
```json
{
  "pk": "COURSE#course-001",
  "sk": "WEEK#week-abc123",
  "weekId": "week-abc123",
  "courseId": "course-001",
  "weekNumber": 2,
  "title": "Defining the Problem Space",
  "description": "How to frame problems before jumping to solutions",
  "youtubeUrl": "https://youtu.be/xxxxxxxxxxx",
  "qaLink": "https://calendly.com/you/week2-qa",
  "visible": true,
  "quiz": {
    "questions": [
      {
        "id": "q1",
        "text": "What is the primary purpose of a problem statement?",
        "options": ["To define the solution", "To align stakeholders on the problem", "To estimate timeline", "To assign ownership"],
        "correctIndex": 1,
        "explanation": "A problem statement defines what you are solving, not how."
      }
    ]
  },
  "createdAt": "2026-02-15T09:00:00Z"
}
```

### Table 2: lms-progress

**Access patterns:**
1. Get all week progress for one student in one course (student dashboard)
2. Update progress for a specific student + week (heartbeat)
3. Scan all progress for one course (admin view)

**Key design:**

| pk | sk | What it is |
|---|---|---|
| USER#abc-uuid | PROGRESS#course-001#week-001 | Student A, Week 1 progress |
| USER#abc-uuid | PROGRESS#course-001#week-002 | Student A, Week 2 progress |
| USER#xyz-uuid | PROGRESS#course-001#week-001 | Student B, Week 1 progress |

**Query for student dashboard:**
```js
KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)'
// pk = "USER#abc-uuid"
// prefix = "PROGRESS#course-001#"
// Returns: all weeks for this student in this course
```

**A progress item looks like:**
```json
{
  "pk": "USER#abc-uuid",
  "sk": "PROGRESS#course-001#week-001",
  "userId": "abc-uuid",
  "courseId": "course-001",
  "weekId": "week-001",
  "watchedSegments": [0, 1, 2, 3, 4, 5, 14, 15, 16],
  "duration": 2400,
  "videoComplete": false,
  "videoCompletedAt": null,
  "quizPassed": false,
  "quizScore": null,
  "quizTotal": null,
  "quizAttempts": 0,
  "lastSeen": "2026-02-21T10:30:00Z"
}
```

Note: `watchedSegments` is displayed as an array here for readability. In DynamoDB it is stored as a **Number Set** (NS type), which is internally a hash set with O(1) membership testing and atomic union via ADD.

### Why `USER#` and `COURSE#` prefixes?

This is a DynamoDB best practice called **entity type prefixing**. It:
1. Prevents key collisions if you ever put both User and Course items in the same table
2. Makes access patterns explicit and human-readable in the console
3. Allows `begins_with` queries to select only items of a certain type

---

## 10. LAMBDA FUNCTIONS — LINE BY LINE REASONING

### Common pattern in every Lambda

```js
exports.handler = async (event) => {
  // 1. Extract authenticated user identity (injected by API Gateway)
  const userId = event.requestContext.authorizer.claims.sub;

  // 2. Parse the request body (it's a raw JSON string, not an object)
  const body = JSON.parse(event.body || '{}');

  // 3. Validate inputs before touching DynamoDB
  if (!body.courseId) return res(400, { message: 'Missing courseId' });

  // 4. Do DynamoDB operations
  // ...

  // 5. Return with CORS headers
  return res(200, { result: data }, corsHeaders());
};
```

**Why `event.body || '{}'`?** Some routes (like GET requests) have no body. Without the fallback, `JSON.parse(undefined)` throws a SyntaxError and crashes the Lambda.

**Why always include CORS headers in the response?** Browsers enforce the Same-Origin Policy — they block JavaScript from reading responses from a different domain unless the server explicitly permits it. Your React app at `stepsmart.net` makes requests to `execute-api.us-east-1.amazonaws.com` — a different domain. Without `Access-Control-Allow-Origin: https://stepsmart.net` in the response, the browser silently discards the response and your app gets an error.

### adminHandler.js — one Lambda for multiple routes

```js
const method = event.httpMethod;    // 'GET', 'POST', 'PATCH'
const path = event.resource;        // '/admin/students', '/admin/courses/{courseId}/weeks'

if (method === 'GET' && path === '/admin/students') { ... }
if (method === 'POST' && path === '/admin/students') { ... }
if (method === 'PATCH' && path === '/admin/courses/{courseId}/weeks/{weekId}') { ... }
```

`event.resource` contains the API Gateway route template (with `{courseId}` as a literal placeholder). `event.pathParameters` contains the resolved values:
```js
event.pathParameters.courseId  // "course-001"
event.pathParameters.weekId    // "week-abc123"
```

Using one Lambda for all admin routes reduces cold start surface area and keeps admin logic in one place.

### getCourseWeeks.js — the answer-stripping logic

This is the most security-sensitive transformation:

```js
const isAdmin = userGroups.includes('admins');

questions: w.quiz.questions.map(q => ({
  id: q.id,
  text: q.text,
  options: q.options,
  explanation: q.explanation,
  ...(isAdmin ? { correctIndex: q.correctIndex } : {}),
  //            ↑ admins get correctIndex for review purposes
  //              students get the same object but without it
}))
```

The spread syntax `...(condition ? obj : {})` is a clean way to conditionally include properties. Admins see correct answers when reviewing their own quiz questions. Students never do.

---

## 11. API GATEWAY — HOW HTTP REACHES LAMBDA

### What API Gateway does

API Gateway is an HTTP reverse proxy with built-in features: authentication, rate limiting, CORS, SSL termination, and routing. It receives HTTP requests from the internet and forwards them to Lambda functions.

### Lambda Proxy Integration

When you check "Use Lambda Proxy Integration":
- API Gateway forwards the **complete HTTP request** to Lambda as a JSON event
- Lambda returns a **complete HTTP response** as a JSON object with `statusCode`, `headers`, `body`
- API Gateway translates this back into a real HTTP response

Without proxy integration, API Gateway does transformation — you'd configure request/response mapping templates in Velocity Template Language (VTL). That's complex and unnecessary here.

### Route matching

```
POST /progress/heartbeat      → lms-heartbeat Lambda
GET  /progress/{courseId}     → lms-getProgress Lambda
POST /quiz/submit             → lms-submitQuiz Lambda
GET  /courses/my              → lms-getMyCourses Lambda
GET  /courses/{courseId}/weeks → lms-getCourseWeeks Lambda
ALL  /admin/*                 → lms-admin Lambda
```

`{courseId}` in the path is a **path parameter** — API Gateway extracts it and passes it in `event.pathParameters.courseId`.

### The Cognito Authorizer

The authorizer is a configuration you attach to API Gateway (not code you write). It tells API Gateway: "before forwarding this request to Lambda, verify the `Authorization` header is a valid Cognito JWT."

If verification fails: API Gateway returns `401 Unauthorized` immediately. Lambda is never invoked — you pay nothing for rejected requests.

If verification succeeds: Gateway decodes the JWT and injects the claims into `event.requestContext.authorizer.claims`. Lambda can trust these without any additional verification.

---

## 12. THE COMPLETE REQUEST LIFECYCLE

Let's trace the most complex interaction: **student submits a quiz.**

```
1. BROWSER
   Student clicks "Submit Quiz"
   QuizComponent.js calls: submitQuiz(courseId, weekId, { "q1": 2, "q2": 0, "q3": 1 })
   
2. utils/api.js
   axios interceptor fires: fetchAuthSession() → gets JWT
   Builds HTTP request:
     POST /quiz/submit
     Authorization: Bearer eyJ...
     Body: {"courseId":"course-001","weekId":"week-001","answers":{"q1":2,"q2":0,"q3":1}}

3. INTERNET → API GATEWAY
   Request arrives at: abc123.execute-api.us-east-1.amazonaws.com/prod/quiz/submit
   
4. API GATEWAY — Cognito Authorizer
   Extracts JWT from Authorization header
   Fetches Cognito public keys (cached after first fetch)
   Verifies RS256 signature
   Decodes payload: { sub: "abc-uuid", email: "student@...", cognito:groups: "students" }
   Attaches to requestContext.authorizer.claims
   
5. API GATEWAY → LAMBDA (lms-submitQuiz)
   Lambda cold start (if first invocation in ~15 mins) or warm execution
   Lambda container receives full event object
   
6. LAMBDA — submitQuiz.js
   Step A: Extract userId from claims → "abc-uuid"
   Step B: Parse body → { courseId, weekId, answers }
   
   Step C: DynamoDB GetItem — check video completion
     Table: lms-progress
     Key: { pk: "USER#abc-uuid", sk: "PROGRESS#course-001#week-001" }
     Result: { videoComplete: true, ... } ✓
   
   Step D: DynamoDB GetItem — fetch correct answers
     Table: lms-courses
     Key: { pk: "COURSE#course-001", sk: "WEEK#week-001" }
     Result: { quiz: { questions: [{ id:"q1", correctIndex: 2 }, ...] } }
   
   Step E: Grade
     q1: submitted=2, correct=2 → ✓
     q2: submitted=0, correct=1 → ✗
     q3: submitted=1, correct=1 → ✓
     score = 2/3 = 66.7% → FAILED (need 70%)
   
   Step F: DynamoDB UpdateItem — save result
     Table: lms-progress
     Key: { pk: "USER#abc-uuid", sk: "PROGRESS#course-001#week-001" }
     SET quizPassed=false, quizScore=2, quizTotal=3
     ADD quizAttempts 1
   
   Step G: Return response
     { statusCode: 200, body: '{"passed":false,"score":2,"total":3,"pct":67}' }

7. API GATEWAY → BROWSER
   Unwraps Lambda response into real HTTP response
   Adds CORS headers
   Returns 200 with JSON body

8. BROWSER — QuizComponent.js
   axios receives response
   setResult({ passed: false, score: 2, total: 3, pct: 67 })
   setSubmitted(true)
   Component re-renders: shows incorrect answers highlighted in red
   Shows "Retry Quiz" button
   onQuizPassed is NOT called (because passed=false)
   
9. STUDENT clicks "Retry Quiz"
   handleRetry() → clears answers, sets submitted=false
   Student sees blank quiz again
   Cycle repeats
```

Two DynamoDB reads + one write for a single quiz submission. At 20 students, this is trivially within free tier.

---

## 13. DEPLOYMENT STEPS — WITH FULL EXPLANATION OF EACH

### STEP 1 — Create a new GitHub repository

```bash
# On your local machine
mkdir courselab-lms
cd courselab-lms
git init
# Copy all the frontend/ and backend/ files here
git add .
git commit -m "Initial CourseLab commit"
git remote add origin https://github.com/YOURUSERNAME/courselab-lms.git
git push -u origin main
```

**What this does:** Creates a new separate repo for the LMS. This repo will be connected to a new Vercel project (separate from your main stepsmart.net Vercel project) and deployed to the `/learn` path.

---

### STEP 2 — Create DynamoDB Tables

Go to **AWS Console → DynamoDB → Create table** (twice).

**Why DynamoDB and not RDS?**
RDS requires a running database server — you pay ~$15/month minimum even when idle. DynamoDB is pay-per-request with a free tier of 25GB storage and 25 read/write capacity units per month. For 20 students sending ~6 heartbeats/minute while watching video: that's 8,640 writes/day, well within free tier.

```
Table 1:
  Name: lms-courses
  Partition key: pk (String)
  Sort key: sk (String)
  Billing: On-demand

Table 2:
  Name: lms-progress
  Partition key: pk (String)
  Sort key: sk (String)
  Billing: On-demand
```

**Why partition key + sort key (composite key)?**
Composite keys enable hierarchical data. All weeks for a course share the same partition key (`COURSE#course-001`) but different sort keys (`WEEK#001`, `WEEK#002`). A single Query call can retrieve all of them — much more efficient than scanning the whole table.

---

### STEP 3 — Set Up Cognito

**AWS Console → Cognito → Create user pool**

Cognito is an OAuth2/OIDC-compliant identity provider. You're using it as a managed auth system — it handles password hashing (bcrypt), token issuance (RS256 JWTs), token refresh, and secure temporary password flows.

Key settings:
- **Self-registration: DISABLED** — students can only be added by you. This prevents random people from signing up.
- **Attributes: email + name** — email is the username.
- **App client: no secret** — React runs in the browser; secrets in client-side code aren't secret. Cognito's public client mode uses PKCE (Proof Key for Code Exchange) instead.

After creation, note:
```
User Pool ID: us-east-1_XXXXXXXXX
App Client ID: XXXXXXXXXXXXXXXXXX
```

Create the `admins` group. Add yourself as a user. You'll get a temp password by email.

---

### STEP 4 — Create IAM Role for Lambda

**AWS Console → IAM → Roles → Create role**

Lambda functions need permission to call DynamoDB and Cognito. An IAM role is a set of permissions you attach to a Lambda function. The function assumes the role when it runs — it doesn't need API keys or credentials in the code.

```
Trust policy: Lambda (allows Lambda service to assume this role)
Permissions:
  - AmazonDynamoDBFullAccess
  - AmazonCognitoPowerUser
  - CloudWatchLogsFullAccess
```

**Why not use access keys in the Lambda code?** Environment variables in Lambda can be read by anyone with console access. IAM roles are credential-free — AWS's internal metadata service issues short-lived tokens to the Lambda container automatically. They rotate every hour with no code changes.

---

### STEP 5 — Create Lambda Functions

**AWS Console → Lambda → Create function** (6 times)

```
Runtime: Node.js 20.x
Architecture: x86_64
Role: lms-lambda-role (the one you just created)
```

For each function: paste the code from the corresponding file, click Deploy.

**Environment variables for each Lambda:**
```
PROGRESS_TABLE = lms-progress
COURSES_TABLE  = lms-courses
USER_POOL_ID   = us-east-1_XXXXXXXXX
FRONTEND_URL   = https://stepsmart.net
```

**Why set FRONTEND_URL?** The CORS `Access-Control-Allow-Origin` header must exactly match the origin making the request. If you set it to `*`, any website can make authenticated requests to your API (bad for security). Setting it to your exact domain ensures only your frontend can read API responses.

**Timeout: set to 15 seconds** (default is 3s). Cognito's `ListUsers` call can occasionally take 3–4 seconds. The admin Lambda calls this on every admin request. A 3-second timeout would randomly fail.

---

### STEP 6 — Create API Gateway

**AWS Console → API Gateway → REST API → Create**

Create all routes per the route table, connect each to its Lambda with **Lambda Proxy Integration checked**.

**Create Cognito Authorizer:**
```
Type: Cognito User Pool
User Pool: lms-user-pool
Token source: Authorization
Token validation: (leave blank)
```

Apply this authorizer to every route except OPTIONS methods (OPTIONS is the CORS preflight — it must be unauthenticated).

**Enable CORS:** For every resource, Actions → Enable CORS. This adds the `OPTIONS` method and the necessary response headers.

**Deploy:**
```
Actions → Deploy API
Stage: prod
```

This publishes your API to the internet. The URL:
`https://[random-id].execute-api.us-east-1.amazonaws.com/prod`

---

### STEP 7 — Connect Vercel to New Repo

**In Vercel dashboard:**
1. New Project → Import Git Repository → select `courselab-lms`
2. Framework Preset: Create React App
3. Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `build`
6. Add Environment Variable: `REACT_APP_API_URL` = your API Gateway URL

**Add to existing domain:**
In Vercel project settings → Domains → Add `stepsmart.net/learn`

Wait for deployment. Vercel runs `npm run build`, uploads the static files to its CDN, and configures the routing rules from `vercel.json`.

---

### STEP 8 — Fill in aws-config.js and Push

```js
// src/config/aws-config.js
const awsConfig = {
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_XXXXXXXXX',           // ← yours
    userPoolWebClientId: 'XXXXXXXXXXXXXXXXXX',    // ← yours
  },
};
```

```bash
git add .
git commit -m "Add AWS config"
git push
```

Vercel automatically detects the push and redeploys within 30 seconds. This is your deployment pipeline — just push to main.

---

### STEP 9 — Seed the First Course

Go to **DynamoDB → Tables → lms-courses → Explore items → Create item**:

```json
{
  "pk": "COURSE#course-001",
  "sk": "METADATA",
  "courseId": "course-001",
  "type": "course",
  "name": "Product Management Bootcamp",
  "description": "Weekly videos, quizzes, and live Q&A sessions."
}
```

Log in to `stepsmart.net/learn` with your admin credentials.
Go to Admin → Add Week → fill in your Week 1 details → Save.
Admin → Manage Weeks → Release Week 1.

---

## ONGOING WEEK RELEASE WORKFLOW

Every week:
1. Upload video to YouTube as **Unlisted** → copy URL
2. Login → Admin → Add Week → paste URL, write quiz, add Q&A Calendly link
3. It saves as hidden (invisible to students)
4. When you're ready: Admin → Manage Weeks → "Release to Students"
5. That's it — no code changes, no deploys needed

---

## WHERE TO FIND EACH THING IN AWS CONSOLE

| What | Where |
|---|---|
| View student progress raw data | DynamoDB → lms-progress → Explore items |
| See all Cognito users + their status | Cognito → lms-user-pool → Users |
| Add admin | Cognito → Users → create → Groups → add to admins |
| Lambda error logs | CloudWatch → Log groups → /aws/lambda/lms-[name] |
| API Gateway request logs | API Gateway → Stages → prod → Logs |
| See all course/week items | DynamoDB → lms-courses → Explore items |
