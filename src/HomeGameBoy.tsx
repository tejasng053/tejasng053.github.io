import { useEffect, useState } from 'react'
import { navigation } from './data'
import { Link, useRouter } from './router'

const consoleNavigation = navigation.filter((item) => item.path !== '/')

export function HomeGameBoy() {
  const [selected, setSelected] = useState(0)
  const { navigate } = useRouter()

  const moveSelection = (direction: -1 | 1) => {
    setSelected((current) => (current + direction + consoleNavigation.length) % consoleNavigation.length)
  }

  const openSelected = () => {
    navigate(consoleNavigation[selected].path)
  }

  const goHome = () => {
    navigate('/')
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault()
        moveSelection(-1)
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault()
        moveSelection(1)
      }
      if (event.key === 'Enter' && document.activeElement?.closest('.home-gameboy')) {
        event.preventDefault()
        openSelected()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected])

  return (
    <div className="home-console-stage" data-reveal>
      <div className="home-gameboy" aria-label="Interactive portfolio navigation console">
        <div className="gameboy-topline" aria-hidden="true">
          <span>TN-01</span>
          <span>PORTFOLIO NAV</span>
        </div>

        <div className="gameboy-screen-bezel">
          <div className="gameboy-screen">
            <div className="gameboy-screen-head">
              <span>TEJAS.OS</span>
              <span className="gameboy-ready"><i /> NAV READY</span>
            </div>
            <p>NAVIGATION MENU</p>
            <nav className="gameboy-nav" aria-label="Portfolio navigation">
              {consoleNavigation.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  data-cursor="OPEN"
                  className={selected === index ? 'selected' : ''}
                  aria-current={selected === index ? 'true' : undefined}
                  onMouseEnter={() => setSelected(index)}
                  onFocus={() => setSelected(index)}
                >
                  <small>{item.number}</small>
                  <span>{item.label}</span>
                  <b aria-hidden="true">{selected === index ? '▶' : '›'}</b>
                </Link>
              ))}
            </nav>
            <small className="gameboy-screen-help">USE D-PAD · A TO OPEN · B HOME</small>
          </div>
        </div>

        <div className="gameboy-brandline">
          <strong>tejas</strong>
          <span>NAV BAR / PORTFOLIO</span>
        </div>

        <div className="gameboy-controls">
          <span className="gameboy-control-label gameboy-control-label-dpad">SELECT</span>
          <span className="gameboy-control-label gameboy-control-label-b">HOME</span>
          <span className="gameboy-control-label gameboy-control-label-a">OPEN</span>

          <div className="gameboy-dpad" aria-label="Choose navigation item">
            <button type="button" className="dpad-up" onClick={() => moveSelection(-1)} aria-label="Previous navigation item">▲</button>
            <span aria-hidden="true" />
            <button type="button" className="dpad-down" onClick={() => moveSelection(1)} aria-label="Next navigation item">▼</button>
          </div>

          <div className="gameboy-center-controls" aria-hidden="true"><i /><i /></div>

          <div className="gameboy-ab">
            <button type="button" className="gameboy-b" onClick={goHome} aria-label="Go to home">B</button>
            <button type="button" className="gameboy-a" onClick={openSelected} aria-label={`Open ${consoleNavigation[selected].label}`}>A</button>
          </div>
        </div>

        <div className="gameboy-speaker" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
        </div>
      </div>
      <p className="gameboy-caption">PORTFOLIO NAVIGATION CONSOLE / TN-01</p>
    </div>
  )
}
