import { Scene } from 'phaser';

import { KEY } from '../constants';

const FADE_DURATION = 800;
const DISPLAY_DURATION = 2000;
const PLAYER_SCALE = 4;
const IDLE_ANIMATION_KEY = 'SPLASH_IDLE';

export class Splash extends Scene {
  constructor() {
    super(KEY.SCENE.SPLASH);
  }

  create() {
    const { centerX, centerY } = this.cameras.main;

    this.anims.create({
      key: IDLE_ANIMATION_KEY,
      frames: this.anims.generateFrameNumbers(KEY.SPRITESHEET.PLAYER, {
        start: 0,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.add
      .sprite(centerX, centerY - 20, KEY.SPRITESHEET.PLAYER)
      .setScale(PLAYER_SCALE)
      .play(IDLE_ANIMATION_KEY);

    this.add
      .text(centerX, centerY + 120, 'Deus Ex Machina', {
        fontSize: 48,
        fontFamily: 'monospace',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.cameras.main.fadeIn(FADE_DURATION);

    this.time.delayedCall(DISPLAY_DURATION, () => {
      this.goToMenu();
    });

    this.input.once('pointerdown', () => {
      this.goToMenu();
    });

    this.input.keyboard?.once('keydown', () => {
      this.goToMenu();
    });
  }

  private goToMenu() {
    this.time.removeAllEvents();
    this.input.removeAllListeners();
    this.cameras.main.fadeOut(FADE_DURATION);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(KEY.SCENE.MENU);
    });
  }
}
