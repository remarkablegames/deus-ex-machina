# Tile Budget Feature

Add a per-level tile drawing budget system that limits how many tiles players can place, with UI feedback and refund on erase.

## Plan

1. **Update Level interface** (`src/constants/level.ts`)
   - Add `BUDGET?: number` field (optional) to `Level` interface
   - `undefined` = no budget display, infinite tiles (for tutorial levels)
   - `Infinity` = show display with '∞' symbol, unlimited tiles
   - Finite numbers = limited budget with display (e.g., 21, 15, 30, 30, 30)

2. **Create BudgetTracker class** (`src/utils/BudgetTracker.ts`)
   - Track remaining tiles vs max budget (or Infinity for unlimited)
   - Methods: `canDraw()`, `recordDraw()`, `recordErase()`, `getRemaining()`, `getMax()`, `isInfinite()`, `onChange()`
   - `canDraw()` always returns true when budget is Infinity
   - `onChange()` registers listeners for reactive UI updates (returns unsubscribe function)
   - Only instantiated when level has a defined BUDGET (undefined means no tracker)

3. **Integrate budget into Main scene** (`src/scenes/Main.tsx`)
   - Instantiate BudgetTracker in `create()` only when `this.level.BUDGET` is defined
   - Pass tracker to TileMarker (or null if no budget)

4. **Update TileMarker** (`src/graphics/TileMarker.ts`)
   - Accept optional BudgetTracker in constructor
   - If tracker exists: check `canDraw()` before placing new tile
   - If tracker exists: call `recordDraw()` on successful tile placement
   - If tracker exists: call `recordErase()` when erasing any ARROW tile (all arrows refund equally)

5. **Add BudgetDisplay component** (`src/components/BudgetDisplay.tsx`)
   - Display "Arrow: X/Y" or "Arrow: ∞" in top-right corner
   - Accepts budget tracker, only renders when budget is defined
   - Shows '∞' symbol when budget is Infinity
   - Uses `useState` and `useEffect` to subscribe to BudgetTracker changes via `onChange()`
   - Updates reactively when budget changes (draw/erase)
   - Use phaser-jsx for rendering

6. **Export and wire up** (`src/components/index.ts`, `src/scenes/Main.tsx`)
   - Export BudgetDisplay from components
   - Conditionally render BudgetDisplay in Main scene only when budget is defined

## Files to Modify

- `src/constants/level.ts`
- `src/graphics/TileMarker.ts`
- `src/scenes/Main.tsx`
- `src/components/index.ts`

## Files to Create

- `src/utils/BudgetTracker.ts`
- `src/components/BudgetDisplay.tsx`
