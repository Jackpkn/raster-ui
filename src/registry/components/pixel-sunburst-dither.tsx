"use client";

import { useEffect, useRef } from "react";

export interface PixelSunburstDitherProps {
  /** Base dither pixel RGB. */
  baseRgb?: [number, number, number];
  /** Core corona accent RGB. */
  accentRgb?: [number, number, number];
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Logical Bayer pixel scale (2-6). */
  pixelSize?: number;
  /** Ray rotation speed multiplier. */
  speed?: number;
  /** Pause rotation. */
  paused?: boolean;
  className?: string;
}

const BAYER_4X4 = [
  0 / 16, 8 / 16, 2 / 16, 10 / 16,
  12 / 16, 4 / 16, 14 / 16, 6 / 16,
  3 / 16, 11 / 16, 1 / 16, 9 / 16,
  15 / 16, 7 / 16, 13 / 16, 5 / 16,
];

/**
 * 1-Bit Ordered Bayer Radial Horizon Sunburst.
 * Projects slowly rotating solar rays from a horizon emitter quantized through a 4x4 Bayer matrix.
 */
export function PixelSunburstDither({
  baseRgb = [240, 235, 228],
  accentRgb = [242, 124, 99],
  backgroundColor = "#060609",
  pixelSize = 3,
  speed = 1,
  paused = false,
  className = "",
}: PixelSunburstDitherProps) {
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
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = Math.max(2, Math.min(7, Math.round(pixelSize)));
    let cols = 140;
    let rows = 80;
    let imageData: ImageData | null = null;
    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      cols = Math.max(64, Math.min(320, Math.floor(rect.width / scale)));
      rows = Math.max(40, Math.min(180, Math.floor(rect.height / scale)));
      canvas.width = cols;
      canvas.height = rows;
      imageData = ctx.createImageData(cols, rows);
    };

    const draw = (timeSec: number) => {
      if (!imageData) return;
      const data = imageData.data;
      const t = timeSec * 0.32 * speed;
      const cx = cols * 0.5;
      const cy = rows * 0.92;
      const maxR = Math.hypot(cols * 0.56, rows * 0.96);

      for (let y = 0; y < rows; y++) {
        const bRow = (y & 3) << 2;
        for (let x = 0; x < cols; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.hypot(dx, dy);
          const normR = dist / maxR;
          const angle = Math.atan2(dy, dx);

          const rays =
            0.5 +
            0.35 * Math.sin(angle * 14 + t) +
            0.15 * Math.cos(angle * 28 - t * 1.4);

          const falloff = Math.max(0, 1 - normR * 1.05);
          const core = Math.exp(-normR * normR * 9.5);
          const lum = Math.max(0, Math.min(1, falloff * falloff * rays * 0.9 + core * 0.65));

          const threshold = BAYER_4X4[bRow + (x & 3)]!;
          const idx = (y * cols + x) * 4;

          if (lum > threshold) {
            const isCore = normR < 0.38 || lum > threshold + 0.28;
            if (isCore) {
              data[idx] = ar;
              data[idx + 1] = ag;
              data[idx + 2] = ab;
              data[idx + 3] = Math.round(135 + falloff * 110);
            } else {
              data[idx] = br;
              data[idx + 1] = bg;
              data[idx + 2] = bb;
              data[idx + 3] = Math.round(65 + falloff * 120);
            }
          } else {
            data[idx] = 0;
            data[idx + 1] = 0;
            data[idx + 2] = 0;
            data[idx + 3] = 0;
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };

    resize();
    draw(1.0);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.0 : (performance.now() - startMs) / 1000);
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
      if (now - lastMs < 42) return;
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
  }, [br, bg, bb, ar, ag, ab, pixelSize, speed, paused]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none block h-full w-full"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
