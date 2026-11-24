import { useMemo, useState } from 'react'
// contour mountain: stacked noisy rings, painted bottom-up so upper rings occlude lower ones
const N = 16
const LEETCODE = 'https://leetcode.com/' // demo: every pin opens the LeetCode home page for now
function ring(i, cx, base, R) {
  const t = i / N, r = R * Math.pow(1 - t, 0.85), lift = Math.pow(t, 0.8) * 250, pts = []
  for (let a = 0; a < 64; a++) {
    const th = (a / 64) * Math.PI * 2
    const n = 1 + 0.09 * Math.sin(th * 3 + i * 0.7) + 0.05 * Math.sin(th * 7 - i)
    pts.push([cx + Math.cos(th) * r * n, base - lift + Math.sin(th) * r * 0.3 * n])
  }
  return 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join('L') + 'Z'
}
const P = [
  ['S', 150, 330, 'var(--bone)', 'Start · Arrays & hashing'], ['C', 250, 245, 'var(--sage)', 'Core · Two pointers'],
  ['F', 520, 340, 'var(--bone)', 'Fork · Binary search'], ['H', 440, 255, 'var(--moss)', 'Hill · Trees'],
  ['L', 590, 245, 'var(--koi)', 'Ledge · Graphs'], ['T', 400, 70, 'var(--bone)', 'Top · System design'],
]
export default function Mountain({ pins = true, route = true, compact = false, fit = false, interactive = false }) {
  const rings = useMemo(() => Array.from({ length: N + 1 }, (_, i) => ring(i, 400, 330, 330)), [])
  const [hov, setHov] = useState(null)
  const vb = fit ? '8 -16 784 472' : compact ? '90 40 620 340' : '0 20 800 380'
  const tip = hov !== null && P[hov]
  const tw = tip ? tip[4].length * 6.6 + 24 : 0
  const tx = tip ? (tip[1] + 22 + tw > 780 ? tip[1] - 22 - tw : tip[1] + 22) : 0
  return (
    <svg className={'mtn' + (fit ? ' fit' : '')} viewBox={vb} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Career route up a contour mountain">
      <ellipse cx="400" cy="335" rx="360" ry="112" className="dial" />
      <ellipse cx="400" cy="335" rx="342" ry="100" className="dial2" />
      <g className="rings">{rings.map((d, i) => <path key={i} d={d} />)}</g>
      {route && <path className="route" d="M150 330 C 220 300, 230 250, 290 232 S 330 150, 365 120 S 395 90, 400 72" />}
      {route && <path className="route r2" d="M520 340 C 470 320, 480 270, 450 250 S 410 150, 400 72" />}
      {pins && P.map(([l, x, y, c, name], i) => {
        const body = (
          <>
            <line x1={x} y1={y} x2={x} y2={y - 48} stroke={c} strokeWidth="1.5" />
            <g className="pdot"><circle cx={x} cy={y - 60} r="13" fill={c} /><text x={x} y={y - 55} textAnchor="middle">{l}</text></g>
          </>
        )
        return (
          <g key={l} className="pin" style={{ animationDelay: i * 0.12 + 's' }}>
            {interactive ? (
              <a href={LEETCODE} target="_blank" rel="noopener noreferrer" aria-label={name + ' (opens LeetCode)'}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} onFocus={() => setHov(i)} onBlur={() => setHov(null)}>{body}</a>
            ) : body}
          </g>
        )
      })}
      {tip && (
        <g className="tip" pointerEvents="none">
          <rect x={tx} y={tip[2] - 74} width={tw} height="26" rx="7" />
          <text x={tx + tw / 2} y={tip[2] - 57} textAnchor="middle">{tip[4]} ↗</text>
        </g>
      )}
    </svg>
  )
}
