import { KEY } from '../constants';

export interface Level {
  INDEX: number;
  MUSIC: string;
  TILEMAP: string;
  TEXT: string;
  BUDGET?: number;
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
    TEXT: 'Left-click arrow block to rotate it',
  },

  {
    INDEX: 2,
    MUSIC: KEY.MUSIC.INTRO,
    TILEMAP: 'tilemaps/level2.json',
    TEXT: 'Left-click to draw arrow block',
  },

  {
    INDEX: 3,
    MUSIC: KEY.MUSIC.CONTINUATION,
    TILEMAP: 'tilemaps/level3.json',
    TEXT: 'There are a limited number of arrows',
    BUDGET: 10,
  },

  {
    INDEX: 4,
    MUSIC: KEY.MUSIC.CONTINUATION,
    TILEMAP: 'tilemaps/level4.json',
    TEXT: 'Some blocks are permanent',
    BUDGET: 30,
  },

  {
    INDEX: 5,
    MUSIC: KEY.MUSIC.CONTINUATION,
    TILEMAP: 'tilemaps/level5.json',
    TEXT: 'Think outside the box',
    BUDGET: 5,
  },

  {
    INDEX: 6,
    MUSIC: KEY.MUSIC.BACKGROUND,
    TILEMAP: 'tilemaps/level6.json',
    TEXT: 'Watch out for spikes',
    BUDGET: 30,
  },

  {
    INDEX: 7,
    MUSIC: KEY.MUSIC.BACKGROUND,
    TILEMAP: 'tilemaps/level7.json',
    TEXT: '',
    BUDGET: 30,
  },
];
