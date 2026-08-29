import { KEY } from '../constants';
import { isMobile } from '../utils';

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
    get TEXT() {
      return isMobile()
        ? 'Tap "Erase" button and then a tile to remove it'
        : 'Right-click to erase block';
    },
  },

  {
    INDEX: 1,
    MUSIC: KEY.MUSIC.INTRO,
    TILEMAP: 'tilemaps/level1.json',
    get TEXT() {
      return isMobile()
        ? 'Tap "Rotate" button and then an arrow to turn it'
        : 'Left-click arrow to rotate it';
    },
  },

  {
    INDEX: 2,
    MUSIC: KEY.MUSIC.INTRO,
    TILEMAP: 'tilemaps/level2.json',
    get TEXT() {
      return isMobile()
        ? 'Tap "Place" button and then a tile to draw an arrow'
        : 'Left-click to draw arrow';
    },
  },

  {
    INDEX: 3,
    MUSIC: KEY.MUSIC.INTRO,
    TILEMAP: 'tilemaps/level3.json',
    TEXT: 'Watch out for spikes',
  },

  {
    INDEX: 4,
    MUSIC: KEY.MUSIC.INTRO,
    TILEMAP: 'tilemaps/level4.json',
    TEXT: 'Some blocks are permanent',
  },

  {
    INDEX: 5,
    MUSIC: KEY.MUSIC.CONTINUATION,
    TILEMAP: 'tilemaps/level5.json',
    TEXT: 'There are a limited number of arrows',
    BUDGET: 10,
  },

  {
    INDEX: 6,
    MUSIC: KEY.MUSIC.CONTINUATION,
    TILEMAP: 'tilemaps/level6.json',
    TEXT: 'Fall and rise',
    BUDGET: 30,
  },

  {
    INDEX: 7,
    MUSIC: KEY.MUSIC.CONTINUATION,
    TILEMAP: 'tilemaps/level7.json',
    TEXT: 'Think outside the box',
    BUDGET: 5,
  },

  {
    INDEX: 8,
    MUSIC: KEY.MUSIC.BACKGROUND,
    TILEMAP: 'tilemaps/level8.json',
    TEXT: 'Tackle thorny issues',
    BUDGET: 30,
  },

  {
    INDEX: 9,
    MUSIC: KEY.MUSIC.BACKGROUND,
    TILEMAP: 'tilemaps/level9.json',
    TEXT: 'Last level',
    BUDGET: 10,
  },
];
