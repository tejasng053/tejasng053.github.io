import { useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'

// Only transform the inner artwork: the pointer target itself remains stationary.
export function usePointerTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const frame = useRef(0)
  const point = useRef({ x: 0, y: 0 })
  const reset = () => {
    cancelAnimationFrame(frame.current)
    frame.current = 0
    ref.current?.style.setProperty('--tilt-x', '0deg')
    ref.current?.style.setProperty('--tilt-y', '0deg')
  }

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    motion.addEventListener('change', reset)
    return () => {
      cancelAnimationFrame(frame.current)
      motion.removeEventListener('change', reset)
    }
  }, [])

  const onPointerMove = (event: PointerEvent<T>) => {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    point.current = { x: event.clientX, y: event.clientY }
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      const element = ref.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      element.style.setProperty('--tilt-x', `${-(point.current.y - rect.top - rect.height / 2) / rect.height * 7}deg`)
      element.style.setProperty('--tilt-y', `${(point.current.x - rect.left - rect.width / 2) / rect.width * 7}deg`)
    })
  }
  return { ref, onPointerMove, onPointerLeave: reset, onBlur: reset }
}
