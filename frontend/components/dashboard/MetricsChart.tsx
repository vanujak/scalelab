import { Card } from "@/components/ui/Card";
import { simulationService } from "@/services/simulation.service";

export function MetricsChart() {
  const snapshot = simulationService.getLatestMetrics();
  const maxLatency = Math.max(...snapshot.timeline.map((point) => point.latencyMs));

  return (
    <Card title="Latency trend" eyebrow="Mock metrics">
      <div className="flex h-72 items-end gap-3">
        {snapshot.timeline.map((point) => {
          const height = `${(point.latencyMs / maxLatency) * 100}%`;
          return (
            <div key={point.tick} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-2xl bg-gradient-to-t from-sky-500 to-cyan-300"
                  style={{ height }}
                />
              </div>
              <span className="text-xs text-slate-500">T{point.tick}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
