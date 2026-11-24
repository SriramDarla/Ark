import { useEffect, useState } from 'react'
import { AuthProvider } from './auth.jsx'
import Sidebar from './components/Sidebar.jsx'
import Landing from './pages/Landing.jsx'
import Resume from './pages/Resume.jsx'
import Interview from './pages/Interview.jsx'
import Progress from './pages/Progress.jsx'
import Courses from './pages/Courses.jsx'
import Login from './pages/Login.jsx'
import Hackathons from './pages/Hackathons.jsx'

export const ROUTES = { home: Landing, resume: Resume, interview: Interview, progress: Progress, courses: Courses, hackathons: Hackathons, login: Login }
const read = () => (location.hash.slice(1) in ROUTES ? location.hash.slice(1) : 'home')

export default function App() {
  const [page, setPage] = useState(read)
  useEffect(() => { const f = () => setPage(read()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  const Page = ROUTES[page]
  return (
    <AuthProvider>
      <div className="shell">
        <Sidebar page={page} />
        <main className="stage" key={page}><Page go={(p) => (location.hash = p)} /></main>
      </div>
    </AuthProvider>
  )
}
