"use client";

import { useEffect, useRef } from "react";

export interface GrainGradientOrbsProps {
  /** 5-stop color ramp from deep void [0] through outer halo [1..2] to core [3..4]. */
  colors?: [string, string, string, string, string];
  /** Stochastic grain scattering intensity (0.08-0.36). */
  grain?: number;
  /** Orb breathing and drift speed multiplier. */
  speed?: number;
  /** Pause animation. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_COLORS: [string, string, string, string, string] = [
  "#030307",
  "#6d28d9",
  "#f0abfc",
  "#00c2ff",
  "#1d4ed8",
];

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = Number.parseInt(clean.length === 3 ? clean.replace(/(.)/g, "$1$1") : clean, 16);
  if (Number.isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function buildColorLut(stops: [string, string, string, string, string]): Uint8Array {
  const rgb = stops.map(hexToRgb);
  const positions = [0, 0.28, 0.52, 0.76, 1];
  const lut = new Uint8Array(256 * 3);

  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let seg = 0;
    while (seg < positions.length - 2 && t > positions[seg + 1]!) seg++;
    const p0 = positions[seg]!;
    const p1 = positions[seg + 1]!;
    const u = Math.max(0, Math.min(1, (t - p0) / Math.max(1e-5, p1 - p0)));
    const s = u * u * (3 - 2 * u);
    const c0 = rgb[seg]!;
    const c1 = rgb[seg + 1]!;
    lut[i * 3] = Math.round(c0[0] + (c1[0] - c0[0]) * s);
    lut[i * 3 + 1] = Math.round(c0[1] + (c1[1] - c0[1]) * s);
    lut[i * 3 + 2] = Math.round(c0[2] + (c1[2] - c0[2]) * s);
  }
  return lut;
}

/**
 * Stochastic Film-Grain Chromatic Corner Orbs Shader.
 * Perturbs smooth opposite-corner radial fields with screen-locked analog grain BEFORE
 * multi-stop color lookup for authentic stippled risograph & Paper-style light falloff.
 */
export function GrainGradientOrbs({
  colors = DEFAULT_COLORS,
  grain = 0.2,
  speed = 1,
  paused = false,
  className = "",
}: GrainGradientOrbsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorKey = colors.join(",");

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lut = buildColorLut(colors);
    const grainAmt = Math.max(0.05, Math.min(0.42, grain));

    let w = 360;
    let h = 200;
    let img = ctx.createImageData(w, h);
    let noise = new Float32Array(w * h);
    let visible = true;
    let rafId = 0;
    let lastMs = 0;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      w = Math.max(160, Math.min(480, Math.floor(rect.width)));
      h = Math.max(100, Math.min(280, Math.floor(rect.height)));
      canvas.width = w;
      canvas.height = h;
      img = ctx.createImageData(w, h);
      noise = new Float32Array(w * h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let s = (x * 374761393 + y * 668265263) | 0;
          s = ((s ^ (s >> 13)) * 1274126177) | 0;
          const r1 = ((s ^ (s >> 16)) & 255) / 255;
          s = (s * 1664525 + 1013904223) | 0;
          const r2 = ((s >>> 24) & 255) / 255;
          // Triangular-distributed analog grain for silky organic stippling
          noise[y * w + x] = (r1 + r2 - 1) * grainAmt;
        }
      }
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 1.1 : Math.max(0, timeSec) * 0.45 * speed;
      const data = img.data;
      const aspect = w / Math.max(1, h);

      // Two breathing corner chromatic orbs (top-right and bottom-left)
      const c1x = 0.94 + Math.cos(t * 0.85) * 0.06;
      const c1y = 0.06 + Math.sin(t * 0.7) * 0.07;
      const c2x = 0.07 + Math.sin(t * 0.65) * 0.06;
      const c2y = 0.96 + Math.cos(t * 0.8) * 0.06;
      const rad1 = 0.68 + Math.sin(t * 0.9) * 0.04;
      const rad2 = 0.66 + Math.cos(t * 0.75) * 0.04;

      for (let y = 0; y < h; y++) {
        const ny = y / h;
        const rowOff = y * w;
        const dy1 = ny - c1y;
        const dy2 = ny - c2y;

        for (let x = 0; x < w; x++) {
          const nx = x / w;
          const dx1 = (nx - c1x) * aspect * 0.72;
          const dx2 = (nx - c2x) * aspect * 0.72;

          const d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
          const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          const f1 = Math.max(0, 1 - d1 / rad1);
          const f2 = Math.max(0, 1 - d2 / rad2);

          // Combine smoothly with soft peak curve + coordinate-perturbed analog grain
          const field = Math.min(1, Math.pow(f1, 1.35) + Math.pow(f2, 1.35));
          const noisy = field + (field > 0.015 ? noise[rowOff + x]! : noise[rowOff + x]! * 0.28);
          const lutIdx = Math.max(0, Math.min(255, Math.round(noisy * 255))) * 3;

          const pIdx = (rowOff + x) * 4;
          data[pIdx] = lut[lutIdx]!;
          data[pIdx + 1] = lut[lutIdx + 1]!;
          data[pIdx + 2] = lut[lutIdx + 2]!;
          data[pIdx + 3] = 255;
        }
      }

      ctx.putImageData(img, 0, 0);
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
      if (now - lastMs < 33) return;
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
  }, [colorKey, grain, speed, paused]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`relative overflow-hidden bg-[#030307] ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
