type BudgetChangeListener = (remaining: number) => void;

export class BudgetTracker {
  private remaining: number;
  private readonly max: number;
  private listeners: BudgetChangeListener[] = [];

  constructor(budget: number) {
    this.max = budget;
    this.remaining = budget;
  }

  canDraw(): boolean {
    return this.remaining > 0 || this.isInfinite();
  }

  recordDraw(): void {
    if (!this.isInfinite()) {
      this.remaining--;
      this.notifyListeners();
    }
  }

  recordErase(): void {
    if (!this.isInfinite()) {
      this.remaining++;
      this.notifyListeners();
    }
  }

  getRemaining(): number {
    return this.remaining;
  }

  getMax(): number {
    return this.max;
  }

  isInfinite(): boolean {
    return this.max === Infinity;
  }

  onChange(listener: BudgetChangeListener): () => void {
    this.listeners.push(listener);

    // unsubscribe
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.remaining);
    }
  }
}
