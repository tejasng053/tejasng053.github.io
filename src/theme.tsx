import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import type { MouseEvent } from 'react'

type Theme = 'light' | 'dark'
const storageKey = 'tn-theme'
let activeTransition: ViewTransition | null = null

export function cancelThemeTransition() {
  activeTransition?.skipTransition()
  activeTransition = null
  delete document.documentElement.dataset.themeTransition
}
function savedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(storageKey)
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch { return null }
}
function paintTheme(theme: Theme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111318' : '#f6f7f9')
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  const busy = useRef(false)
  const revision = useRef(0)
  // If storage is unavailable, still keep a manual choice for this visit.
  const manual = useRef<Theme | null>(savedTheme())

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      revision.current += 1
      busy.current = false
      cancelThemeTransition()
      const next = manual.current ?? (media.matches ? 'dark' : 'light')
      paintTheme(next)
      setTheme(next)
    }
    const storage = (event: StorageEvent) => {
      if (event.key !== storageKey && event.key !== null) return
      manual.current = savedTheme()
      sync()
    }
    media.addEventListener('change', sync)
    window.addEventListener('storage', storage)
    return () => { revision.current += 1; media.removeEventListener('change', sync); window.removeEventListener('storage', storage); cancelThemeTransition() }
  }, [])

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (busy.current) return
    const id = ++revision.current
    const next = theme === 'light' ? 'dark' : 'light'
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2
    const root = document.documentElement
    root.style.setProperty('--theme-x', `${x}px`)
    root.style.setProperty('--theme-y', `${y}px`)
    root.style.setProperty('--theme-radius', `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 2}px`)
    const apply = () => {
      if (id !== revision.current) return
      manual.current = next
      try { localStorage.setItem(storageKey, next) } catch { /* The toggle also works without storage. */ }
      paintTheme(next)
      flushSync(() => setTheme(next))
    }
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(); return }
    cancelThemeTransition()
    busy.current = true
    root.dataset.themeTransition = 'true'
    try {
      const transition = document.startViewTransition(apply)
      activeTransition = transition
      // A navigation or tab switch can skip the reveal; the theme still applies.
      void transition.ready.catch(() => {})
      const finish = () => {
        if (id === revision.current) busy.current = false
        if (activeTransition === transition) {
          activeTransition = null
          delete root.dataset.themeTransition
        }
      }
      void transition.finished.then(finish, finish)
    } catch {
      busy.current = false
      cancelThemeTransition()
      apply()
    }
  }
  return { theme, toggle }
}

export function ThemeButton({ theme, onClick, floating = false }: { theme: Theme; onClick: (event: MouseEvent<HTMLButtonElement>) => void; floating?: boolean }) {
  return (
    <button type="button" className={`theme-toggle${floating ? ' theme-toggle-floating' : ''}`} onClick={onClick} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === 'light'
          ? <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></svg>
          : <svg viewBox="0 0 24 24"><path d="M20.4 15.2A8.2 8.2 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z" /></svg>}
      </span>
      <span className="theme-toggle-label">{theme === 'light' ? 'Day' : 'Night'}</span>
      <span className="theme-toggle-track" aria-hidden="true"><i /></span>
    </button>
  )
}
