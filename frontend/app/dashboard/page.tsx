"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricsChart } from "@/components/dashboard/MetricsChart";
import { PerformancePanel } from "@/components/dashboard/PerformancePanel";
import { simulationService } from "@/services/simulation.service";
import { sessionService } from "@/services/session.service";
import { systemsService } from "@/services/systems.service";
import type { AuthUser } from "@/services/auth.service";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
  const systems = systemsService.list();
  const [system] = systems;
  const metrics = simulationService.getLatestMetrics();

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(sessionService.getUser());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function handleSignOut() {
    sessionService.clearUser();
    setUser(null);
    router.replace("/login");
  }

  if (user === undefined) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 text-slate-100 sm:px-10 lg:px-12">
        <div className="h-64 animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6 py-12 text-slate-100 sm:px-10 lg:px-12">
        <Card title="Sign in to open your dashboard" eyebrow="Dashboard access" tone="dark">
          <p className="text-sm leading-7 text-slate-300">
            Your dashboard is personalized around the active ScaleLab account. Login or create an
            account to save your workspace and review recent simulation results.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/login" variant="primary">
              Login
            </Button>
            <Button href="/signup" variant="ghost">
              Create account
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 text-slate-100 sm:px-10 lg:px-12">
      <header className="mb-10 grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Welcome back, {user.name}.</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            {system.name} is ready for your next iteration. Use this workspace to continue modeling
            topology changes, run another load test, and review the latest performance signal.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/systems" variant="primary">
              Open workspace
            </Button>
            <Button href="/simulation" variant="ghost">
              Run simulation
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Logged in as</p>
              <p className="mt-2 text-xl font-semibold text-white">{user.email}</p>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <QuickStat label="Systems tracked" value={`${systems.length}`} />
            <QuickStat label="Latency" value={`${metrics.summary.latencyMs} ms`} />
            <QuickStat label="Throughput" value={`${metrics.summary.throughputRps} rps`} />
            <QuickStat label="Cache hit rate" value={`${metrics.summary.cacheHitRate}%`} />
          </div>
        </div>
      </header>

      <section className="mb-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card title="Current focus" eyebrow="Primary system" tone="dark">
          <p className="text-sm leading-7 text-slate-300">{system.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {system.nodes.map((node) => (
              <span
                key={node.id}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
              >
                {node.label}
              </span>
            ))}
          </div>
        </Card>

        <Card title="Next actions" eyebrow="Recommended flow" tone="dark">
          <div className="grid gap-3 md:grid-cols-3">
            <ActionTile
              title="Review topology"
              description="Refine nodes and edges before testing a new traffic profile."
            />
            <ActionTile
              title="Replay load"
              description="Run the latest configuration against the seed traffic scenario."
            />
            <ActionTile
              title="Inspect metrics"
              description="Compare latency and cache behavior from the last snapshot."
            />
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <MetricsChart />
        <PerformancePanel />
      </section>
    </main>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ActionTile({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}
