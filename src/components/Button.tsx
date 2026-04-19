import { Text, useScene } from 'phaser-jsx';

import { KEY } from '../constants';

const BG_COLOR = '#2d3142';
const BG_COLOR_HOVER = '#4a4e69';

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
        color: '#ffffff',
        backgroundColor: BG_COLOR,
        padding: { x: 24, y: 16 },
      }}
      originX={0.5}
      originY={0.5}
      input={{ cursor: 'pointer' }}
      onPointerOver={(_pointer, gameObject) => {
        (gameObject as Phaser.GameObjects.Text).setBackgroundColor(
          BG_COLOR_HOVER,
        );
        scene.sound.play(KEY.SOUND.HOVER);
      }}
      onPointerOut={(_pointer, gameObject) => {
        (gameObject as Phaser.GameObjects.Text).setBackgroundColor(BG_COLOR);
      }}
      onPointerDown={() => {
        scene.sound.play(KEY.SOUND.CLICK);
        onClick();
      }}
    />
  );
}
