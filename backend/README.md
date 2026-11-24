# Ark Backend

Express server handling authentication and (soon) API data for Ark.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Google OAuth credentials
npm run dev
```

## Google OAuth Setup

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create a new **OAuth 2.0 Client ID** (Web application)
3. Set **Authorized redirect URIs** to: `http://localhost:3001/api/auth/google/callback`
4. Copy the **Client ID** and **Client Secret** into your `.env` file

## GitHub OAuth Setup

1. Go to [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers) and create a new OAuth App
2. Set **Authorization callback URL** to: `http://localhost:3001/api/auth/github/callback`
3. Copy the **Client ID** and a generated **Client Secret** into your `.env` file

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/google` | Start Google OAuth flow |
| GET | `/api/auth/google/callback` | OAuth callback (Google redirects here) |
| GET | `/api/auth/github` | Start GitHub OAuth flow |
| GET | `/api/auth/github/callback` | OAuth callback (GitHub redirects here) |
| GET | `/api/auth/me` | Get current logged-in user |
| POST | `/api/auth/logout` | Log out and destroy session |
| GET | `/api/health` | Health check |
