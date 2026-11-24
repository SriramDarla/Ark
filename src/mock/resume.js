// DEMO DATA for the resume tailor page (stands in for the real parsing + job analysis later)
export const sampleLink = 'https://careers.northwind.example/jobs/backend-engineer-payments'

export const job = {
  title: 'Backend Engineer, Payments',
  company: 'Northwind Payments',
  where: 'Bengaluru · Hybrid',
  matched: ['Python', 'REST APIs', 'SQL', 'Testing'],
  added: ['PostgreSQL', 'Docker'],   // missing at first, fixed by the "skills" edit
  gap: ['System design'],            // not on the resume: points to Courses
}

export const resume = {
  name: 'Aarav Mehta',
  contact: 'Bengaluru · aarav.mehta@email.com · github.com/aaravm',
  summary: ['Final-year CS student who enjoys building web apps.', 'Backend-focused CS student who ships reliable REST APIs and data services, including a ledger service handling 5k requests a minute.'],
  jobs: [
    { role: 'Software Engineering Intern', org: 'Finlytics', when: 'May to Aug 2026', bullets: [
      ['Worked on the backend of the analytics dashboard.', 'Built 6 REST endpoints in Python and FastAPI for a dashboard used by 2,000 analysts; cut p95 latency 38% with Redis caching.'],
      ['Fixed bugs and wrote tests.', 'Raised test coverage from 41% to 78% and removed 12 flaky tests, shortening CI from 14 to 6 minutes.'],
    ] },
    { role: 'Open-source contributor', org: 'DataKit', when: '2025 to now', bullets: [
      ['Merged 9 pull requests across the CLI and docs.', null],
    ] },
  ],
  project: { name: 'LedgerLite', text: 'Double-entry ledger API with idempotent transfers, Postgres and Docker Compose.' },
  skills: [['Python, React, SQL, Git', 'Python, REST APIs, SQL, PostgreSQL, Docker, React, Git']],
  education: 'B.E. Computer Science · Bengaluru · 2027',
}

export const suggestions = [
  { id: 'summary', title: 'Lead with backend focus', why: 'The posting opens with APIs and reliability, but your summary is generic.' },
  { id: 'bullet', title: 'Quantify the Finlytics work', why: '"Worked on the backend" hides your 38% latency win.' },
  { id: 'skills', title: 'Add PostgreSQL and Docker', why: 'Both are required, and both already appear in LedgerLite.' },
  { id: 'design', title: 'Show system design experience', why: 'Required by the role and missing from your resume.', course: true },
]
