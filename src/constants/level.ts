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
    TEXT: 'Right-click to erase block',
  },

  {
    INDEX: 1,
    MUSIC: KEY.MUSIC.INTRO,
    TILEMAP: 'tilemaps/level1.json',
    TEXT: 'Left-click to draw arrow block',
  },

  {
    INDEX: 2,
    MUSIC: KEY.MUSIC.CONTINUATION,
    TILEMAP: 'tilemaps/level2.json',
    TEXT: 'Left-click arrow block to rotate it',
  },

  {
    INDEX: 3,
    MUSIC: KEY.MUSIC.CONTINUATION,
    TILEMAP: 'tilemaps/level3.json',
    TEXT: "Some blocks can't be erased",
  },

  {
    INDEX: 4,
    MUSIC: KEY.MUSIC.BACKGROUND,
    TILEMAP: 'tilemaps/level4.json',
    TEXT: 'Watch out for spikes',
  },

  {
    INDEX: 5,
    MUSIC: KEY.MUSIC.BACKGROUND,
    TILEMAP: 'tilemaps/level5.json',
    TEXT: '',
  },
];
