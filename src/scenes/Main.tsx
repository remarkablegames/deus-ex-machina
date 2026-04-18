import Phaser from 'phaser';
import { render } from 'phaser-jsx';

import { HelpText } from '../components';
import {
  KEY,
  TILE,
  TILEMAP_LAYER,
  TILEMAP_OBJECT,
  TILESET_NAME,
} from '../constants';
import { TileMarker } from '../graphics';
import { Player } from '../sprites';
import { getPlayerConveyorVelocity } from '../utils';

export class Main extends Phaser.Scene {
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private player!: Player;
  private spikeGroup!: Phaser.Physics.Arcade.StaticGroup;
  private tileMarker!: Phaser.GameObjects.Graphics;
  private isPlayerDead = false;
  private levelKey: string = KEY.TILEMAP.LEVEL1;

  constructor() {
    super(KEY.SCENE.MAIN);
  }

  init(data: { levelKey?: string }) {
    this.levelKey = data.levelKey ?? KEY.TILEMAP.LEVEL1;
  }

  create() {
    this.isPlayerDead = false;

    const map = this.make.tilemap({ key: this.levelKey });
    const tileset = map.addTilesetImage(TILESET_NAME, KEY.IMAGE.TILES)!;

    map.createLayer(TILEMAP_LAYER.BACKGROUND, tileset);
    this.groundLayer = map.createLayer(TILEMAP_LAYER.GROUND, tileset)!;
    map.createLayer(TILEMAP_LAYER.FOREGROUND, tileset);

    // Instantiate a player instance at the location of the "Spawn" object in the Tiled map
    const spawnPoint = map.findObject(
      TILEMAP_LAYER.OBJECTS,
      ({ name }) => name === TILEMAP_OBJECT.SPAWN,
    )!;
    this.player = new Player(this, spawnPoint.x!, spawnPoint.y!);

    // Find the Win object and create an invisible zone for collision
    const winPoint = map.findObject(
      TILEMAP_LAYER.OBJECTS,
      ({ name }) => name === TILEMAP_OBJECT.WIN,
    );
    if (winPoint) {
      const winZone = this.add.zone(winPoint.x!, winPoint.y!, 32, 32);
      this.physics.world.enable(winZone, Phaser.Physics.Arcade.STATIC_BODY);

      this.physics.add.overlap(this.player, winZone, () => {
        this.handleWin();
      });
    }

    // Collide the player against the ground layer
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider(this.player, this.groundLayer);

    // The map contains a row of spikes. The spike only take a small sliver of the tile graphic, so
    // if we let arcade physics treat the spikes as colliding, the player will collide while the
    // sprite is hovering over the spikes. We'll remove the spike tiles and turn them into sprites
    // so that we give them a more fitting hitbox
    this.spikeGroup = this.physics.add.staticGroup();
    this.groundLayer.forEachTile((tile) => {
      if (tile.index === TILE.SPIKE) {
        const spike = this.spikeGroup.create(
          tile.getCenterX(),
          tile.getCenterY(),
          KEY.IMAGE.SPIKE,
        ) as Phaser.Physics.Arcade.Sprite;
        const spikeBody = spike.body as Phaser.Physics.Arcade.StaticBody;

        // The map has spikes rotated in Tiled (z key), so parse out that angle to the correct body
        // placement
        spike.rotation = tile.rotation;
        if (spike.angle === 0) {
          spikeBody.setSize(32, 6).setOffset(0, 26);
        } else if (spike.angle === -90) {
          spikeBody.setSize(6, 32).setOffset(26, 0);
        } else if (spike.angle === 90) {
          spikeBody.setSize(6, 32).setOffset(0, 0);
        }

        this.groundLayer.removeTileAt(tile.x, tile.y);
      }
    });

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.tileMarker = new TileMarker(this, map, this.groundLayer);

    render(<HelpText />, this);
  }

  update() {
    if (this.isPlayerDead) {
      return;
    }

    this.player.update({
      conveyorVelocity: getPlayerConveyorVelocity(
        this.player,
        this.groundLayer,
      ),
    });
    this.tileMarker.update();

    if (
      this.player.y > this.groundLayer.height ||
      this.physics.world.overlap(this.player, this.spikeGroup)
    ) {
      // Flag that the player is dead so that we can stop update from running in the future
      this.isPlayerDead = true;

      this.cameras.main.shake(100, 0.05);
      this.cameras.main.fade(250, 0, 0, 0);

      // Freeze the player to leave them on screen while fading but remove the marker immediately
      this.player.freeze();

      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.player.destroy();
        this.scene.restart();
      });
    }
  }

  private handleWin() {
    const nextLevel = this.getNextLevel();
    if (nextLevel) {
      this.cameras.main.fade(250, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.restart({ levelKey: nextLevel });
      });
    }
  }

  private getNextLevel(): string | null {
    if (this.levelKey === KEY.TILEMAP.LEVEL1) {
      return KEY.TILEMAP.LEVEL2;
    }
    return null;
  }
}
