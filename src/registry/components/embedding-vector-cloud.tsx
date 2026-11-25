"use client";

import { useEffect, useRef } from "react";

export interface EmbeddingVectorCloudProps {
  /** Query vector and nearest-neighbor retrieval accent color. */
  accentColor?: string;
  /** Semantic point cloud RGB tuple. */
  pointRgb?: [number, number, number];
  /** Background obsidian color. */
  backgroundColor?: string;
  /** 3D orbit rotation speed multiplier. */
  speed?: number;
  /** Pause 3D orbit rotation. */
  paused?: boolean;
  className?: string;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
  cluster: number;
}

/**
 * 3D Semantic Embedding Vector Cloud & Nearest-Neighbor Retrieval Visualizer.
 * Rotates three clustered embedding neighborhoods on pure Canvas2D while a live
 * query vector locks onto its top-K nearest semantic matches.
 */
export function EmbeddingVectorCloud({
  accentColor = "#f27c63",
  pointRgb = [238, 234, 228],
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: EmbeddingVectorCloudProps) {
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

    // Deterministic 3-cluster semantic vector dataset
    const centers: Array<[number, number, number]> = [
      [-0.52, -0.18, 0.25],
      [0.48, -0.22, -0.2],
      [0.05, 0.48, 0.1],
    ];
    let seed = 42019;
    const nextRand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296 - 0.5;
    };

    const points: Vec3[] = Array.from({ length: 54 }, (_, i) => {
      const cluster = i % 3;
      const [cx, cy, cz] = centers[cluster]!;
      return {
        x: cx + nextRand() * 0.52,
        y: cy + nextRand() * 0.44,
        z: cz + nextRand() * 0.52,
        cluster,
      };
    });

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
      const t = paused || prefersReduced ? 1.1 : timeSec * 0.42 * speed;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.44;
      const cosY = Math.cos(t);
      const sinY = Math.sin(t);
      const cosX = Math.cos(0.32);
      const sinX = Math.sin(0.32);

      const project = (v: { x: number; y: number; z: number }) => {
        const x1 = v.x * cosY - v.z * sinY;
        const z1 = v.x * sinY + v.z * cosY;
        const y2 = v.y * cosX - z1 * sinX;
        const z2 = v.y * sinX + z1 * cosX;
        const persp = 2.4 / (2.4 - z2);
        return { sx: cx + x1 * scale * persp, sy: cy + y2 * scale * persp, z: z2, persp };
      };

      // Active drifting query vector orbiting through embedding space
      const activeCluster = Math.floor(t * 0.5) % 3;
      const [qx0, qy0, qz0] = centers[activeCluster]!;
      const queryVec = {
        x: qx0 + Math.cos(t * 1.4) * 0.08,
        y: qy0 + Math.sin(t * 1.4) * 0.08,
        z: qz0,
      };
      const qProj = project(queryVec);

      // Find top-5 nearest neighbors to query vector
      const scored = points.map((p, idx) => {
        const d = Math.hypot(p.x - queryVec.x, p.y - queryVec.y, p.z - queryVec.z);
        return { idx, p, d, proj: project(p) };
      });
      scored.sort((a, b) => a.d - b.d);
      const topIds = new Set(scored.slice(0, 6).map((s) => s.idx));

      // Draw subtle retrieval lines from query vector to nearest semantic neighbors
      for (const s of scored.slice(0, 6)) {
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = 0.48;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(qProj.sx, qProj.sy);
        ctx.lineTo(s.proj.sx, s.proj.sy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Sort back-to-front for crisp depth rendering
      scored.sort((a, b) => a.proj.z - b.proj.z);
      const [r, g, b] = pointRgb;

      for (const s of scored) {
        const isMatch = topIds.has(s.idx);
        const alpha = Math.max(0.18, Math.min(0.95, 0.45 + s.proj.z * 0.45));
        const rad = (isMatch ? 3 : 2) * s.proj.persp;
        ctx.fillStyle = isMatch ? accentColor : `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(s.proj.sx, s.proj.sy, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      // Query vector beacon reticle
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(qProj.sx, qProj.sy, 8.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#f8f5f0";
      ctx.beginPath();
      ctx.arc(qProj.sx, qProj.sy, 3, 0, Math.PI * 2);
      ctx.fill();
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
  }, [accentColor, pointRgb, speed, paused]);

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
