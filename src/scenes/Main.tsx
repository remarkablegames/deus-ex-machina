import Phaser from 'phaser';
import { Container, render } from 'phaser-jsx';

import { BudgetDisplay, HelpText } from '../components';
import {
  KEY,
  type Level,
  LEVELS,
  TILE,
  TILEMAP_LAYER,
  TILEMAP_OBJECT,
  TILESET_NAME,
} from '../constants';
import { TileMarker } from '../graphics';
import { Player } from '../sprites';
import { BudgetTracker, getPlayerConveyorVelocity } from '../utils';

const FADE_DURATION = 200;
const DUST_SPEED = 5;

export class Main extends Phaser.Scene {
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private player!: Player;
  private spikeGroup!: Phaser.Physics.Arcade.StaticGroup;
  private tileMarker!: TileMarker;
  private isPlayerDead = false;
  private level!: Level;
  private dustParticles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private budgetTracker!: BudgetTracker;
  private savedTiles?: { x: number; y: number; rotation: number }[];

  constructor() {
    super(KEY.SCENE.MAIN);
  }

  init(data: {
    level: number;
    savedTiles?: { x: number; y: number; rotation: number }[];
  }) {
    this.level = LEVELS[data.level] ?? LEVELS[0];
    this.savedTiles = data.savedTiles;
  }

  create() {
    this.isPlayerDead = false;

    this.cameras.main.fadeIn(FADE_DURATION);

    this.sound.stopByKey(KEY.SOUND.TYPEWRITER);

    const musicKeys: string[] = Object.values(KEY.MUSIC);
    const playingMusic = this.sound
      .getAllPlaying()
      .find((sound) => musicKeys.includes(sound.key));

    if (playingMusic?.key !== this.level.MUSIC) {
      playingMusic?.stop();
      this.sound.play(this.level.MUSIC, { loop: true });
    }

    const map = this.make.tilemap({ key: this.level.TILEMAP });
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

      const winOverlap = this.physics.add.overlap(this.player, winZone, () => {
        this.physics.world.removeCollider(winOverlap);
        this.handleWin({ x: winPoint.x!, y: winPoint.y! });
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
      switch (tile.index) {
        case TILE.SPIKE: {
          const spike = this.spikeGroup.create(
            tile.getCenterX(),
            tile.getCenterY(),
            KEY.IMAGE.SPIKE,
          ) as Phaser.Physics.Arcade.Sprite;
          const spikeBody = spike.body as Phaser.Physics.Arcade.StaticBody;

          // The map has spikes rotated in Tiled (z key), so parse out that angle to the correct body
          // placement
          spike.rotation = tile.rotation;
          switch (spike.angle) {
            case 0:
              spikeBody.setSize(32, 6).setOffset(0, 26);
              break;
            case -90:
              spikeBody.setSize(6, 32).setOffset(26, 0);
              break;
            case 90:
              spikeBody.setSize(6, 32).setOffset(0, 0);
              break;
          }

          this.groundLayer.removeTileAt(tile.x, tile.y);
          break;
        }

        case TILE.ARROW: {
          const newTile = this.groundLayer
            .putTileAtWorldXY(TILE.ARROW, tile.getCenterX(), tile.getCenterY())
            .setCollision(true);
          newTile.rotation = tile.rotation;
          break;
        }

        case TILE.PERMANENT:
          tile.tint = 0x555555;
          break;
      }
    });

    const zoomX = this.cameras.main.width / map.widthInPixels;
    const zoomY = this.cameras.main.height / map.heightInPixels;
    const zoom = Math.min(zoomX, zoomY);
    this.cameras.main.setZoom(zoom);
    this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);

    this.budgetTracker = new BudgetTracker(this.level.BUDGET ?? Infinity);
    this.tileMarker = new TileMarker(
      this,
      map,
      this.groundLayer,
      this.budgetTracker,
      this.savedTiles,
    );

