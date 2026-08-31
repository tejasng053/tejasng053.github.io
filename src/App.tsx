import { CustomCursor, RevealController, SiteFooter, SiteHeader, TopProgress } from './components'
import type { ReactElement } from 'react'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { SkillsPage } from './pages/SkillsPage'
import { Link, RouterProvider, useRouter } from './router'

function NotFoundPage() {
  return (
    <div className="route-page not-found-page">
      <span>404 / NOT FOUND</span>
      <h1>This page wandered off.</h1>
      <Link to="/" data-cursor="HOME">Return home ↗</Link>
    </div>
  )
}

function SiteRoutes() {
  const { path } = useRouter()
  const routes: Record<string, ReactElement> = {
    '/': <HomePage />,
    '/projects': <ProjectsPage />,
    '/skills': <SkillsPage />,
    '/about': <AboutPage />,
    '/contact': <ContactPage />,
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <TopProgress route={path} />
      <CustomCursor />
      <div className="paper-grain" aria-hidden="true" />
      <SiteHeader />
      <RevealController route={path} />
      <main id="main-content" key={path}>{routes[path] ?? <NotFoundPage />}</main>
      <SiteFooter />
    </>
  )
}

export default function App() {
  return <RouterProvider><SiteRoutes /></RouterProvider>
}
