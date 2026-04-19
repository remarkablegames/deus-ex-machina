import { Scene } from 'phaser';
import { Container, render, Text } from 'phaser-jsx';

import { KEY } from '../constants';

export class Menu extends Scene {
  constructor() {
    super(KEY.SCENE.MENU);
  }

  create() {
    const { centerX, centerY, height } = this.cameras.main;

    render(
      <Container>
        <Text
          x={centerX}
          y={height / 3}
          text="Deus Ex Machina"
          style={{
            fontSize: 48,
            fontFamily: 'monospace',
            color: '#ffffff',
          }}
          originX={0.5}
          originY={0.5}
        />

        <Text
          x={centerX}
          y={centerY}
          text="Start Game"
          style={{
            fontSize: 24,
            fontFamily: 'monospace',
            color: '#ffffff',
            backgroundColor: '#2d3142',
            padding: { x: 24, y: 16 },
          }}
          originX={0.5}
          originY={0.5}
          input={{ cursor: 'pointer' }}
          onPointerOver={(_pointer, gameObject) => {
            (gameObject as Phaser.GameObjects.Text).setBackgroundColor(
              '#4a4e69',
            );
          }}
          onPointerOut={(_pointer, gameObject) => {
            (gameObject as Phaser.GameObjects.Text).setBackgroundColor(
              '#2d3142',
            );
          }}
          onPointerDown={() => {
            this.handleStart();
          }}
        />
      </Container>,
      this,
    );
  }

  private handleStart() {
    this.scene.start(KEY.SCENE.MAIN, { level: 0 });
  }
}
