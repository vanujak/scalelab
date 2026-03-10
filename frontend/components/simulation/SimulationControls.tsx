import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useSimulation } from "@/hooks/useSimulation";

export function SimulationControls() {
  const { config, status } = useSimulation();

  return (
    <Card
      title="Simulation controls"
      eyebrow={status}
      footer={
        <div className="flex gap-3">
          <Button variant="primary">Start run</Button>
          <Button>Save preset</Button>
        </div>
      }
    >
      <div className="space-y-3 text-sm text-slate-600">
        <p>Requests per minute: {config.requestsPerMinute}</p>
        <p>Duration: {config.durationMinutes} minutes</p>
        <p>Algorithm: {config.algorithm}</p>
      </div>
    </Card>
  );
}
