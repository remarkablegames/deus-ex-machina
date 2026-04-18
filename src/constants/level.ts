export interface LevelConfig {
  KEY: string;
  TILEMAP: string;
  TEXT: string;
}

export const LEVELS: LevelConfig[] = [
  {
    KEY: 'level0',
    TILEMAP: 'tilemaps/level0.json',
    TEXT: 'Right-click to erase tiles',
  },
  {
    KEY: 'level1',
    TILEMAP: 'tilemaps/level1.json',
    TEXT: 'Left-click to draw tiles',
  },
  {
    KEY: 'level2',
    TILEMAP: 'tilemaps/level2.json',
    TEXT: '',
  },
];
