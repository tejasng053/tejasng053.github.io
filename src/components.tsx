import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { featuredProjects, navigation, site } from './data'
import type { FeaturedProject } from './data'
import { Link, useRouter } from './router'
import { ProjectVisual } from './ProjectVisual'
import { ThemeButton, useTheme } from './theme'

export function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 16 16 4M7 4h9v9" /></svg>
}

export function GitHubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.72c-2.78.6-3.37-1.18-3.37-1.18-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.61.07-.61 1 .07 1.52 1.02 1.52 1.02.89 1.51 2.33 1.08 2.9.83.09-.64.35-1.08.63-1.33-2.22-.25-4.56-1.1-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.7 9.7 0 0 1 12 6.8a9.7 9.7 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.68-4.57 4.93.36.31.68.9.68 1.81v2.68c0 .26.18.57.69.48A10 10 0 0 0 12 2Z" fill="currentColor" stroke="none" /></svg>
}

export function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9v8M7 6.5v.01M11 17v-5a3 3 0 0 1 6 0v5M11 9v8" /></svg>
}

export function SiteHeader() {
  const { path } = useRouter()
  const [open, setOpen] = useState(false)
  const [detached, setDetached] = useState(false)
  const [pacmanRun, setPacmanRun] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    let frame = 0
    const isHome = path === '/'
    const enterAt = isHome ? Math.min(window.innerHeight * 0.58, 560) : 28
    const leaveAt = isHome ? Math.min(window.innerHeight * 0.22, 190) : 4
    let floating = window.scrollY > enterAt
    setDetached(floating)

    const update = () => {
      frame = 0
      // The homepage keeps navigation inside the console until the hero has
      // mostly passed. Separate thresholds prevent jitter during trackpad scroll.
      const next = floating ? window.scrollY > leaveAt : window.scrollY > enterAt
      if (next !== floating) {
        floating = next
        setDetached(next)
      }
    }

    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [path])

  useEffect(() => setOpen(false), [path])

  useEffect(() => {
    if (path === '/' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPacmanRun(false)
      return
    }

    setPacmanRun(false)
    const frame = window.requestAnimationFrame(() => setPacmanRun(true))
    const timer = window.setTimeout(() => setPacmanRun(false), 1050)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [path])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <>
      {path === '/' && !detached && <ThemeButton theme={theme} onClick={toggle} floating />}
      <header className="site-header" data-home={path === '/'} data-detached={detached} data-pacman={pacmanRun}>
      {path !== '/' && (
        <div className="pacman-nav-builder" aria-hidden="true">
          <div className="pacman-dot-track">
            {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--dot-index': index } as CSSProperties} />)}
          </div>
          <span className="pacman-character" />
        </div>
      )}
      <Link className="brand" to="/" data-cursor="HOME" aria-label="Tejas NG home">
        <span>TN</span><i>Portfolio / 26</i>
      </Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <Link key={item.path} to={item.path} className={path === item.path ? 'active' : ''} aria-current={path === item.path ? 'page' : undefined}>
            <small>{item.number}</small>{item.label}
          </Link>
        ))}
      </nav>
      <div className="header-end">
        <a href={site.codolio} target="_blank" rel="noreferrer" data-cursor="OPEN">Codolio <ArrowIcon /></a>
        {(path !== '/' || detached) && <ThemeButton theme={theme} onClick={toggle} />}
        <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle menu">
          <span>{open ? 'Close' : 'Menu'}</span><i>{open ? '×' : '＋'}</i>
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navigation.map((item) => <Link key={item.path} to={item.path} aria-current={path === item.path ? 'page' : undefined} onClick={() => setOpen(false)}><small>{item.number}</small><span>{item.label}</span></Link>)}
          <a href={site.codolio} target="_blank" rel="noreferrer"><small>EXT</small><span>Codolio ↗</span></a>
        </nav>
      )}
      </header>
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div><span>© 2026 TEJAS NG</span><span>{site.location}</span></div>
      <div>
        <a href={site.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={site.codolio} target="_blank" rel="noreferrer">Codolio</a>
      </div>
      <Link to="/contact">Available for work <i /></Link>
    </footer>
  )
}

export function PageIntro({ number, eyebrow, title, description }: { number: string; eyebrow: string; title: string; description: string }) {
  return (
    <header className="page-intro" data-reveal>
      <div className="page-intro-meta"><span>{number}</span><span>{eyebrow}</span></div>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  )
}

export function SectionHeading({ index, title, note, action }: { index: string; title: string; note?: string; action?: ReactNode }) {
  return (
    <div className="section-heading" data-reveal>
      <div><span>{index}</span><h2>{title}</h2></div>
      {note && <p>{note}</p>}
      {action && <div className="section-action">{action}</div>}
    </div>
  )
}

