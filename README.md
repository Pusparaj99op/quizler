# Quizler

A quiz platform for a college: departments run courses, faculty author and publish quizzes to
their courses, students take them in a timed runner, and everything is graded automatically.

Built with **Next.js 16 (App Router) + React 19**, **MongoDB via Mongoose**, **Auth.js v5**
(credentials, JWT sessions) and **Tailwind CSS v4**. Deploys to **Vercel** as-is.

## The college model

```
Department  ->  Course  ->  enrolled students + assigned faculty
                  |
                  +-> Quiz (draft | published | closed)  ->  Attempt per student
```

- A quiz belongs to a course, so publishing it makes it visible to everyone enrolled.
- A published quiz also carries a **join code**, so a student can join one that is not tied to
  their enrolments.
- Attempts are capped per quiz (`maxAttempts`) and bounded by a duration and an optional
  open/close window.

## Roles

| Role | Can do |
| --- | --- |
| **student** | See available quizzes, join by code, take a quiz, review past attempts and results |
| **faculty** | Everything a student can, plus author/publish/close quizzes, view per-quiz results and export CSV |
| **admin** | Everything above, plus approve or suspend users, change roles, manage departments and courses, enrol students, force-close any quiz |

New registrations land in `pending` and must be approved by an admin at `/admin/users`.
Registration can be restricted to a single email domain via `ALLOWED_EMAIL_DOMAIN`.

## Local setup

```bash
npm install
cp .env.example .env.local     # then fill in MONGODB_URI and AUTH_SECRET
npx auth secret                # generates AUTH_SECRET
npm run seed                   # optional: demo departments, courses, users and a quiz
npm run dev
```

Open http://localhost:3000. `npm run seed` prints the accounts it created; they all share
`SEED_DEMO_PASSWORD` (falling back to `SEED_ADMIN_PASSWORD`).

MongoDB can be a local `mongod` or a MongoDB Atlas cluster — set `MONGODB_URI` accordingly.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm test` | Vitest (scoring rules) |
| `npm run seed` | Seed demo data into `MONGODB_URI` |

## Deploying to Vercel

1. Push the repo to GitHub and import it at [vercel.com/new](https://vercel.com/new) — the
   Next.js preset needs no extra configuration.
2. Add `MONGODB_URI`, `AUTH_SECRET`, `NEXTAUTH_URL` (your production domain) and
   `ALLOWED_EMAIL_DOMAIN` under Project Settings → Environment Variables, for Production,
   Preview and Development.
3. In MongoDB Atlas, allow access from Vercel under Network Access (`0.0.0.0/0`, or install
   the Atlas integration from the Vercel Marketplace).
4. Seed the production database once from your machine with `MONGODB_URI` pointed at Atlas,
   or register the first account and promote it to `admin` directly in the database.

Everything runs on the Node.js runtime (Mongoose cannot run on the edge). The connection is
cached on `globalThis` in `src/lib/db.ts` so warm serverless invocations reuse one pool.

## Layout

```
src/
  app/(auth)/        login, register
  app/(app)/         dashboard, quiz runner, results, faculty area, admin panel
  app/api/           Auth.js route, per-quiz results CSV export
  actions/           server actions: auth, quiz authoring, attempts, admin
  models/            Mongoose schemas: user, department, course, quiz, attempt
  lib/               db connection, guards, scoring, quiz windows, zod validation
  components/        layout shell, quiz editor, quiz runner UI, shared primitives
  proxy.ts           route protection (Next 16's renamed middleware)
scripts/seed.ts      demo data
```

Authorization is enforced server-side in `src/lib/guards.ts` on every page and action;
`src/proxy.ts` is only a fast redirect, not a security boundary.
