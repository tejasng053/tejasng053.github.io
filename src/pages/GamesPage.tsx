import { useCallback, useEffect, useMemo, useState } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right'
type GameName = 'tetris' | 'xo' | 'pacman'

function ArcadePad({
  onDirection,
  onA,
  onB,
  aLabel = 'A',
  bLabel = 'B',
}: {
  onDirection: (direction: Direction) => void
  onA: () => void
  onB: () => void
  aLabel?: string
  bLabel?: string
}) {
  return (
    <div className="arcade-pad" aria-label="On-screen game controls">
      <div className="arcade-dpad">
        <button type="button" className="pad-up" onClick={() => onDirection('up')} aria-label="Up">▲</button>
        <button type="button" className="pad-left" onClick={() => onDirection('left')} aria-label="Left">◀</button>
        <i aria-hidden="true" />
        <button type="button" className="pad-right" onClick={() => onDirection('right')} aria-label="Right">▶</button>
        <button type="button" className="pad-down" onClick={() => onDirection('down')} aria-label="Down">▼</button>
      </div>
      <div className="arcade-action-buttons">
        <button type="button" className="arcade-b" onClick={onB}><span>B</span><small>{bLabel}</small></button>
        <button type="button" className="arcade-a" onClick={onA}><span>A</span><small>{aLabel}</small></button>
      </div>
    </div>
  )
}

const TETRIS_SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 0], [0, 1, 1]],
]

type TetrisPiece = { shape: number[][]; x: number; y: number }

function makePiece(): TetrisPiece {
  const shape = TETRIS_SHAPES[Math.floor(Math.random() * TETRIS_SHAPES.length)].map((row) => [...row])
  return { shape, x: Math.floor((10 - shape[0].length) / 2), y: 0 }
}

function rotateShape(shape: number[][]) {
  return shape[0].map((_, column) => shape.map((row) => row[column]).reverse())
}

function emptyBoard() {
  return Array.from({ length: 18 }, () => Array(10).fill(0) as number[])
}

