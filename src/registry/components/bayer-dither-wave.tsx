"use client";

import { useEffect, useRef } from "react";

export interface BayerDitherWaveProps {
  /** Base dither pixel color as [R, G, B] (0-255). Default: warm silver-ivory. */
  baseRgb?: [number, number, number];
  /** Highlight peak dither color as [R, G, B] (0-255). Default: terracotta. */
  accentRgb?: [number, number, number];
  /** Background color behind the dither matrix. */
  backgroundColor?: string;
  /** Logical Bayer pixel size in CSS px (2-6). */
  pixelSize?: number;
  /** Animation speed multiplier (0.2-3). */
  speed?: number;
  /** Peak luminance intensity (0.2-1.0). */
  intensity?: number;
  /** Feather the left side into solid backgroundColor for headline contrast. */
  fadeLeft?: boolean;
  /** Pause animation while keeping the rendered frame crisp. */
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
 * Zero-dependency 4x4 Ordered Bayer Dither Fluid Wave Canvas.
 * Copy-paste ready: requires only React and HTML5 Canvas2D.
 */
export function BayerDitherWave({
  baseRgb = [238, 234, 228],
  accentRgb = [242, 124, 99],
  backgroundColor = "#08080b",
  pixelSize = 3,
  speed = 1,
  intensity = 0.82,
  fadeLeft = true,
  paused = false,
  className = "",
}: BayerDitherWaveProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const r0 = baseRgb[0];
  const g0 = baseRgb[1];
  const b0 = baseRgb[2];
  const r1 = accentRgb[0];
  const g1 = accentRgb[1];
  const b1 = accentRgb[2];

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = Math.max(2, Math.min(8, Math.round(pixelSize)));
    let cols = 160;
    let rows = 64;
    let imageData: ImageData | null = null;
    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      cols = Math.max(64, Math.min(340, Math.floor(rect.width / scale)));
      rows = Math.max(36, Math.min(180, Math.floor(rect.height / scale)));
      canvas.width = cols;
      canvas.height = rows;
      imageData = ctx.createImageData(cols, rows);
    };

    const drawFrame = (timeSec: number) => {
      if (!imageData) return;
      const data = imageData.data;
      const t = timeSec * 0.28 * speed;

      for (let y = 0; y < rows; y++) {
        const ny = y / rows;
        const bRow = (y & 3) << 2;
        for (let x = 0; x < cols; x++) {
          const nx = x / cols;
          const hMask = fadeLeft
            ? Math.max(0, Math.min(1, (nx - 0.16) / 0.72))
            : 1;
          const smoothMask = hMask * hMask * (3 - 2 * hMask);

          const wx = nx * 3.5 + Math.sin(ny * 3.1 + t * 0.75) * 0.5;
          const wy = ny * 2.7 + Math.cos(nx * 2.7 - t * 0.6) * 0.44;
          const w1 = Math.sin(wx * 2.0 + t) * Math.cos(wy * 2.1 - t * 0.8);
          const w2 = Math.sin((wx + wy) * 2.4 - t * 0.6) * 0.55;
          const w3 = Math.cos(wx * 4.0 - wy * 3.2 + t * 1.05) * 0.24;

          const field = Math.max(0, Math.min(1, 0.46 + (w1 + w2 + w3) * 0.36));
          const lum = field * smoothMask * intensity;
          const threshold = BAYER_4X4[bRow + (x & 3)]!;
          const idx = (y * cols + x) * 4;

          if (lum > threshold) {
            const isPeak = lum > threshold + 0.22 && nx > (fadeLeft ? 0.52 : 0.25);
            if (isPeak) {
              data[idx] = r1;
              data[idx + 1] = g1;
              data[idx + 2] = b1;
              data[idx + 3] = 175;
            } else {
              data[idx] = r0;
              data[idx + 1] = g0;
              data[idx + 2] = b0;
              data[idx + 3] = Math.round(74 + smoothMask * 96);
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
    drawFrame(2.4);

    const ro = new ResizeObserver(() => {
      resize();
      drawFrame(paused || prefersReduced ? 2.4 : (performance.now() - startMs) / 1000);
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
      drawFrame((now - startMs) / 1000);
    };

    if (!paused && !prefersReduced) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [r0, g0, b0, r1, g1, b1, pixelSize, speed, intensity, fadeLeft, paused]);

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
      {fadeLeft && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${backgroundColor} 0%, ${backgroundColor}e8 30%, transparent 74%)`,
          }}
        />
      )}
    </div>
  );
}
