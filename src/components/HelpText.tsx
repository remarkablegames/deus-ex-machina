import { Text } from 'phaser-jsx';

import { LEVELS } from '../constants';

/**
 * Help text that has a "fixed" position on the screen.
 */
export function HelpText({ level }: { level: number }) {
  const text = LEVELS[level]?.TEXT;

  if (!text) {
    return null;
  }

  return (
    <Text
      x={16}
      y={16}
      text={text}
      style={{
        backgroundColor: '#fff',
        color: '#000',
        font: '18px monospace',
        padding: { x: 20, y: 10 },
      }}
      scrollFactorX={0}
      scrollFactorY={0}
    />
  );
}
