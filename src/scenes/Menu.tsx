import { Scene } from 'phaser';

import { KEY } from '../constants';

export class Menu extends Scene {
  constructor() {
    super(KEY.SCENE.MENU);
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add
      .text(width / 2, height / 3, 'Deus Ex Machina', {
        fontSize: '48px',
        fontFamily: 'monospace',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const startButton = this.add
      .text(width / 2, height / 2, 'Start Game', {
        fontSize: '24px',
        fontFamily: 'monospace',
        color: '#ffffff',
        backgroundColor: '#2d3142',
        padding: { x: 24, y: 16 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
      startButton.setBackgroundColor('#4a4e69');
    });

    startButton.on('pointerout', () => {
      startButton.setBackgroundColor('#2d3142');
    });

    startButton.on('pointerdown', () => {
      this.handleStart();
    });
  }

  private handleStart() {
    const params = new URLSearchParams(window.location.search);
    const levelIndex = Number(params.get('level') ?? 0);
    this.scene.start(KEY.SCENE.MAIN, { levelIndex });
  }
}
