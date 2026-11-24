import { useRef, useState, useEffect } from 'react'
import { useAuth, API_URL } from '../auth.jsx'


const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.998 23.998 0 000 24c0 3.77.9 7.35 2.56 10.57l7.97-5.98z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.98C6.51 42.62 14.62 48 24 48z"/></svg>
)
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="#111" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
)
function OAuthButton({ onClick, icon: Icon, children }) {
  return (
    <button type="button" onClick={onClick} className="oauth">
      <Icon />
      <span>{children}</span>
    </button>
  )
}

export default function Login({ go }) {
  const { user, logout } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [name, setName] = useState('')
  const pond = useRef(null)

  useEffect(() => {
    const el = pond.current; let tx = 0.5, ty = 0.5, x = 0.5, y = 0.5, raf
    const move = (e) => { const r = el.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height }
    const loop = () => { x += (tx - x) * 0.08; y += (ty - y) * 0.08; el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%'); el.style.setProperty('--px', (x - 0.5) * -2); el.style.setProperty('--py', (y - 0.5) * -2); raf = requestAnimationFrame(loop) }
    addEventListener('pointermove', move); raf = requestAnimationFrame(loop)
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])

  const submit = (e) => { e.preventDefault(); go('home') }
  const oauth = (provider) => { window.location.href = `${API_URL}/api/auth/${provider}` }

  // If already logged in, show profile
  if (user) {
    return (
      <section className="pond" ref={pond}>
        <div className="pond-in" style={{ maxWidth: 400 }}>
          <div className="ask" style={{ alignItems: 'center', textAlign: 'center', gap: 16, padding: '32px 22px' }}>
            {user.avatar && <img src={user.avatar} alt="" style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #ededea' }} referrerPolicy="no-referrer" />}
            <h2 style={{ margin: 0, color: '#111', fontSize: 20 }}>{user.name}</h2>
            <p style={{ margin: 0, color: '#8b8b85', fontSize: 13 }}>{user.email}</p>
            <button onClick={logout} style={{ width: '100%', padding: '12px', border: '1px solid #deded8', borderRadius: 8, background: '#fff', color: '#111', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 8 }}>
              Sign out
            </button>
            <button onClick={() => go('home')} style={{ width: '100%', padding: '12px', border: 0, borderRadius: 8, background: '#2a2a2a', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Go to dashboard
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pond" ref={pond}>
      <div className="pond-in" style={{ maxWidth: 400 }}>
        <h1 style={{ font: "400 clamp(24px,3.4vw,38px)/1.2 'Helvetica Neue',Helvetica,Arial,sans-serif", letterSpacing: '-.02em', margin: '0 0 8px', color: '#111' }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ color: '#8b8b85', margin: '0 0 28px', fontSize: 14 }}>
          {mode === 'login' ? 'Sign in to continue your climb.' : 'Start your journey with Ark.'}
        </p>

        {/* OAuth buttons */}
        <div style={{ display: 'grid', gap: 10 }}>
          <OAuthButton onClick={() => oauth('google')} icon={GoogleIcon}>Continue with Google</OAuthButton>
          <OAuthButton onClick={() => oauth('github')} icon={GithubIcon}>Continue with GitHub</OAuthButton>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', color: '#ccc' }}>
          <div style={{ flex: 1, height: 1, background: '#deded8' }} />
          <span style={{ fontSize: 12, color: '#8b8b85' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#deded8' }} />
        </div>

        <form className="ask" onSubmit={submit} style={{ gap: 0 }}>
          {mode === 'signup' && (
            <div style={{ padding: '14px 0', borderBottom: '1px solid #ededea' }}>
              <label style={{ fontSize: 11, color: '#8b8b85', display: 'block', marginBottom: 4 }}>Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" aria-label="Full name" style={{ border: 0, background: 'none', outline: 0, color: '#111', width: '100%', fontSize: 15 }} />
            </div>
          )}
          <div style={{ padding: '14px 0', borderBottom: '1px solid #ededea' }}>
            <label style={{ fontSize: 11, color: '#8b8b85', display: 'block', marginBottom: 4 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email" style={{ border: 0, background: 'none', outline: 0, color: '#111', width: '100%', fontSize: 15 }} />
          </div>
          <div style={{ padding: '14px 0' }}>
            <label style={{ fontSize: 11, color: '#8b8b85', display: 'block', marginBottom: 4 }}>Password</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" aria-label="Password" style={{ border: 0, background: 'none', outline: 0, color: '#111', width: '100%', fontSize: 15 }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', border: 0, borderRadius: 8, background: '#2a2a2a', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 6 }}>
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: '#8b8b85' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ background: 'none', border: 0, color: '#111', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', font: 'inherit', padding: 0 }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </section>
  )
}
