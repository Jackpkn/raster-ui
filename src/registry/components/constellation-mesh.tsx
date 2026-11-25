"use client";

import { useEffect, useRef } from "react";

export interface ConstellationMeshProps {
  /** Number of drifting nodes (18-70). */
  nodeCount?: number;
  /** Maximum distance in CSS px to draw connecting hairlines. */
  linkDistance?: number;
  /** Primary node and link color RGB. */
  nodeRgb?: [number, number, number];
  /** Highlight accent color for hub nodes and cursor links. */
  accentColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Drift velocity multiplier. */
  speed?: number;
  /** Pause particle drift. */
  paused?: boolean;
  className?: string;
}

interface NodePt {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hub: boolean;
}

function seedNodes(count: number, w: number, h: number): NodePt[] {
  let s = 44219;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  return Array.from({ length: count }, (_, i) => ({
    x: rand() * w,
    y: rand() * h,
    vx: (rand() - 0.5) * 0.45,
    vy: (rand() - 0.5) * 0.45,
    hub: i % 6 === 0,
  }));
}

/**
 * Interactive Minimalist Constellation Graph Mesh.
 * Connects nearby drifting nodes with distance-weighted hairlines and responds smoothly to pointer proximity.
 */
export function ConstellationMesh({
  nodeCount = 38,
  linkDistance = 115,
  nodeRgb = [238, 234, 228],
  accentColor = "#f27c63",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: ConstellationMeshProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: -999, y: -999, active: false });

  const nr = nodeRgb[0];
  const ng = nodeRgb[1];
  const nb = nodeRgb[2];

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 420;
    let height = 240;
    let dpr = 1;
    let nodes: NodePt[] = [];
    let visible = true;
    let rafId = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(160, Math.floor(rect.width));
      height = Math.max(120, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = seedNodes(Math.max(12, Math.min(75, nodeCount)), width, height);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const p = pointerRef.current;
      const maxD = Math.max(60, linkDistance);

      if (!paused && !prefersReduced) {
        for (const n of nodes) {
          n.x += n.vx * speed;
          n.y += n.vy * speed;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
          n.x = Math.max(0, Math.min(width, n.x));
          n.y = Math.max(0, Math.min(height, n.y));
        }
      }

      // Draw proximity links
      ctx.lineWidth = 0.9;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]!;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]!;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < maxD) {
            const alpha = (1 - dist / maxD) * 0.28;
            ctx.strokeStyle = `rgba(${nr}, ${ng}, ${nb}, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        if (p.active) {
          const pd = Math.hypot(a.x - p.x, a.y - p.y);
          if (pd < maxD * 1.2) {
            ctx.strokeStyle = accentColor;
            ctx.globalAlpha = (1 - pd / (maxD * 1.2)) * 0.55;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.hub ? 2.6 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = n.hub ? accentColor : `rgba(${nr}, ${ng}, ${nb}, 0.75)`;
        ctx.fill();
      }
    };

    resize();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const tick = () => {
      rafId = window.requestAnimationFrame(tick);
      if (!visible) return;
      draw();
    };

    if (!paused && !prefersReduced) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [nodeCount, linkDistance, nr, ng, nb, accentColor, speed, paused]);

  return (
    <div
      ref={containerRef}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointerRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
