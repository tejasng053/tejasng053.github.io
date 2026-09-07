import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { navigation } from './data'
import { Link, useRouter } from './router'
import { createTetris, stepTetris } from './arcade/engine'
import type { Direction, Input, Tetris } from './arcade/engine'
import { TetrisScreen } from './arcade/TetrisScreen'
import './arcade/gameboy-arcade.css'

const consoleNavigation = navigation.filter(item => item.path !== '/')
const gamesIndex = consoleNavigation.length
const directions: Direction[] = ['up', 'left', 'right', 'down']
type Screen = 'navigation' | 'arcade' | 'tetris'
type Action = { input: Input } | { seed: number }
const reducer = (state: Tetris, action: Action) => 'seed' in action ? createTetris(action.seed) : stepTetris(state, action.input)

export function HomeGameBoy() {
  const [selected, setSelected] = useState(0)
  const [screen, setScreen] = useState<Screen>('navigation')
  const [game, dispatch] = useReducer(reducer, 0, createTetris)
  const [sound, setSound] = useState(true)
  const consoleRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<AudioContext | null>(null)
  const holdRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const { navigate } = useRouter()

  const beep = useCallback((frequency = 330, duration = .045) => {
    if (!sound) return
    try {
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = audioRef.current ?? (audioRef.current = new AudioCtx())
      if (ctx.state === 'suspended') void ctx.resume().catch(() => {})
      const oscillator = ctx.createOscillator(), gain = ctx.createGain()
      oscillator.type = 'square'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(.025, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration)
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.start()
      oscillator.stop(ctx.currentTime + duration)
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
    } catch { /* Audio is optional on browsers without Web Audio support. */ }
  }, [sound])

  const stopHold = useCallback(() => { clearTimeout(holdRef.current); holdRef.current = undefined }, [])
  const focusConsole = () => consoleRef.current?.focus({ preventScroll: true })
  const start = () => { stopHold(); dispatch({ seed: Date.now() }); setScreen('tetris'); focusConsole(); beep(520) }
  const openArcade = () => { stopHold(); setSelected(gamesIndex); setScreen('arcade'); focusConsole() }
  const back = () => {
    stopHold()
    if (screen === 'tetris') setScreen('arcade')
    else { setScreen('navigation'); if (screen === 'navigation') setSelected(0) }
    focusConsole()
  }
  const act = () => {
    if (screen === 'navigation') {
      if (selected === gamesIndex) openArcade()
      else navigate(consoleNavigation[selected].path)
    } else if (screen === 'arcade' || game.over) start()
    else { dispatch({ input: game.paused ? 'pause' : 'a' }); beep(400) }
  }
  const move = (direction: Direction) => {
    if (screen === 'navigation') {
      const delta = direction === 'up' || direction === 'left' ? -1 : 1
      setSelected(current => (current + delta + gamesIndex + 1) % (gamesIndex + 1))
    } else if (screen === 'tetris') dispatch({ input: direction })
  }
  const drop = () => { dispatch({ input: 'drop' }); focusConsole(); beep(190, .065) }
  const pause = () => { stopHold(); dispatch({ input: 'pause' }); focusConsole() }
  const toggleSound = () => { setSound(value => !value); focusConsole() }
  const moveRef = useRef(move)
  useLayoutEffect(() => { moveRef.current = move })

  const pointerMove = (event: PointerEvent<HTMLButtonElement>, direction: Direction) => {
    event.preventDefault()
    stopHold()
    focusConsole()
    event.currentTarget.setPointerCapture(event.pointerId)
    move(direction)
    if (screen === 'arcade' || (screen === 'tetris' && direction === 'up')) return
    const repeat = () => {
      moveRef.current(direction)
      holdRef.current = setTimeout(repeat, 90)
    }
    holdRef.current = setTimeout(repeat, 260)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || (event.target as HTMLElement).isContentEditable) return
    const key = event.key.toLowerCase()
    if ((key === 'enter' || key === ' ') && (event.target as HTMLElement).closest('[data-console-native]')) return
    const direction = key.startsWith('arrow') ? key.slice(5) as Direction : undefined
    if (direction && directions.includes(direction)) { event.preventDefault(); move(direction); return }
    const actions: Record<string, () => void> = {
      a: act, z: act, enter: act, b: back, x: back, escape: back, backspace: back,
      ' ': screen === 'tetris' ? drop : act,
      p: screen === 'tetris' ? pause : () => {},
      r: screen === 'tetris' ? start : () => {}, m: toggleSound,
    }
    if (actions[key]) { event.preventDefault(); if (!event.repeat) actions[key]() }
  }

  useEffect(() => {
    if (screen !== 'tetris' || game.over || game.paused) return
    const timer = window.setInterval(() => dispatch({ input: 'tick' }), Math.max(160, 620 - game.lines * 12))
    return () => window.clearInterval(timer)
  }, [screen, game.over, game.paused, game.lines])

  // Pause when the player leaves the console; never keep falling off-screen.
  const autoPause = useCallback(() => {
    stopHold()
    if (screen === 'tetris' && !game.paused && !game.over) dispatch({ input: 'pause' })
  }, [screen, game.paused, game.over, stopHold])
  useEffect(() => {
    const visibility = () => { if (document.hidden) autoPause() }
    const observer = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) autoPause() })
    if (consoleRef.current) observer.observe(consoleRef.current)
    window.addEventListener('blur', autoPause)
    document.addEventListener('visibilitychange', visibility)
    return () => { observer.disconnect(); window.removeEventListener('blur', autoPause); document.removeEventListener('visibilitychange', visibility) }
  }, [autoPause])
  const previousScore = useRef(0)
  useEffect(() => {
    if (game.score > previousScore.current) beep(game.score - previousScore.current >= 100 ? 660 : 220, .075)
    previousScore.current = game.score
  }, [game.score, beep])
  useEffect(() => () => { stopHold(); if (audioRef.current) void audioRef.current.close().catch(() => {}) }, [stopHold])

  return (
    <div className="home-console-stage" data-reveal>
      <div className="gameboy-side-note" aria-hidden="true">
        <strong>GAME BOY IS THE NAV</strong><span>use it to explore</span>
        <svg viewBox="0 0 120 58" role="presentation"><path d="M8 16C34 42 74 48 105 25" /><path d="M93 23l14 1-4 13" /></svg>
      </div>
      <div ref={consoleRef} className="home-gameboy" tabIndex={0} role="group" aria-label="Interactive portfolio and Tetris console" aria-describedby="gameboy-keyboard-help" data-screen={screen} onKeyDown={onKeyDown} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) autoPause() }}>
        <div className="gameboy-topline" aria-hidden="true"><span>TN-01</span><span>PORTFOLIO NAV</span></div>
        <div className="gameboy-screen-bezel">
          <div className="gameboy-screen">
            {screen === 'navigation' && <>
              <div className="gameboy-screen-head"><span>TEJAS.OS</span><span className="gameboy-ready"><i /> NAV READY</span></div>
              <p>NAVIGATION MENU</p>
              <nav className="gameboy-nav" aria-label="Portfolio navigation">
                {consoleNavigation.map((item, index) => <Link key={item.path} to={item.path} data-cursor="OPEN" className={selected === index ? 'selected' : ''} onMouseEnter={() => setSelected(index)} onFocus={() => setSelected(index)}><small>{item.number}</small><span>{item.label}</span><b aria-hidden="true">{selected === index ? '▶' : '›'}</b></Link>)}
                <button type="button" className={selected === gamesIndex ? 'selected' : ''} onMouseEnter={() => setSelected(gamesIndex)} onFocus={() => setSelected(gamesIndex)} onClick={openArcade}><small>06</small><span>GAMES</span><b aria-hidden="true">{selected === gamesIndex ? '▶' : '›'}</b></button>
              </nav>
              <small className="gameboy-screen-help">USE D-PAD · A TO OPEN · B TO RESET</small>
            </>}
            {screen === 'arcade' && <>
              <div className="gameboy-screen-head"><span>TEJAS.OS</span><span className="gameboy-ready"><i /> ARCADE</span></div>
              <p>ARCADE MENU</p>
              <div className="gameboy-nav" aria-label="Arcade menu"><button type="button" className="selected" onClick={start}><small>01</small><span>TETRIS</span><b aria-hidden="true">▶</b></button></div>
              <div className="gb-arcade-intro"><strong>STACK. CLEAR. REPEAT.</strong><p>Fill a row to clear it.<br />Keep the blocks below the top.</p><span>← → MOVE · A ROTATE<br />↓ SOFT DROP · SELECT DROP</span></div>
              <small className="gameboy-screen-help">A / ENTER TO PLAY · B / ESC BACK</small>
            </>}
            {screen === 'tetris' && <TetrisScreen state={game} sound={sound} onSound={toggleSound} onDrop={drop} onRestart={start} onPause={pause} />}
          </div>
        </div>
        <div className="gameboy-brandline"><strong>tejas</strong><span>NAV BAR / PORTFOLIO</span></div>
        <div className="gameboy-controls">
          <span className="gameboy-control-label gameboy-control-label-dpad">{screen === 'tetris' ? 'MOVE' : 'SELECT'}</span>
          <span className="gameboy-control-label gameboy-control-label-b">BACK</span>
          <span className="gameboy-control-label gameboy-control-label-a">{screen === 'tetris' ? 'ROTATE' : 'OPEN'}</span>
          <div className="gameboy-dpad" aria-label="D-pad">
            <span aria-hidden="true" />
            {directions.map(direction => <button key={direction} type="button" className={`dpad-${direction}`} aria-label={direction[0].toUpperCase() + direction.slice(1)} onPointerDown={event => pointerMove(event, direction)} onPointerUp={stopHold} onPointerCancel={stopHold} onLostPointerCapture={stopHold} onClick={event => { if (event.detail === 0) move(direction) }}>{({ up: '▲', left: '◀', right: '▶', down: '▼' })[direction]}</button>)}
          </div>
          <div className="gameboy-center-controls">
            <button type="button" data-console-native aria-label={screen === 'tetris' ? 'Select: hard drop' : 'Select next menu item'} onClick={() => { if (screen === 'tetris') drop(); else { move('down'); focusConsole() } }}><i /><small>SELECT</small></button>
            <button type="button" data-console-native aria-label={screen === 'tetris' ? 'Start: pause or resume' : 'Start selected item'} onClick={screen === 'tetris' ? pause : act}><i /><small>START</small></button>
          </div>
          <div className="gameboy-ab">
            <button type="button" className="gameboy-b" onClick={back} aria-label="B: go back">B</button>
            <button type="button" className="gameboy-a" onClick={act} aria-label={screen === 'tetris' ? 'A: rotate or retry' : 'A: open selected item'}>A</button>
          </div>
        </div>
        <div className="gameboy-speaker" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>
      </div>
      <p className="gameboy-caption" id="gameboy-keyboard-help">ARROWS MOVE · A / ENTER CONFIRM · B / ESC BACK</p>
    </div>
  )
}
