import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import cors from 'cors'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'

const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173'
const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001'

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: FRONTEND, credentials: true }))
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,          // set true in production with HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}))
app.use(passport.initialize())
app.use(passport.session())

// ── Passport – Google OAuth 2.0 ──────────────────────────────
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${BACKEND}/api/auth/google/callback`,
}, (_accessToken, _refreshToken, profile, done) => {
  // In production, look up / create a DB user here.
  // For now we just pass the profile through.
  const user = {
    id: profile.id,
    name: profile.displayName,
    email: profile.emails?.[0]?.value,
    avatar: profile.photos?.[0]?.value,
  }
  done(null, user)
}))

// ── Passport – GitHub OAuth ──────────────────────────────────
const githubReady = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)
if (githubReady) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${BACKEND}/api/auth/github/callback`,
    scope: ['user:email'],
  }, (_accessToken, _refreshToken, profile, done) => {
    done(null, {
      id: 'gh-' + profile.id,
      name: profile.displayName || profile.username,
      email: profile.emails?.[0]?.value,
      avatar: profile.photos?.[0]?.value,
    })
  }))
}

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

// ── Auth routes ──────────────────────────────────────────────

// Start Google OAuth flow
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

// Google callback
app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND}/#login` }),
  (_req, res) => res.redirect(`${FRONTEND}/#home`)
)

// Start GitHub OAuth flow
app.get('/api/auth/github', (req, res, next) => {
  if (!githubReady) return res.status(501).send('GitHub login is not configured yet. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to backend/.env')
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next)
})

// GitHub callback
app.get('/api/auth/github/callback', (req, res, next) => {
  if (!githubReady) return res.redirect(`${FRONTEND}/#login`)
  passport.authenticate('github', { failureRedirect: `${FRONTEND}/#login` })(req, res, () => res.redirect(`${FRONTEND}/#home`))
})

// Get current user
app.get('/api/auth/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user })
  } else {
    res.json({ user: null })
  }
})

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid')
      res.json({ ok: true })
    })
  })
})

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓ Ark backend running on ${BACKEND}`)
  console.log(`  Google OAuth callback: ${BACKEND}/api/auth/google/callback`)
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your-client-id-here.apps.googleusercontent.com') {
    console.log('\n⚠  GOOGLE_CLIENT_ID not set — copy .env.example to .env and add your credentials.')
    console.log('   https://console.cloud.google.com/apis/credentials\n')
  }
})
