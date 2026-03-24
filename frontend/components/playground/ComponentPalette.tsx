"use client";

import type { NodeType } from "@/types/playground";

type Props = {
  onAddNode: (type: NodeType) => void;
  connectingFrom: string | null;
  onCancelConnect: () => void;
};

const PALETTE_ITEMS: {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}[] = [
  {
    type: "client",
    label: "Client",
    description: "HTTP/WebSocket traffic source",
    icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20",
  },
  {
    type: "load-balancer",
    label: "Load Balancer",
    description: "Distribute traffic across servers",
    icon: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20",
  },
  {
    type: "server",
    label: "Server",
    description: "Application or API compute node",
    icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20",
  },
  {
    type: "cache",
    label: "Cache",
    description: "Redis or Memcached layer",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20",
  },
  {
    type: "database",
    label: "Database",
    description: "SQL or NoSQL data store",
    icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20",
  },
  {
    type: "queue",
    label: "Message Queue",
    description: "Kafka, RabbitMQ, or SQS",
    icon: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20",
  },
];

export function ComponentPalette({ onAddNode, connectingFrom, onCancelConnect }: Props) {
  return (
    <div className="flex flex-col h-full p-3 overflow-hidden">
      <div className="mb-3">
        <p className="text-xs font-bold tracking-widest uppercase text-cyan-400 mb-0.5">Components</p>
        <p className="text-[10px] text-slate-500">Click to add to canvas</p>
      </div>

      {connectingFrom && (
        <div className="mb-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-2">
          <p className="text-[10px] font-medium text-cyan-300 mb-1">Connecting mode</p>
          <p className="text-[10px] text-slate-400 mb-1">
            Click a target node to connect.
          </p>
          <button
            onClick={onCancelConnect}
            className="text-[10px] text-rose-400 hover:text-rose-300 font-medium transition"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1.5 flex-1">
        {PALETTE_ITEMS.map((item) => (
          <button
            key={item.type}
            onClick={() => onAddNode(item.type)}
            title={item.description}
            className={`w-full rounded-lg border px-2.5 py-2 text-left transition-all duration-200 ${item.bgColor} group`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`flex-shrink-0 ${item.color}`}>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={item.icon} />
                </svg>
              </div>
              <span className="text-xs font-semibold text-white group-hover:text-white/90">
                {item.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-3 border-t border-white/5">
        <p className="text-[10px] text-slate-600 leading-relaxed">
          <span className="text-cyan-500">•</span> Drag to move
          <span className="text-slate-700 mx-1">|</span>
          <span className="text-cyan-500">•</span> Click to select
          <span className="text-slate-700 mx-1">|</span>
          <span className="text-emerald-500">▶</span> Run to simulate
        </p>
      </div>
    </div>
  );
}
