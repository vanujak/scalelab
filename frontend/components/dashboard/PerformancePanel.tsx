import { Card } from "@/components/ui/Card";
import { simulationService } from "@/services/simulation.service";

export function PerformancePanel() {
  const metrics = simulationService.getLatestMetrics();

  return (
    <Card title="Performance panel" eyebrow="Current snapshot">
      <div className="space-y-4">
        <Stat label="Latency" value={`${metrics.summary.latencyMs} ms`} />
        <Stat label="Throughput" value={`${metrics.summary.throughputRps} rps`} />
        <Stat label="Error rate" value={`${metrics.summary.errorRate}%`} />
        <Stat label="Cache hit rate" value={`${metrics.summary.cacheHitRate}%`} />
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
