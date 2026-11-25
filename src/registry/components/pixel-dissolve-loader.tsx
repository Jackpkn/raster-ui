"use client";

import { useEffect, useRef } from "react";

export interface PixelDissolveLoaderProps {
  /** Grid dimension (5 or 7 cells per side). */
  gridSize?: number;
  /** Base monochrome lit cell color. */
  color?: string;
  /** Peak pulse accent cell color. */
  accentColor?: string;
  /** Size of the rendered matrix in CSS px. */
  sizePx?: number;
  /** Wave animation speed multiplier. */
  speed?: number;
  /** Pause animation. */
  paused?: boolean;
  className?: string;
}

/**
 * Hardware-Style 1-Bit Pixel Matrix Dissolve Loader.
 * Renders a crisp square LED / Bayer dot matrix sweeping in diagonal harmonic waves.
 */
export function PixelDissolveLoader({
  gridSize = 7,
  color = "#e7e2da",
  accentColor = "#f27c63",
  sizePx = 92,
  speed = 1,
  paused = false,
  className = "",
}: PixelDissolveLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = Math.max(3, Math.min(9, Math.round(gridSize)));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(sizePx * dpr);
    canvas.height = Math.floor(sizePx * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 1.4 : timeSec * 2.4 * speed;
      ctx.clearRect(0, 0, sizePx, sizePx);

      const cell = sizePx / n;
      const gap = Math.max(2, cell * 0.24);
      const box = cell - gap;
      const center = (n - 1) / 2;

      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const dist = Math.hypot(x - center, y - center);
          const diag = (x + y) * 0.45;
          const wave = 0.5 + 0.5 * Math.sin(dist * 1.15 - t + Math.cos(diag - t * 0.5) * 0.6);

          const isPeak = wave > 0.82;
          ctx.fillStyle = isPeak ? accentColor : color;
          ctx.globalAlpha = isPeak ? 0.96 : 0.08 + wave * wave * 0.62;
          ctx.fillRect(x * cell + gap / 2, y * cell + gap / 2, box, box);
        }
      }
      ctx.globalAlpha = 1;
    };

    draw(1.4);

    const io = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

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
      io.disconnect();
    };
  }, [gridSize, color, accentColor, sizePx, speed, paused]);

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: sizePx, height: sizePx }}
    >
      <canvas ref={canvasRef} style={{ width: sizePx, height: sizePx }} />
    </div>
  );
}
