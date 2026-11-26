"use client";

import { useEffect, useRef } from "react";

export interface MoireInterferenceRingsProps {
  /** 4-stop color ramp from deep obsidian troughs to glowing optical crests. */
  colors?: [string, string, string, string];
  /** Analog grain scatter intensity (0.04-0.28). */
  grain?: number;
  /** Emitter orbit speed multiplier. */
  speed?: number;
  /** Pause moire motion. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_COLORS: [string, string, string, string] = [
  "#030307",
  "#4c1d95",
  "#e879f9",
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
 * Optical Moire Wave Interference Grain Shader.
 * Superimposes two orbiting concentric wave fields across obsidian to produce
 * crisp living moire fringes rendered through a chromatic LUT and film grain.
 */
export function MoireInterferenceRings({
  colors = DEFAULT_COLORS,
  grain = 0.15,
  speed = 1,
  paused = false,
  className = "",
}: MoireInterferenceRingsProps) {
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

    let w = 340;
    let h = 190;
    let img = ctx.createImageData(w, h);
    let noise = new Float32Array(w * h);
    let visible = true;
    let rafId = 0;
    let lastMs = 0;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      w = Math.max(160, Math.min(440, Math.floor(rect.width)));
      h = Math.max(100, Math.min(260, Math.floor(rect.height)));
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
      const t = paused || prefersReduced ? 1.4 : Math.max(0, timeSec) * 0.55 * speed;
      const data = img.data;
      const aspect = w / Math.max(1, h);

      const e1x = Math.cos(t * 0.8) * 0.48;
      const e1y = Math.sin(t * 0.65) * 0.24;
      const e2x = -Math.cos(t * 0.72) * 0.48;
      const e2y = -Math.sin(t * 0.9) * 0.24;

      for (let y = 0; y < h; y++) {
        const ny = (y / h) * 2 - 1;
        const rowOff = y * w;
        for (let x = 0; x < w; x++) {
          const nx = ((x / w) * 2 - 1) * aspect;
          const d1 = Math.sqrt((nx - e1x) * (nx - e1x) + (ny - e1y) * (ny - e1y));
          const d2 = Math.sqrt((nx - e2x) * (nx - e2x) + (ny - e2y) * (ny - e2y));

          const w1 = Math.sin(d1 * 22 - t * 2.2);
          const w2 = Math.sin(d2 * 22 - t * 1.9);
          const moire = Math.pow(0.5 + 0.5 * (w1 * w2), 2.1);
          const vignette = Math.max(0, 1 - (nx * nx * 0.2 + ny * ny * 0.45));
          const field = Math.min(1, moire * vignette);

          const n = field > 0.02 ? noise[rowOff + x]! : noise[rowOff + x]! * 0.18;
          const idx = Math.max(0, Math.min(255, Math.round((field + n) * 255))) * 3;
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
    draw(1.4);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.4 : (performance.now() - startMs) / 1000);
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
