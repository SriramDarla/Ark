import { useEffect, useRef } from 'react'

// Dithered cherry blossom branches + flowers on canvas, gentle breeze sway
// Aesthetic: black halftone dots on light background (matches the reference image)

function rand(min, max) { return min + Math.random() * (max - min) }
function lerp(a, b, t) { return a + (b - a) * t }

// Bezier helpers
function bezierPt(p0, p1, p2, p3, t) {
  const u = 1 - t
  return {
    x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
    y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y,
  }
}

function generateBranches(W, H) {
  const branches = []
  // Main branches from right edge, curving left
  const origins = [
    { x: W + 10, y: H * 0.08 },
    { x: W + 10, y: H * 0.22 },
    { x: W * 0.92, y: -10 },
    { x: W + 10, y: H * 0.55 },
    { x: W + 10, y: H * 0.72 },
    { x: W * 0.85, y: H + 10 },
    { x: W + 10, y: H * 0.9 },
  ]

  for (const origin of origins) {
    const reach = W * rand(0.2, 0.5)
    const p0 = origin
    const p3 = { x: origin.x - reach, y: origin.y + rand(-H * 0.15, H * 0.15) }
    const p1 = { x: lerp(p0.x, p3.x, 0.33) + rand(-40, 40), y: lerp(p0.y, p3.y, 0.33) + rand(-60, 60) }
    const p2 = { x: lerp(p0.x, p3.x, 0.66) + rand(-40, 40), y: lerp(p0.y, p3.y, 0.66) + rand(-60, 60) }
    branches.push({ p0, p1, p2, p3, thickness: rand(3, 7) })

    // Sub-branches
    const subCount = Math.floor(rand(2, 5))
    for (let s = 0; s < subCount; s++) {
      const bt = rand(0.2, 0.85)
      const bp = bezierPt(p0, p1, p2, p3, bt)
      const subReach = reach * rand(0.25, 0.55)
      const sp3 = { x: bp.x - rand(subReach * 0.3, subReach), y: bp.y + rand(-subReach * 0.7, subReach * 0.7) }
      const sp1 = { x: lerp(bp.x, sp3.x, 0.4) + rand(-25, 25), y: lerp(bp.y, sp3.y, 0.4) + rand(-35, 35) }
      const sp2 = { x: lerp(bp.x, sp3.x, 0.7) + rand(-20, 20), y: lerp(bp.y, sp3.y, 0.7) + rand(-25, 25) }
      branches.push({ p0: bp, p1: sp1, p2: sp2, p3: sp3, thickness: rand(1.5, 3.5) })

      // Tiny twigs from sub-branches
      if (Math.random() > 0.4) {
        const tt = rand(0.5, 0.95)
        const tp = bezierPt(bp, sp1, sp2, sp3, tt)
        const twigEnd = { x: tp.x + rand(-50, -10), y: tp.y + rand(-50, 50) }
        const tc1 = { x: lerp(tp.x, twigEnd.x, 0.5) + rand(-15, 15), y: lerp(tp.y, twigEnd.y, 0.5) + rand(-15, 15) }
        branches.push({ p0: tp, p1: tc1, p2: tc1, p3: twigEnd, thickness: rand(0.8, 2) })
      }
    }
  }
  return branches
}

function generateFlowers(branches, W, H) {
  const flowers = []
  for (const br of branches) {
    // Flowers along branch and at tips
    const count = br.thickness > 3 ? Math.floor(rand(3, 7)) : Math.floor(rand(1, 4))
    for (let i = 0; i < count; i++) {
      const t = rand(0.3, 1.0)
      const pt = bezierPt(br.p0, br.p1, br.p2, br.p3, t)
      // Skip if outside canvas
      if (pt.x < -30 || pt.x > W + 30 || pt.y < -30 || pt.y > H + 30) continue
      const r = rand(8, 22)
      flowers.push({ x: pt.x + rand(-8, 8), y: pt.y + rand(-8, 8), r, petals: 5, rot: rand(0, Math.PI * 2) })
    }
    // Extra flower at tip
    if (Math.random() > 0.3) {
      const tip = br.p3
      if (tip.x > -30 && tip.x < W + 30 && tip.y > -30 && tip.y < H + 30) {
        flowers.push({ x: tip.x, y: tip.y, r: rand(12, 26), petals: 5, rot: rand(0, Math.PI * 2) })
      }
    }
  }
  return flowers
}

