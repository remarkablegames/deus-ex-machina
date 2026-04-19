import { Scene } from 'phaser';
import { Fragment, render, Text } from 'phaser-jsx';

import { Button } from '../components';
import { KEY } from '../constants';

export class Menu extends Scene {
  constructor() {
    super(KEY.SCENE.MENU);
  }

  create() {
    this.sound.stopAll();
    this.sound.play(KEY.MUSIC.MENU, { loop: true });

    const { centerX, centerY, height } = this.cameras.main;

    render(
      <Fragment>
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

        <Button
          x={centerX}
          y={centerY}
          text="Start Game"
          onClick={() => {
            this.handleStart();
          }}
        />
      </Fragment>,
      this,
    );
  }

  private handleStart() {
    this.scene.start(KEY.SCENE.MAIN, { level: 0 });
  }
}
