export type NodeType = "client" | "load-balancer" | "server" | "cache" | "database" | "queue";

export type ArchitectureNode = {
  id: string;
  label: string;
  type: NodeType;
};

export type ArchitectureEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type SystemDefinition = {
  id: string;
  name: string;
  description: string;
  status: "draft" | "planned" | "active";
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
};
