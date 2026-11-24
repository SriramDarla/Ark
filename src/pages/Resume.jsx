import { useRef, useState, useEffect } from 'react'
import { Link2, Check, Download } from 'lucide-react'
import usePond from '../hooks/usePond.js'
import { job, resume, suggestions, sampleLink } from '../mock/resume.js'

const BASE = 58, STEP = 11, STEPS = ['Reading the job posting…', 'Matching it against your resume…', 'Writing suggestions…']

function Mark({ on, children }) { return on ? <mark className="tl">{children}</mark> : children }

function SampleResume({ ap }) {
  return (
    <div className="sres">
      <h2>{resume.name}</h2>
      <p className="ct">{resume.contact}</p>
      <h4>Summary</h4>
      <p><Mark on={ap.has('summary')}>{resume.summary[ap.has('summary') ? 1 : 0]}</Mark></p>
      <h4>Experience</h4>
      {resume.jobs.map((j) => (
        <div key={j.org}>
          <p className="rl"><b>{j.role}</b>, {j.org}<span>{j.when}</span></p>
          <ul>{j.bullets.map(([a, b], k) => <li key={k}>{b ? <Mark on={ap.has('bullet')}>{ap.has('bullet') ? b : a}</Mark> : a}</li>)}</ul>
        </div>
      ))}
      <h4>Projects</h4>
      <p><b>{resume.project.name}</b>: {resume.project.text}</p>
      <h4>Skills</h4>
      <p><Mark on={ap.has('skills')}>{resume.skills[0][ap.has('skills') ? 1 : 0]}</Mark></p>
      <h4>Education</h4>
      <p>{resume.education}</p>
    </div>
  )
}

