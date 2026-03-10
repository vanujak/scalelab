import { Card } from "@/components/ui/Card";
import { systemsService } from "@/services/systems.service";
import { EdgeComponent } from "./EdgeComponent";
import { NodeComponent } from "./NodeComponent";

export function ArchitectureBuilder() {
  const [system] = systemsService.list();

  return (
    <Card
      title="Architecture builder"
      eyebrow="Phase 1 scaffold"
      footer={<p className="text-sm text-slate-500">Drag-and-drop editing comes after API persistence.</p>}
    >
      <div className="space-y-3">
        {system.nodes.map((node, index) => (
          <div key={node.id} className="space-y-3">
            <NodeComponent node={node} />
            {system.edges[index] ? <EdgeComponent edge={system.edges[index]} /> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
