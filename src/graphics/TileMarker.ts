import Phaser from 'phaser';

import { KEY, TILE } from '../constants';

export class TileMarker extends Phaser.GameObjects.Graphics {
  private static readonly ROTATION_STEP = Phaser.Math.DegToRad(90);

  private map!: Phaser.Tilemaps.Tilemap;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private wasLeftButtonDown = false;
  private inputDelay = 300; // ms to wait before processing input
  private lastTileRotation = Phaser.Math.DegToRad(90);

  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
  ) {
    super(scene);
    this.map = map;
    this.groundLayer = groundLayer;

    this.lineStyle(5, 0xffffff, 1);
    this.strokeRect(0, 0, map.tileWidth, map.tileHeight);
    this.lineStyle(3, 0xff4f78, 1);
    this.strokeRect(0, 0, map.tileWidth, map.tileHeight);

    // Add the graphic to the scene
    scene.add.existing(this);
  }

  update() {
    // Skip input processing during initial delay to prevent accidental tile draw
    // when transitioning from menu (mouse button still down from clicking Start)
    if (this.inputDelay > 0) {
      this.inputDelay -= this.scene.game.loop.delta;
      this.wasLeftButtonDown =
        this.scene.input.manager.activePointer.leftButtonDown();
      return;
    }

    // Convert the mouse position to world position within the camera
    const worldPoint = this.scene.input.activePointer.positionToCamera(
      this.scene.cameras.main,
    ) as Phaser.Math.Vector2;

    // Place the marker in world space, but snap it to the tile grid. If we convert world -> tile and
    // then tile -> world, we end up with the position of the tile under the pointer
    const pointerTileXY = this.map.worldToTileXY(worldPoint.x, worldPoint.y)!;
    const snappedWorldPoint = this.map.tileToWorldXY(
      pointerTileXY.x,
      pointerTileXY.y,
    )!;
    this.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);

    // When mouse is down, put a colliding tile at the mouse location
    // Draw or erase tiles (only within the groundLayer)
    const { activePointer } = this.scene.input.manager;
    if (activePointer.leftButtonDown()) {
      try {
        const tile = this.groundLayer.getTileAtWorldXY(
          worldPoint.x,
          worldPoint.y,
        ) as Phaser.Tilemaps.Tile | null;

        if (!this.wasLeftButtonDown && tile?.index === TILE.ARROW) {
          tile.rotation += TileMarker.ROTATION_STEP;
          this.lastTileRotation = tile.rotation;
          this.scene.sound.play(KEY.SOUND.DRAW);
        } else if (!tile) {
          const newTile = this.groundLayer
            .putTileAtWorldXY(TILE.ARROW, worldPoint.x, worldPoint.y)
            .setCollision(true);
          newTile.rotation = this.lastTileRotation;
          this.scene.sound.play(KEY.SOUND.DRAW);
        }
      } catch {
        // don't draw tile if outside of game world
      }
    } else if (activePointer.rightButtonDown()) {
      const tile = this.groundLayer.getTileAtWorldXY(
        worldPoint.x,
        worldPoint.y,
      ) as Phaser.Tilemaps.Tile | null;

      if (tile && tile.index !== TILE.INDESTRUCTIBLE) {
        this.groundLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
        this.scene.sound.play(KEY.SOUND.ERASE);
      }
    }

    this.wasLeftButtonDown = activePointer.leftButtonDown();
  }
}
