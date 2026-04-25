import { Text, useEffect, useScene, useState } from 'phaser-jsx';

import { KEY } from '../constants';

export function HelpText({
  text,
  speed = 50,
}: {
  text: string;
  speed?: number;
}) {
  const scene = useScene();
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!text) {
      return;
    }

    let index = 0;

    const typewriterSound = scene.sound.add(KEY.SOUND.TYPEWRITER, {
      loop: true,
    });
    typewriterSound.play();

    const timerEvent = scene.time.addEvent({
      delay: speed,
      callback: () => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          timerEvent.remove();
          typewriterSound.destroy();
        }
      },
      loop: true,
    });

    const onShutdown = () => {
      timerEvent.remove();
      typewriterSound.destroy();
    };

    scene.events.once('shutdown', onShutdown);

    return () => {
      timerEvent.remove();
      typewriterSound.destroy();
      scene.events.off('shutdown', onShutdown);
    };
  }, []);

  if (!text) {
    return null;
  }

  return (
    <Text
      x={16}
      text={displayText}
      style={{
        backgroundColor: '#fff',
        color: '#000',
        font: '18px monospace',
        padding: { x: 15, y: 10 },
      }}
    />
  );
}
