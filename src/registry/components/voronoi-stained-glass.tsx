"use client";

import { useEffect, useRef } from "react";

export interface VoronoiStainedGlassProps {
  /** 4-stop color ramp from dark obsidian crystal interiors to luminous cell edges. */
  colors?: [string, string, string, string];
  /** Analog grain scatter intensity (0.04-0.28). */
  grain?: number;
  /** Seed drift speed multiplier. */
  speed?: number;
  /** Pause cellular drift. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_COLORS: [string, string, string, string] = [
  "#030307",
  "#4c1d95",
  "#c084fc",
  "#38bdf8",
];

function parseHex(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const n = Number.parseInt(c.length === 3 ? c.replace(/(.)/g, "$1$1") : c, 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function createLut(stops: [string, string, string, string]): Uint8Array {
  const rgb = stops.map(parseHex);
  const pos = [0, 0.36, 0.72, 1];
  const lut = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let seg = 0;
    while (seg < pos.length - 2 && t > pos[seg + 1]!) seg++;
    const u = Math.max(0, Math.min(1, (t - pos[seg]!) / Math.max(1e-5, pos[seg + 1]! - pos[seg]!)));
    const s = u * u * (3 - 2 * u);
    const a = rgb[seg]!;
    const b = rgb[seg + 1]!;
    lut[i * 3] = Math.round(a[0] + (b[0] - a[0]) * s);
    lut[i * 3 + 1] = Math.round(a[1] + (b[1] - a[1]) * s);
    lut[i * 3 + 2] = Math.round(a[2] + (b[2] - a[2]) * s);
  }
  return lut;
}

/**
 * Crystalline Voronoi Stained-Glass Grain Shader.
 * Evaluates live F2-F1 cellular distance edges across drifting Voronoi seeds with
 * screen-locked analog film grain on pure Canvas2D.
 */
export function VoronoiStainedGlass({
  colors = DEFAULT_COLORS,
  grain = 0.16,
  speed = 1,
  paused = false,
  className = "",
}: VoronoiStainedGlassProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const key = colors.join(",");

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lut = createLut(colors);
    const grainAmt = Math.max(0.04, Math.min(0.32, grain));

    const seeds = Array.from({ length: 12 }, (_, i) => ({
      bx: ((i * 37 + 13) % 100) / 100,
      by: ((i * 61 + 29) % 100) / 100,
      px: i * 1.13,
      py: i * 1.71,
    }));

    let w = 280;
    let h = 160;
    let img = ctx.createImageData(w, h);
    let noise = new Float32Array(w * h);
    let visible = true;
    let rafId = 0;
    let lastMs = 0;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      w = Math.max(140, Math.min(340, Math.floor(rect.width * 0.72)));
      h = Math.max(90, Math.min(200, Math.floor(rect.height * 0.72)));
      canvas.width = w;
      canvas.height = h;
      img = ctx.createImageData(w, h);
      noise = new Float32Array(w * h);
      for (let i = 0; i < w * h; i++) {
        let s = ((i % w) * 374761393 + Math.floor(i / w) * 668265263) | 0;
        s = ((s ^ (s >> 13)) * 1274126177) | 0;
        const r1 = ((s ^ (s >> 16)) & 255) / 255;
        s = (s * 1664525 + 1013904223) | 0;
        const r2 = ((s >>> 24) & 255) / 255;
        noise[i] = (r1 + r2 - 1) * grainAmt;
      }
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 1.5 : Math.max(0, timeSec) * 0.45 * speed;
      const data = img.data;
      const aspect = w / Math.max(1, h);

      const sx = new Float32Array(seeds.length);
      const sy = new Float32Array(seeds.length);
      for (let i = 0; i < seeds.length; i++) {
        const s = seeds[i]!;
        sx[i] = (s.bx + Math.sin(t + s.px) * 0.12) * aspect;
        sy[i] = s.by + Math.cos(t * 0.85 + s.py) * 0.14;
      }

      for (let y = 0; y < h; y++) {
        const ny = y / h;
        const rowOff = y * w;
        for (let x = 0; x < w; x++) {
          const nx = (x / w) * aspect;
          let d1 = 99;
          let d2 = 99;
          for (let i = 0; i < seeds.length; i++) {
            const dx = nx - sx[i]!;
            const dy = ny - sy[i]!;
            const d = dx * dx + dy * dy;
            if (d < d1) {
              d2 = d1;
              d1 = d;
            } else if (d < d2) {
              d2 = d;
            }
          }
          const edge = Math.sqrt(d2) - Math.sqrt(d1);
          const ridge = Math.exp(-edge * 11.5);
          const facet = Math.max(0, 0.32 - Math.sqrt(d1) * 0.55);
          const field = Math.min(1, ridge * 0.92 + facet);

          const idx = Math.max(0, Math.min(255, Math.round((field + noise[rowOff + x]!) * 255))) * 3;
          const p = (rowOff + x) * 4;
          data[p] = lut[idx]!;
          data[p + 1] = lut[idx + 1]!;
          data[p + 2] = lut[idx + 2]!;
          data[p + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
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
  }, [key, grain, speed, paused]);

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
