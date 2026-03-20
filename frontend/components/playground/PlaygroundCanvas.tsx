"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { PlaygroundNode, PlaygroundEdge } from "@/types/playground";

type Props = {
  nodes: PlaygroundNode[];
  edges: PlaygroundEdge[];
  selectedNodeId: string | null;
  connectingFrom: string | null;
  simulationStatus: "idle" | "running";
  onNodeClick: (nodeId: string) => void;
  onNodeMove: (nodeId: string, x: number, y: number) => void;
  onEdgeClick: (edgeId: string) => void;
  onCanvasClick: () => void;
};

const NODE_COLORS: Record<string, { bg: string; border: string; text: string; glow: string; icon: string }> = {
  client: {
    bg: "rgba(34, 211, 238, 0.08)",
    border: "rgba(34, 211, 238, 0.3)",
    text: "#67e8f9",
    glow: "rgba(34, 211, 238, 0.15)",
    icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  },
  "load-balancer": {
    bg: "rgba(168, 85, 247, 0.08)",
    border: "rgba(168, 85, 247, 0.3)",
    text: "#c084fc",
    glow: "rgba(168, 85, 247, 0.15)",
    icon: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
  },
  server: {
    bg: "rgba(59, 130, 246, 0.08)",
    border: "rgba(59, 130, 246, 0.3)",
    text: "#93c5fd",
    glow: "rgba(59, 130, 246, 0.15)",
    icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z",
  },
  cache: {
    bg: "rgba(16, 185, 129, 0.08)",
    border: "rgba(16, 185, 129, 0.3)",
    text: "#6ee7b7",
    glow: "rgba(16, 185, 129, 0.15)",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  },
  database: {
    bg: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.3)",
    text: "#fcd34d",
    glow: "rgba(245, 158, 11, 0.15)",
    icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125",
  },
  queue: {
    bg: "rgba(244, 63, 94, 0.08)",
    border: "rgba(244, 63, 94, 0.3)",
    text: "#fda4af",
    glow: "rgba(244, 63, 94, 0.15)",
    icon: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z",
  },
};

const NODE_WIDTH = 160;
const NODE_HEIGHT = 72;

