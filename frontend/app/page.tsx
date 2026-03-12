import { Button } from "@/components/ui/Button";
import { systemsService } from "@/services/systems.service";

const features = [
  {
    title: "Model Topology",
    description:
      "Visually construct clients, load balancers, and databases into a single operational reality.",
  },
  {
    title: "Simulate Traffic",
    description:
      "Inject realistic load patterns and observe how your architecture routing handles the pressure.",
  },
  {
    title: "Analyze Insight",
    description:
      "Spot hidden latency spikes and resource saturation before your application hits production.",
  },
];

export default function Home() {
  const systems = systemsService.list();
  const featuredSystemName = systems[0]?.name ?? "your architecture";

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 selection:bg-cyan-500/30">
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-0 top-[20%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute -bottom-[20%] left-[20%] h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
        {/* Navigation */}
        <header className="flex items-center justify-between py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <div className="h-3 w-3 rounded-full bg-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ScaleLab</span>
          </div>
          <div className="flex items-center gap-4">
            <Button href="/login" variant="ghost">
              Sign In
            </Button>
            <Button href="/signup" variant="primary">
              Get Started
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center pt-24 pb-32 text-center lg:pt-32 lg:pb-40">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            ScaleLab v1.0 is Live
          </div>
          
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
            Stress Test Your <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Architecture.
            </span>
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            ScaleLab turns system design into an interactive laboratory. Model your infrastructure, inject peak traffic, and uncover bottlenecks before your users do.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="/systems" variant="primary">
              Start Building
            </Button>
            <Button href="/dashboard" variant="ghost">
              Open Dashboard
            </Button>
          </div>
        </section>

        {/* Visual Showcase */}
        <section className="mx-auto max-w-5xl pb-32">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-2 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-6 py-4 rounded-t-[1.5rem]">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <p className="ml-4 text-xs font-medium tracking-widest uppercase text-slate-400">Simulation Run: E-Commerce Surge</p>
            </div>

            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 p-6 lg:p-8">
              {/* Architecture Diagram */}
              <div className="rounded-3xl border border-white/5 bg-slate-900/50 p-6 shadow-inner">
                <div className="flex flex-col items-center gap-4">
                  <ArchitectureNode label="Client Traffic" type="Ingress" accent="cyan" />
                  <FlowConnector />
                  <ArchitectureNode label="Global Load Balancer" type="Network" accent="slate" />
                  <FlowConnector />
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <ArchitectureNode label="API Node 1" type="Compute" accent="blue" />
                    <ArchitectureNode label="API Node 2" type="Compute" accent="blue" />
                  </div>
                  <FlowConnector />
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <ArchitectureNode label="Redis Cluster" type="Cache" accent="emerald" />
                    <ArchitectureNode label="PostgreSQL" type="Database" accent="amber" />
                  </div>
                </div>
              </div>

              {/* Metrics Readout */}
              <div className="flex flex-col gap-4">
                <div className="rounded-3xl border border-white/5 bg-slate-900/50 p-6">
                  <p className="text-sm font-semibold text-white mb-6">Live Metrics</p>
                  <div className="space-y-5">
                    <SignalBar label="Global Latency" value="142 ms" width="65%" color="bg-emerald-400" />
                    <SignalBar label="Cache Hit Rate" value="89%" width="89%" color="bg-emerald-400" />
                    <SignalBar label="DB CPU Load" value="78%" width="78%" color="bg-amber-400" />
                  </div>
                </div>
                
                <div className="rounded-3xl border border-white/5 bg-slate-900/50 p-6 flex-1 flex flex-col justify-center">
                   <p className="text-3xl font-bold text-white mb-1">18,402</p>
                   <p className="text-sm text-slate-400">Requests per second</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Breakdown */}
        <section className="pb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Built for Engineers</h2>
            <p className="mt-4 text-slate-400">Everything you need to validate your system design without provisioning a single server.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10 hover:border-cyan-500/30">
                <div className="mb-6 h-12 w-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mb-24 rounded-[3rem] border border-cyan-500/20 bg-gradient-to-b from-cyan-900/20 to-slate-900 px-6 py-20 text-center sm:px-12">
          <h2 className="text-3xl font-bold text-white sm:text-5xl">Ready to stress test {featuredSystemName}?</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">
            Join thousands of developers validating their assumptions. No credit card required.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button href="/signup" variant="primary">
              Create Free Account
            </Button>
            <Button href="/systems" variant="ghost">
              Browse Templates
            </Button>
          </div>
        </section>

      </div>
    </main>
  );
}

/* Helper Components */

function ArchitectureNode({
  label,
  type,
  accent = "slate",
}: {
  label: string;
  type: string;
  accent?: "slate" | "cyan" | "blue" | "emerald" | "amber";
}) {
  const accents = {
    slate: "border-white/10 bg-white/5 text-slate-300",
    cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  };

  return (
    <div className={`w-full rounded-2xl border p-4 backdrop-blur-md transition-all hover:scale-[1.02] ${accents[accent]}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{type}</p>
          <p className="text-sm font-semibold text-white">{label}</p>
        </div>
        <div className="h-2 w-2 rounded-full bg-current shadow-[0_0_10px_currentColor] animate-pulse" />
      </div>
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="flex items-center justify-center my-1 w-full relative">
      <div className="h-8 w-px bg-gradient-to-b from-cyan-400 to-transparent opacity-50" />
      {/* Animated particle down the wire */}
      <div className="absolute top-0 h-2 w-px bg-cyan-200 shadow-[0_0_8px_#22d3ee] animate-[bounce_1.5s_infinite]" />
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
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-slate-400">{label}</span>
        <span className="font-medium text-white">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-1000`} style={{ width }} />
      </div>
    </div>
  );
}
