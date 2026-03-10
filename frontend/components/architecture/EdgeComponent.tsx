import type { ArchitectureEdge } from "@/types/system";

export function EdgeComponent({ edge }: { edge: ArchitectureEdge }) {
  return (
    <div className="flex items-center gap-3 px-2 text-sm text-slate-500">
      <span className="h-px flex-1 bg-slate-300" />
      <span>{edge.label ?? "routes to"}</span>
      <span className="h-px flex-1 bg-slate-300" />
    </div>
  );
}
