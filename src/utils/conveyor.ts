import Phaser from 'phaser';

import { TILE } from '../constants';
import type { Player } from '../sprites';

const CARDINAL_ROTATION_STEP = Math.PI / 2;
const FULL_ROTATION = Math.PI * 2;

export interface ConveyorVelocity {
  x: number;
  y: number;
}

function normalizeTileRotation(rotation: number) {
  return Phaser.Math.Wrap(rotation, 0, FULL_ROTATION);
}

export function getConveyorVelocityFromRotation(
  rotation: number,
): ConveyorVelocity {
  const normalizedRotation = normalizeTileRotation(rotation);
  const cardinalRotation =
    Math.round(normalizedRotation / CARDINAL_ROTATION_STEP) *
    CARDINAL_ROTATION_STEP;
  const snappedRotation = normalizeTileRotation(cardinalRotation);

  if (Phaser.Math.Within(snappedRotation, 0, 0.01)) {
    return { x: 0, y: -1 };
  }

  if (Phaser.Math.Within(snappedRotation, CARDINAL_ROTATION_STEP, 0.01)) {
    return { x: 1, y: 0 };
  }

  if (Phaser.Math.Within(snappedRotation, Math.PI, 0.01)) {
    return { x: 0, y: 1 };
  }

  return { x: -1, y: 0 };
}

export function getPlayerConveyorVelocity(
  player: Player,
  groundLayer: Phaser.Tilemaps.TilemapLayer,
): ConveyorVelocity | null {
  if (!player.body.blocked.down) {
    return null;
  }

  const tile = groundLayer.getTileAtWorldXY(
    player.body.center.x,
    player.body.bottom + 1,
  ) as Phaser.Tilemaps.Tile | null;

  if (tile?.index !== TILE.ARROW) {
    return null;
  }

  return getConveyorVelocityFromRotation(tile.rotation);
}
