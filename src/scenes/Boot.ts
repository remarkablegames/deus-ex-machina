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

    for (const { TILEMAP } of LEVELS) {
      this.load.tilemapTiledJSON(TILEMAP, TILEMAP);
    }

    for (const key in KEY.MUSIC) {
      this.load.audio(key, `music/${key.toLowerCase()}.mp3`);
    }

    for (const key in KEY.SOUND) {
      this.load.audio(key, `sounds/${key.toLowerCase()}.mp3`);
    }
  }

  create() {
    const params = new URLSearchParams(window.location.search);
    const levelParam = params.get('level');
    const level = levelParam !== null ? parseInt(levelParam, 10) : NaN;

    if (!isNaN(level) && level >= 0) {
      this.scene.start(KEY.SCENE.MAIN, { level });
    } else {
      this.scene.start(KEY.SCENE.MENU);
    }
  }
}
