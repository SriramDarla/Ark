// pixel cat drawn from a character grid, rendered with horizontal scanlines like the reference
const G = [
  '..#....#........',
  '.###..###.......',
  '.############...',
  '.#.##..##.##....',
  '.############...',
  '..##########..#.',
  '..###########.#.',
  '.############.#.',
  '.############.#.',
  '.##############.',
  '..#.##..##.#....',
  '..#.##..##.#....',
]
export default function Cat({ size = 18, blink = true }) {
  const rects = []
  G.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === '#') rects.push(<rect key={x + '-' + y} x={x * size} y={y * size} width={size} height={size - 4} />)
  }))
  const eye = (x) => <rect className={blink ? 'eye' : ''} x={x * size} y={3 * size} width={size} height={size - 4} fill="var(--bg)" />
  return (
    <svg className="cat" viewBox={`0 0 ${16 * size} ${12 * size}`} role="img" aria-label="Pixel cat mascot">
      <g fill="currentColor">{rects}</g>{eye(3)}{eye(8)}
    </svg>
  )
}
