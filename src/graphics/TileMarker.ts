import Phaser from 'phaser';

import { KEY, TILE } from '../constants';

const TINT_COLOR = 0xff8000;
const OUTLINE_OUTER_COLOR = 0xffffff;
const OUTLINE_INNER_COLOR = 0xff4f78;
const OUTLINE_OUTER_WIDTH = 5;
const OUTLINE_INNER_WIDTH = 3;

export class TileMarker extends Phaser.GameObjects.Sprite {
  private static readonly ROTATION_STEP = Phaser.Math.DegToRad(90);

  private map!: Phaser.Tilemaps.Tilemap;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private wasLeftButtonDown = false;
  private inputDelay = 300; // ms to wait before processing input
  private lastTileRotation = Phaser.Math.DegToRad(90);
  private outline: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    groundLayer: Phaser.Tilemaps.TilemapLayer,
  ) {
    // Create a transparent texture for the sprite
    const textureKey = 'tile-marker';
    if (!scene.textures.exists(textureKey)) {
      const graphics = scene.add.graphics();
      graphics.fillStyle(0xffffff, 0.2);
      graphics.fillRect(0, 0, map.tileWidth, map.tileHeight);
      graphics.generateTexture(textureKey, map.tileWidth, map.tileHeight);
      graphics.destroy();
    }

    super(scene, 0, 0, textureKey);

    this.map = map;
    this.groundLayer = groundLayer;

    // Add the sprite to the scene
    scene.add.existing(this);

    // Create outline graphics
    this.outline = scene.add.graphics();
    this.drawOutline();
  }

  private drawOutline(): void {
    this.outline.clear();
    this.outline.lineStyle(OUTLINE_OUTER_WIDTH, OUTLINE_OUTER_COLOR, 1);
    this.outline.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
    this.outline.lineStyle(OUTLINE_INNER_WIDTH, OUTLINE_INNER_COLOR, 1);
    this.outline.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
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
    this.setPosition(
      snappedWorldPoint.x + this.map.tileWidth / 2,
      snappedWorldPoint.y + this.map.tileHeight / 2,
    );
    this.outline.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);

    // Check if tile exists and update tint (any tile on groundLayer is editable)
    const tile = this.groundLayer.getTileAtWorldXY(
      worldPoint.x,
      worldPoint.y,
    ) as Phaser.Tilemaps.Tile | null;

    if (tile && tile.index !== TILE.PERMANENT) {
      this.setVisible(true);
      this.setTint(TINT_COLOR);
    } else {
      this.setVisible(false);
    }

    // When mouse is down, put a colliding tile at the mouse location
    // Draw or erase tiles (only within the groundLayer)
    const { activePointer } = this.scene.input.manager;
    if (activePointer.leftButtonDown()) {
      try {
        const clickedTile = this.groundLayer.getTileAtWorldXY(
          worldPoint.x,
          worldPoint.y,
        ) as Phaser.Tilemaps.Tile | null;

        if (!this.wasLeftButtonDown && clickedTile?.index === TILE.ARROW) {
          clickedTile.rotation += TileMarker.ROTATION_STEP;
          this.lastTileRotation = clickedTile.rotation;
          this.scene.sound.play(KEY.SOUND.DRAW);
        } else if (!clickedTile) {
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

      if (tile && tile.index !== TILE.PERMANENT) {
        this.groundLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
        this.scene.sound.play(KEY.SOUND.ERASE);
      }
    }

    this.wasLeftButtonDown = activePointer.leftButtonDown();
  }
}
