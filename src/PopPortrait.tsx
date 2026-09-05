import { useState } from 'react'
import { usePointerTilt } from './usePointerTilt'

export function PopPortrait({ priority = false }: { priority?: boolean }) {
  const [popped, setPopped] = useState(false)
  const tilt = usePointerTilt<HTMLButtonElement>()
  return (
    <button {...tilt} type="button" className="pop-portrait" aria-label="Tejas NG — toggle portrait pop-out" aria-pressed={popped} onClick={() => setPopped((value) => !value)} data-cursor="HELLO">
      <span className="portrait-frame" aria-hidden="true" />
      <img className="portrait-photo" src="/assets/tejas-ng.jpg" alt="Tejas NG" fetchPriority={priority ? 'high' : 'auto'} loading={priority ? 'eager' : 'lazy'} width="200" height="200" />
      <span className="portrait-hello" aria-hidden="true">Hi, I’m Tejas. <span>↗</span></span>
      <span className="portrait-toggle" aria-hidden="true">{popped ? '−' : '+'}</span>
    </button>
  )
}
