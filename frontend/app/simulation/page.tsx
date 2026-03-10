import { ArchitectureBuilder } from "@/components/architecture/ArchitectureBuilder";
import { SimulationControls } from "@/components/simulation/SimulationControls";
import { TrafficVisualizer } from "@/components/simulation/TrafficVisualizer";

export default function SimulationPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 text-slate-100 sm:px-10 lg:px-12">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Simulation</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Traffic rehearsal workspace</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Phase 1 keeps the UI seeded with mock data while the backend contracts and persistence layer
          are being defined.
        </p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ArchitectureBuilder />
        <div className="space-y-6">
          <SimulationControls />
          <TrafficVisualizer />
        </div>
      </section>
    </main>
  );
}
