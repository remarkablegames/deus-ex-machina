import { KEY } from '../constants';

export interface Level {
  INDEX: number;
  MUSIC: string;
  TILEMAP: string;
  TEXT: string;
}

export const LEVELS: Level[] = [
  {
    INDEX: 0,
    MUSIC: KEY.MUSIC.INTRO,
    TILEMAP: 'tilemaps/level0.json',
    TEXT: 'Right-click to erase tile',
  },

  {
    INDEX: 1,
    MUSIC: KEY.MUSIC.INTRO,
    TILEMAP: 'tilemaps/level1.json',
    TEXT: 'Left-click to draw tile',
  },

  {
    INDEX: 2,
    MUSIC: KEY.MUSIC.INTRO,
    TILEMAP: 'tilemaps/level2.json',
    TEXT: 'Left-click tile to rotate it',
  },

  {
    INDEX: 3,
    MUSIC: KEY.MUSIC.BACKGROUND,
    TILEMAP: 'tilemaps/level3.json',
    TEXT: '',
  },
];
