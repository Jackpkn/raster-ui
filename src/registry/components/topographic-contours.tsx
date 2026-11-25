"use client";

import { useEffect, useRef } from "react";

export interface TopographicContoursProps {
  /** Base elevation isoline stroke color. */
  lineColor?: string;
  /** Highlight summit contour line color. */
  accentColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Number of contour elevation levels (5-12). */
  levels?: number;
  /** Terrain drift speed multiplier. */
  speed?: number;
  /** Pause drift animation. */
  paused?: boolean;
  className?: string;
}

/**
 * Procedural Marching-Squares Topographic Contour Map.
 * Extracts crisp real-time vector elevation isolines across an animated scalar field on pure Canvas2D.
 */
export function TopographicContours({
  lineColor = "rgba(235, 230, 222, 0.24)",
  accentColor = "#f27c63",
  backgroundColor = "#060609",
  levels = 8,
  speed = 1,
  paused = false,
  className = "",
}: TopographicContoursProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(160, Math.floor(rect.width));
      height = Math.max(120, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const sampleField = (nx: number, ny: number, t: number): number => {
      const a = Math.sin(nx * 4.2 + t * 0.45) * Math.cos(ny * 3.6 - t * 0.35);
      const b = Math.sin((nx * 2.5 - ny * 3.2) + t * 0.3) * 0.65;
      const c = Math.cos((nx + ny) * 5.1 - t * 0.5) * 0.32;
      return 0.5 + (a + b + c) * 0.26;
    };

    const draw = (timeSec: number) => {
      const t = timeSec * 0.55 * speed;
      ctx.clearRect(0, 0, width, height);

      const cols = 42;
      const rows = 26;
      const cellW = width / cols;
      const cellH = height / rows;

      // Sample scalar elevation grid
      const grid = new Float32Array((cols + 1) * (rows + 1));
      for (let j = 0; j <= rows; j++) {
        const ny = j / rows;
        for (let i = 0; i <= cols; i++) {
          grid[j * (cols + 1) + i] = sampleField(i / cols, ny, t);
        }
      }

      const levelCount = Math.max(4, Math.min(12, Math.round(levels)));
      const stride = cols + 1;

      for (let l = 1; l <= levelCount; l++) {
        const iso = 0.14 + (l / (levelCount + 1)) * 0.72;
        const isRidge = l === levelCount - 1;
        ctx.strokeStyle = isRidge ? accentColor : lineColor;
        ctx.globalAlpha = isRidge ? 0.75 : 1;
        ctx.lineWidth = isRidge ? 1.35 : 0.95;
        ctx.beginPath();

        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const vTL = grid[j * stride + i]!;
            const vTR = grid[j * stride + i + 1]!;
            const vBR = grid[(j + 1) * stride + i + 1]!;
            const vBL = grid[(j + 1) * stride + i]!;

            const x = i * cellW;
            const y = j * cellH;
            const pts: Array<[number, number]> = [];

            const interp = (a: number, b: number) => (iso - a) / (b - a + 1e-6);

            if ((vTL < iso) !== (vTR < iso)) pts.push([x + interp(vTL, vTR) * cellW, y]);
            if ((vTR < iso) !== (vBR < iso)) pts.push([x + cellW, y + interp(vTR, vBR) * cellH]);
            if ((vBL < iso) !== (vBR < iso)) pts.push([x + interp(vBL, vBR) * cellW, y + cellH]);
            if ((vTL < iso) !== (vBL < iso)) pts.push([x, y + interp(vTL, vBL) * cellH]);

            if (pts.length >= 2) {
              ctx.moveTo(pts[0]![0], pts[0]![1]);
              ctx.lineTo(pts[1]![0], pts[1]![1]);
              if (pts.length === 4) {
                ctx.moveTo(pts[2]![0], pts[2]![1]);
                ctx.lineTo(pts[3]![0], pts[3]![1]);
              }
            }
          }
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    resize();
    draw(1.5);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.5 : (performance.now() - startMs) / 1000);
    });
    ro.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    let lastMs = 0;
    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);
      if (!visible || paused || prefersReduced) return;
      if (now - lastMs < 40) return;
      lastMs = now;
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
  }, [lineColor, accentColor, levels, speed, paused]);

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
