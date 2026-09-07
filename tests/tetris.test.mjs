import test from 'node:test'
import assert from 'node:assert/strict'
import { createTetris, collides, stepTetris, tetrisDisplay } from '../.test-build/engine.js'

test('piece movement respects both walls and the floor', () => {
  let game = createTetris(123)
  for (let i = 0; i < 20; i++) game = stepTetris(game, 'left')
  assert.equal(game.piece.x, 0)
  for (let i = 0; i < 20; i++) game = stepTetris(game, 'right')
  assert.equal(game.piece.x + game.piece.shape[0].length, 10)
  assert.equal(collides(game.board, { ...game.piece, y: 18 }), true)
})

test('hard drop clears a row, scores it, and spawns a valid piece without mutating the old board', () => {
  const game = createTetris(4)
  game.board[17] = [1,1,1,0,0,0,0,1,1,1]
  game.piece = { shape: [[1,1,1,1]], x: 3, y: 0 }
  const snapshot = structuredClone(game)
  const next = stepTetris(game, 'drop')
  assert.equal(next.lines, 1)
  assert.equal(next.score, 139)
  assert.ok(next.board.every(row => row.every(cell => !cell)))
  assert.equal(collides(next.board, next.piece), false)
  assert.deepEqual(game, snapshot)
})

test('four rows clear together and rotation kicks away from the wall', () => {
  const game = createTetris(7)
  for (let y = 14; y < 18; y++) game.board[y] = [1,1,1,1,1,0,1,1,1,1]
  game.piece = { shape: [[1],[1],[1],[1]], x: 5, y: 0 }
  const next = stepTetris(game, 'drop')
  assert.equal(next.lines, 4)
  assert.equal(next.score, 833)
  const wall = { ...createTetris(7), piece: { shape: [[1],[1],[1]], x: 9, y: 4 } }
  const rotated = stepTetris(wall, 'a')
  assert.equal(rotated.piece.shape[0].length, 3)
  assert.equal(collides(rotated.board, rotated.piece), false)
})

test('pause freezes gravity, movement and drop until resumed', () => {
  const paused = stepTetris(createTetris(5), 'pause')
  for (const input of ['tick','left','right','down','a','drop']) assert.equal(stepTetris(paused, input), paused)
  const resumed = stepTetris(paused, 'pause')
  assert.equal(stepTetris(resumed, 'tick').piece.y, resumed.piece.y + 1)
})

test('a blocked spawn ends the game and further input cannot change the board', () => {
  const game = createTetris(1)
  game.board[0] = [1,1,1,1,1,1,1,1,1,0]
  game.piece = { shape: [[1]], x: 9, y: 17 }
  const next = stepTetris(game, 'drop')
  assert.equal(next.over, true)
  assert.equal(stepTetris(next, 'tick'), next)
  assert.equal(stepTetris(next, 'drop'), next)
  assert.equal(createTetris(10).over, false)
})

test('preview shows the landing shadow without modifying gameplay state', () => {
  const game = createTetris(3), snapshot = structuredClone(game)
  const display = tetrisDisplay(game)
  assert.ok(display.flat().includes(2))
  assert.ok(display.flat().includes(3))
  assert.deepEqual(game, snapshot)
})

test('rapid inputs and repeated drops keep a valid bounded board across seeds', () => {
  for (let seed = 0; seed < 30; seed++) {
    let game = createTetris(seed)
    for (let i = 0; i < 300 && !game.over; i++) {
      game = stepTetris(game, ['a','left','tick','right','down','drop'][i % 6])
      assert.equal(game.board.length, 18)
      assert.ok(game.board.every(row => row.length === 10 && row.every(cell => cell === 0 || cell === 1)))
      if (!game.over) assert.equal(collides(game.board, game.piece), false)
    }
  }
})