    this.input.keyboard?.on('keydown-R', () => {
      this.sound.play(KEY.SOUND.LOSE);
      this.cameras.main.fade(FADE_DURATION, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.restart({
          level: this.level.INDEX,
          savedTiles: this.tileMarker.getDrawnTiles(),
        });
      });
    });

    const uiBlockers: Phaser.GameObjects.GameObject[] = [];
    const collectUIBlocker = (go: Phaser.GameObjects.GameObject) => {
      uiBlockers.push(go);
    };

    render(
      <Container y={16}>
        <HelpText text={this.level.TEXT} ref={collectUIBlocker} />
        {this.level.BUDGET !== undefined && (
          <BudgetDisplay
            budgetTracker={this.budgetTracker}
            onReset={() => {
              this.tileMarker.resetDrawnTiles();
            }}
            ref={collectUIBlocker}
          />
        )}
      </Container>,
      this,
    );

    this.spikeGroup.getChildren().forEach((spike) => uiBlockers.push(spike));

    this.tileMarker.setUIBlockers(uiBlockers);

    this.createDustParticles(map);
    this.createLightRays(map);
  }

  private createLightRays(map: Phaser.Tilemaps.Tilemap) {
    const rayCount = 3;
    const rayWidth = Phaser.Math.Between(80, 100);
    const rayHeight = map.heightInPixels * 0.7;

    for (let i = 0; i < rayCount; i++) {
      const x = (map.widthInPixels / (rayCount + 1)) * (i + 1);
      const ray = this.add.graphics();

      ray.fillGradientStyle(
        0xffffff,
        0xffffff,
        0xffffff,
        0xffffff,
        0.15,
        0.15,
        0,
        0,
      );
      ray.fillRect(-rayWidth / 2, 0, rayWidth, rayHeight);
      ray.setPosition(x, 0);
      ray.setBlendMode('ADD');
      ray.setDepth(-0.5);

      this.tweens.add({
        targets: ray,
        alpha: { from: 0.1, to: 0.2 },
        duration: 3000 + i * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private createDustParticles(map: Phaser.Tilemaps.Tilemap) {
    const TEXTURE_KEY = 'dust';

    const texture = this.make.graphics({ x: 0, y: 0 });
    texture.fillStyle(0x888888, 1);
    texture.fillCircle(2, 2, 2);
    texture.generateTexture(TEXTURE_KEY, 4, 4);
    texture.destroy();

    this.dustParticles = this.add.particles(0, 0, TEXTURE_KEY, {
      x: { min: 0, max: map.widthInPixels },
      y: { min: 0, max: map.heightInPixels },
      lifespan: 6000,
      speedY: { min: -DUST_SPEED, max: -DUST_SPEED * 2 },
      speedX: { min: -2, max: 2 },
      scale: { min: 0.3, max: 0.6 },
      alpha: { start: 0.4, end: 0.1 },
      quantity: 1,
      frequency: 100,
      blendMode: 'ADD',
    });

    this.dustParticles.setDepth(-1);
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

    // Kill the player if they fall off the map or touch a spike
    if (
      this.player.y > this.groundLayer.height ||
      this.physics.world.overlap(this.player, this.spikeGroup)
    ) {
      // Flag that the player is dead so that we can stop update from running in the future
      this.isPlayerDead = true;

      this.sound.play(KEY.SOUND.LOSE);
      this.cameras.main.shake(100, 0.01);
      this.cameras.main.fade(FADE_DURATION, 0, 0, 0);

      // Freeze the player to leave them on screen while fading but remove the marker immediately
      this.player.freeze();

      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.player.destroy();
        this.scene.restart({
          level: this.level.INDEX,
          savedTiles: this.tileMarker.getDrawnTiles(),
        });
      });
    }
  }

  private handleWin(winPosition: { x: number; y: number }) {
    const nextLevel = this.getNextLevel();
    if (nextLevel) {
      this.createWinParticles(winPosition.x, winPosition.y);
      this.sound.play(KEY.SOUND.WIN);
      this.cameras.main.fade(FADE_DURATION * 2, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(KEY.SCENE.MAIN, { level: nextLevel.INDEX });
      });
    }
  }

  private createWinParticles(x: number, y: number) {
    const colors = [0xffd700, 0x00ff00, 0x00bfff, 0xffffff];

    const particles = this.add.particles(0, 0, 'dust', {
      x,
      y,
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.8, end: 0 },
      lifespan: 800,
      gravityY: 200,
      quantity: 30,
      tint: colors,
      blendMode: 'ADD',
      emitting: false,
    });

    particles.explode();
  }

  private getNextLevel(): Level | null {
    return LEVELS[this.level.INDEX + 1] ?? null;
  }
}
