# StepSmart – Team Onboarding Guide

Welcome to the StepSmart codebase. This document covers everything you need to understand the project, make changes, and deploy them.

---

## Table of Contents

1. [What is StepSmart?](#1-what-is-stepsmart)
2. [How the Pieces Fit Together](#2-how-the-pieces-fit-together)
3. [Repo Structure](#3-repo-structure)
4. [Local Development](#4-local-development)
5. [Frontend – Landing Page](#5-frontend--landing-page)
6. [Frontend – LMS App](#6-frontend--lms-app)
7. [Backend – Lambda Functions](#7-backend--lambda-functions)
8. [AWS Services Reference](#8-aws-services-reference)
9. [Deployment](#9-deployment)
10. [Managing Students (Cognito)](#10-managing-students-cognito)
11. [Environment Variables](#11-environment-variables)

---

## 1. What is StepSmart?

StepSmart is a product management learning platform with two user-facing parts:

- **Landing page** (`stepsmart.net`) — marketing site with course info and lead capture
- **LMS** (`stepsmart.net/learn`) — the learning portal where enrolled students watch videos, take quizzes, and submit assignments

---

## 2. How the Pieces Fit Together

```
Browser
  │
  ├── stepsmart.net/*         → Landing page Vercel project (landing/)
  │     ├── /                    React + Vite marketing site
  │     └── /learn/*             Proxied to LMS Vercel project ↓
  │
  └── stepsmart-backend-lyart.vercel.app
        └── /learn/*           → LMS Vercel project (frontend/)
                                  React + CRA student portal
                                        │
                                        └── API calls → AWS API Gateway
                                                              │
                                              ┌───────────────┼───────────────┐
                                           Lambda          DynamoDB        Cognito
                                          (backend/)     (lms-progress)  (auth/users)
```

**Key routing detail:** The landing page's `vercel.json` has a proxy rule that forwards all `/learn/*` traffic to the LMS Vercel project. This is how one domain (`stepsmart.net`) serves both apps.

---

## 3. Repo Structure

```
StepSmart-learn-site/
├── landing/          Landing page (Vite + React + TypeScript)
│   ├── App.tsx           Entire landing page in one component
│   ├── main.tsx          Entry point
│   ├── styles.css        Global styles
│   ├── index.html        HTML shell
│   ├── vite.config.ts    Vite config
│   ├── firebase.json     Firebase project config
│   ├── vercel.json       Routing + /learn proxy rule
│   └── public/           Static assets (images, PDF brochure)
│
├── frontend/         LMS app (Create React App + React)
│   ├── src/
│   │   ├── App.js            Route definitions
│   │   ├── index.js          Entry point
│   │   ├── index.css         Design tokens + global styles
│   │   ├── config/
│   │   │   └── aws-config.js Cognito connection settings
│   │   ├── context/
│   │   │   └── AuthContext.js Auth state + Amplify integration
│   │   ├── components/
│   │   │   ├── ProtectedRoute.js  Route guards (student + admin)
│   │   │   ├── VideoPlayer.js     Video with progress heartbeat
│   │   │   ├── QuizComponent.js   Quiz UI + submission
│   │   │   └── AssignmentUpload.js File upload component
│   │   ├── pages/
│   │   │   ├── LoginPage.js       Sign in + force-change-password flow
│   │   │   ├── DashboardPage.js   Student course list
│   │   │   ├── LearnPage.js       Video + quiz + assignment per week
│   │   │   └── AdminPage.js       Admin dashboard
│   │   └── utils/
│   │       └── api.js             All API calls (axios + auth interceptor)
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── vercel.json       SPA rewrite rule for the LMS project
│
├── backend/          AWS Lambda functions (one file = one function)
│   ├── studentHandler.js     Student routes (progress, courses, heartbeat)
│   ├── adminHandler.js       Admin routes (/admin/*)
│   ├── getCourseWeeks.js     GET /courses/{courseId}/weeks
│   ├── getMyCourses.js       GET /courses/my
│   ├── getProgress.js        GET /progress/{courseId}
│   ├── getStudentAssignments.js  GET /courses/{courseId}/weeks/{weekId}/assignments
│   ├── submitQuiz.js         POST /quiz/submit
│   ├── uploadAssignment.js   POST /assignments/upload
│   ├── publicHandler.js      Unauthenticated public routes
│   └── heartbeat.js          POST /progress/heartbeat (deprecated → studentHandler.js)
│
└── scripts/
    └── deploy-lambda.sh  CLI script to deploy Lambda functions via AWS CLI
```

---

## 4. Local Development

### Prerequisites

- Node.js 18+
- npm

### Landing page

```bash
cd landing
npm install
npm run dev
# Opens at http://localhost:5173
```

Firebase features (lead capture form) won't work locally without the Firebase env vars. The rest of the page renders fine without them.

### LMS app

```bash
cd frontend
npm install
# Create a local env file:
echo "REACT_APP_API_URL=https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod" > .env.local
npm start
# Opens at http://localhost:3000/learn
```

The app will talk to the live AWS backend — you'll need a real student or admin account in Cognito to log in.

### Backend (Lambda)

The Lambda functions run in AWS and cannot be run locally without additional tooling. Read the code directly in `backend/` and deploy changes via the script in `scripts/`.

---

## 5. Frontend – Landing Page

**Tech:** Vite, React 19, TypeScript, Firebase (Firestore for lead capture), React Hook Form, Zod

**Key file:** `landing/App.tsx` — the entire site lives in this one file.

**Firebase** is used to store enquiry form submissions in Firestore. It uses anonymous auth so visitors don't need an account.

### Making changes

Edit `landing/App.tsx` (and `styles.css` for global styles), commit, and push. Vercel auto-deploys.

---

## 6. Frontend – LMS App

**Tech:** Create React App, React 18, AWS Amplify v6 (auth only), Axios, React Router v6

**Auth flow:**
1. `AuthContext.js` calls `Amplify.configure()` on load with the Cognito settings from `aws-config.js`
2. On mount it calls `getCurrentUser()` to restore any existing session
3. Login uses Cognito's SRP challenge via `signIn()`. New accounts are in `FORCE_CHANGE_PASSWORD` state — the login page handles this with a second form step
4. Every API request gets the Cognito ID Token attached via an Axios interceptor in `api.js`
5. API Gateway verifies the JWT before any Lambda runs

**Routing:** The app is mounted at `/learn` (`BrowserRouter basename="/learn"`). React Router matches routes without the `/learn` prefix internally, but the browser URL always shows `/learn/...`.

### Making changes

Edit files in `frontend/src/`, commit, and push. Vercel auto-deploys.

**Admin access:** A Cognito user must be in the `admins` group to see the admin page. The `AdminRoute` component in `ProtectedRoute.js` checks `isAdmin` from `AuthContext`.

---

## 7. Backend – Lambda Functions

Each file in `backend/` is a standalone AWS Lambda function. They share no code — each one is fully self-contained.

### Function map

| File | Lambda Name | API Route |
|------|-------------|-----------|
| `studentHandler.js` | `lms-student` | Student routes (progress, courses, heartbeat) |
| `adminHandler.js` | `lms-admin` | ALL `/admin/*` |
| `getCourseWeeks.js` | `lms-getCourseWeeks` | GET `/courses/{courseId}/weeks` |
| `getMyCourses.js` | `lms-getMyCourses` | GET `/courses/my` |
| `getProgress.js` | `lms-getProgress` | GET `/progress/{courseId}` |
| `getStudentAssignments.js` | `lms-getStudentAssignments` | GET `/courses/{courseId}/weeks/{weekId}/assignments` |
| `submitQuiz.js` | `lms-submitQuiz` | POST `/quiz/submit` |
| `uploadAssignment.js` | `lms-uploadAssignment` | POST `/assignments/upload` |
| `publicHandler.js` | (public routes) | Unauthenticated routes |
| `heartbeat.js` | `lms-heartbeat` | POST `/progress/heartbeat` (deprecated) |

All authenticated routes require a valid Cognito JWT in the `Authorization: Bearer <token>` header. API Gateway validates the token before the Lambda runs — the Lambda reads the verified user ID from `event.requestContext.authorizer.claims.sub`.

### Deploying a Lambda change

You need the AWS CLI installed and configured with your IAM credentials.

```bash
# Deploy one function after editing it
./scripts/deploy-lambda.sh studentHandler

# Deploy all functions at once
./scripts/deploy-lambda.sh
```

The script zips the file and calls `aws lambda update-function-code`. Changes are live within seconds.

**AWS CLI setup (first time):**
```bash
# Install AWS CLI if you don't have it
brew install awscli   # macOS

# Configure with your IAM credentials (Ankit will provide these)
aws configure
# AWS Access Key ID: <your key>
# AWS Secret Access Key: <your secret>
# Default region: eu-north-1
# Default output format: json
```

---

## 8. AWS Services Reference

All AWS resources are in region **eu-north-1 (Stockholm)**.

### API Gateway

- **URL:** `https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod`
- Stage: `prod`
- Auth: Cognito User Pool Authorizer on all routes except public ones
- You generally don't need to change API Gateway unless adding a new route

### DynamoDB

- **Table:** `lms-progress`
- Stores student video progress (watched segments), quiz results, and assignment submissions
- Primary key: `pk` (e.g. `USER#<cognito-sub>`) + `sk` (e.g. `PROGRESS#<courseId>#<weekId>`)
- Access via AWS Console → DynamoDB → Tables → `lms-progress` → Explore items

### Cognito

- **Region:** `eu-north-1`
- **User Pool ID:** `eu-north-1_jnwEn55p2`
- **App Client ID:** `4hjlo8ssb3p17dr4bnk19cmgqk`
- Groups: `admins` (grants access to the admin dashboard in the LMS)
- Access via AWS Console → Cognito → User pools

### S3 (Assignments)

Assignment files uploaded by students go to an S3 bucket via pre-signed URLs generated by `uploadAssignment.js`. Check that Lambda for the bucket name.

---

## 9. Deployment

### How auto-deploy works

Both Vercel projects are connected to this GitHub repo. Pushing to `main` triggers both to rebuild and deploy automatically — no manual steps needed for frontend changes.

| Project | Vercel URL | Root Dir | Auto-deploys on push to |
|---------|-----------|----------|--------------------------|
| Landing | `stepsmart.net` | `landing/` | `main` |
| LMS | `stepsmart-backend-lyart.vercel.app` | `frontend/` | `main` |

### Deploying frontend changes

```bash
git add .
git commit -m "your message"
git push
# Both Vercel projects build and deploy automatically
```

### Deploying backend changes

```bash
# After editing a file in backend/
./scripts/deploy-lambda.sh <functionKey>

# Example — after editing studentHandler.js:
./scripts/deploy-lambda.sh studentHandler
```

Valid function keys: `studentHandler`, `adminHandler`, `getCourseWeeks`, `getMyCourses`, `getProgress`, `getStudentAssignments`, `submitQuiz`, `uploadAssignment`, `publicHandler`, `heartbeat`

---

## 10. Managing Students (Cognito)

All student account management is done through the AWS Console → Cognito → User pools → `eu-north-1_jnwEn55p2`.

### Creating a student account

1. AWS Console → Cognito → User pools → select the pool
2. Users → **Create user**
3. Enter their email, set a temporary password, check **Send an invitation**
4. On first login the LMS will prompt them to set a permanent password (handled automatically)

### Making someone an admin

1. AWS Console → Cognito → User pools → Groups → `admins`
2. Add the user to the group
3. They'll see the Admin tab on next login

### Resetting a password

1. Find the user in Cognito → User pools → Users
2. Click the user → **Reset password**

---

## 11. Environment Variables

### LMS (frontend/) — set in the `stepsmart-backend-lyart` Vercel project

| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | `https://6osmrsvdtg.execute-api.eu-north-1.amazonaws.com/prod` |

The Cognito settings (`userPoolId`, `userPoolClientId`) are hardcoded in `frontend/src/config/aws-config.js` — they are safe to commit (no secrets, public client).

### Landing (landing/) — set in the landing Vercel project

| Variable | Purpose |
|----------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase project credentials |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase project credentials |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project credentials |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase project credentials |
| `VITE_FIREBASE_SENDER_ID` | Firebase project credentials |
| `VITE_FIREBASE_APP_ID` | Firebase project credentials |

Get these from the Firebase Console → Project Settings → Your apps → Web app config. Or ask Ankit — he has the existing values.

### Backend (Lambda) — set per-function in AWS Console

| Variable | Default | Purpose |
|----------|---------|---------|
| `PROGRESS_TABLE` | `lms-progress` | DynamoDB table name |
| `FRONTEND_URL` | `https://stepsmart.net` | CORS allowed origin |
| `AWS_REGION` | `eu-north-1` | AWS region |

These are set in AWS Console → Lambda → select function → Configuration → Environment variables.
