import { createContext, useContext, useEffect, useMemo, useState } from 'react'
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

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    document.title = titles[path] ?? 'Tejas NG — Portfolio'
    window.scrollTo(0, 0)
  }, [path])

  const value = useMemo<RouterValue>(() => ({
    path,
    navigate: (to) => {
      const next = normalizePath(to)
      if (next === path) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      window.history.pushState({}, '', next)
      setPath(next)
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
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
  }

  return <a href={to} onClick={handleClick} {...props} />
}
