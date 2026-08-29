# Mobile Support Plan

Make the game playable on mobile landscape by adding a touch toolbar for place/rotate/erase modes, pinch-to-zoom and drag-to-pan, and enforcing landscape orientation.

## Goals

- Support tap input for the editor on mobile devices.
- Force landscape orientation.
- Keep existing desktop behavior unchanged.

## Changes

### 1. Orientation

- Update `public/manifest.webmanifest` orientation to `landscape-primary`.
- Attempt `screen.orientation.lock('landscape')` when the game starts; gracefully ignore unsupported browsers.

### 2. Touch Toolbar

- Add a `MobileToolbar` component in `src/components/` rendered in `Main.tsx` when `isMobile()` is true.
- Buttons: **Pan**, **Place**, **Rotate**, **Erase**, **Restart**.
- Add a draggable `≡` handle to the right of **Restart**.
- Only show on touch devices.
- Default the toolbar at the bottom-center of the screen (`x = width / 2`, `y = height - 60`, `scale = 1.25`).
- Allow dragging the toolbar anywhere within the current camera view.
- Preserve the dragged toolbar position across mode changes.
- **Restart** restarts the current level, preserving the current drawn tiles.
- Hide the desktop `BudgetDisplay` **Reset** button on mobile; keep the `Arrows` counter visible.
- Scale mobile `Text` UI objects by 1.5x and the toolbar by 1.25x.

### 3. Tile Editing

- Update `TileMarker.ts` to track an active `editMode` (`'pan' | 'place' | 'rotate' | 'erase'`) and expose it as a shared `EditMode` type.
- On mobile, hide the `TileMarker` hover outline and use the tap position for the tile action.
- On a tap (or tap-and-drag) in the level:
  - `pan` is a no-op for tile editing; one-finger drag pans the camera.
  - `place` draws a new arrow if the tile is empty and budget allows.
  - `rotate` cycles the rotation of an existing arrow tile.
  - `erase` removes an arrow or ground tile.
- Support continuous place/erase by dragging with the pointer held down.
- Keep existing desktop mouse/keyboard behavior (left click, right click, R restart) working.

### 4. Camera (Mobile)

- Add pinch-to-zoom and drag-to-pan for mobile.
- Distinguish gestures by pointer count and mode:
  - One quick release with little movement = tap; performs the active `place`/`rotate`/`erase` action.
  - One finger held and dragged only pans the camera when `editMode` is `pan`.
  - Two fingers moving apart/together = pinch zoom.
- Clamp zoom between `cameras.main.width / groundLayer.width` and `3`.
- Keep desktop behavior unchanged.

### 5. Resize Handling

- Keep `Scale.FIT` and `Scale.CENTER_BOTH` in `src/index.ts`.
- Toolbar defaults to the bottom-center at the start of each level; the player can drag it out of the way.

### 6. Level Hints

- Add a `src/utils/mobile.ts` helper that exports an `isMobile()` function for detecting touch/mobile devices.
- Convert the desktop-only `TEXT` strings in `LEVELS` to `get TEXT()` getters that return a mobile hint when `isMobile()` is true and the existing hint otherwise.
- Keep `HelpText` unchanged; it reads `level.TEXT` as a string.

### 7. Verification

- Run `npm start` and test on a mobile device or DevTools mobile emulation.
- Verify all three modes and the reset/restart flows work with touch.
