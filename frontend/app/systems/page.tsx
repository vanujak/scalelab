import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { systemsService } from "@/services/systems.service";

export default function SystemsPage() {
  const systems = systemsService.list();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-700">Systems</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-950">Architecture catalog</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            These mocked systems represent the initial objects we will later persist through the Nest
            API and PostgreSQL.
          </p>
        </div>
        <Button href="/simulation" variant="primary">
          Create simulation
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {systems.map((system) => (
          <Card key={system.id} title={system.name} eyebrow={system.status}>
            <p className="text-sm leading-6 text-slate-600">{system.description}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <p>{system.nodes.length} nodes</p>
              <p>{system.edges.length} edges</p>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
