import { useEffect } from 'react'

// shared grid-glow background that follows the mouse (same effect as every other page)
export default function usePond(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let tx = 0.5, ty = 0.5, x = 0.5, y = 0.5, raf
    const move = (e) => { const r = el.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height }
    const loop = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08
      el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%')
      el.style.setProperty('--px', (x - 0.5) * -2); el.style.setProperty('--py', (y - 0.5) * -2)
      raf = requestAnimationFrame(loop)
    }
    addEventListener('pointermove', move); raf = requestAnimationFrame(loop)
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [ref])
}
