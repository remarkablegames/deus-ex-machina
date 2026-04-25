import { Text, useScene } from 'phaser-jsx';

import { KEY } from '../constants';

const BACKGROUND_COLOR = '#2d3142';
const BACKGROUND_COLOR_HOVER = '#4a4e69';
const TEXT_COLOR = '#fff';

export function Button({
  x,
  y,
  text,
  onClick,
}: {
  x: number;
  y: number;
  text: string;
  onClick: () => void;
}) {
  const scene = useScene();

  return (
    <Text
      x={x}
      y={y}
      text={text}
      style={{
        fontSize: 24,
        fontFamily: 'monospace',
        color: TEXT_COLOR,
        backgroundColor: BACKGROUND_COLOR,
        padding: { x: 24, y: 16 },
      }}
      originX={0.5}
      originY={0.5}
      input={{ cursor: 'pointer' }}
      onPointerOver={(_pointer, gameObject) => {
        const text = gameObject as Phaser.GameObjects.Text;
        text.setBackgroundColor(BACKGROUND_COLOR_HOVER);
        text.setScale(1.02);
        scene.sound.play(KEY.SOUND.HOVER);
      }}
      onPointerOut={(_pointer, gameObject) => {
        const text = gameObject as Phaser.GameObjects.Text;
        text.setBackgroundColor(BACKGROUND_COLOR);
        text.setScale(1);
      }}
      onPointerDown={() => {
        scene.sound.play(KEY.SOUND.CLICK);
        onClick();
      }}
    />
  );
}
