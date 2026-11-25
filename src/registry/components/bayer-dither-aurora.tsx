"use client";

import { useEffect, useRef } from "react";

export interface BayerDitherAuroraProps {
  /** Base ivory / silver RGB tuple. */
  baseRgb?: [number, number, number];
  /** Aurora curtain highlight accent RGB tuple. */
  accentRgb?: [number, number, number];
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Bayer pixel block size in CSS px (2-6). */
  pixelSize?: number;
  /** Curtain drift speed multiplier. */
  speed?: number;
  /** Pause aurora curtain drift. */
  paused?: boolean;
  className?: string;
}

const BAYER_4X4 = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
];

/**
 * Ordered 4x4 Bayer-Dithered Vertical Aurora Curtains.
 * Quantizes gently billowing vertical atmospheric curtains into crisp 1-bit pixel bands
 * on pure HTML5 Canvas2D with zero WebGL dependencies.
 */
export function BayerDitherAurora({
  baseRgb = [238, 234, 228],
  accentRgb = [242, 124, 99],
  backgroundColor = "#060609",
  pixelSize = 3,
  speed = 1,
  paused = false,
  className = "",
}: BayerDitherAuroraProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = Math.max(2, Math.min(6, Math.round(pixelSize)));
    let cols = 120;
    let rows = 60;
    let imgData = ctx.createImageData(cols, rows);
    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      cols = Math.max(48, Math.floor(rect.width / scale));
      rows = Math.max(32, Math.floor(rect.height / scale));
      canvas.width = cols;
      canvas.height = rows;
      imgData = ctx.createImageData(cols, rows);
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 1.8 : timeSec * 0.65 * speed;
      const data = imgData.data;
      const [br, bg, bb] = baseRgb;
      const [ar, ag, ab] = accentRgb;

      for (let y = 0; y < rows; y++) {
        const ny = y / rows;
        const vertFade = Math.sin(ny * Math.PI);
        const yRow = (y & 3) << 2;

        for (let x = 0; x < cols; x++) {
          const nx = x / cols;
          const sway = Math.sin(nx * 5.2 + t * 0.9) * 0.22 + Math.cos(nx * 10.5 - t * 1.2) * 0.09;
          const ribbonA = Math.exp(-Math.pow((ny - (0.42 + sway)) * 3.8, 2));
          const ribbonB = Math.exp(-Math.pow((ny - (0.62 - sway * 0.7)) * 4.4, 2));
          const verticalRay = 0.65 + 0.35 * Math.sin(nx * 24 + t * 1.6 + ny * 2.5);

          const intensity = Math.min(1, (ribbonA * 0.85 + ribbonB * 0.65) * verticalRay * vertFade);
          const threshold = (BAYER_4X4[yRow + (x & 3)]! + 0.5) / 16;

          const idx = (y * cols + x) * 4;
          if (intensity > threshold) {
            const isAccent = ribbonA > ribbonB && intensity > 0.42;
            data[idx] = isAccent ? ar : br;
            data[idx + 1] = isAccent ? ag : bg;
            data[idx + 2] = isAccent ? ab : bb;
            data[idx + 3] = isAccent ? 235 : 155;
          } else {
            data[idx] = 0;
            data[idx + 1] = 0;
            data[idx + 2] = 0;
            data[idx + 3] = 0;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
    };

    resize();
    draw(1.8);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.8 : (performance.now() - startMs) / 1000);
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
  }, [baseRgb, accentRgb, pixelSize, speed, paused]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
