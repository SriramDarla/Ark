import { useMemo, useRef, useState } from 'react'
import { Search, ArrowUpRight, Calendar, MapPin } from 'lucide-react'
import usePond from '../hooks/usePond.js'
import { hackathonMcp } from '../mock/mcp.js'

export default function Hackathons() {
  const pond = useRef(null)
  usePond(pond)
  const { platforms, events } = hackathonMcp
  const [q, setQ] = useState(''), [src, setSrc] = useState('All')
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return events.filter((e) => (src === 'All' || e.platform === src) && (!s || (e.name + ' ' + e.mode + ' ' + e.tags.join(' ')).toLowerCase().includes(s)))
  }, [q, src, events])
  const sources = src === 'All' ? Object.keys(platforms) : [src]

  return (
    <section className="pond pg" ref={pond}>
      <div className="pg-in">
        <header className="pg-head">
          <h1 className="px sm" style={{ color: '#111' }}>FIND HACKATHONS</h1>
          <span className="mcp-badge"><i />{hackathonMcp.server} · Unstop, Devfolio, Devpost</span>
        </header>

        <div className="ask hk-bar">
          <Search size={16} color="#8b8b85" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by theme, city or tech: AI, fintech, Bengaluru…" aria-label="Search hackathons" />
          <div className="seg">
            {['All', ...Object.keys(platforms)].map((p) => <button key={p} className={p === src ? 'on' : ''} onClick={() => setSrc(p)}>{p}</button>)}
          </div>
        </div>

        <div className="toolc solo"><i /><span><b>{hackathonMcp.server}</b> search_events(query="{q}", sources=[{sources.map((s) => `"${s.toLowerCase()}"`).join(', ')}])<em>→ {list.length} events</em></span></div>

        <div className="hgrid">
          {list.map((e) => {
            const p = platforms[e.platform]
            return (
              <a key={e.name} className="ask hk" href={p.url} target="_blank" rel="noopener noreferrer">
                <div className="between">
                  <span className="plat" style={{ background: p.color + '1f', color: p.color }}>{e.platform}</span>
                  <ArrowUpRight size={16} color="#8b8b85" />
                </div>
                <h3>{e.name}</h3>
                <div className="meta"><Calendar size={13} />{e.dates}</div>
                <div className="meta"><MapPin size={13} />{e.mode}</div>
                <div className="hk-foot">
                  <div><small>Prize pool</small><big style={{ color: '#111' }}>{e.prize}</big></div>
                  <span className="left">{e.left}</span>
                </div>
                <div className="tags">{e.tags.map((t) => <span key={t}>{t}</span>)}</div>
              </a>
            )
          })}
          {!list.length && <div className="ask empty">No hackathons match that search. Try another theme or city.</div>}
        </div>
      </div>
    </section>
  )
}
