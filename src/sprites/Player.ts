import Phaser from 'phaser';

import { KEY } from '../constants';
import type { ConveyorVelocity } from '../utils';

const ANIMATION = {
  IDLE: 'IDLE',
  RUN: 'RUN',
};

const PLAYER_DRAG_X = 0;
const PLAYER_DRAG_Y = 0;
const PLAYER_MAX_VELOCITY_X = 300;
const PLAYER_MAX_VELOCITY_Y = 600;
const CONVEYOR_SPEED = 10;
const CONVEYOR_UPWARD_LAUNCH_SPEED = 500;

export interface PlayerEnvironment {
  conveyorVelocity: ConveyorVelocity | null;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  private lastVelocityX = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture = KEY.SPRITESHEET.PLAYER,
    frame = 0,
  ) {
    super(scene, x, y, texture, frame);

    // Create sprite animations
    this.createAnimations();

    // Enable sprite physics
    this.enablePhysics();
  }

  private enablePhysics() {
    // Enable physics for the sprite
    this.scene.physics.world.enable(this);

    // Create the physics-based sprite that we will move around and animate
    this.setDrag(PLAYER_DRAG_X, PLAYER_DRAG_Y)
      .setMaxVelocity(PLAYER_MAX_VELOCITY_X, PLAYER_MAX_VELOCITY_Y)
      .setSize(18, 24)
      .setOffset(7, 9);

    // Add the sprite to the scene
    this.scene.add.existing(this);
  }

  private createAnimations() {
    // Create the animations we need from the player spritesheet
    const anims = this.scene.anims;

    if (!anims.exists(ANIMATION.IDLE)) {
      anims.create({
        key: ANIMATION.IDLE,
        frames: anims.generateFrameNumbers(KEY.SPRITESHEET.PLAYER, {
          start: 0,
          end: 3,
        }),
        frameRate: 3,
        repeat: -1,
      });
    }

    if (!anims.exists(ANIMATION.RUN)) {
      anims.create({
        key: ANIMATION.RUN,
        frames: anims.generateFrameNumbers(KEY.SPRITESHEET.PLAYER, {
          start: 8,
          end: 15,
        }),
        frameRate: 12,
        repeat: -1,
      });
    }
  }

  freeze() {
    this.body.moves = false;
  }

  update({ conveyorVelocity }: PlayerEnvironment) {
    if (this.body.velocity.x !== 0) {
      this.lastVelocityX = this.body.velocity.x;
    }

    if (this.body.blocked.left || this.body.blocked.right) {
      this.setVelocityX(-this.lastVelocityX);
    }

    if (conveyorVelocity) {
      if (conveyorVelocity.x !== 0) {
        this.setVelocityX(conveyorVelocity.x * this.body.maxVelocity.x);
      }

      if (conveyorVelocity.y !== 0) {
        const conveyorVelocityY =
          conveyorVelocity.y < 0 && this.body.blocked.down
            ? Math.min(
                this.body.velocity.y,
                conveyorVelocity.y * CONVEYOR_UPWARD_LAUNCH_SPEED,
              )
            : this.body.velocity.y + conveyorVelocity.y * CONVEYOR_SPEED;

        this.setVelocityY(
          Phaser.Math.Clamp(
            conveyorVelocityY,
            -this.body.maxVelocity.y,
            this.body.maxVelocity.y,
          ),
        );
      }
    }

    // Update the animation/texture based on the state of the player
    if (this.body.blocked.down) {
      this.anims.play(
        this.body.velocity.x ? ANIMATION.RUN : ANIMATION.IDLE,
        true,
      );
    } else {
      this.anims.stop();
      this.setTexture(KEY.SPRITESHEET.PLAYER, 10);
    }
  }
}
