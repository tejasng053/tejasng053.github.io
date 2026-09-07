import { tetrisDisplay } from './engine'
import type { Tetris } from './engine'

type Props = { state: Tetris; sound: boolean; onSound: () => void; onDrop: () => void; onRestart: () => void; onPause: () => void }
export function TetrisScreen({ state, sound, onSound, onDrop, onRestart, onPause }: Props) {
  return (
    <>
      <div className="gameboy-screen-head"><span>TETRIS</span><span role="status">{state.over ? 'GAME OVER' : state.paused ? 'PAUSED' : 'PLAYING'}</span></div>
      <div className="gb-tetris-layout">
        <div className="gb-tetris-well" role="img" aria-label={`Tetris board, ${state.lines} lines cleared`}>
          <div className="gb-tetris-board" aria-hidden="true">
            {tetrisDisplay(state).flatMap((row, y) => row.map((cell, x) => <i key={`${x}-${y}`} data-cell={cell} />))}
          </div>
          {(state.over || state.paused) && <div className="gb-tetris-overlay"><strong>{state.over ? 'GAME OVER' : 'PAUSED'}</strong><span>{state.over ? 'A TO RETRY' : 'START TO PLAY'}</span></div>}
        </div>
        <div className="gb-tetris-stats">
          <small>SCORE</small><strong data-testid="score">{String(state.score).padStart(5, '0')}</strong>
          <small>LINES</small><strong>{String(state.lines).padStart(2, '0')}</strong>
          <button type="button" data-console-native onClick={onSound} aria-pressed={sound} aria-label={sound ? 'Mute sound' : 'Enable sound'}>SOUND {sound ? 'ON' : 'OFF'}</button>
          <button type="button" data-console-native onClick={state.over ? onRestart : onPause}>{state.over ? 'RETRY' : state.paused ? 'RESUME' : 'PAUSE'}</button>
          <button type="button" data-console-native onClick={onDrop} disabled={state.over || state.paused}>DROP ↓</button>
        </div>
      </div>
      <small className="gameboy-screen-help">← → MOVE · ↓ SOFT DROP · A / ↑ ROTATE<br />SPACE / SELECT DROP · B BACK · R RETRY</small>
    </>
  )
}