function TetrisGame({ active }: { active: boolean }) {
  const [board, setBoard] = useState<number[][]>(() => emptyBoard())
  const [piece, setPiece] = useState<TetrisPiece>(() => makePiece())
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [running, setRunning] = useState(true)
  const [sound, setSound] = useState(true)

  const beep = useCallback((frequency = 280, duration = .055) => {
    if (!sound) return
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = 'square'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(.035, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration)
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start()
    oscillator.stop(ctx.currentTime + duration)
    oscillator.addEventListener('ended', () => void ctx.close(), { once: true })
  }, [sound])

  const collides = useCallback((candidate: TetrisPiece, sourceBoard = board) => {
    return candidate.shape.some((row, sy) => row.some((value, sx) => {
      if (!value) return false
      const x = candidate.x + sx
      const y = candidate.y + sy
      return x < 0 || x >= 10 || y >= 18 || (y >= 0 && Boolean(sourceBoard[y]?.[x]))
    }))
  }, [board])

  const spawnOn = useCallback((nextBoard: number[][]) => {
    const next = makePiece()
    if (next.shape.some((row, sy) => row.some((value, sx) => value && nextBoard[next.y + sy]?.[next.x + sx]))) {
      setRunning(false)
      return
    }
    setPiece(next)
  }, [])

  const lockPiece = useCallback((current: TetrisPiece) => {
    const nextBoard = board.map((row) => [...row])
    current.shape.forEach((row, sy) => row.forEach((value, sx) => {
      if (value && current.y + sy >= 0) nextBoard[current.y + sy][current.x + sx] = 1
    }))
    const kept = nextBoard.filter((row) => row.some((value) => !value))
    const cleared = 18 - kept.length
    while (kept.length < 18) kept.unshift(Array(10).fill(0))
    setBoard(kept)
    if (cleared) {
      setLines((value) => value + cleared)
      setScore((value) => value + [0, 100, 300, 500, 800][cleared])
      beep(520 + cleared * 80, .09)
    } else {
      setScore((value) => value + 5)
      beep(190, .035)
    }
    spawnOn(kept)
  }, [board, beep, spawnOn])

  const move = useCallback((dx: number, dy: number) => {
    if (!running) return
    const next = { ...piece, x: piece.x + dx, y: piece.y + dy }
    if (!collides(next)) {
      setPiece(next)
      return true
    }
    if (dy > 0) lockPiece(piece)
    return false
  }, [piece, running, collides, lockPiece])

  const rotate = useCallback(() => {
    if (!running) return
    const rotated = { ...piece, shape: rotateShape(piece.shape) }
    if (!collides(rotated)) {
      setPiece(rotated)
      beep(340, .03)
    }
  }, [piece, running, collides, beep])

  const hardDrop = useCallback(() => {
    if (!running) return
    let dropped = { ...piece }
    while (!collides({ ...dropped, y: dropped.y + 1 })) dropped = { ...dropped, y: dropped.y + 1 }
    setScore((value) => value + Math.max(0, dropped.y - piece.y) * 2)
    lockPiece(dropped)
  }, [piece, running, collides, lockPiece])

  const reset = useCallback(() => {
    setBoard(emptyBoard())
    setPiece(makePiece())
    setScore(0)
    setLines(0)
    setRunning(true)
  }, [])

  useEffect(() => {
    if (!active || !running) return
    const timer = window.setInterval(() => move(0, 1), Math.max(180, 620 - lines * 12))
    return () => window.clearInterval(timer)
  }, [active, running, lines, move])

  useEffect(() => {
    if (!active) return
    const key = (event: KeyboardEvent) => {
      const map: Record<string, () => void> = {
        ArrowLeft: () => move(-1, 0),
        ArrowRight: () => move(1, 0),
        ArrowDown: () => move(0, 1),
        ArrowUp: rotate,
        ' ': hardDrop,
        z: rotate,
        Z: rotate,
        r: reset,
        R: reset,
      }
      if (!map[event.key]) return
      event.preventDefault()
      map[event.key]()
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [active, move, rotate, hardDrop, reset])

  const display = useMemo(() => {
    const result = board.map((row) => [...row])
    piece.shape.forEach((row, sy) => row.forEach((value, sx) => {
      const y = piece.y + sy
      const x = piece.x + sx
      if (value && y >= 0 && y < 18 && x >= 0 && x < 10) result[y][x] = 2
    }))
    return result
  }, [board, piece])

  const control = (direction: Direction) => {
    if (direction === 'left') move(-1, 0)
    if (direction === 'right') move(1, 0)
    if (direction === 'down') move(0, 1)
    if (direction === 'up') rotate()
  }

  return (
    <div className="arcade-game-shell tetris-shell">
      <div className="arcade-screen">
        <div className="arcade-screen-head"><span>TETRIS // TN-26</span><span>{running ? 'RUNNING' : 'GAME OVER'}</span></div>
        <div className="tetris-layout">
          <div className="tetris-board" aria-label="Tetris board">
            {display.flatMap((row, y) => row.map((value, x) => <i key={`${x}-${y}`} data-cell={value} />))}
          </div>
          <div className="tetris-stats">
            <small>SCORE</small><strong>{String(score).padStart(5, '0')}</strong>
            <small>LINES</small><strong>{String(lines).padStart(2, '0')}</strong>
            <button type="button" onClick={() => setSound((value) => !value)}>SOUND {sound ? 'ON' : 'OFF'}</button>
            {!running && <button type="button" className="arcade-restart" onClick={reset}>RESTART</button>}
          </div>
        </div>
      </div>
      <ArcadePad onDirection={control} onA={rotate} onB={hardDrop} aLabel="ROTATE" bLabel="DROP" />
      <p className="arcade-key-help">KEYBOARD: ← → MOVE · ↓ DROP · ↑/Z ROTATE · SPACE HARD DROP · R RESET</p>
    </div>
  )
}

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function winnerOf(board: string[]) {
  for (const [a, b, c] of WIN_LINES) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  return board.every(Boolean) ? 'DRAW' : ''
}

function TicTacToeGame({ active }: { active: boolean }) {
  const [board, setBoard] = useState<string[]>(() => Array(9).fill(''))
  const [cursor, setCursor] = useState(4)
  const result = winnerOf(board)
  const playerTurn = board.filter(Boolean).length % 2 === 0

  const reset = useCallback(() => {
    setBoard(Array(9).fill(''))
    setCursor(4)
  }, [])

  const place = useCallback(() => {
    if (result || !playerTurn || board[cursor]) return
    const next = [...board]
    next[cursor] = 'X'
    setBoard(next)
  }, [board, cursor, result, playerTurn])

  useEffect(() => {
    if (!active || result || playerTurn) return
    const timer = window.setTimeout(() => {
      const open = board.map((value, index) => value ? -1 : index).filter((index) => index >= 0)
      const tryMark = (mark: string) => {
        for (const index of open) {
          const test = [...board]
          test[index] = mark
          if (winnerOf(test) === mark) return index
        }
        return -1
      }
      const move = tryMark('O') >= 0 ? tryMark('O') : tryMark('X') >= 0 ? tryMark('X') : open.includes(4) ? 4 : open[Math.floor(Math.random() * open.length)]
      if (move == null || move < 0) return
      const next = [...board]
      next[move] = 'O'
      setBoard(next)
    }, 360)
    return () => window.clearTimeout(timer)
  }, [active, board, playerTurn, result])

  const moveCursor = useCallback((direction: Direction) => {
    setCursor((current) => {
      const row = Math.floor(current / 3)
      const col = current % 3
      if (direction === 'left') return row * 3 + (col + 2) % 3
      if (direction === 'right') return row * 3 + (col + 1) % 3
      if (direction === 'up') return ((row + 2) % 3) * 3 + col
      return ((row + 1) % 3) * 3 + col
    })
  }, [])

  useEffect(() => {
    if (!active) return
    const key = (event: KeyboardEvent) => {
      if (event.key.startsWith('Arrow')) {
        event.preventDefault()
        moveCursor(event.key.replace('Arrow', '').toLowerCase() as Direction)
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        place()
      }
      if (event.key === 'r' || event.key === 'R') reset()
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [active, moveCursor, place, reset])

  return (
    <div className="arcade-game-shell">
      <div className="arcade-screen xo-screen">
        <div className="arcade-screen-head"><span>X/O // VS CPU</span><span>{result || (playerTurn ? 'YOUR TURN' : 'CPU THINKING')}</span></div>
        <div className="xo-board">
          {board.map((value, index) => (
            <button key={index} type="button" className={cursor === index ? 'cursor' : ''} onClick={() => { setCursor(index); if (!value && playerTurn && !result) { const next = [...board]; next[index] = 'X'; setBoard(next) } }}>
              {value}
            </button>
          ))}
        </div>
      </div>
      <ArcadePad onDirection={moveCursor} onA={place} onB={reset} aLabel="PLACE X" bLabel="RESET" />
      <p className="arcade-key-help">KEYBOARD: ARROWS SELECT · ENTER/SPACE PLACE X · R RESET</p>
    </div>
  )
}

const MAZE = [
  '###########',
  '#.........#',
  '#.###.###.#',
  '#.#.....#.#',
  '#.#.###.#.#',
  '#...#.#...#',
  '###.#.#.###',
  '#.........#',
  '#.###.###.#',
  '#.........#',
  '###########',
]

function PacmanGame({ active }: { active: boolean }) {
  const startDots = useMemo(() => {
    const dots = new Set<string>()
    MAZE.forEach((row, y) => [...row].forEach((cell, x) => { if (cell === '.') dots.add(`${x},${y}`) }))
    return dots
  }, [])
  const [player, setPlayer] = useState({ x: 1, y: 1 })
  const [ghost, setGhost] = useState({ x: 9, y: 9 })
  const [dots, setDots] = useState<Set<string>>(() => new Set(startDots))
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState('READY')

  const reset = useCallback(() => {
    setPlayer({ x: 1, y: 1 })
    setGhost({ x: 9, y: 9 })
    setDots(new Set(startDots))
    setScore(0)
    setStatus('READY')
  }, [startDots])

  const walkable = (x: number, y: number) => MAZE[y]?.[x] && MAZE[y][x] !== '#'

  const ghostStep = useCallback((target: { x: number; y: number }, current: { x: number; y: number }) => {
    const options = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ].filter((point) => walkable(point.x, point.y))
    options.sort((a, b) => (Math.abs(a.x - target.x) + Math.abs(a.y - target.y)) - (Math.abs(b.x - target.x) + Math.abs(b.y - target.y)))
    return Math.random() < .72 ? options[0] : options[Math.floor(Math.random() * options.length)]
  }, [])

  const move = useCallback((direction: Direction) => {
    if (status === 'CAUGHT' || status === 'CLEARED') return
    const delta = direction === 'left' ? [-1, 0] : direction === 'right' ? [1, 0] : direction === 'up' ? [0, -1] : [0, 1]
    const next = { x: player.x + delta[0], y: player.y + delta[1] }
    if (!walkable(next.x, next.y)) return
    const nextDots = new Set(dots)
    const key = `${next.x},${next.y}`
    if (nextDots.delete(key)) {
      setScore((value) => value + 10)
      setDots(nextDots)
      if (nextDots.size === 0) setStatus('CLEARED')
      else setStatus('CHASE')
    }
    const nextGhost = ghostStep(next, ghost)
    setPlayer(next)
    setGhost(nextGhost)
    if ((nextGhost.x === next.x && nextGhost.y === next.y) || (ghost.x === next.x && ghost.y === next.y)) setStatus('CAUGHT')
  }, [player, ghost, dots, status, ghostStep])

  useEffect(() => {
    if (!active) return
    const key = (event: KeyboardEvent) => {
      if (event.key.startsWith('Arrow')) {
        event.preventDefault()
        move(event.key.replace('Arrow', '').toLowerCase() as Direction)
      }
      if (event.key === 'r' || event.key === 'R') reset()
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [active, move, reset])

  return (
    <div className="arcade-game-shell">
      <div className="arcade-screen pacman-screen">
        <div className="arcade-screen-head"><span>PAC-MINI // MAZE 01</span><span>{status} · {score}</span></div>
        <div className="pacman-board">
          {MAZE.flatMap((row, y) => [...row].map((cell, x) => {
            const here = `${x},${y}`
            const type = cell === '#' ? 'wall' : player.x === x && player.y === y ? 'pac' : ghost.x === x && ghost.y === y ? 'ghost' : dots.has(here) ? 'dot' : 'floor'
            return <i key={here} data-type={type} />
          }))}
        </div>
      </div>
      <ArcadePad onDirection={move} onA={() => move('right')} onB={reset} aLabel="GO" bLabel="RESET" />
      <p className="arcade-key-help">KEYBOARD: ARROW KEYS MOVE · R RESET · EAT EVERY DOT, AVOID THE GHOST</p>
    </div>
  )
}

export function GamesPage() {
  const [game, setGame] = useState<GameName>('tetris')

  return (
    <div className="route-page games-page">
      <section className="games-intro">
        <div className="games-intro-meta"><span>06 / PLAYGROUND</span><span>KEYBOARD + ON-SCREEN CONTROLS</span></div>
        <div>
          <p className="studio-eyebrow">A SMALL BREAK BETWEEN BUILDS</p>
          <h1>Press start.<br /><span>Stay curious.</span></h1>
          <p>Three tiny games built directly into the portfolio. No downloads, no external game engines — just browser code and a little nostalgia.</p>
        </div>
      </section>

      <section className="arcade-section">
        <div className="arcade-selector" role="tablist" aria-label="Choose a game">
          <button type="button" role="tab" aria-selected={game === 'tetris'} className={game === 'tetris' ? 'active' : ''} onClick={() => setGame('tetris')}><small>01</small><span>Tetris</span><b>Sound + score</b></button>
          <button type="button" role="tab" aria-selected={game === 'xo'} className={game === 'xo' ? 'active' : ''} onClick={() => setGame('xo')}><small>02</small><span>X / O</span><b>Play the CPU</b></button>
          <button type="button" role="tab" aria-selected={game === 'pacman'} className={game === 'pacman' ? 'active' : ''} onClick={() => setGame('pacman')}><small>03</small><span>Pac-Mini</span><b>Eat the dots</b></button>
        </div>

        <div className="arcade-cabinet">
          <div className="arcade-cabinet-top"><span>TEJAS / ARCADE SYSTEM</span><span>TN-26</span></div>
          <div className="arcade-game-stage">
            <div hidden={game !== 'tetris'}><TetrisGame active={game === 'tetris'} /></div>
            <div hidden={game !== 'xo'}><TicTacToeGame active={game === 'xo'} /></div>
            <div hidden={game !== 'pacman'}><PacmanGame active={game === 'pacman'} /></div>
          </div>
          <div className="arcade-cabinet-foot"><span>MOVE WITH THE KEYS OR THE CONTROLLER BELOW</span><span>PLAY / LEARN / REPEAT</span></div>
        </div>
      </section>
    </div>
  )
}