export function ProjectCard({ project, index, compact = false }: { project: FeaturedProject; index: number; compact?: boolean }) {
  const primaryUrl = project.live ?? project.repository
  const primaryLabel = project.live ? `Open ${project.name} live demo` : `Open ${project.name} on GitHub`

  return (
    <article className={`project-card-new ${compact ? 'compact' : ''}`} data-reveal>
      <ProjectVisual project={project} />
      <div className="project-copy-new">
        <div className="project-number">{String(index + 1).padStart(2, '0')}</div>
        <div>
          <a className="project-main-link" href={primaryUrl} target="_blank" rel="noreferrer" data-cursor={project.live ? 'LAUNCH' : 'VIEW'} aria-label={primaryLabel}>
            <span>{project.label}</span>
            <h3>{project.name}</h3>
            <p>{compact ? project.summary : project.detail}</p>
            <div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          </a>
        </div>
        <div className="project-actions">
          <a className="project-action-button" href={project.repository} target="_blank" rel="noreferrer" data-cursor="GITHUB" aria-label={`View ${project.name} on GitHub`}><GitHubIcon /><span>GitHub</span></a>
          {project.live && <a className="project-action-button primary" href={project.live} target="_blank" rel="noreferrer" data-cursor="LIVE" aria-label={`Open ${project.name} hosted site`}><span>Live demo</span><ArrowIcon /></a>}
        </div>
      </div>
    </article>
  )
}

export function ContactBand({ label = 'Have a project, role, or difficult idea?' }: { label?: string }) {
  return (
    <section className="contact-band" data-reveal>
      <span>05 / CONTACT</span>
      <h2>{label}</h2>
      <Link to="/contact" data-cursor="TALK">Let’s talk <ArrowIcon /></Link>
    </section>
  )
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="arrow-link" href={href} target="_blank" rel="noreferrer" data-cursor="OPEN">{children}<ArrowIcon /></a>
}

export function ProjectPreviewList() {
  return <div className="project-preview-list">{featuredProjects.slice(0, 3).map((project, index) => <ProjectCard key={project.id} project={project} index={index} compact />)}</div>
}

export function TopProgress({ route }: { route: string }) {
  useEffect(() => {
    const update = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight
      const value = distance > 0 ? Math.min(100, Math.max(0, (window.scrollY / distance) * 100)) : 0
      document.documentElement.style.setProperty('--scroll', `${value}%`)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [route])
  return <div className="top-progress" aria-hidden="true"><span /></div>
}

export function RevealController({ route }: { route: string }) {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => item.classList.add('visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [route])
  return null
}

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canUse = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!ringRef.current || !dotRef.current || !labelRef.current) return

    const ring = ringRef.current
    const dot = dotRef.current
    const label = labelRef.current
    let targetX = -100
    let targetY = -100
    let ringX = -100
    let ringY = -100
    let frame = 0
    let previousTime = 0
    let enabled = canUse.matches

    document.documentElement.classList.toggle('custom-pointer', enabled)

    const animate = (time: number) => {
      frame = 0
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16
      previousTime = time
      const ease = 1 - Math.exp(-elapsed / 75)
      ringX += (targetX - ringX) * ease
      ringY += (targetY - ringY) * ease
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      if (Math.abs(targetX - ringX) + Math.abs(targetY - ringY) > .1) frame = window.requestAnimationFrame(animate)
      else previousTime = 0
    }

    const move = (event: PointerEvent) => {
      if (!enabled || event.pointerType !== 'mouse') return
      targetX = event.clientX
      targetY = event.clientY
      if (!ring.classList.contains('shown')) { ringX = targetX; ringY = targetY }
      dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      ring.classList.add('shown')
      dot.classList.add('shown')
      if (!frame) frame = window.requestAnimationFrame(animate)
    }

    const over = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')
      const cursorLabel = target?.dataset.cursor ?? ''
      label.textContent = cursorLabel
      ring.classList.toggle('active', Boolean(cursorLabel))
    }

    const leave = () => {
      ring.classList.remove('shown')
      dot.classList.remove('shown')
      window.cancelAnimationFrame(frame)
      frame = 0
      previousTime = 0
    }
    const preferenceChanged = () => {
      enabled = canUse.matches
      document.documentElement.classList.toggle('custom-pointer', enabled)
      leave()
    }
    canUse.addEventListener('change', preferenceChanged)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('blur', leave)
    document.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('mouseleave', leave)

    return () => {
      document.documentElement.classList.remove('custom-pointer')
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('blur', leave)
      canUse.removeEventListener('change', preferenceChanged)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <div className="cursor-layer" aria-hidden="true">
      <div className="cursor-ring" ref={ringRef}><span ref={labelRef} /></div>
      <div className="cursor-dot" ref={dotRef} />
    </div>
  )
}
