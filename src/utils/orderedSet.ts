export class OrderedSet<T> {
  private readonly seen = new Set<T>();
  private readonly values: T[] = [];

  add(value: T): void {
    if (this.seen.has(value)) {
      return;
    }

    this.seen.add(value);
    this.values.push(value);
  }

  addMany(values: T[]): void {
    for (const value of values) {
      this.add(value);
    }
  }

  toArray(): T[] {
    return [...this.values];
  }
}
