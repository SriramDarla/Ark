import { useEffect, useRef } from 'react'

// Voice orb in the style of the ElevenLabs agent orb: a soft glowing sphere that swells with
// the audio level, plus ripple rings while someone is talking.
//   state:    'idle' | 'listening' (user is speaking) | 'talking' (agent is speaking)
//   palette:  'blue' (agent) | 'koi' (user)
//   getLevel: optional () => 0..1 audio level. Wire a real mic / ElevenLabs output volume here later.
//             Without it, the orb animates a believable fake level (demo mode).
export default function Orb({ size = 48, state = 'idle', palette = 'blue', getLevel }) {
  const el = useRef(null), st = useRef(state), gl = useRef(getLevel)
  st.current = state; gl.current = getLevel

  useEffect(() => {
    let raf, lv = 0
    const t0 = performance.now()
    const loop = (now) => {
      const t = (now - t0) / 1000, s = st.current
      let target
      if (s === 'idle') target = 0.05 + 0.04 * Math.sin(t * 1.6)
      else if (gl.current) target = gl.current()
      else target = 0.42 + 0.3 * Math.sin(t * 8.1) + 0.2 * Math.sin(t * 13.7 + 1.3) + 0.1 * Math.sin(t * 21 + 0.4)
      target = Math.max(0, Math.min(1, target))
      lv += (target - lv) * 0.2
      el.current?.style.setProperty('--lv', lv.toFixed(3))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <span ref={el} className={`orbw ${state} ${palette}`} style={{ '--s': size + 'px' }} aria-hidden="true">
      <i className="rg r1" /><i className="rg r2" />
      <span className="orb2"><i className="b1" /><i className="b2" /><i className="b3" /><i className="hl" /></span>
    </span>
  )
}
