import type { SystemDefinition } from "@/types/system";

const seededSystems: SystemDefinition[] = [
  {
    id: "sys-ecommerce",
    name: "E-commerce checkout",
    description: "Load-balanced application tier with cache-assisted product and cart reads.",
    status: "draft",
    nodes: [
      { id: "n1", label: "Users", type: "client" },
      { id: "n2", label: "Load Balancer", type: "load-balancer" },
      { id: "n3", label: "API Cluster", type: "server" },
      { id: "n4", label: "Redis Cache", type: "cache" },
      { id: "n5", label: "PostgreSQL", type: "database" },
    ],
    edges: [
      { id: "e1", source: "n1", target: "n2", label: "HTTPS" },
      { id: "e2", source: "n2", target: "n3", label: "round robin" },
      { id: "e3", source: "n3", target: "n4", label: "read-through" },
      { id: "e4", source: "n4", target: "n5", label: "cache miss" },
    ],
  },
  {
    id: "sys-streaming",
    name: "Streaming ingestion pipeline",
    description: "Burst-heavy ingest path with queue buffering and analytics consumers.",
    status: "planned",
    nodes: [
      { id: "s1", label: "Producers", type: "client" },
      { id: "s2", label: "Ingress API", type: "server" },
      { id: "s3", label: "Queue", type: "queue" },
      { id: "s4", label: "Workers", type: "server" },
      { id: "s5", label: "Warehouse", type: "database" },
    ],
    edges: [
      { id: "se1", source: "s1", target: "s2", label: "events" },
      { id: "se2", source: "s2", target: "s3", label: "enqueue" },
      { id: "se3", source: "s3", target: "s4", label: "consume" },
      { id: "se4", source: "s4", target: "s5", label: "batch write" },
    ],
  },
];

export const systemsService = {
  list(): SystemDefinition[] {
    return seededSystems;
  },
};
