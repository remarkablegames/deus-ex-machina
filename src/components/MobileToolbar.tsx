import { Container, Text, useScene, useState } from 'phaser-jsx';

import { KEY } from '../constants';
import type { EditMode } from '../graphics';

const INACTIVE_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  font: '24px monospace',
  color: '#fff',
  backgroundColor: '#2d3142',
  padding: { x: 16, y: 12 },
};

const ACTIVE_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  font: '24px monospace',
  color: '#fff',
  backgroundColor: '#ff4f78',
  padding: { x: 16, y: 12 },
};

const HANDLE_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  font: '24px monospace',
  color: '#888',
  padding: { x: 16, y: 12 },
};

interface MobileToolbarProps {
  onModeChange: (mode: EditMode) => void;
  onClear: () => void;
  onRestart: () => void;
  ref?: (gameObject: Phaser.GameObjects.GameObject) => void;
}

const BUTTON_CHARACTER_WIDTH = 20;
const BUTTON_WIDTHS = [
  BUTTON_CHARACTER_WIDTH * 4.1, // Pan
  BUTTON_CHARACTER_WIDTH * 5.3, // Place
  BUTTON_CHARACTER_WIDTH * 6.2, // Rotate
  BUTTON_CHARACTER_WIDTH * 5.3, // Erase
  BUTTON_CHARACTER_WIDTH * 5.3, // Clear
  BUTTON_CHARACTER_WIDTH * 6.8, // Restart
];

export function MobileToolbar({
  onModeChange,
  onClear,
  onRestart,
  ref,
}: MobileToolbarProps) {
  const scene = useScene();
  const [mode, setMode] = useState<EditMode>('pan');
  const [toolbarX, setToolbarX] = useState(scene.cameras.main.width / 2);
  const [toolbarY, setToolbarY] = useState(scene.cameras.main.height - 60);

  const totalWidth = BUTTON_WIDTHS.reduce((sum, width) => sum + width, 0);
  const positions: number[] = [];
  let left = -totalWidth / 2;
  for (const buttonWidth of BUTTON_WIDTHS) {
    positions.push(left + buttonWidth / 2);
    left += buttonWidth;
  }
  const HANDLE_WIDTH = 32;
  const handleX = totalWidth / 2 + 8 + HANDLE_WIDTH / 2;

  const handleModeChange = (next: EditMode) => {
    setMode(next);
    scene.sound.play(KEY.SOUND.CLICK);
    onModeChange(next);
  };

  const renderButton = (label: string, next: EditMode, x: number) => (
    <Text
      x={x}
      text={label}
      style={mode === next ? ACTIVE_STYLE : INACTIVE_STYLE}
      originX={0.5}
      originY={0.5}
      input={{ cursor: 'pointer' }}
      onPointerDown={() => {
        handleModeChange(next);
      }}
    />
  );

  return (
    <Container
      scale={1.25}
      ref={(gameObject) => {
        if (!gameObject.getData('positioned')) {
          gameObject.setData('positioned', true);
          gameObject.x = toolbarX;
          gameObject.y = toolbarY;
        }
        ref?.(gameObject);
      }}
    >
      {renderButton('Pan', 'pan', positions[0])}
      {renderButton('Place', 'place', positions[1])}
      {renderButton('Rotate', 'rotate', positions[2])}
      {renderButton('Erase', 'erase', positions[3])}

      <Text
        x={positions[4]}
        text="Clear"
        style={INACTIVE_STYLE}
        originX={0.5}
        originY={0.5}
        input={{ cursor: 'pointer' }}
        onPointerDown={() => {
          scene.sound.play(KEY.SOUND.CLICK);
          onClear();
        }}
      />

      <Text
        x={positions[5]}
        text="Restart"
        style={INACTIVE_STYLE}
        originX={0.5}
        originY={0.5}
        input={{ cursor: 'pointer' }}
        onPointerDown={() => {
          scene.sound.play(KEY.SOUND.CLICK);
          onRestart();
        }}
      />

      <Text
        x={handleX}
        text="≡"
        style={HANDLE_STYLE}
        originX={0.5}
        originY={0.5}
        ref={(gameObject) => {
          if (gameObject.input) {
            return;
          }
          const toolbar =
            gameObject.parentContainer as Phaser.GameObjects.Container | null;
          if (!toolbar) {
            return;
          }
          gameObject.setInteractive();
          scene.input.setDraggable(gameObject, true);
          let startX = 0;
          let startY = 0;
          let startPointerX = 0;
          let startPointerY = 0;
          gameObject.on('dragstart', (pointer: Phaser.Input.Pointer) => {
            const start = pointer.positionToCamera(
              scene.cameras.main,
            ) as Phaser.Math.Vector2;
            startPointerX = start.x;
            startPointerY = start.y;
            startX = toolbar.x;
            startY = toolbar.y;
          });
          gameObject.on('drag', (pointer: Phaser.Input.Pointer) => {
            const current = pointer.positionToCamera(
              scene.cameras.main,
            ) as Phaser.Math.Vector2;
            const dx = current.x - startPointerX;
            const dy = current.y - startPointerY;
            const bounds = toolbar.getBounds();
            const view = scene.cameras.main.worldView;
            const halfWidth = Math.min(bounds.width / 2, view.width / 2 - 1);
            const halfHeight = Math.min(bounds.height / 2, view.height / 2 - 1);
            toolbar.x = Phaser.Math.Clamp(
              startX + dx,
              view.x + halfWidth,
              view.right - halfWidth,
            );
            toolbar.y = Phaser.Math.Clamp(
              startY + dy,
              view.y + halfHeight,
              view.bottom - halfHeight,
            );
          });
          gameObject.on('dragend', () => {
            setToolbarX(toolbar.x);
            setToolbarY(toolbar.y);
          });
        }}
      />
    </Container>
  );
}