export function PlaygroundCanvas({
  nodes,
  edges,
  selectedNodeId,
  connectingFrom,
  simulationStatus,
  onNodeClick,
  onNodeMove,
  onEdgeClick,
  onCanvasClick,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<{ nodeId: string; offsetX: number; offsetY: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    function handleResize() {
      if (svgRef.current) {
        const rect = svgRef.current.parentElement?.getBoundingClientRect();
        if (rect) {
          setCanvasSize({ width: rect.width, height: rect.height });
        }
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation();
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;
      setDragging({
        nodeId,
        offsetX: e.clientX - node.x,
        offsetY: e.clientY - node.y,
      });
    },
    [nodes]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      const x = Math.max(0, Math.min(canvasSize.width - NODE_WIDTH, e.clientX - dragging.offsetX));
      const y = Math.max(0, Math.min(canvasSize.height - NODE_HEIGHT, e.clientY - dragging.offsetY));
      onNodeMove(dragging.nodeId, x, y);
    },
    [dragging, onNodeMove, canvasSize]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  function getNodeCenter(node: PlaygroundNode) {
    return { x: node.x + NODE_WIDTH / 2, y: node.y + NODE_HEIGHT / 2 };
  }

  /**
   * Compute the intersection point of a ray from `from` → `to`
   * with the border of a rectangle centered at `from`.
   * The `inset` pulls the point back along the ray so the
   * arrowhead marker doesn't overlap the node border.
   */
  function clipToNodeEdge(
    center: { x: number; y: number },
    target: { x: number; y: number },
    halfW: number,
    halfH: number,
    inset = 0,
  ) {
    const dx = target.x - center.x;
    const dy = target.y - center.y;

    if (dx === 0 && dy === 0) return { x: center.x, y: center.y };

    // Find the parameter t where the ray hits the rect edge
    const tX = halfW / Math.abs(dx || 1);
    const tY = halfH / Math.abs(dy || 1);
    const t = Math.min(tX, tY);

    const edgeX = center.x + dx * t;
    const edgeY = center.y + dy * t;

    // Pull back along the ray by `inset` pixels
    if (inset > 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      return {
        x: edgeX - (dx / len) * inset,
        y: edgeY - (dy / len) * inset,
      };
    }

    return { x: edgeX, y: edgeY };
  }

  const HALF_W = NODE_WIDTH / 2;
  const HALF_H = NODE_HEIGHT / 2;
  const ARROW_INSET = 10; // size of the arrowhead marker so it sits flush

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ cursor: dragging ? "grabbing" : connectingFrom ? "crosshair" : "default" }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as SVGElement).tagName === "svg") {
            onCanvasClick();
          }
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(148, 163, 184, 0.5)" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(34, 211, 238, 0.8)" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const srcCenter = getNodeCenter(sourceNode);
          const tgtCenter = getNodeCenter(targetNode);
          const isActive = simulationStatus === "running";

          // Clip line start to source node border (no inset needed)
          const lineStart = clipToNodeEdge(srcCenter, tgtCenter, HALF_W, HALF_H);
          // Clip line end to target node border, pulled back by the arrowhead size
          const lineEnd = clipToNodeEdge(tgtCenter, srcCenter, HALF_W, HALF_H, ARROW_INSET);

          const midX = (lineStart.x + lineEnd.x) / 2;
          const midY = (lineStart.y + lineEnd.y) / 2;

          return (
            <g
              key={edge.id}
              onClick={(e) => {
                e.stopPropagation();
                onEdgeClick(edge.id);
              }}
              className="cursor-pointer group"
            >
              {/* Invisible wider hit area */}
              <line
                x1={lineStart.x}
                y1={lineStart.y}
                x2={lineEnd.x}
                y2={lineEnd.y}
                stroke="transparent"
                strokeWidth="20"
              />
              {/* Visible edge */}
              <line
                x1={lineStart.x}
                y1={lineStart.y}
                x2={lineEnd.x}
                y2={lineEnd.y}
                stroke={isActive ? "rgba(34, 211, 238, 0.3)" : "rgba(148, 163, 184, 0.2)"}
                strokeWidth="2"
                strokeDasharray={isActive ? "none" : "6 4"}
                markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                className="transition-all duration-300"
              />
              {/* Animated particles on edge when simulating */}
              {isActive && (
                <>
                  <circle r="3" fill="#22d3ee" filter="url(#glow)">
                    <animateMotion
                      dur={`${1 + Math.random()}s`}
                      repeatCount="indefinite"
                      path={`M${lineStart.x},${lineStart.y} L${lineEnd.x},${lineEnd.y}`}
                    />
                  </circle>
                  <circle r="2" fill="#22d3ee" opacity="0.5">
                    <animateMotion
                      dur={`${1.5 + Math.random()}s`}
                      repeatCount="indefinite"
                      path={`M${lineStart.x},${lineStart.y} L${lineEnd.x},${lineEnd.y}`}
                      begin="0.5s"
                    />
                  </circle>
                </>
              )}
              {/* Edge label */}
              <g className="opacity-60 group-hover:opacity-100 transition-opacity">
                <rect
                  x={midX - 24}
                  y={midY - 10}
                  width="48"
                  height="20"
                  rx="6"
                  fill="rgba(2, 6, 23, 0.8)"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  fill="rgba(148, 163, 184, 0.8)"
                  fontSize="9"
                  fontWeight="500"
                >
                  {edge.label}
                </text>
              </g>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const colors = NODE_COLORS[node.type] ?? NODE_COLORS.server;
          const isSelected = selectedNodeId === node.id;
          const isConnecting = connectingFrom === node.id;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={(e) => {
                e.stopPropagation();
                if (!dragging) onNodeClick(node.id);
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              className="cursor-grab active:cursor-grabbing"
            >
              {/* Glow effect */}
              {(isSelected || isConnecting || simulationStatus === "running") && (
                <rect
                  x="-4"
                  y="-4"
                  width={NODE_WIDTH + 8}
                  height={NODE_HEIGHT + 8}
                  rx="20"
                  fill="none"
                  stroke={isConnecting ? "rgba(34, 211, 238, 0.5)" : colors.border}
                  strokeWidth="2"
                  opacity={isSelected || isConnecting ? 1 : 0.4}
                  className={simulationStatus === "running" && !isSelected ? "animate-pulse" : ""}
                />
              )}
              {/* Node background */}
              <rect
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx="16"
                fill={colors.bg}
                stroke={isSelected ? colors.text : colors.border}
                strokeWidth={isSelected ? "2" : "1"}
                className="transition-all duration-200"
              />
              {/* Icon */}
              <svg
                x="12"
                y={(NODE_HEIGHT - 20) / 2}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.text}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={colors.icon} />
              </svg>
              {/* Label */}
              <text
                x="40"
                y={NODE_HEIGHT / 2 - 4}
                fill="white"
                fontSize="12"
                fontWeight="600"
                dominantBaseline="middle"
              >
                {node.label.length > 14 ? node.label.slice(0, 14) + "…" : node.label}
              </text>
              {/* Type label */}
              <text
                x="40"
                y={NODE_HEIGHT / 2 + 12}
                fill={colors.text}
                fontSize="9"
                fontWeight="500"
                style={{ textTransform: "uppercase" }}
                dominantBaseline="middle"
              >
                {node.type.toUpperCase()}
              </text>
              {/* Running indicator */}
              {simulationStatus === "running" && (
                <circle
                  cx={NODE_WIDTH - 16}
                  cy="16"
                  r="4"
                  fill="#34d399"
                  className="animate-pulse"
                >
                  <animate
                    attributeName="opacity"
                    values="1;0.4;1"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
