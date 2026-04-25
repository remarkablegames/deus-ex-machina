import { Container, Text, useEffect, useScene, useState } from 'phaser-jsx';

import { BudgetTracker } from '../utils/BudgetTracker';
import { Button } from './Button';

interface BudgetDisplayProps {
  budgetTracker: BudgetTracker;
  onReset: () => void;
  ref?: (gameObject: Phaser.GameObjects.GameObject) => void;
}

export function BudgetDisplay({
  budgetTracker,
  onReset,
  ref,
}: BudgetDisplayProps) {
  const scene = useScene();
  const [remaining, setRemaining] = useState(budgetTracker.getRemaining());

  useEffect(() => {
    return budgetTracker.onChange(setRemaining);
  }, []);

  const max = budgetTracker.getMax();

  const label = budgetTracker.isInfinite()
    ? 'Arrows: ∞'
    : `Arrows: ${remaining.toString()}/${max.toString()}`;

  const x = scene.cameras.main.width - 16;

  return (
    <Container>
      <Text
        x={x}
        text={label}
        style={{
          backgroundColor: '#fff',
          color: '#000',
          font: '18px monospace',
          padding: { x: 15, y: 10 },
        }}
        originX={1}
        originY={0}
        ref={ref}
      />

      <Button
        x={x}
        y={52}
        text="Reset"
        onClick={onReset}
        style={{
          fontSize: 18,
          fontFamily: 'monospace',
          padding: { x: 15, y: 10 },
        }}
        originX={1}
        originY={0}
        ref={ref}
      />
    </Container>
  );
}
