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

  /**
   * @see https://docs.wavedash.com/engines/phaser
   */
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
  backgroundColor: '#1d212d',
  pixelArt: true,

  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
});
