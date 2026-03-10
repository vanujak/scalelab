export function useSimulation() {
  return {
    status: "ready",
    config: {
      requestsPerMinute: 12000,
      durationMinutes: 15,
      algorithm: "round-robin",
    },
  };
}
