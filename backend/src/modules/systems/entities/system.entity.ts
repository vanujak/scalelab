export class SystemEntity {
  id!: string;
  name!: string;
  description!: string;
  status!: 'draft' | 'planned' | 'active';
  architecture!: {
    nodes: Array<{ id: string; label: string; type: string }>;
    edges: Array<{ id: string; source: string; target: string; label?: string }>;
  };
}
