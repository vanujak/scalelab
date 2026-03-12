type ConnectionTarget = {
  id: string;
  activeConnections: number;
};

export function leastConnections(
  targets: ConnectionTarget[],
): ConnectionTarget | null {
  if (targets.length === 0) {
    return null;
  }

  return [...targets].sort(
    (left, right) => left.activeConnections - right.activeConnections,
  )[0];
}
