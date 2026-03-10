import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { systemsService } from "@/services/systems.service";
import { formatNumber } from "@/utils/helpers";

const pillars = [
  {
    title: "Model the topology",
    description:
      "Lay out clients, balancers, services, queues, caches, and databases as one operational system.",
  },
  {
    title: "Rehearse load",
    description:
      "Push traffic through the graph with different routing assumptions and compare the pressure points.",
  },
  {
    title: "Read the failure shape",
    description:
      "Spot latency spikes, low cache efficiency, and resource saturation before the design reaches production.",
  },
];

const snapshots = [
  { label: "Active systems", value: "12", tone: "text-cyan-300" },
  { label: "Peak traffic", value: "18k rpm", tone: "text-emerald-300" },
  { label: "Median latency", value: "182 ms", tone: "text-amber-300" },
];

const simulationSteps = [
  "Sketch the request path with reusable infrastructure nodes.",
  "Choose a traffic profile and balancing strategy.",
  "Replay the run and inspect bottlenecks in context.",
];

export default function Home() {
  const systems = systemsService.list();
  const featuredSystemName = systems[0]?.name ?? "your first architecture";

  return (
    <main className="min-h-screen text-slate-100">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute right-[-6rem] top-24 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.45em] text-cyan-300">ScaleLab</p>
              <p className="mt-2 text-sm text-slate-400">
                Distributed architecture design and simulation workspace
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/login" variant="ghost">
                Login
              </Button>
              <Button href="/signup" variant="primary">
                Sign up
              </Button>
            </div>
          </header>

          <div className="grid gap-12 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24">
            <div className="space-y-8 text-slate-100">
              <div className="inline-flex rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-cyan-200 backdrop-blur-sm">
                Design. Simulate. Diagnose.
              </div>
              <div className="space-y-6">
                <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl xl:text-7xl">
                  Sketch load paths.
                  <span className="block text-slate-400">Stress them.</span>
                  <span className="block">Find the crack before production does.</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  ScaleLab turns system design into an interactive lab. Model the architecture,
                  simulate traffic, and read the metrics as if the incident already happened.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button href="/systems" variant="primary">
                  Start with a system
                </Button>
                <Button href="/simulation" variant="ghost">
                  Open simulation lab
                </Button>
                <Button href="/dashboard" variant="ghost">
                  View metrics dashboard
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {snapshots.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{item.label}</p>
                    <p className={`mt-3 text-2xl font-semibold ${item.tone}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-5 shadow-2xl shadow-black/30 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Live canvas</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">Checkout request path</h2>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    Simulation ready
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4">
                    <div className="grid gap-3">
                      <ArchitectureNode label="Users" type="Client" />
                      <FlowConnector />
                      <ArchitectureNode label="Global Load Balancer" type="Ingress" accent="cyan" />
                      <FlowConnector />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <ArchitectureNode label="API Cluster A" type="Service" accent="sky" />
                        <ArchitectureNode label="API Cluster B" type="Service" accent="sky" />
                      </div>
                      <FlowConnector />
                      <div className="grid gap-3 sm:grid-cols-[0.9fr_1.1fr]">
                        <ArchitectureNode label="Redis Cache" type="Cache" accent="emerald" />
                        <ArchitectureNode label="PostgreSQL" type="Storage" accent="amber" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Run profile</p>
                      <div className="mt-4 space-y-3 text-sm text-slate-200">
                        <MetricRow label="Traffic shape" value="flash sale burst" />
                        <MetricRow label="Balancer" value="least connections" />
                        <MetricRow label="Duration" value="15 min" />
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Observed metrics</p>
                      <div className="mt-4 space-y-4">
                        <SignalBar label="Latency" value="182 ms" width="72%" color="bg-amber-400" />
                        <SignalBar label="Cache hit rate" value="68%" width="68%" color="bg-emerald-400" />
                        <SignalBar label="CPU pressure" value="61%" width="61%" color="bg-cyan-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-300">Why ScaleLab</p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              More than a diagramming app.
            </h2>
            <p className="max-w-lg text-base leading-7 text-slate-300">
              The home page now frames ScaleLab as an interactive systems lab: architecture on the
              left, runtime behavior on the right, and a clear progression from model to insight.
            </p>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/10 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Simulation flow</p>
              <div className="mt-4 space-y-3">
                {simulationSteps.map((step, index) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-300/30">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-6 text-slate-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((item) => (
              <Card key={item.title} title={item.title} eyebrow="Core capability" tone="dark">
                <p className="text-sm leading-7 text-slate-300">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
                Seed systems
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Start from realistic scenarios</h2>
            </div>
            <p className="text-sm text-slate-300">
              {formatNumber(systems.length)} architecture{systems.length === 1 ? "" : "s"} scaffolded
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {systems.map((system) => (
              <Card
                key={system.id}
                title={system.name}
                eyebrow={system.status.toUpperCase()}
                tone="dark"
                footer={
                  <Button href="/systems" variant="ghost">
                    Open in workspace
                  </Button>
                }
              >
                <p className="text-sm leading-6 text-slate-300">{system.description}</p>
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
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid gap-6 rounded-[2rem] bg-slate-950 px-6 py-8 text-slate-100 shadow-xl shadow-slate-300/40 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Ready to build</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Turn {featuredSystemName} into your first simulation.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
              Start with a seeded system, modify the topology, and then move into the simulation lab
              to compare tradeoffs under pressure.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/systems" variant="primary">
              Open systems
            </Button>
            <Button href="/signup" variant="ghost">
              Create account
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function ArchitectureNode({
  label,
  type,
  accent = "slate",
}: {
  label: string;
  type: string;
  accent?: "slate" | "cyan" | "sky" | "emerald" | "amber";
}) {
  const accents = {
    slate: "from-white/10 to-white/5 text-slate-100",
    cyan: "from-cyan-400/20 to-cyan-400/5 text-cyan-100",
    sky: "from-sky-400/20 to-sky-400/5 text-sky-100",
    emerald: "from-emerald-400/20 to-emerald-400/5 text-emerald-100",
    amber: "from-amber-400/20 to-amber-400/5 text-amber-100",
  };

  return (
    <div className={`rounded-2xl border border-white/10 bg-gradient-to-r p-4 ${accents[accent]}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{type}</p>
          <p className="mt-2 text-sm font-semibold">{label}</p>
        </div>
        <div className="h-3 w-3 rounded-full bg-current opacity-80" />
      </div>
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-7 w-px bg-gradient-to-b from-cyan-300/60 to-transparent" />
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function SignalBar({
  label,
  value,
  width,
  color,
}: {
  label: string;
  value: string;
  width: string;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-medium text-white">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className={`h-2 rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  );
}
