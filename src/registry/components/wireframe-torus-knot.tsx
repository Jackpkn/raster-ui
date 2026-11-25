"use client";

import { useEffect, useRef } from "react";

export interface WireframeTorusKnotProps {
  /** Base wireframe stroke RGB. */
  strokeRgb?: [number, number, number];
  /** Accent highlight color for front-facing ridges and moving spark. */
  accentColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Rotation speed multiplier. */
  speed?: number;
  /** Pause rotation. */
  paused?: boolean;
  className?: string;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Pure Canvas2D 3D Parametric Wireframe Torus Sculpture.
 * Renders a depth-shaded rotating 3D torus lattice with pointer tilt and zero Three.js dependency.
 */
export function WireframeTorusKnot({
  strokeRgb = [238, 234, 228],
  accentColor = "#f27c63",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: WireframeTorusKnotProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tiltRef = useRef({ tx: 0, ty: 0 });

  const sr = strokeRgb[0];
  const sg = strokeRgb[1];
  const sb = strokeRgb[2];

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 360;
    let height = 260;
    let dpr = 1;
    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const ringsU = 28;
    const ringsV = 12;
    const majorR = 1.05;
    const minorR = 0.42;

    const project = (p: Vec3, yaw: number, pitch: number, cx: number, cy: number, scale: number) => {
      const cyw = Math.cos(yaw);
      const syw = Math.sin(yaw);
      const x1 = p.x * cyw + p.z * syw;
      const z1 = -p.x * syw + p.z * cyw;

      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const y2 = p.y * cp - z1 * sp;
      const z2 = p.y * sp + z1 * cp;

      const persp = 3.2 / (3.2 - z2 * 0.68);
      return {
        sx: cx + x1 * scale * persp,
        sy: cy - y2 * scale * persp,
        z: z2,
      };
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(160, Math.floor(rect.width));
      height = Math.max(140, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 0.8 : timeSec * 0.45 * speed;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.27;
      const yaw = t + tiltRef.current.tx * 0.5;
      const pitch = 0.58 + Math.sin(t * 0.6) * 0.16 + tiltRef.current.ty * 0.4;

      const grid: Array<Array<{ sx: number; sy: number; z: number }>> = [];
      for (let i = 0; i < ringsU; i++) {
        const u = (i / ringsU) * Math.PI * 2;
        const row: Array<{ sx: number; sy: number; z: number }> = [];
        for (let j = 0; j < ringsV; j++) {
          const v = (j / ringsV) * Math.PI * 2;
          const r = majorR + minorR * Math.cos(v);
          const p: Vec3 = {
            x: r * Math.cos(u),
            y: minorR * Math.sin(v),
            z: r * Math.sin(u),
          };
          row.push(project(p, yaw, pitch, cx, cy, scale));
        }
        grid.push(row);
      }

      // Draw latitude & meridian segments with depth fog
      ctx.lineWidth = 0.9;
      for (let i = 0; i < ringsU; i++) {
        const nextI = (i + 1) % ringsU;
        for (let j = 0; j < ringsV; j++) {
          const nextJ = (j + 1) % ringsV;
          const a = grid[i]![j]!;
          const b = grid[nextI]![j]!;
          const c = grid[i]![nextJ]!;

          const depthA = Math.max(0.08, Math.min(0.82, (a.z + 1.5) / 3.0));
          ctx.strokeStyle =
            j === 0 ? accentColor : `rgba(${sr}, ${sg}, ${sb}, ${(depthA * 0.72).toFixed(3)})`;
          ctx.globalAlpha = j === 0 ? Math.min(0.95, depthA + 0.2) : 1;

          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();

          ctx.globalAlpha = 1;
          ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, ${(depthA * 0.36).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(c.sx, c.sy);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    draw(0.8);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 0.8 : (performance.now() - startMs) / 1000);
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
  }, [sr, sg, sb, accentColor, speed, paused]);

  return (
    <div
      ref={containerRef}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        tiltRef.current = {
          tx: ((e.clientX - r.left) / r.width - 0.5) * 2,
          ty: ((e.clientY - r.top) / r.height - 0.5) * 2,
        };
      }}
      onPointerLeave={() => {
        tiltRef.current = { tx: 0, ty: 0 };
      }}
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
