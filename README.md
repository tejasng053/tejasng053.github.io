# Tejas NG portfolio

React + TypeScript portfolio, deployed to GitHub Pages from `main`.

## Homepage Game Boy

`GAMES` appears only at the end of the homepage console menu. It opens the arcade menu, then Tetris inside the same display. There is no Games route or main navbar link. The Pac-Man navbar transition remains on the normal portfolio pages.

- D-pad / arrow keys: select menu items or move the piece. Up rotates.
- A / Enter / Z: confirm, rotate, resume, or retry after game over.
- B / Escape / X: game → arcade menu → portfolio menu.
- Select / Space: hard drop during play.
- Start / P: pause or resume during play.
- R: restart Tetris. M or the sound button: mute/unmute.
- Hold left, right, or down on the physical D-pad to repeat movement.

Click or tab into the console to use the keyboard. Keyboard controls stay scoped to the console. Play pauses when the console loses focus, leaves the viewport, or the browser tab is hidden. Returning to the arcade menu ends the current run.

## Development and checks

```sh
npm ci
npm run dev
npm test
npm run build
```

Gameplay regression tests cover wall/floor collision, rotation, single and four-row clears, scoring, pause, blocked spawns, landing previews, and repeated inputs. GitHub Actions runs the tests and build before deployment.
