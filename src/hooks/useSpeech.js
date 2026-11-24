import { useCallback, useEffect, useRef, useState } from 'react'

// Text-to-speech for the interviewer.
// DEMO: uses the browser's built-in voice and falls back to a silent timed animation.
// LATER: replace the body of speak() with ElevenLabs TTS (stream audio, then feed its volume to `level`).
export default function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const [muted, setMutedState] = useState(false)
  const lvl = useRef(0), pulse = useRef(null), fallback = useRef(null), mutedRef = useRef(false), run = useRef(0)

  const getLevel = useCallback(() => { lvl.current *= 0.88; return lvl.current }, [])

  const stop = useCallback(() => {
    run.current++
    clearInterval(pulse.current); clearTimeout(fallback.current)
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel()
    lvl.current = 0
    setSpeaking(false)
  }, [])

  const speak = useCallback((text) => {
    stop()
    const id = run.current
    const done = () => { if (run.current !== id) return; clearInterval(pulse.current); clearTimeout(fallback.current); lvl.current = 0; setSpeaking(false) }
    setSpeaking(true)
    pulse.current = setInterval(() => { lvl.current = Math.max(lvl.current, 0.3 + Math.random() * 0.4) }, 150)
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
    if (!mutedRef.current && synth && typeof SpeechSynthesisUtterance !== 'undefined') {
      const u = new SpeechSynthesisUtterance(text)
      const vs = synth.getVoices()
      u.voice = vs.find((v) => /en[-_]IN/i.test(v.lang)) || vs.find((v) => /en[-_](US|GB)/i.test(v.lang) && /natural|google|samantha|aria|jenny/i.test(v.name)) || vs.find((v) => /^en/i.test(v.lang)) || null
      u.rate = 1.02
      u.onboundary = () => { lvl.current = 0.65 + Math.random() * 0.35 }
      u.onend = done
      // blocked or failed (e.g. browser autoplay rules): keep the orb animating silently for a natural duration
      u.onerror = () => { if (run.current !== id) return; clearTimeout(fallback.current); fallback.current = setTimeout(done, Math.min(9000, 700 + text.length * 55)) }
      synth.speak(u)
      fallback.current = setTimeout(done, 20000) // safety net
    } else {
      fallback.current = setTimeout(done, Math.min(9000, 700 + text.length * 55))
    }
  }, [stop])

  const setMuted = useCallback((m) => { mutedRef.current = m; setMutedState(m); if (m) stop() }, [stop])
  useEffect(() => () => stop(), [stop])

  return { speaking, muted, setMuted, speak, stop, getLevel }
}