export default function Resume() {
  const pond = useRef(null), pick = useRef(null)
  usePond(pond)
  const [file, setFile] = useState(null), [url, setUrl] = useState(''), [over, setOver] = useState(false), [link, setLink] = useState('')
  const [sample, setSample] = useState(false)
  const [stage, setStage] = useState('idle'), [step, setStep] = useState(0)
  const [ap, setAp] = useState(new Set()), [saved, setSaved] = useState(false)
  const timers = useRef([])

  useEffect(() => () => { if (url) URL.revokeObjectURL(url) }, [url])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const take = (f) => {
    if (!f) return
    setFile(f); setSample(false)
    setUrl(/pdf|image/.test(f.type) ? URL.createObjectURL(f) : '')
  }
  const drop = (e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files?.[0]) }
  const openPicker = (e) => { e?.stopPropagation(); pick.current?.click() }
  const useSample = (e) => { e.stopPropagation(); setSample(true); setFile(null); setUrl('') }

  const analyze = () => {
    if (stage === 'analyzing') return
    if (!link.trim()) setLink(sampleLink)
    if (!file) setSample(true)
    setAp(new Set()); setSaved(false); setStage('analyzing'); setStep(0)
    timers.current.push(setTimeout(() => setStep(1), 800), setTimeout(() => setStep(2), 1600), setTimeout(() => setStage('done'), 2400))
  }
  const toggle = (id) => setAp((s) => { const n = new Set(s); n.add(id); return n })
  const applyAll = () => setAp(new Set(['summary', 'bullet', 'skills']))
  const score = BASE + STEP * ap.size
  const done = stage === 'done'
  const R = 40, C = 2 * Math.PI * R
  const kw = (k) => job.added.includes(k) ? ap.has('skills') : true
  const save = () => { setSaved(true); timers.current.push(setTimeout(() => setSaved(false), 2200)) }
  const showSample = sample && !file

  return (
    <section className="pond rs" ref={pond}>
      <div className="pond-in rs-in">
        <section
          className={'ask a4' + (over ? ' over' : '') + (file || showSample ? ' has' : '')}
          onClick={() => !file && !showSample && openPicker()}
          onDragOver={(e) => { e.preventDefault(); setOver(true) }}
          onDragLeave={() => setOver(false)}
          onDrop={drop}
          role="button" tabIndex={0} aria-label="Drag or select a resume file"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker() } }}
        >
          <button className="plus" onClick={openPicker} aria-label="Select a file" title="Select a file">+</button>
          <input ref={pick} type="file" accept=".pdf,.doc,.docx,.txt,image/*" hidden onChange={(e) => take(e.target.files?.[0])} />
          {file && url && (file.type === 'application/pdf'
            ? <object className="a4-prev" data={url + '#toolbar=0&navpanes=0'} type="application/pdf" aria-label={file.name} />
            : <img className="a4-prev" src={url} alt={file.name} />)}
          {file && !url && <div className="a4-empty"><b>{file.name}</b><span className="hint">preview not available</span></div>}
          {showSample && <SampleResume ap={ap} />}
          {!file && !showSample && (
            <div className="a4-empty">
              <b>Drag or select a file</b><span className="hint">PDF, DOCX or image</span>
              <button className="pbtn ghost" onClick={useSample}>Use a sample resume</button>
            </div>
          )}
        </section>

        <div className="rs-side">
          <section className="ask rsc">
            <header className="between"><b>Job description</b><span className="hint">paste a link</span></header>
            <label className="srch lg"><Link2 size={15} color="#8b8b85" />
              <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://company.com/careers/backend-engineer" aria-label="Job description link" onKeyDown={(e) => e.key === 'Enter' && analyze()} />
            </label>
            <div className="arow">
              <button className="pbtn dark" onClick={analyze} disabled={stage === 'analyzing'}>{stage === 'analyzing' ? 'Analyzing…' : done ? 'Analyze again' : 'Analyze job'}</button>
              {stage === 'analyzing' && <small className="steps">{STEPS[step]}</small>}
              {stage === 'idle' && <button className="pbtn ghost" onClick={() => { setLink(sampleLink) }}>Use a sample link</button>}
            </div>
            {done && (
              <div className="jobsum"><b>{job.title}</b><small>{job.company} · {job.where}</small></div>
            )}
          </section>

          <section className="ask rsc">
            <header className="between"><b>Resume match</b>{done && <span className="chip soft">{ap.size} of 3 edits applied</span>}</header>
            {!done ? <small className="empty-s">Analyze a job to see how well your resume matches it.</small> : (
              <div className="match">
                <div className="mring">
                  <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r={R} className="tr" /><circle cx="50" cy="50" r={R} className="fg" style={{ strokeDasharray: C, strokeDashoffset: C * (1 - score / 100) }} /></svg>
                  <div><b>{score}</b><small>/ 100</small></div>
                </div>
                <div className="kws">
                  <small>Keywords the job asks for</small>
                  <div className="tags">
                    {job.matched.map((k) => <span key={k} className="ok">{k}</span>)}
                    {job.added.map((k) => <span key={k} className={kw(k) ? 'ok' : 'gap'}>{k}</span>)}
                    {job.gap.map((k) => <span key={k} className="gap">{k}</span>)}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="ask rsc grow">
            <header className="between"><b>Suggested edits</b>{done && <button className="pbtn ghost" onClick={applyAll}>Apply all</button>}</header>
            {!done ? <small className="empty-s">Tailored edits will appear here, one tap to apply each.</small> : (
              <div className="sugs">
                {suggestions.map((s) => (
                  <div className="sg" key={s.id}>
                    <span className="t"><b>{s.title}</b><small>{s.why}</small></span>
                    {s.course
                      ? <a className="pbtn ghost" href="#courses">Find a course</a>
                      : ap.has(s.id)
                        ? <span className="applied"><Check size={14} /> Applied</span>
                        : <button className="pbtn dark" onClick={() => toggle(s.id)}>Apply</button>}
                  </div>
                ))}
              </div>
            )}
            {done && (
              <div className="dl">
                <button className="pbtn dark" onClick={save} disabled={!ap.size}><Download size={14} /> {saved ? 'Saved to downloads ✓' : 'Download tailored resume'}</button>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  )
}
