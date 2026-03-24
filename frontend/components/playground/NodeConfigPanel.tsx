"use client";

import { useState } from "react";
import type { PlaygroundNode, PlaygroundEdge } from "@/types/playground";

type Props = {
  node: PlaygroundNode;
  edges: PlaygroundEdge[];
  onUpdateNode: (nodeId: string, updates: Partial<PlaygroundNode>) => void;
  onUpdateEdge: (edgeId: string, updates: Partial<PlaygroundEdge>) => void;
  onDeleteNode: (nodeId: string) => void;
  onStartConnect: (nodeId: string) => void;
};

type ConfigField = {
  key: string;
  label: string;
  type: "number" | "text" | "select";
  options?: string[];
};

const CONFIG_FIELDS: Record<string, ConfigField[]> = {
  client: [
    { key: "instances", label: "Concurrent Users", type: "number" },
    { key: "requestRate", label: "Requests/sec", type: "number" },
  ],
  "load-balancer": [
    {
      key: "algorithm",
      label: "Algorithm",
      type: "select",
      options: ["round-robin", "least-connections", "ip-hash", "random", "weighted"],
    },
    { key: "maxConnections", label: "Max Connections", type: "number" },
  ],
  server: [
    { key: "cpu", label: "CPU Cores", type: "number" },
    { key: "memory", label: "Memory (GB)", type: "number" },
    { key: "maxConcurrency", label: "Max Concurrency", type: "number" },
  ],
  cache: [
    { key: "maxMemory", label: "Max Memory (GB)", type: "number" },
    {
      key: "evictionPolicy",
      label: "Eviction Policy",
      type: "select",
      options: ["lru", "lfu", "ttl", "random"],
    },
    { key: "ttlSeconds", label: "TTL (seconds)", type: "number" },
  ],
  database: [
    { key: "maxConnections", label: "Max Connections", type: "number" },
    { key: "storageGB", label: "Storage (GB)", type: "number" },
    {
      key: "replication",
      label: "Replication",
      type: "select",
      options: ["primary", "replica", "multi-primary"],
    },
  ],
  queue: [
    { key: "maxDepth", label: "Max Queue Depth", type: "number" },
    { key: "partitions", label: "Partitions", type: "number" },
    { key: "retentionHours", label: "Retention (hours)", type: "number" },
  ],
};

const NODE_TYPE_COLORS: Record<string, string> = {
  client: "text-cyan-400",
  "load-balancer": "text-purple-400",
  server: "text-blue-400",
  cache: "text-emerald-400",
  database: "text-amber-400",
  queue: "text-rose-400",
};

export function NodeConfigPanel({
  node,
  edges,
  onUpdateNode,
  onUpdateEdge,
  onDeleteNode,
  onStartConnect,
}: Props) {
  const [label, setLabel] = useState(node.label);
  const fields = CONFIG_FIELDS[node.type] ?? [];
  const colorClass = NODE_TYPE_COLORS[node.type] ?? "text-slate-400";

  function handleLabelBlur() {
    if (label.trim() && label !== node.label) {
      onUpdateNode(node.id, { label: label.trim() });
    }
  }

  function handleConfigChange(key: string, value: string | number) {
    onUpdateNode(node.id, {
      config: { ...node.config, [key]: value },
    });
  }

  function handleEdgeLatencyChange(edgeId: string, latencyMs: number) {
    onUpdateEdge(edgeId, { latencyMs });
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition placeholder-slate-600 focus:border-cyan-500/50 focus:bg-white/10";
  const selectClass =
    "w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-500/50 appearance-none cursor-pointer";

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-3 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-bold tracking-widest uppercase ${colorClass}`}>
            {node.type}
          </span>
          <span className="text-[10px] text-slate-600">#{node.id.slice(-4)}</span>
        </div>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleLabelBlur}
          onKeyDown={(e) => e.key === "Enter" && handleLabelBlur()}
          className={`${inputClass} font-semibold`}
          placeholder="Node label"
        />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-3 space-y-3 min-h-0">
        {/* Configuration */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">
            Configuration
          </p>
          <div className="space-y-2">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-[10px] font-medium text-slate-400 mb-1 ml-0.5">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    value={String(node.config[field.key] ?? "")}
                    onChange={(e) => handleConfigChange(field.key, e.target.value)}
                    className={selectClass}
                  >
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={String(node.config[field.key] ?? "")}
                    onChange={(e) =>
                      handleConfigChange(
                        field.key,
                        field.type === "number" ? Number(e.target.value) : e.target.value
                      )
                    }
                    className={inputClass}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Connections */}
        {edges.length > 0 && (
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">
              Connections ({edges.length})
            </p>
            <div className="space-y-1.5">
              {edges.map((edge) => (
                <div
                  key={edge.id}
                  className="rounded-lg border border-white/5 bg-white/[0.02] p-2"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400">{edge.label}</span>
                    <span className="text-[10px] text-slate-600">
                      {edge.source === node.id ? "→ out" : "← in"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] text-slate-500 whitespace-nowrap">Latency:</label>
                    <input
                      type="number"
                      value={edge.latencyMs}
                      onChange={(e) =>
                        handleEdgeLatencyChange(edge.id, Number(e.target.value))
                      }
                      className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white outline-none focus:border-cyan-500/50"
                    />
                    <span className="text-[10px] text-slate-600">ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Actions Footer */}
      <div className="flex-shrink-0 p-3 pt-2 border-t border-white/5 space-y-1.5">
        <button
          onClick={() => onStartConnect(node.id)}
          className="w-full rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/10"
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Connect
          </span>
        </button>
        <button
          onClick={() => onDeleteNode(node.id)}
          className="w-full rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10"
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Node
          </span>
        </button>
      </div>
    </div>
  );
}
