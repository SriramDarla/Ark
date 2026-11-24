import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, Volume2, VolumeX } from 'lucide-react'
import Orb from '../components/Orb.jsx'
import usePond from '../hooks/usePond.js'
import useSpeech from '../hooks/useSpeech.js'
import { codingMcp, processMcp, weakTopics, questionsFor, REPORT } from '../mock/mcp.js'

const TYPE = { coding: 'Coding', design: 'Design', behavioral: 'Behavioral' }
const clock = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
const firstCoding = (rounds) => Math.max(0, rounds.findIndex((r, i) => i >= 2 && r.type === 'coding'))

export default function Interview() {
  const pond = useRef(null), end = useRef(null), sid = useRef(0)
  usePond(pond)
  const { speaking, muted, setMuted, speak, stop, getLevel } = useSpeech()
  const companies = Object.keys(processMcp.companies)
  const [co, setCo] = useState(companies[0])
  const [ri, setRi] = useState(() => firstCoding(processMcp.companies[companies[0]].rounds))
  const [msgs, setM] = useState([])
  const [qi, setQi] = useState(0)
  const [busy, setBusy] = useState(true)
  const [thinking, setThinking] = useState(false)
  const [listening, setListening] = useState(false)
  const [sec, setSec] = useState(0)
  const [v, setV] = useState('')
  const [find, setFind] = useState('')

  const data = processMcp.companies[co]
  const round = data.rounds[ri]
  const qs = useMemo(() => questionsFor(co, round.type), [co, round.type])
  const done = qi >= qs.length
  const matches = companies.filter((c) => c.toLowerCase().includes(find.trim().toLowerCase()))

  useEffect(() => { const t = setInterval(() => setSec((s) => s + 1), 1000); return () => clearInterval(t) }, [])
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }, [msgs, thinking, listening])

  // start (or restart) a session: show the two MCP calls, then the interviewer opens and asks out loud
  useEffect(() => {
    const s = ++sid.current
    stop()
    setM([]); setQi(0); setSec(0); setBusy(true); setThinking(false); setListening(false); setV('')
    const lc = codingMcp.sites[0].done
    const steps = [
      { tool: true, server: processMcp.server, call: `get_company_rounds("${co}", "SWE")`, out: `${data.rounds.length} rounds found · practising "${round.name}"` },
      { tool: true, server: codingMcp.server, call: 'get_profile_summary()', out: `LeetCode ${lc} solved · weakest: ${weakTopics.map(([t, p]) => `${t} ${p}%`).join(', ')}` },
      { t: `Hi, I'm your ${co} interviewer for the "${round.name}" round. ${round.focus}. I pulled your practice history, so I'll lean on what ${co} tests where you are weakest.` },
      { t: qs[0].q },
    ]
    const ts = steps.map((st, k) => setTimeout(() => {
      if (sid.current !== s) return
      setM((m) => [...m, st])
      if (k === steps.length - 1) { setBusy(false); speak(qs[0].q) }
    }, 650 * (k + 1)))
    return () => ts.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [co, ri])

  const answer = (text) => {
    if (busy || done || !text.trim()) return
    stop()
    const s = sid.current, n = qi + 1
    setBusy(true); setThinking(true); setV('')
    setM((m) => [...m, { me: true, t: text }])
    setTimeout(() => {
      if (sid.current !== s) return
      setThinking(false)
      setM((m) => [...m, { fb: true, t: qs[qi].fb }, ...(n < qs.length ? [{ t: qs[n].q }] : [{ t: 'That was the last question. Your report is ready.' }, { report: true }])])
      setQi(n); setBusy(false)
      if (n < qs.length) speak(qs[n].q)
    }, 1100)
  }
  const talk = () => {
    if (busy || done || listening) return
    stop()
    const s = sid.current
    setListening(true)
    setTimeout(() => { if (sid.current !== s) return; setListening(false); answer(qs[qi].ans) }, 2400)
  }
  const pickCo = (c) => { if (c !== co) { setCo(c); setRi(firstCoding(processMcp.companies[c].rounds)) } }
  const status = listening ? 'Listening to you…' : speaking ? 'Speaking…' : thinking ? 'Thinking…' : busy ? 'Getting ready…' : done ? 'Interview finished' : 'Your turn'

  return (
    <section className="pond pg" ref={pond}>
      <div className="pg-in fixed">
        <header className="pg-head">
          <h1 className="px sm" style={{ color: '#111' }}>MOCK INTERVIEW</h1>
          <span className="mcp-badge"><i />2 MCP servers connected</span>
        </header>

        <div className="ivx">
          <section className="ask chatc">
            <span className="corner"><Orb size={26} state={speaking ? 'talking' : 'idle'} palette="blue" getLevel={getLevel} /></span>
            <header className="chat-hd">
              <div className="agent">
                <div className="who"><b>{co} · {round.name}</b><small>{TYPE[round.type]} round · {round.mins} min · {status}</small></div>
              </div>
              <div className="hd-right">
                <div className="qprog">
                  <small>Question {Math.min(qi + 1, qs.length)} / {qs.length} · {clock(sec)}</small>
                  <div className="bar"><i style={{ width: (Math.min(qi, qs.length) / qs.length) * 100 + '%', background: '#d9573a' }} /></div>
                </div>
                <button className="pbtn sq" onClick={() => setMuted(!muted)} aria-label={muted ? 'Unmute interviewer voice' : 'Mute interviewer voice'} title={muted ? 'Unmute interviewer voice' : 'Mute interviewer voice'}>
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </header>
            <div className="log">
              {msgs.map((m, k) => {
                if (m.tool) return <div key={k} className="toolc"><i /><span><b>{m.server}</b> {m.call}<em>→ {m.out}</em></span></div>
                if (m.report) return (
                  <div key={k} className="rep">
                    <b>Interview report · {co} · {round.name}</b>
                    {REPORT.map(([n, sc]) => (
                      <div className="rrow" key={n}><span>{n}</span><div className="bar"><i style={{ width: sc * 10 + '%', background: sc >= 8 ? '#6aaa3a' : sc >= 7 ? '#e0a43a' : '#d9573a' }} /></div><b>{sc}/10</b></div>
                    ))}
                    <small>Closest to the {co} bar on {weakTopics[0][0].toLowerCase()} after today. Practise cycle detection and say your complexity earlier.</small>
                    {ri + 1 < data.rounds.length && <button className="pbtn dark" onClick={() => setRi(ri + 1)}>Next round: {data.rounds[ri + 1].name}</button>}
                  </div>
                )
                return <div key={k} className={'cm' + (m.me ? ' me' : '') + (m.fb ? ' fb' : '')}>{m.t}</div>
              })}
              {thinking && <div className="cm dots"><span /><span /><span /></div>}
              {listening && <div className="cm me listen"><i /><i /><i /><i /><i /><em>Listening…</em></div>}
              <div ref={end} />
            </div>
            <div className="composer">
              <button className="orbtn" onClick={talk} disabled={busy || done} aria-label="Answer out loud" title="Answer out loud">
                <Orb size={22} state={listening ? 'listening' : 'idle'} palette="koi" />
              </button>
              <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && answer(v)} placeholder={done ? 'Interview finished' : 'Type your answer, or tap the orb and speak'} aria-label="Your answer" disabled={busy || done} />
              <button className="pbtn send" onClick={() => answer(v)} disabled={busy || done} aria-label="Send">↑</button>
            </div>
          </section>

          <aside className="iv-side">
            <div className="ask cx proc">
              <header className="between"><b>Interview process</b><span className="mcp-badge sm"><i />{processMcp.server}</span></header>
              <label className="srch"><Search size={14} color="#8b8b85" /><input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Search companies" aria-label="Search companies" /></label>
              <small className="mono">search_companies("{find}") → {matches.length} {matches.length === 1 ? 'match' : 'matches'}</small>
              <div className="seg">
                {matches.map((c) => <button key={c} className={c === co ? 'on' : ''} onClick={() => pickCo(c)}>{c}</button>)}
                {!matches.length && <small>No company found. Try another name.</small>}
              </div>
              <div className="rounds">
                {data.rounds.map((r, k) => (
                  <button key={r.name} className={'rnd' + (k === ri ? ' on' : '')} onClick={() => setRi(k)}>
                    <span className="n">{k + 1}</span>
                    <span className="t"><b>{r.name}</b><small>{r.focus}</small></span>
                    <small className="mins">{r.mins}m</small>
                  </button>
                ))}
              </div>
              <small className="tipx">{data.tip}</small>
            </div>

            <div className="ask cx">
              <header className="between"><b>Your coding data</b><span className="mcp-badge sm"><i />{codingMcp.server}</span></header>
              <div className="tps">
                {codingMcp.topics.map(([n, p, c]) => (
                  <div key={n} className="trow"><span className="lb">{n}{p < 35 && <em>focus</em>}</span><div className="bar"><i style={{ width: p + '%', background: c }} /></div><b>{p}%</b></div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
