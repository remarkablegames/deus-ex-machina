import { Scene } from 'phaser';

import { KEY, LEVELS } from '../constants';

export class Boot extends Scene {
  constructor() {
    super(KEY.SCENE.BOOT);
  }

  preload() {
    this.load.spritesheet(
      KEY.SPRITESHEET.PLAYER,
      'sprites/0x72-industrial-player-32px-extruded.png',
      {
        frameWidth: 32,
        frameHeight: 32,
        margin: 1,
        spacing: 2,
      },
    );

    this.load.image(KEY.IMAGE.SPIKE, 'sprites/0x72-industrial-spike.png');

    this.load.image(
      KEY.IMAGE.TILES,
      'tilemaps/0x72-industrial-tileset-32px-extruded.png',
    );

    for (const { KEY, TILEMAP } of LEVELS) {
      this.load.tilemapTiledJSON(KEY, TILEMAP);
    }

    this.load.audio(KEY.MUSIC.BACKGROUND, 'music/background.mp3');
    this.load.audio(KEY.SOUND.JUMP, 'sounds/jump.mp3');
  }

  create() {
    this.sound.play(KEY.MUSIC.BACKGROUND, { loop: true });
    this.scene.start(KEY.SCENE.MAIN, { levelKey: this.getLevelKey() });
  }

  private getLevelKey() {
    const params = new URLSearchParams(window.location.search);
    const levelIndex = Number(params.get('level') ?? 0);
    return (LEVELS[levelIndex] ?? LEVELS[0]).KEY;
  }
}
