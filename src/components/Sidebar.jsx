import { Mountain, FileText, Mic, TrendingUp, BookOpen, Trophy, User } from 'lucide-react'
const items = [
  ['home', Mountain, 'Base camp'], ['resume', FileText, 'Resume tailor'], ['interview', Mic, 'Mock interview'],
  ['progress', TrendingUp, 'Progress'], ['courses', BookOpen, 'Courses'], ['hackathons', Trophy, 'Hackathons'],
]
export default function Sidebar({ page }) {
  return (
    <nav className="rail" aria-label="Main">
      <div className="rtop">
        <a href="#home" className="logo" aria-label="Ark"><span /></a>
        {items.map(([id, Icon, label]) => (
          <a key={id} href={'#' + id} className={'rb' + (page === id ? ' on' : '')} aria-label={label} title={label}><Icon size={10} /></a>
        ))}
      </div>
      <span className="grow" />
      <a href="#login" className="rb" aria-label="Profile" title="Profile"><User size={10} /></a>
      <span className="orb" />
    </nav>
  )
}
