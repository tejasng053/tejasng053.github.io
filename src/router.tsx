import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { cancelThemeTransition } from './theme'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

type RouterValue = {
  path: string
  navigate: (to: string) => void
}

const RouterContext = createContext<RouterValue | null>(null)

const titles: Record<string, string> = {
  '/': 'Tejas NG — Software Engineering, AI/ML & Research',
  '/projects': 'Projects & Contributions — Tejas NG',
  '/skills': 'Skills & Certifications — Tejas NG',
  '/about': 'About — Tejas NG',
  '/contact': 'Contact — Tejas NG',
}

function normalizePath(pathname: string) {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return clean === '/skill' ? '/skills' : clean
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))
  const transitionRef = useRef<ViewTransition | null>(null)
  const navigationId = useRef(0)

  useEffect(() => {
    const handlePopState = () => {
      cancelThemeTransition()
      navigationId.current += 1
      transitionRef.current?.skipTransition()
      delete document.documentElement.dataset.pageTransition
      setPath(normalizePath(window.location.pathname))
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useLayoutEffect(() => {
    document.title = titles[path] ?? 'Tejas NG — Portfolio'
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [path])

  const value = useMemo<RouterValue>(() => ({
    path,
    navigate: (to) => {
      cancelThemeTransition()
      const next = normalizePath(to)
      if (next === path) {
        navigationId.current += 1
        transitionRef.current?.skipTransition()
        delete document.documentElement.dataset.pageTransition
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
        return
      }
      const id = ++navigationId.current
      transitionRef.current?.skipTransition()
      const update = () => {
        if (id !== navigationId.current) return
        window.history.pushState({}, '', next)
        flushSync(() => setPath(next))
        document.getElementById('main-content')?.focus({ preventScroll: true })
      }
      if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        update()
        return
      }
      document.documentElement.dataset.pageTransition = 'true'
      document.documentElement.dataset.nativePageMotion = 'true'
      const transition = document.startViewTransition(update)
      transitionRef.current = transition
      void transition.ready.catch(() => {}) // Interrupted transitions still complete navigation.
      const finish = () => {
        if (id === navigationId.current) {
          delete document.documentElement.dataset.pageTransition
          transitionRef.current = null
        }
      }
      void transition.finished.then(finish, finish)
    },
  }), [path])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const value = useContext(RouterContext)
  if (!value) throw new Error('useRouter must be used inside RouterProvider')
  return value
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }

export function Link({ to, onClick, ...props }: LinkProps) {
  const { navigate } = useRouter()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank' || props.download != null) return
    event.preventDefault()
    navigate(to)
  }

  return <a href={to} onClick={handleClick} {...props} />
}