function buildDotField(branches, flowers, W, H) {
  const step = 4 // dot grid spacing
  const dots = []

  // Sample distance field for branches
  function branchDensity(px, py) {
    let minDist = Infinity
    for (const br of branches) {
      // Sample bezier at intervals
      for (let t = 0; t <= 1; t += 0.02) {
        const pt = bezierPt(br.p0, br.p1, br.p2, br.p3, t)
        const d = Math.hypot(px - pt.x, py - pt.y)
        const thickHere = br.thickness * (1 - t * 0.3)
        const dist = d - thickHere
        if (dist < minDist) minDist = dist
      }
    }
    return minDist
  }

  // Petal shape distance
  function flowerDensity(px, py) {
    let minDist = Infinity
    for (const fl of flowers) {
      const dx = px - fl.x, dy = py - fl.y
      const dist = Math.hypot(dx, dy)
      // Petal lobes
      const angle = Math.atan2(dy, dx)
      for (let p = 0; p < fl.petals; p++) {
        const pa = fl.rot + (p / fl.petals) * Math.PI * 2
        const petalCx = fl.x + Math.cos(pa) * fl.r * 0.55
        const petalCy = fl.y + Math.sin(pa) * fl.r * 0.55
        const pd = Math.hypot(px - petalCx, py - petalCy) - fl.r * 0.45
        if (pd < minDist) minDist = pd
      }
      // Center
      const cd = dist - fl.r * 0.18
      if (cd < minDist) minDist = cd
    }
    return minDist
  }

  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const bd = branchDensity(x, y)
      const fd = flowerDensity(x, y)
      const md = Math.min(bd, fd)

      // Dithering: closer = higher probability of dot
      let prob = 0
      if (md < 0) {
        prob = 0.92 // solid core
      } else if (md < 4) {
        prob = 0.75
      } else if (md < 8) {
        prob = 0.5
      } else if (md < 14) {
        prob = 0.28
      } else if (md < 22) {
        prob = 0.12
      } else if (md < 32) {
        prob = 0.04
      }

      if (prob > 0 && Math.random() < prob) {
        // Dot size varies with density
        const size = md < 0 ? rand(2.0, 3.2) : md < 8 ? rand(1.4, 2.5) : rand(0.8, 1.8)
        dots.push({ x, y, size, depth: Math.random() })
      }
    }
  }
  return dots
}

export default function Flowers({ avoid }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2)
    let W, H, raf, dots, needRebuild = true

    const fit = () => {
      W = c.offsetWidth; H = c.offsetHeight
      c.width = W * dpr; c.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      needRebuild = true
    }
    fit(); addEventListener('resize', fit)

    const still = matchMedia('(prefers-reduced-motion: reduce)').matches

    const tick = (t) => {
      if (needRebuild) {
        const branches = generateBranches(W, H)
        const flowers = generateFlowers(branches, W, H)
        dots = buildDotField(branches, flowers, W, H)
        needRebuild = false
      }
      ctx.clearRect(0, 0, W, H)

      // Very subtle breeze – dots sway gently
      const breezeT = t / 4000
      for (const dot of dots) {
        // Sway based on position (higher = more sway, like tree tops)
        const heightFactor = 1 - dot.y / H // top of screen sways more
        const depthPhase = dot.depth * 2
        const swayX = Math.sin(breezeT + dot.y * 0.003 + depthPhase) * (1.5 + heightFactor * 2.5)
        const swayY = Math.cos(breezeT * 0.7 + dot.x * 0.002 + depthPhase) * (0.6 + heightFactor * 1.0)

        const dx = still ? 0 : swayX
        const dy = still ? 0 : swayY

        ctx.globalAlpha = 0.82 + dot.depth * 0.18
        ctx.fillStyle = '#222'
        ctx.beginPath()
        ctx.arc(dot.x + dx, dot.y + dy, dot.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', fit) }
  }, [avoid])
  return <canvas ref={ref} className="koi" aria-hidden="true" />
}
