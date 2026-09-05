import { useEffect, useRef } from 'react'

const letters = [...'TEJAS NG']

export function AnimatedName() {
  const nameRef = useRef<HTMLButtonElement>(null)
  const replayRef = useRef<() => void>(() => {})

  useEffect(() => {
    const name = nameRef.current
    if (!name) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const shells = [...name.querySelectorAll<HTMLElement>('.name-letter')]
    const glyphs = [...name.querySelectorAll<HTMLElement>('.name-glyph')]
    let animations: Animation[] = []
    let frame = 0
    let pointerX = 0

    const reset = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      for (const glyph of glyphs) {
        glyph.style.setProperty('--lift', '0px')
        glyph.style.setProperty('--twist', '0deg')
        glyph.style.setProperty('--echo', '0')
      }
    }
    const play = () => {
      animations.forEach((animation) => animation.cancel())
      animations = []
      if (reducedMotion.matches) return
      animations = shells.map((shell, index) => shell.animate([
        { transform: 'translateY(95%) rotate(7deg)', opacity: 0 },
        { transform: 'translateY(-5%) rotate(-1deg)', opacity: 1, offset: .75 },
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      ], { duration: 900, delay: index * 55, easing: 'cubic-bezier(.22,.8,.22,1)', fill: 'backwards' }))
    }
    replayRef.current = play

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || reducedMotion.matches) return
      pointerX = event.clientX
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        // Read stable letter positions before writing transforms to avoid layout thrashing.
        const bounds = shells.map((shell) => shell.getBoundingClientRect())
        const radius = name.clientWidth * .26
        glyphs.forEach((glyph, index) => {
          const rect = bounds[index]
          const distance = (rect.left + rect.width / 2 - pointerX) / radius
          const influence = Math.max(0, 1 - Math.abs(distance))
          glyph.style.setProperty('--lift', `${-influence * Math.min(30, rect.height * .15)}px`)
          glyph.style.setProperty('--twist', `${distance * influence * 9}deg`)
          glyph.style.setProperty('--echo', `${influence * .7}`)
        })
      })
    }
    const motionChanged = () => {
      reset()
      if (reducedMotion.matches) animations.forEach((animation) => animation.cancel())
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { play(); observer.disconnect() }
    }, { threshold: .25 })
    observer.observe(name)
    name.addEventListener('pointermove', move, { passive: true })
    name.addEventListener('pointerleave', reset)
    reducedMotion.addEventListener('change', motionChanged)
    return () => {
      observer.disconnect()
      reset()
      animations.forEach((animation) => animation.cancel())
      name.removeEventListener('pointermove', move)
      name.removeEventListener('pointerleave', reset)
      reducedMotion.removeEventListener('change', motionChanged)
      replayRef.current = () => {}
    }
  }, [])

  return (
    <button className="studio-wordmark kinetic-name" ref={nameRef} type="button" onClick={() => replayRef.current()} aria-label="Tejas NG — replay name animation" data-cursor="PLAY">
      <span className="name-letters" aria-hidden="true">
        {letters.map((letter, index) => <span className={`name-letter${letter === ' ' ? ' name-space' : ''}`} key={index}><span className="name-glyph" data-letter={letter}>{letter === ' ' ? '\u00a0' : letter}</span></span>)}
      </span>
      <span className="name-spark" aria-hidden="true">✳</span>
    </button>
  )
}
