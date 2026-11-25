"use client";

import { useEffect, useRef } from "react";

export interface MeshTopologyFlowProps {
  /** Traveling signal packet and active beacon accent color. */
  accentColor?: string;
  /** Static link edge stroke color. */
  edgeColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Packet routing speed multiplier. */
  speed?: number;
  /** Pause packet hops. */
  paused?: boolean;
  className?: string;
}

const NODES = [
  { id: "US-E", x: 0.16, y: 0.34 },
  { id: "EU-W", x: 0.44, y: 0.22 },
  { id: "CORE", x: 0.5, y: 0.54 },
  { id: "CACHE", x: 0.22, y: 0.74 },
  { id: "EDGE", x: 0.78, y: 0.32 },
  { id: "AP-S", x: 0.82, y: 0.72 },
];

const LINKS: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 4],
  [2, 3],
  [2, 4],
  [2, 5],
  [4, 5],
];

/**
 * Distributed Cluster Mesh Topology with Live Multi-Hop Data Packets.
 * Renders regional infrastructure nodes linked by clean vector edges with
 * directional glowing packets and arrival pulse rings on pure Canvas2D.
 */
export function MeshTopologyFlow({
  accentColor = "#f27c63",
  edgeColor = "rgba(248, 245, 240, 0.15)",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: MeshTopologyFlowProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 440;
    let height = 220;
    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(180, Math.floor(rect.width));
      height = Math.max(120, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 1.1 : timeSec * 0.45 * speed;
      ctx.clearRect(0, 0, width, height);

      const coords = NODES.map((n) => ({ ...n, px: n.x * width, py: n.y * height }));

      // Draw static topology links
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = 1.1;
      for (const [a, b] of LINKS) {
        const na = coords[a]!;
        const nb = coords[b]!;
        ctx.beginPath();
        ctx.moveTo(na.px, na.py);
        ctx.lineTo(nb.px, nb.py);
        ctx.stroke();
      }

      // Active packet streams gliding across topology links
      LINKS.forEach(([a, b], idx) => {
        const na = coords[a]!;
        const nb = coords[b]!;
        const phase = (t + idx * 0.23) % 1.45;
        if (phase > 1) return;

        const dir = idx % 2 === 0 ? phase : 1 - phase;
        const tail = idx % 2 === 0 ? Math.max(0, dir - 0.18) : Math.min(1, dir + 0.18);

        const hx = na.px + (nb.px - na.px) * dir;
        const hy = na.py + (nb.py - na.py) * dir;
        const tx = na.px + (nb.px - na.px) * tail;
        const ty = na.py + (nb.py - na.py) * tail;

        const grad = ctx.createLinearGradient(tx, ty, hx, hy);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, accentColor);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();

        ctx.fillStyle = "#f8f5f0";
        ctx.beginPath();
        ctx.arc(hx, hy, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw cluster nodes & monospace labels
      coords.forEach((n, idx) => {
        const isCore = n.id === "CORE";
        const pulse = (t * 1.1 + idx * 0.35) % 1;

        // Subtle telemetry arrival ripple
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = (1 - pulse) * (isCore ? 0.45 : 0.22);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.px, n.py, (isCore ? 10 : 7) + pulse * 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.fillStyle = "#0c0c12";
        ctx.strokeStyle = isCore ? accentColor : "rgba(248, 245, 240, 0.32)";
        ctx.lineWidth = isCore ? 1.5 : 1.1;
        ctx.beginPath();
        ctx.arc(n.px, n.py, isCore ? 9 : 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isCore ? accentColor : "#f8f5f0";
        ctx.beginPath();
        ctx.arc(n.px, n.py, isCore ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isCore ? "#f8f5f0" : "#9c978f";
        ctx.font = "600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.fillText(n.id, n.px, n.py + (isCore ? 21 : 17));
      });
    };

    resize();
    draw(1.1);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.1 : (performance.now() - startMs) / 1000);
    });
    ro.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);
      if (!visible || paused || prefersReduced) return;
      draw((now - startMs) / 1000);
    };

    if (!paused && !prefersReduced) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [accentColor, edgeColor, speed, paused]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
