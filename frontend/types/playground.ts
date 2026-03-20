export type NodeType = "client" | "load-balancer" | "server" | "cache" | "database" | "queue";

export type PlaygroundNode = {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  config: Record<string, unknown>;
};

export type PlaygroundEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  latencyMs: number;
};

export type SimulationState = {
  status: "idle" | "running";
};

export type SimulationMetrics = {
  timestamp: number;
  latencyMs: number;
  throughputRps: number;
  errorRate: number;
  cacheHitRate: number;
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  requestsInFlight: number;
  saturationPoints: string[];
};
