"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { sessionService } from "@/services/session.service";
import type { AuthUser } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { PlaygroundCanvas } from "@/components/playground/PlaygroundCanvas";
import { ComponentPalette } from "@/components/playground/ComponentPalette";
import { NodeConfigPanel } from "@/components/playground/NodeConfigPanel";
import { SimulationEngine } from "@/components/playground/SimulationEngine";
import { LiveMetricsPanel } from "@/components/playground/LiveMetricsPanel";
import type {
  PlaygroundNode,
  PlaygroundEdge,
  SimulationState,
  SimulationMetrics,
  NodeType,
} from "@/types/playground";

const DEFAULT_NODES: PlaygroundNode[] = [
  {
    id: "node-1",
    type: "client",
    label: "Web Clients",
    x: 400,
    y: 60,
    config: { instances: 1000, requestRate: 500 },
  },
  {
    id: "node-2",
    type: "load-balancer",
    label: "Load Balancer",
    x: 400,
    y: 200,
    config: { algorithm: "round-robin", maxConnections: 10000 },
  },
  {
    id: "node-3",
    type: "server",
    label: "API Server 1",
    x: 250,
    y: 350,
    config: { cpu: 4, memory: 8, maxConcurrency: 200 },
  },
  {
    id: "node-4",
    type: "server",
    label: "API Server 2",
    x: 550,
    y: 350,
    config: { cpu: 4, memory: 8, maxConcurrency: 200 },
  },
  {
    id: "node-5",
    type: "cache",
    label: "Redis Cache",
    x: 250,
    y: 500,
    config: { maxMemory: 4, evictionPolicy: "lru", ttlSeconds: 300 },
  },
  {
    id: "node-6",
    type: "database",
    label: "PostgreSQL",
    x: 550,
    y: 500,
    config: { maxConnections: 100, storageGB: 500, replication: "primary" },
  },
];

const DEFAULT_EDGES: PlaygroundEdge[] = [
  { id: "edge-1", source: "node-1", target: "node-2", label: "HTTPS", latencyMs: 5 },
  { id: "edge-2", source: "node-2", target: "node-3", label: "HTTP", latencyMs: 1 },
  { id: "edge-3", source: "node-2", target: "node-4", label: "HTTP", latencyMs: 1 },
  { id: "edge-4", source: "node-3", target: "node-5", label: "TCP", latencyMs: 2 },
  { id: "edge-5", source: "node-4", target: "node-5", label: "TCP", latencyMs: 2 },
  { id: "edge-6", source: "node-3", target: "node-6", label: "TCP", latencyMs: 5 },
  { id: "edge-7", source: "node-4", target: "node-6", label: "TCP", latencyMs: 5 },
  { id: "edge-8", source: "node-5", target: "node-6", label: "cache miss", latencyMs: 8 },
];

