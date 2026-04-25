import { Scene } from 'phaser';
import { Fragment, render, Text } from 'phaser-jsx';

import { Button } from '../components';
import { KEY, TILE_SIZE, TILESET_NAME } from '../constants';

const SCROLL_SPEED = 20;
const BACKGROUND_TILES = [
  17, 18, 19, 49, 50, 51, 80, 81, 82, 112, 113, 114, 145, 146, 147,
];

export class Menu extends Scene {
  private backgroundLayer!: Phaser.Tilemaps.TilemapLayer;
  private scrollAccumulator = 0;

  constructor() {
    super(KEY.SCENE.MENU);
  }

  create() {
    this.sound.stopAll();
    this.sound.play(KEY.MUSIC.MENU, { loop: true });

    this.createBackground();

    const { centerX, centerY, height } = this.cameras.main;

    render(
      <Fragment>
        <Text
          x={centerX}
          y={height / 3}
          text="Deus Ex Machina"
          style={{
            fontSize: 48,
            fontFamily: 'monospace',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
          }}
          originX={0.5}
          originY={0.5}
        />

        <Button
          x={centerX}
          y={centerY}
          text="Start Game"
          onClick={() => {
            this.handleStart();
          }}
        />
      </Fragment>,
      this,
    );
  }

  update(_time: number, delta: number) {
    const scrollAmount = (SCROLL_SPEED * delta) / 1000;
    this.backgroundLayer.x += scrollAmount;
    this.scrollAccumulator += scrollAmount;

    const screenWidth = this.cameras.main.width;
    if (this.scrollAccumulator >= screenWidth) {
      this.scrollAccumulator -= screenWidth;
      this.backgroundLayer.x -= screenWidth;
    }
  }

  private createBackground() {
    const { width, height } = this.cameras.main;
    const mapWidth = Math.ceil((width * 3) / TILE_SIZE);
    const mapHeight = Math.ceil(height / TILE_SIZE);

    const map = this.make.tilemap({
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
      width: mapWidth,
      height: mapHeight,
    });

    const tileset = map.addTilesetImage(
      TILESET_NAME,
      KEY.IMAGE.TILES,
      TILE_SIZE,
      TILE_SIZE,
      1,
      2,
    )!;

    const data: number[][] = [];
    for (let y = 0; y < mapHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < mapWidth; x++) {
        const randomIndex = Math.floor(Math.random() * BACKGROUND_TILES.length);
        row.push(BACKGROUND_TILES[randomIndex]);
      }
      data.push(row);
    }

    this.backgroundLayer = map
      .createBlankLayer('Background', tileset)!
      .putTilesAt(data, 0, 0);
    this.backgroundLayer.setAlpha(0.4);
    this.backgroundLayer.setScrollFactor(0);
    this.backgroundLayer.x = -width;
  }

  private handleStart() {
    this.scene.start(KEY.SCENE.MAIN, { level: 0 });
  }
}
