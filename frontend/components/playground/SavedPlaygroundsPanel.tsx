"use client";

import { useState, useEffect, useRef } from "react";
import type { SavedPlayground } from "@/services/playground.service";
import { playgroundService } from "@/services/playground.service";
import type { PlaygroundNode, PlaygroundEdge } from "@/types/playground";

type Props = {
  userId: string;
  currentNodes: PlaygroundNode[];
  currentEdges: PlaygroundEdge[];
  onLoad: (nodes: PlaygroundNode[], edges: PlaygroundEdge[], name: string, id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  activePlaygroundId: string | null;
};

export function SavedPlaygroundsPanel({
  userId,
  currentNodes,
  currentEdges,
  onLoad,
  isOpen,
  onClose,
  activePlaygroundId,
}: Props) {
  const [playgrounds, setPlaygrounds] = useState<SavedPlayground[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const saveInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && userId) {
      loadPlaygrounds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  useEffect(() => {
    if (showSaveInput && saveInputRef.current) {
      saveInputRef.current.focus();
    }
  }, [showSaveInput]);

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 2500);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  async function loadPlaygrounds() {
    setLoading(true);
    setError(null);
    try {
      const data = await playgroundService.getAll(userId);
      setPlaygrounds(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const name = saveName.trim();
    if (!name) return;
    setSaving(true);
    setError(null);
    try {
      await playgroundService.create(userId, name, currentNodes, currentEdges);
      setSaveName("");
      setShowSaveInput(false);
      setSuccessMsg("Playground saved!");
      await loadPlaygrounds();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleOverwrite(pg: SavedPlayground) {
    setSaving(true);
    setError(null);
    try {
      await playgroundService.update(pg.id, userId, {
        nodes: currentNodes,
        edges: currentEdges,
      });
      setSuccessMsg("Playground updated!");
      await loadPlaygrounds();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await playgroundService.remove(id, userId);
      setDeletingId(null);
      setSuccessMsg("Playground deleted.");
      await loadPlaygrounds();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  function handleLoadPlayground(pg: SavedPlayground) {
    onLoad(pg.nodes, pg.edges, pg.name, pg.id);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className="relative ml-auto h-full w-[420px] max-w-[90vw] flex flex-col border-l border-white/10 bg-[#0a0e1a]/95 backdrop-blur-2xl shadow-2xl shadow-black/50"
        style={{ animation: "slideInRight 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30">
              <svg className="h-4.5 w-4.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Saved Playgrounds</h2>
              <p className="text-[10px] text-slate-500">
                {playgrounds.length} playground{playgrounds.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-4 mt-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mx-4 mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400 flex items-center gap-2">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {successMsg}
          </div>
        )}

        {/* Save New Button */}
        <div className="px-4 pt-4 pb-2">
          {showSaveInput ? (
            <div className="flex gap-2">
              <input
                ref={saveInputRef}
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") { setShowSaveInput(false); setSaveName(""); }
                }}
                placeholder="Enter playground name…"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                disabled={saving}
              />
              <button
                onClick={handleSave}
                disabled={saving || !saveName.trim()}
                className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
              >
                {saving ? (
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
              <button
                onClick={() => { setShowSaveInput(false); setSaveName(""); }}
                className="rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-400 hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSaveInput(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-violet-500/30 bg-violet-500/5 px-4 py-3 text-sm font-semibold text-violet-400 transition-all hover:bg-violet-500/10 hover:border-violet-500/50 group"
            >
              <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Save Current Playground
            </button>
          )}
        </div>

        {/* Playground List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-7 w-7 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
              <p className="mt-3 text-xs text-slate-500">Loading playgrounds…</p>
            </div>
          ) : playgrounds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <svg className="h-7 w-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-400">No saved playgrounds</p>
              <p className="text-xs text-slate-600 mt-1">Save your current design to access it later</p>
            </div>
          ) : (
            playgrounds.map((pg) => (
              <div
                key={pg.id}
                className={`group rounded-xl border transition-all duration-200 ${
                  activePlaygroundId === pg.id
                    ? "border-violet-500/40 bg-violet-500/10"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10"
                }`}
              >
                {/* Card Content */}
                <div className="px-3.5 py-3">
                  {/* Title Row */}
                  <div className="flex items-start justify-between gap-2">
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {pg.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-500">
                            {(pg.nodes?.length ?? 0)} nodes · {(pg.edges?.length ?? 0)} edges
                          </span>
                          <span className="text-[10px] text-slate-600">·</span>
                          <span className="text-[10px] text-slate-500">
                            {formatDate(pg.updated_at)}
                          </span>
                        </div>
                      </div>
                      {activePlaygroundId === pg.id && (
                        <span className="flex-shrink-0 inline-flex items-center rounded-full bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 text-[9px] font-bold text-violet-400 uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 mt-3 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleLoadPlayground(pg)}
                        className="flex-1 flex items-center justify-center h-7 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 text-[10px] font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleOverwrite(pg)}
                        className="flex-1 flex items-center justify-center h-7 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 text-[10px] font-semibold text-amber-400 transition-all hover:bg-amber-500/20"
                      >
                        Overwrite
                      </button>
                      {deletingId === pg.id ? (
                        <div className="flex items-center h-7 gap-1">
                          <button
                            onClick={() => handleDelete(pg.id)}
                            className="flex items-center justify-center h-full rounded-lg bg-rose-600/80 px-2.5 text-[10px] font-bold text-white hover:bg-rose-600 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="flex items-center justify-center h-full rounded-lg bg-white/5 px-2.5 text-[10px] text-slate-400 hover:bg-white/10 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingId(pg.id)}
                          className="flex items-center justify-center h-7 w-8 rounded-lg border border-rose-500/10 bg-rose-500/5 text-rose-400/60 transition-all hover:bg-rose-500/20 hover:text-rose-400"
                          title="Delete"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      )}
                    </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
