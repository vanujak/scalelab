import { Card } from "@/components/ui/Card";

const flow = [
  { label: "Ingress", value: "12k rpm", width: "92%", color: "bg-sky-500" },
  { label: "Cache hits", value: "68%", width: "68%", color: "bg-emerald-500" },
  { label: "DB pressure", value: "31%", width: "31%", color: "bg-amber-500" },
];

export function TrafficVisualizer() {
  return (
    <Card title="Traffic visualizer" eyebrow="Seeded preview">
      <div className="space-y-4">
        {flow.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>{item.label}</span>
              <span className="font-semibold text-slate-950">{item.value}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div className={`h-3 rounded-full ${item.color}`} style={{ width: item.width }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
