import { useEffect, useRef, useState } from 'react'
import Orb from '../components/Orb.jsx'
const asks = [['Tailor my resume', 'resume'], ['Practice an interview', 'interview'], ['Check my progress', 'progress'], ['Find a course', 'courses']]
const lines = ['What role are you aiming for?', 'Which resume should we sharpen?', 'Ready to rehearse an interview?', 'How is your practice going?', 'Looking for a course to learn next?']
const SPOKEN = 'Practice a Google interview' // demo: what the "voice" hears
export default function Landing({ go }) {
  const [q, setQ] = useState('')
  const room = useRef(null), pond = useRef(null), timers = useRef([])
  const [i, setI] = useState(0)
  const [voice, setVoice] = useState('idle') // idle | listening | typing
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % lines.length), 3200); return () => clearInterval(t) }, [])
  useEffect(() => () => timers.current.forEach((t) => { clearTimeout(t); clearInterval(t) }), [])
  useEffect(() => {
    const el = pond.current; let tx = 0.5, ty = 0.5, x = 0.5, y = 0.5, raf
    const move = (e) => { const r = el.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height }
    const loop = () => { x += (tx - x) * 0.08; y += (ty - y) * 0.08; el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%'); el.style.setProperty('--px', (x - 0.5) * -2); el.style.setProperty('--py', (y - 0.5) * -2); raf = requestAnimationFrame(loop) }
    addEventListener('pointermove', move); raf = requestAnimationFrame(loop)
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
  const route = (text) => { const s = text.toLowerCase(); go(/resume|cv/.test(s) ? 'resume' : /interview/.test(s) ? 'interview' : /hack/.test(s) ? 'hackathons' : /leet|code|progress/.test(s) ? 'progress' : 'courses') }
  const send = () => route(q)
  const key = (e) => { if (e.key === 'Enter') send(); if (e.key === 'Escape') setQ('') }

  // demo voice request: listen for a moment, "transcribe" it into the bar, then navigate
  const listen = () => {
    if (voice !== 'idle') return
    setQ(''); setVoice('listening')
    timers.current.push(setTimeout(() => {
      setVoice('typing'); let n = 0
      const t = setInterval(() => {
        n++; setQ(SPOKEN.slice(0, n))
        if (n >= SPOKEN.length) { clearInterval(t); setVoice('idle'); timers.current.push(setTimeout(() => route(SPOKEN), 700)) }
      }, 38)
      timers.current.push(t)
    }, 2400))
  }

  return (
    <section className="pond" ref={pond}>
      <div className="pond-in" ref={room}>
        <h1 aria-live="off"><span key={i}>{lines[i]}</span></h1>
        <div className="ask">
          <div className="ask-top">
            <button className="orbtn" onClick={listen} aria-label="Speak your request" title="Speak your request">
              <Orb size={21} state={voice === 'listening' ? 'listening' : 'idle'} palette="koi" />
            </button>
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={key} placeholder={voice === 'listening' ? 'Listening…' : 'Start typing, or tap the orb and speak…'} aria-label="Ask Ark" autoFocus />
          </div>
          <div className="ask-foot">
            <span className="hint">{voice === 'listening' ? 'Listening…' : 'esc clear · ↵ ask · tap the orb to speak'}</span>
            <button onClick={send} aria-label="Ask">↑</button>
          </div>
        </div>
        <div className="chips">{asks.map(([t, p]) => <button key={p} onClick={() => go(p)}>{t}</button>)}</div>
      </div>
    </section>
  )
}
