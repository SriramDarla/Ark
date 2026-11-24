import { useMemo, useRef, useState } from 'react'
import { Search, ArrowUpRight, FileText, Mic } from 'lucide-react'
import usePond from '../hooks/usePond.js'
import { courseMcp } from '../mock/mcp.js'

const COLOR = { Udemy: '#d9573a', Coursera: '#566a94' }
const url = (c) => c.platform === 'Udemy' ? 'https://www.udemy.com/courses/search/?q=' + encodeURIComponent(c.q) : 'https://www.coursera.org/search?query=' + encodeURIComponent(c.q)

export default function Courses() {
  const pond = useRef(null)
  usePond(pond)
  const { resume, interviews, courses } = courseMcp
  const byId = useMemo(() => Object.fromEntries(courses.map((c) => [c.id, c])), [courses])
  const recommended = useMemo(() => new Set([...resume.gaps.map((g) => g[1]), ...interviews.map((w) => w.course)]), [resume, interviews])
  const [q, setQ] = useState(''), [f, setF] = useState('All')
  const list = courses.filter((c) => (f === 'All' || c.platform === f) && (!q.trim() || c.title.toLowerCase().includes(q.trim().toLowerCase())))

  const Row = ({ id, why }) => {
    const c = byId[id]
    return (
      <a className="recrow" href={url(c)} target="_blank" rel="noopener noreferrer">
        <span className="rt"><b>{c.title}</b><small>{c.platform} · {why}</small></span>
        <ArrowUpRight size={16} color="#8b8b85" />
      </a>
    )
  }

  return (
    <section className="pond pg" ref={pond}>
      <div className="pg-in">
        <header className="pg-head">
          <h1 className="px sm" style={{ color: '#111' }}>COURSES</h1>
          <span className="mcp-badge"><i />Recommendations · demo data</span>
        </header>

        <div className="crow">
          <div className="ask rec">
            <header className="between"><b className="ttl"><FileText size={16} /> Based on your resume</b><span className="chip soft">Target: {resume.role}</span></header>
            <div className="skl"><small>Skills found</small><div className="tags ok">{resume.skills.map((s) => <span key={s}>{s}</span>)}</div></div>
            <div className="skl"><small>Gaps for this role</small><div className="tags gap">{resume.gaps.map(([s]) => <span key={s}>{s}</span>)}</div></div>
            <div className="recs">{resume.gaps.map(([s, id]) => <Row key={id} id={id} why={'Fills gap: ' + s} />)}</div>
          </div>

          <div className="ask rec">
            <header className="between"><b className="ttl"><Mic size={16} /> Based on your mock interviews</b><span className="chip soft">Last 3 sessions</span></header>
            <div className="weak">
              {interviews.map((w) => (
                <div key={w.topic} className="wk">
                  <div className="between"><b>{w.topic}</b><span className="chip bad">{w.score}</span></div>
                  <div className="bar"><i style={{ width: w.pct + '%', background: '#d9573a' }} /></div>
                  <small>{w.note}</small>
                  <Row id={w.course} why={'Recommended for ' + w.topic.toLowerCase()} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ask hk-bar">
          <Search size={16} color="#8b8b85" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search all courses" aria-label="Search courses" />
          <div className="seg">{['All', 'Udemy', 'Coursera'].map((p) => <button key={p} className={p === f ? 'on' : ''} onClick={() => setF(p)}>{p}</button>)}</div>
        </div>

        <div className="hgrid">
          {list.map((c) => (
            <a key={c.id} className="ask hk" href={url(c)} target="_blank" rel="noopener noreferrer">
              <div className="between">
                <span className="plat" style={{ background: COLOR[c.platform] + '1f', color: COLOR[c.platform] }}>{c.platform}</span>
                {recommended.has(c.id) ? <span className="left">Recommended</span> : <ArrowUpRight size={16} color="#8b8b85" />}
              </div>
              <h3>{c.title}</h3>
              <div className="meta">{c.level} · {c.hours} hours</div>
              <div className="hk-foot" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                <div className="bar"><i style={{ width: c.progress + '%', background: c.progress === 100 ? '#6aaa3a' : '#2a2a2a' }} /></div>
                <small>{c.progress === 100 ? 'Completed' : c.progress ? c.progress + '% done' : 'Not started'}</small>
              </div>
            </a>
          ))}
          {!list.length && <div className="ask empty">No courses match that search.</div>}
        </div>
      </div>
    </section>
  )
}
