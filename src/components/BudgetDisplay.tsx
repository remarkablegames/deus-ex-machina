import { Text, useEffect, useScene, useState } from 'phaser-jsx';

import { BudgetTracker } from '../utils/BudgetTracker';

interface BudgetDisplayProps {
  budgetTracker: BudgetTracker;
}

export function BudgetDisplay({ budgetTracker }: BudgetDisplayProps) {
  const scene = useScene();
  const [remaining, setRemaining] = useState(budgetTracker.getRemaining());

  useEffect(() => {
    return budgetTracker.onChange(setRemaining);
  }, []);

  const max = budgetTracker.getMax();

  const label = budgetTracker.isInfinite()
    ? 'Arrows: ∞'
    : `Arrows: ${remaining.toString()}/${max.toString()}`;

  return (
    <Text
      x={scene.cameras.main.width - 16}
      text={label}
      style={{
        backgroundColor: '#fff',
        color: '#000',
        font: '18px monospace',
        padding: { x: 15, y: 10 },
      }}
      originX={1}
      originY={0}
    />
  );
}
