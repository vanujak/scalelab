"use client";

import { useState, useEffect } from "react";
import type { SimulationMetrics } from "@/types/playground";

type Props = {
  metrics: SimulationMetrics | null;
  simulationStatus: "idle" | "running";
};

export function LiveMetricsPanel({ metrics, simulationStatus }: Props) {
  const [history, setHistory] = useState<SimulationMetrics[]>([]);

  useEffect(() => {
    if (metrics) {
      setHistory((prev) => [...prev.slice(-19), metrics]);
    }
  }, [metrics]);

  if (!metrics) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
          <svg
            className="h-8 w-8 text-slate-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-400 mb-2">No metrics yet</p>
        <p className="text-xs text-slate-600 leading-relaxed">
          Run a simulation to see live performance metrics for your architecture.
        </p>
      </div>
    );
  }

  const latencyColor =
    metrics.latencyMs < 50
      ? "text-emerald-400"
      : metrics.latencyMs < 150
      ? "text-amber-400"
      : "text-rose-400";

  const errorColor =
    metrics.errorRate < 1
      ? "text-emerald-400"
      : metrics.errorRate < 5
      ? "text-amber-400"
      : "text-rose-400";

  const cpuColor =
    metrics.cpuUsage < 60
      ? "text-emerald-400"
      : metrics.cpuUsage < 85
      ? "text-amber-400"
      : "text-rose-400";

  return (
    <div className="flex flex-col p-4 gap-4 overflow-y-auto">
      {/* Status */}
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            simulationStatus === "running"
              ? "bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
              : "bg-slate-500"
          }`}
        />
        <span className="text-xs font-bold tracking-widest uppercase text-slate-400">
          {simulationStatus === "running" ? "Live Metrics" : "Last Snapshot"}
        </span>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard
          label="Latency"
          value={`${metrics.latencyMs}`}
          unit="ms"
          colorClass={latencyColor}
        />
        <MetricCard
          label="Throughput"
          value={`${metrics.throughputRps}`}
          unit="rps"
          colorClass="text-cyan-400"
        />
        <MetricCard
          label="Error Rate"
          value={`${metrics.errorRate}`}
          unit="%"
          colorClass={errorColor}
        />
        <MetricCard
          label="Cache Hits"
          value={`${metrics.cacheHitRate}`}
          unit="%"
          colorClass="text-emerald-400"
        />
      </div>

      {/* Resource Gauges */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
          Resources
        </p>
        <div className="space-y-3">
          <GaugeBar label="CPU Usage" value={metrics.cpuUsage} colorClass={cpuColor} />
          <GaugeBar
            label="Memory"
            value={metrics.memoryUsage}
            colorClass={metrics.memoryUsage > 85 ? "text-rose-400" : "text-blue-400"}
          />
        </div>
      </div>

      {/* Connection Stats */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
          Connections
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <p className="text-xs text-slate-500 mb-1">Active</p>
            <p className="text-lg font-bold text-white">{metrics.activeConnections}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <p className="text-xs text-slate-500 mb-1">In-Flight</p>
            <p className="text-lg font-bold text-white">{metrics.requestsInFlight}</p>
          </div>
        </div>
      </div>

      {/* Saturation Warnings */}
      {metrics.saturationPoints.length > 0 && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="h-4 w-4 text-rose-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Saturation Detected
            </p>
          </div>
          <div className="space-y-1">
            {metrics.saturationPoints.map((point) => (
              <p key={point} className="text-xs text-rose-300 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                {point} is under heavy load
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Latency Timeline Mini-Chart */}
      {history.length > 1 && (
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
            Latency Timeline
          </p>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <div className="flex items-end gap-1 h-20">
              {history.map((h, i) => {
                const maxLatency = Math.max(...history.map((m) => m.latencyMs), 1);
                const heightPct = (h.latencyMs / maxLatency) * 100;
                const color =
                  h.latencyMs < 50
                    ? "bg-emerald-400"
                    : h.latencyMs < 150
                    ? "bg-amber-400"
                    : "bg-rose-400";
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t ${color} transition-all duration-500 min-h-[2px]`}
                    style={{ height: `${heightPct}%` }}
                    title={`${h.latencyMs}ms`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  colorClass,
}: {
  label: string;
  value: string;
  unit: string;
  colorClass: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-bold ${colorClass}`}>{value}</span>
        <span className="text-xs text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

function GaugeBar({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) {
  const barColor =
    value < 60
      ? "bg-emerald-400"
      : value < 85
      ? "bg-amber-400"
      : "bg-rose-400";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span className={`text-xs font-semibold ${colorClass}`}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}
