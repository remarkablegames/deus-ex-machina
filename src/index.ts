import type { WavedashSDK } from '@wvdsh/sdk-js';
import { Game, Scale } from 'phaser';

import * as scenes from './scenes';

/**
 * @see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/game/
 */
new Game({
  width: 1280,
  height: 720,
  title: 'Deus Ex Machina',
  url: import.meta.env.VITE_APP_HOMEPAGE,
  version: import.meta.env.VITE_APP_VERSION,

  scene: [
    scenes.Boot,
    ...Object.values(scenes).filter((scene) => scene !== scenes.Boot),
  ],

  callbacks: {
    postBoot: () => {
      try {
        const Wavedash = (window as unknown as { Wavedash: WavedashSDK })
          .Wavedash;
        Wavedash.updateLoadProgressZeroToOne(1);
        Wavedash.init();
      } catch {
        // don't throw TypeError on non-Wavedash platforms
      }

      try {
        screen.orientation.lock('landscape').catch(() => {
          // ignore unsupported browsers
        });
      } catch {
        // ignore missing screen.orientation API
      }
    },
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        x: 0,
        y: 1000,
      },
      debug: import.meta.env.DEV,
    },
  },

  disableContextMenu: true,
  input: {
    touch: {
      capture: true,
    },
  },
  backgroundColor: '#1d212d',
  pixelArt: true,

  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
});
