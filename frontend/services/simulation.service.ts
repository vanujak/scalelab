import type { MetricsSnapshot } from "@/types/metrics";

const snapshot: MetricsSnapshot = {
  summary: {
    latencyMs: 182,
    throughputRps: 940,
    errorRate: 0.7,
    cacheHitRate: 68,
  },
  timeline: [
    { tick: 1, latencyMs: 110 },
    { tick: 2, latencyMs: 132 },
    { tick: 3, latencyMs: 150 },
    { tick: 4, latencyMs: 182 },
    { tick: 5, latencyMs: 164 },
    { tick: 6, latencyMs: 148 },
  ],
};

export const simulationService = {
  getLatestMetrics(): MetricsSnapshot {
    return snapshot;
  },
};
