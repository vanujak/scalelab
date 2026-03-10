import type { ArchitectureNode } from "@/types/system";

export function NodeComponent({ node }: { node: ArchitectureNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{node.type}</p>
      <p className="mt-2 text-sm font-semibold text-slate-950">{node.label}</p>
    </div>
  );
}
