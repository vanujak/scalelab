export type MetricsSummary = {
  latencyMs: number;
  throughputRps: number;
  errorRate: number;
  cacheHitRate: number;
};

export type MetricsTimelinePoint = {
  tick: number;
  latencyMs: number;
};

export type MetricsSnapshot = {
  summary: MetricsSummary;
  timeline: MetricsTimelinePoint[];
};
