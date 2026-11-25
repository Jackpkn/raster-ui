"use client";

import { useEffect, useRef } from "react";

export interface VoronoiPulseGridProps {
  /** Tile size in CSS px (12-26). */
  tileSize?: number;
  /** Primary tile RGB color. */
  baseRgb?: [number, number, number];
  /** Interference peak accent RGB color. */
  accentRgb?: [number, number, number];
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Interference pulse speed multiplier. */
  speed?: number;
  /** Pause interference wave. */
  paused?: boolean;
  className?: string;
}

/**
 * Architectural Dual-Wave Cellular Interference Tile Grid.
 * Quantized micro-tiles pulse smoothly along two drifting wave emitters for compute and AI infrastructure cards.
 */
export function VoronoiPulseGrid({
  tileSize = 14,
  baseRgb = [232, 228, 222],
  accentRgb = [242, 124, 99],
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: VoronoiPulseGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const br = baseRgb[0];
  const bg = baseRgb[1];
  const bb = baseRgb[2];
  const ar = accentRgb[0];
  const ag = accentRgb[1];
  const ab = accentRgb[2];

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
      width = Math.max(140, Math.floor(rect.width));
      height = Math.max(110, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (timeSec: number) => {
      const t = timeSec * 1.15 * speed;
      ctx.clearRect(0, 0, width, height);

      const step = Math.max(10, Math.min(28, Math.round(tileSize)));
      const gap = 3;
      const box = Math.max(4, step - gap);

      const e1x = width * (0.32 + Math.cos(t * 0.45) * 0.14);
      const e1y = height * (0.48 + Math.sin(t * 0.55) * 0.18);
      const e2x = width * (0.7 + Math.sin(t * 0.4) * 0.15);
      const e2y = height * (0.52 + Math.cos(t * 0.5) * 0.18);

      for (let y = 2; y < height - 2; y += step) {
        for (let x = 2; x < width - 2; x += step) {
          const d1 = Math.hypot(x - e1x, y - e1y);
          const d2 = Math.hypot(x - e2x, y - e2y);
          const w1 = Math.sin(d1 * 0.055 - t * 1.7);
          const w2 = Math.sin(d2 * 0.055 - t * 1.45);
          const val = Math.max(0, Math.min(1, 0.5 + (w1 + w2) * 0.25));

          const isCrest = val > 0.84;
          const alpha = isCrest ? 0.72 : 0.04 + val * val * 0.26;
          ctx.fillStyle = isCrest
            ? `rgba(${ar}, ${ag}, ${ab}, ${alpha.toFixed(3)})`
            : `rgba(${br}, ${bg}, ${bb}, ${alpha.toFixed(3)})`;
          ctx.fillRect(x, y, box, box);
        }
      }
    };

    resize();
    draw(1.6);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.6 : (performance.now() - startMs) / 1000);
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
  }, [tileSize, br, bg, bb, ar, ag, ab, speed, paused]);

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
