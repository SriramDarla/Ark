# Ark

Ark is a career-prep web app for students. It brings resume tailoring, voice mock interviews, coding-progress tracking, course recommendations and hackathon discovery into one place, so you stop juggling job portals and a dozen browser tabs.

> **Demo status:** this is a demo build. Only login is real (Google and GitHub OAuth). Every other feature shows scripted, believable outcomes to demonstrate the product vision. See [Roadmap](#roadmap) for what's planned.

## Features

| Route | Page | What it does | Status |
|---|---|---|---|
| `#home` | Landing | Cycling prompt, search bar with a voice orb, quick-action chips | Mock voice |
| `#resume` | Resume | A4 upload (drag, select, or use a sample), job-link analysis, match score, keyword chips, one-tap edits that highlight on the resume, mock download | Mock (file preview is real) |
| `#interview` | Interview | Voice mock interviewer with company search, per-company rounds, questions tailored to company style and weak topics, scored report | Mock |
| `#progress` | Your climb | Stats from coding sites, interactive mastery mountain, weekly chart, recent solves | Mock |
| `#courses` | Courses | Recommendations from resume gaps and interview weak points, plus a searchable course grid | Mock |
| `#hackathons` | Hackathons | Searchable, filterable events across Unstop, Devfolio and Devpost | Mock |
| `#login` | Login | Email form (UI only), Google, GitHub, profile and sign-out view | Real OAuth |

## Tech stack

- **Frontend:** React 18, Vite 5, lucide-react, plain CSS (`src/styles.css`). No router library; pages switch on the URL hash in `src/App.jsx`.
- **Backend:** Node, Express, `express-session`, `passport`, `passport-google-oauth20`, `passport-github2`.
- **Ports:** frontend on `5173`, backend on `3001`. The backend URL is hard-coded in `src/auth.jsx`.

## Getting started

### Frontend

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`.

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in your credentials
npm run dev
```

`.env` variables:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
SESSION_SECRET=
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

OAuth callback URLs:

- `http://localhost:3001/api/auth/google/callback`
- `http://localhost:3001/api/auth/github/callback`

GitHub login shows a "not configured" message until its keys are set. Full OAuth setup steps are in [`backend/README.md`](backend/README.md).

> The app works without the backend, but login won't. Everything else runs on mock data.

## Project structure

```
Ark/
├── backend/            Express server, OAuth (Google, GitHub)
├── src/
│   ├── App.jsx         Hash-based page switching
│   ├── auth.jsx        Auth context (backend URL lives here)
│   ├── styles.css
│   ├── pages/          Landing, Resume, Interview, Progress, Courses, Hackathons, Login
│   ├── mock/           Mock data (see below)
│   └── ...             Sidebar, Orb, Mountain, Cat, Koi, usePond, useSpeech
├── index.html
├── vite.config.js
└── package.json
```

Key pieces:

- **Sidebar:** icon rail with pages at the top, profile and colour orb pinned at the bottom.
- **Orb:** voice orb with `idle`, `listening` and `talking` states and two palettes (blue for the agent, koi for the user). Accepts an optional `getLevel` for real audio volume.
- **Mountain:** contour-map SVG used on the Your climb page.
- **usePond:** mouse-following grid-glow background shared by every page.
- **useSpeech:** interviewer text-to-speech using the browser's built-in voice, with a silent timed animation as fallback.

## How the mock data works

All fake data lives in two places:

- `src/mock/mcp.js`: one block per planned server.
  - `codingMcp`: LeetCode, HackerRank and Codeforces stats and topic mastery
  - `processMcp`: 7 companies with rounds and tips
  - `courseMcp`: courses and resume/interview-based recommendations
  - `hackathonMcp`: events and platform links
  - Interview question banks and mock report scores also sit here.
- `src/mock/resume.js`: the sample resume, the mock job, and the suggested edits.

Swapping mock for real should mostly mean replacing these exports with API calls.

## Roadmap

Planned architecture, not built yet:

- **Three MCP servers**
  - `coding-profiles-mcp`: LeetCode, HackerRank and other competitive-coding data
  - `interview-process-mcp`: company interview rounds and methods
  - `hackathon-finder-mcp`: Unstop, Devfolio and Devpost events

  Their names already appear as "connected" badges and mock tool-call lines in the UI.
- **Voice:** ElevenLabs Agents via the React SDK. A backend signed-URL endpoint keeps the API key off the frontend, and the interviewer's LLM (Grok) connects as a Custom LLM through a thin backend proxy. A global navigator agent could also drive the site through client tools.
- **Still to wire:** real resume parsing and tailoring, real job-link scraping, resume- and interview-driven course recommendations, email/password auth (the form is UI only), and persistence beyond the in-memory session.

## Known limitations

- Demo only: all features except login use mock data.
- The backend URL is hard-coded in `src/auth.jsx`.
- Sessions are in-memory and are lost when the backend restarts.
- The email/password form is UI only.
- Layout is tuned for a full-screen desktop browser (Chrome recommended) and stacks on screens narrower than about 1000px.
- The checked-in `dist/` folder is a stale old build; run `npm run build` to refresh it.

## Design notes

White and beige surfaces with orange, green and blue accents. Silkscreen and JetBrains Mono for display and code text. Every page shares the same animated background.
