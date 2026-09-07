export type Direction = 'up' | 'down' | 'left' | 'right'
export type Input = Direction | 'a' | 'drop' | 'tick' | 'pause'

const SHAPES = [
  [[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]],
  [[0, 1, 1], [1, 1, 0]], [[1, 1, 0], [0, 1, 1]],
]
export type Piece = { shape: number[][]; x: number; y: number }
export type Tetris = { board: number[][]; piece: Piece; seed: number; score: number; lines: number; over: boolean; paused: boolean }
const emptyBoard = () => Array.from({ length: 18 }, () => Array<number>(10).fill(0))
function nextPiece(seed: number) {
  const next = (Math.imul(seed, 1664525) + 1013904223) >>> 0
  const shape = SHAPES[(next >>> 16) % SHAPES.length]
  return { seed: next, piece: { shape, x: Math.floor((10 - shape[0].length) / 2), y: 0 } }
}
export function createTetris(seed: number): Tetris {
  return { board: emptyBoard(), ...nextPiece(seed), score: 0, lines: 0, over: false, paused: false }
}
export function collides(board: number[][], piece: Piece) {
  return piece.shape.some((row, sy) => row.some((cell, sx) => cell && (
    piece.x + sx < 0 || piece.x + sx >= 10 || piece.y + sy >= 18 || piece.y + sy < 0 || Boolean(board[piece.y + sy]?.[piece.x + sx])
  )))
}
function lock(state: Tetris, piece: Piece): Tetris {
  const board = state.board.map(row => [...row])
  piece.shape.forEach((row, sy) => row.forEach((cell, sx) => { if (cell) board[piece.y + sy][piece.x + sx] = 1 }))
  const kept = board.filter(row => row.some(cell => !cell))
  const cleared = 18 - kept.length
  while (kept.length < 18) kept.unshift(Array<number>(10).fill(0))
  const next = nextPiece(state.seed)
  return { ...state, ...next, board: kept, lines: state.lines + cleared, score: state.score + [0, 100, 300, 500, 800][cleared] + 5, over: collides(kept, next.piece) }
}
export function stepTetris(state: Tetris, input: Input): Tetris {
  if (input === 'pause' && !state.over) return { ...state, paused: !state.paused }
  if (state.over || state.paused) return state
  if (input === 'up' || input === 'a') {
    const shape = state.piece.shape[0].map((_, col) => state.piece.shape.map(row => row[col]).reverse())
    // Small wall kicks allow rotation against the side of the well.
    for (const dx of [0, -1, 1, -2, 2]) {
      const piece = { ...state.piece, shape, x: state.piece.x + dx }
      if (!collides(state.board, piece)) return { ...state, piece }
    }
  }
  if (input === 'drop') {
    let piece = state.piece
    while (!collides(state.board, { ...piece, y: piece.y + 1 })) piece = { ...piece, y: piece.y + 1 }
    return lock({ ...state, score: state.score + (piece.y - state.piece.y) * 2 }, piece)
  }
  if (['left', 'right', 'down', 'tick'].includes(input)) {
    const falling = input === 'down' || input === 'tick'
    const piece = { ...state.piece, x: state.piece.x + (input === 'left' ? -1 : input === 'right' ? 1 : 0), y: state.piece.y + (falling ? 1 : 0) }
    if (!collides(state.board, piece)) return { ...state, piece }
    if (falling) return lock(state, state.piece)
  }
  return state
}
export function tetrisDisplay(state: Tetris) {
  const board = state.board.map(row => [...row])
  if (state.over) return board
  let shadow = state.piece
  while (!collides(state.board, { ...shadow, y: shadow.y + 1 })) shadow = { ...shadow, y: shadow.y + 1 }
  for (const [piece, value] of [[shadow, 3], [state.piece, 2]] as const) {
    piece.shape.forEach((row, sy) => row.forEach((cell, sx) => { if (cell) board[piece.y + sy][piece.x + sx] = value }))
  }
  return board
}

