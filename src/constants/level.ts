export interface LevelConfig {
  KEY: string;
  TILEMAP: string;
  TEXT: string;
}

export const LEVELS: LevelConfig[] = [
  {
    KEY: 'level0',
    TILEMAP: 'tilemaps/level0.json',
    TEXT: 'Right-click to erase tile',
  },

  {
    KEY: 'level1',
    TILEMAP: 'tilemaps/level1.json',
    TEXT: 'Left-click to draw tile',
  },

  {
    KEY: 'level2',
    TILEMAP: 'tilemaps/level2.json',
    TEXT: 'Left-click tile to rotate it',
  },

  {
    KEY: 'level3',
    TILEMAP: 'tilemaps/level3.json',
    TEXT: '',
  },
];
