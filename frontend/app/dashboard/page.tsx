import { MetricsChart } from "@/components/dashboard/MetricsChart";
import { PerformancePanel } from "@/components/dashboard/PerformancePanel";
import { systemsService } from "@/services/systems.service";

export default function DashboardPage() {
  const [system] = systemsService.list();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 text-slate-100 sm:px-10 lg:px-12">
      <header className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">{system.name}</h1>
          <p className="mt-3 max-w-2xl text-slate-300">{system.description}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Last run</p>
          <p className="mt-1 text-lg font-semibold text-white">Seed simulation snapshot</p>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <MetricsChart />
        <PerformancePanel />
      </section>
    </main>
  );
}
