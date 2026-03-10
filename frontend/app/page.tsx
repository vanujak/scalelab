import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { systemsService } from "@/services/systems.service";
import { formatNumber } from "@/utils/helpers";

const highlights = [
  {
    title: "Architecture builder",
    description:
      "Model load balancers, stateless services, caches, queues, and data stores in one flow.",
  },
  {
    title: "Traffic simulation",
    description:
      "Run configurable request bursts and compare how routing and caching strategies behave.",
  },
  {
    title: "Metrics dashboard",
    description:
      "Track latency, throughput, utilization, and failure signals before you ship a design.",
  },
];

export default function Home() {
  const systems = systemsService.list();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_34%),linear-gradient(180deg,_#07111f_0%,_#0f172a_48%,_#e2e8f0_48%,_#f8fafc_100%)] text-slate-950">
      <section className="mx-auto flex min-h-[40rem] max-w-6xl flex-col justify-between px-6 py-16 sm:px-10 lg:px-12">
        <div className="space-y-6 text-slate-100">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-300">
              ScaleLab
            </p>
            <div className="flex gap-3">
              <Button href="/login">Login</Button>
              <Button href="/signup" variant="primary">
                Sign up
              </Button>
            </div>
          </div>
          <div className="max-w-3xl space-y-5">
            <h1 className="font-sans text-5xl leading-tight font-semibold sm:text-6xl">
              Design distributed systems and test their weak points before production.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              A portfolio-grade platform for modeling architectures, simulating traffic, and
              surfacing bottlenecks across the request path.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/systems" variant="primary">
              Open systems workspace
            </Button>
            <Button href="/simulation" variant="secondary">
              Explore simulation view
            </Button>
            <Button href="/signup" variant="secondary">
              Create account
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title} title={item.title} tone="dark">
              <p className="text-sm leading-6 text-slate-300">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10 lg:px-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-700">
              Seed systems
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Initial project baseline</h2>
          </div>
          <p className="text-sm text-slate-600">
            {formatNumber(systems.length)} architecture{systems.length === 1 ? "" : "s"} scaffolded
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {systems.map((system) => (
            <Card
              key={system.id}
              title={system.name}
              eyebrow={system.status.toUpperCase()}
              footer={<Button href="/dashboard">Inspect dashboard</Button>}
            >
              <p className="text-sm leading-6 text-slate-600">{system.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {system.nodes.map((node) => (
                  <span
                    key={node.id}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {node.label}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
