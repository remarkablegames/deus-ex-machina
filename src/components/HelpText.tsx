import { Text, useEffect, useScene, useState } from 'phaser-jsx';

import { LEVELS } from '../constants';

export function HelpText({
  level,
  speed = 50,
}: {
  level: number;
  speed?: number;
}) {
  const scene = useScene();
  const text = LEVELS[level]?.TEXT;
  const [displayText, setDisplayText] = useState('');

  if (!text) {
    return null;
  }

  useEffect(() => {
    let index = 0;

    const timerEvent = scene.time.addEvent({
      delay: speed,
      callback: () => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          timerEvent.remove();
        }
      },
      loop: true,
    });

    return () => {
      timerEvent.remove();
    };
  }, []);

  return (
    <Text
      x={16}
      y={16}
      text={displayText}
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