export default function PlaygroundPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
  const [nodes, setNodes] = useState<PlaygroundNode[]>(DEFAULT_NODES);
  const [edges, setEdges] = useState<PlaygroundEdge[]>(DEFAULT_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [simulation, setSimulation] = useState<SimulationState>({ status: "idle" });
  const [metrics, setMetrics] = useState<SimulationMetrics | null>(null);
  const [showPalette, setShowPalette] = useState(true);
  const [showMetrics, setShowMetrics] = useState(false);
  const simulationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(sessionService.getUser());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user, router]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  function handleSignOut() {
    sessionService.clearUser();
    router.replace("/login");
  }

  function handleAddNode(type: NodeType) {
    const id = `node-${Date.now()}`;
    const defaultConfigs: Record<NodeType, Record<string, unknown>> = {
      client: { instances: 100, requestRate: 100 },
      "load-balancer": { algorithm: "round-robin", maxConnections: 10000 },
      server: { cpu: 4, memory: 8, maxConcurrency: 200 },
      cache: { maxMemory: 4, evictionPolicy: "lru", ttlSeconds: 300 },
      database: { maxConnections: 100, storageGB: 500, replication: "primary" },
      queue: { maxDepth: 10000, partitions: 3, retentionHours: 24 },
    };
    const labels: Record<NodeType, string> = {
      client: "Client",
      "load-balancer": "Load Balancer",
      server: "Server",
      cache: "Cache",
      database: "Database",
      queue: "Queue",
    };
    const newNode: PlaygroundNode = {
      id,
      type,
      label: labels[type],
      x: 200 + Math.random() * 400,
      y: 150 + Math.random() * 300,
      config: defaultConfigs[type],
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
  }

  function handleDeleteNode(nodeId: string) {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }

  function handleNodeMove(nodeId: string, x: number, y: number) {
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n)));
  }

  function handleNodeClick(nodeId: string) {
    if (connectingFrom) {
      if (connectingFrom !== nodeId) {
        const edgeId = `edge-${Date.now()}`;
        const newEdge: PlaygroundEdge = {
          id: edgeId,
          source: connectingFrom,
          target: nodeId,
          label: "TCP",
          latencyMs: 5,
        };
        setEdges((prev) => [...prev, newEdge]);
      }
      setConnectingFrom(null);
    } else {
      setSelectedNodeId(nodeId);
    }
  }

  function handleStartConnect(nodeId: string) {
    setConnectingFrom(nodeId);
    setSelectedNodeId(null);
  }

  function handleDeleteEdge(edgeId: string) {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
  }

  function handleUpdateNode(nodeId: string, updates: Partial<PlaygroundNode>) {
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)));
  }

  function handleUpdateEdge(edgeId: string, updates: Partial<PlaygroundEdge>) {
    setEdges((prev) => prev.map((e) => (e.id === edgeId ? { ...e, ...updates } : e)));
  }

  const runSimulationTick = useCallback(() => {
    const clientNodes = nodes.filter((n) => n.type === "client");
    const serverNodes = nodes.filter((n) => n.type === "server");
    const cacheNodes = nodes.filter((n) => n.type === "cache");
    const dbNodes = nodes.filter((n) => n.type === "database");
    const lbNodes = nodes.filter((n) => n.type === "load-balancer");

    const totalRequestRate = clientNodes.reduce(
      (sum, n) => sum + ((n.config?.requestRate as number) ?? 100),
      0
    );
    const totalServerCapacity = serverNodes.reduce(
      (sum, n) => sum + ((n.config?.maxConcurrency as number) ?? 200),
      0
    );
    const cacheMemory = cacheNodes.reduce(
      (sum, n) => sum + ((n.config?.maxMemory as number) ?? 4),
      0
    );
    const dbConnections = dbNodes.reduce(
      (sum, n) => sum + ((n.config?.maxConnections as number) ?? 100),
      0
    );

    const serverLoad = totalServerCapacity > 0 ? Math.min(totalRequestRate / totalServerCapacity, 2.0) : 2.0;
    const cacheHitRate = cacheMemory > 0 ? Math.min(55 + cacheMemory * 5, 98) : 0;
    const hasLb = lbNodes.length > 0;
    const lbDistributionEfficiency = hasLb ? 0.9 : serverNodes.length > 1 ? 0.5 : 1.0;

    const baseLatency = 10;
    const serverLatency = serverLoad > 1.0 ? baseLatency * (1 + (serverLoad - 1) * 5) : baseLatency * (0.5 + serverLoad * 0.5);
    const cacheEffect = cacheHitRate > 0 ? 1 - (cacheHitRate / 100) * 0.6 : 1;
    const dbLatency = dbConnections > 0 ? 15 * (totalRequestRate * (1 - cacheHitRate / 100)) / dbConnections : 50;
    const avgLatency = (serverLatency * cacheEffect + dbLatency * (1 - cacheHitRate / 100)) * (2 - lbDistributionEfficiency);

    const effectiveThroughput = Math.min(
      totalRequestRate,
      totalServerCapacity * lbDistributionEfficiency
    );
    const errorRate = serverLoad > 1.5 ? Math.min((serverLoad - 1.5) * 40, 100) : serverLoad > 1.0 ? (serverLoad - 1.0) * 5 : 0;

    const jitter = () => 0.85 + Math.random() * 0.3;

    setMetrics({
      timestamp: Date.now(),
      latencyMs: Math.round(Math.max(1, avgLatency * jitter())),
      throughputRps: Math.round(effectiveThroughput * jitter()),
      errorRate: Math.round(Math.max(0, errorRate * jitter()) * 10) / 10,
      cacheHitRate: Math.round(Math.max(0, cacheHitRate * jitter())),
      cpuUsage: Math.round(Math.min(100, serverLoad * 50 * jitter())),
      memoryUsage: Math.round(Math.min(100, (30 + serverLoad * 25) * jitter())),
      activeConnections: Math.round(effectiveThroughput * 0.3 * jitter()),
      requestsInFlight: Math.round(totalRequestRate * 0.05 * jitter()),
      saturationPoints: serverLoad > 1.2
        ? serverNodes.map((n) => n.label)
        : [],
    });
  }, [nodes]);

  function handleStartSimulation() {
    setSimulation({ status: "running" });
    setShowMetrics(true);
    runSimulationTick();
    simulationRef.current = setInterval(runSimulationTick, 1500);
  }

  function handleStopSimulation() {
    setSimulation({ status: "idle" });
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
  }

  function handleResetPlayground() {
    handleStopSimulation();
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES);
    setSelectedNodeId(null);
    setConnectingFrom(null);
    setMetrics(null);
    setShowMetrics(false);
  }

  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, []);

  if (user === undefined) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 flex flex-col overflow-hidden">
      {/* Background Gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute right-0 top-[20%] h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[150px]" />
        <div className="absolute -bottom-[20%] left-[40%] h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Top Bar */}
      <header className="relative z-50 flex items-center justify-between border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
              <div className="h-3 w-3 rounded-full bg-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">ScaleLab</span>
          </div>
          <div className="mx-4 h-6 w-px bg-white/10" />
          <span className="text-sm font-medium text-cyan-300">System Design Playground</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <div
              className={`h-2 w-2 rounded-full ${
                simulation.status === "running"
                  ? "bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
                  : "bg-slate-500"
              }`}
            />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {simulation.status === "running" ? "Simulating" : "Ready"}
            </span>
          </div>

          {simulation.status === "running" ? (
            <button
              onClick={handleStopSimulation}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/20"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              Stop
            </button>
          ) : (
            <button
              onClick={handleStartSimulation}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Run Simulation
            </button>
          )}

          <button
            onClick={handleResetPlayground}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>

          <div className="mx-2 h-6 w-px bg-white/10" />
          <span className="text-sm text-slate-400">{user.name}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-slate-500 hover:text-slate-300 transition"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left: Component Palette */}
        <aside
          className={`relative z-40 border-r border-white/10 bg-slate-950/60 backdrop-blur-xl transition-all duration-300 ${
            showPalette ? "w-64" : "w-12"
          } flex-shrink-0 flex flex-col`}
        >
          <button
            onClick={() => setShowPalette(!showPalette)}
            className="absolute -right-3 top-4 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-slate-400 transition hover:text-white"
          >
            <svg
              className={`h-3 w-3 transition-transform ${showPalette ? "" : "rotate-180"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {showPalette && (
            <ComponentPalette
              onAddNode={handleAddNode}
              connectingFrom={connectingFrom}
              onCancelConnect={() => setConnectingFrom(null)}
            />
          )}
        </aside>

        {/* Center: Canvas */}
        <div className="flex-1 relative">
          <PlaygroundCanvas
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNodeId}
            connectingFrom={connectingFrom}
            simulationStatus={simulation.status}
            onNodeClick={handleNodeClick}
            onNodeMove={handleNodeMove}
            onEdgeClick={handleDeleteEdge}
            onCanvasClick={() => {
              setSelectedNodeId(null);
              setConnectingFrom(null);
            }}
          />
          {connectingFrom && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
              </span>
              Click a target node to connect, or Esc to cancel
            </div>
          )}
        </div>

        {/* Right: Config / Metrics Panel */}
        <aside className="relative z-40 w-80 flex-shrink-0 border-l border-white/10 bg-slate-950/60 backdrop-blur-xl flex flex-col overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setShowMetrics(false)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                !showMetrics
                  ? "text-cyan-300 border-b-2 border-cyan-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setShowMetrics(true)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                showMetrics
                  ? "text-cyan-300 border-b-2 border-cyan-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Metrics
            </button>
          </div>

          {!showMetrics ? (
            selectedNode ? (
              <NodeConfigPanel
                node={selectedNode}
                edges={edges.filter(
                  (e) => e.source === selectedNode.id || e.target === selectedNode.id
                )}
                onUpdateNode={handleUpdateNode}
                onUpdateEdge={handleUpdateEdge}
                onDeleteNode={handleDeleteNode}
                onStartConnect={handleStartConnect}
              />
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                  <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-400 mb-2">No node selected</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click a node on the canvas to view and edit its properties, or drag components from the palette.
                </p>
              </div>
            )
          ) : (
            <LiveMetricsPanel metrics={metrics} simulationStatus={simulation.status} />
          )}
        </aside>
      </div>
    </main>
  );
}
