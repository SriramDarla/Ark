import { useRef } from 'react'
import Mountain from '../components/Mountain.jsx'
import usePond from '../hooks/usePond.js'
import { codingMcp } from '../mock/mcp.js'

const DIFF = { Easy: '#6aaa3a', Medium: '#e0a43a', Hard: '#d9573a' }

export default function Progress() {
  const pond = useRef(null)
  usePond(pond)
  const { sites, topics, weekly, recent } = codingMcp
  const peak = Math.max(...weekly)
  return (
    <section className="pond pg" ref={pond}>
      <div className="pg-in">
        <header className="pg-head">
          <h1 className="px sm" style={{ color: '#111' }}>YOUR CLIMB</h1>
          <span className="mcp-badge"><i />{codingMcp.server} · synced just now</span>
        </header>

        <div className="pgrid">
          <div className="ask cx accent">
            <small>Today's focus</small>
            <big>1.8<em>/ 6h</em></big>
            <div className="bar"><i style={{ width: '30%' }} /></div>
          </div>
          {sites.map((s) => (
            <div className="ask cx" key={s.name}>
              <small>{s.name} · {s.label}</small>
              <big style={{ color: '#111' }}>{s.done}<em>/ {s.total}</em></big>
              <div className="bar"><i style={{ width: (s.done / s.total) * 100 + '%', background: s.color }} /></div>
              <button className="pbtn ghost">Sync</button>
            </div>
          ))}

          <div className="ask mtn-card s3">
            <header className="between"><b>Mastery route</b><span className="hint">Arrays → Graphs → System design · click a peak to practise on LeetCode</span></header>
            <div className="mtn-wrap"><Mountain fit interactive /></div>
            <div className="topics">
              {topics.map(([n, p, c]) => <span className="tp" key={n}><i style={{ background: c }} />{n} <b>{p}%</b></span>)}
            </div>
          </div>

          <div className="stack">
            <div className="ask cx">
              <small>Problems per week</small>
              <div className="bars2">
                {weekly.map((h, i) => (
                  <div key={i} className="col"><i style={{ height: (h / peak) * 100 + '%', background: h === peak ? '#d9573a' : '#deded8' }} /><span>W{i + 1}</span></div>
                ))}
              </div>
            </div>
            <div className="ask cx center">
              <div className="pring" style={{ '--p': 74 }}><b>7.4</b><small>consistency</small></div>
            </div>
          </div>

          <div className="ask cx beige s2">
            <small>Next on your route</small>
            <big style={{ color: '#111' }}>Graph BFS<em>10 problems</em></big>
            <a href="#courses" className="pbtn dark">Find a course</a>
          </div>
          <div className="ask cx s2">
            <small>Recent solves</small>
            <ul className="solves">
              {recent.map(([n, d, site, t]) => (
                <li key={n}><span className="nm">{n}<small>{site}</small></span><span className="chip" style={{ background: DIFF[d] + '22', color: DIFF[d] }}>{d}</span><small>{t}</small></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
