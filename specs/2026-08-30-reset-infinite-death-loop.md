# Reset Level on Infinite Death Loop

Track the time between consecutive player deaths in `Main.tsx` and, when three or more deaths occur within a 1.5-second rolling window, perform a hard level reset that restarts the scene without restoring the player's drawn tiles.

## Background

- Related issue: <https://github.com/remarkablegames/deus-ex-machina/issues/32>
- `src/scenes/Main.tsx` handles player death in `killPlayer()`, which calls `this.scene.restart({ level, savedTiles })` after a fade-out.
- `src/graphics/TileMarker.ts` uses `savedTiles` in `restoreTiles()` to redraw player-placed arrows and charges them against the `BudgetTracker`.
- Passing `savedTiles: undefined` on restart will reload the original map state, effectively clearing all player modifications.

## Implementation

1. Add two constants near the top of `src/scenes/Main.tsx`:
   - `DEATH_LOOP_WINDOW_MS = 1500`
   - `DEATH_LOOP_MAX_COUNT = 3`

2. Add state to the `Main` class:
   - `private lastDeathTime = -Infinity`
   - `private rapidDeathCount = 0`

3. Modify `killPlayer()`:
   - At the start, compute `const now = this.time.now`.
   - If `now - this.lastDeathTime <= DEATH_LOOP_WINDOW_MS`, increment `rapidDeathCount`; otherwise reset it to `1`.
   - Set `this.lastDeathTime = now`.
   - If `rapidDeathCount >= DEATH_LOOP_MAX_COUNT`, restart the scene with `savedTiles: undefined` (a hard reset). Otherwise, restart with `this.tileMarker.getDrawnTiles()` as before.

## Open Questions / Notes

- The current restore logic only replays player-_placed_ arrows; erased original tiles already come back on every normal restart because the tilemap JSON is reloaded. A hard reset therefore only differs by also removing placed arrows and refunding the budget, which is what the user requested.
- The 1.5-second / 3-death values are the user's chosen starting point and can be tuned in `src/scenes/Main.tsx`.
