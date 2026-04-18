export interface LevelConfig {
  KEY: string;
  TILEMAP: string;
  TEXT: string;
}

export const LEVELS: LevelConfig[] = [
  {
    KEY: 'LEVEL1',
    TILEMAP: 'tilemaps/level1.json',
    TEXT: 'Right-click to erase tiles',
  },
  {
    KEY: 'LEVEL2',
    TILEMAP: 'tilemaps/level2.json',
    TEXT: 'Left-click to draw tiles',
  },
];
