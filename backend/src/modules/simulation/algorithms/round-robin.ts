export function roundRobin<T>(items: T[], requestIndex: number): T | null {
  if (items.length === 0) {
    return null;
  }

  return items[requestIndex % items.length];
}
