"use client";

import { useEffect, useRef } from "react";

export interface NeuroPlasmaFieldProps {
  /** 4-stop color ramp from pitch black to bright filament crests. */
  colors?: [string, string, string, string];
  /** Analog grain scatter intensity (0.06-0.3). */
  grain?: number;
  /** Organic neural ripple speed multiplier. */
  speed?: number;
  /** Pause filament drift. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_COLORS: [string, string, string, string] = [
  "#030307",
  "#3b0764",
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
  const pos = [0, 0.35, 0.72, 1];
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
 * Ridged Bioluminescent Neuro-Noise Filaments Shader.
 * Synthesizes sharp glowing silk-like interference ridges over deep obsidian
 * with stochastic grain dispersion and zero WebGL overhead.
 */
export function NeuroPlasmaField({
  colors = DEFAULT_COLORS,
  grain = 0.16,
  speed = 1,
  paused = false,
  className = "",
}: NeuroPlasmaFieldProps) {
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
      const t = paused || prefersReduced ? 1.6 : Math.max(0, timeSec) * 0.48 * speed;
      const data = img.data;

      for (let y = 0; y < h; y++) {
        const ny = (y / h) * 3.4 - 1.7;
        const rowOff = y * w;
        for (let x = 0; x < w; x++) {
          const nx = (x / w) * 5.2 - 2.6;

          const qx = nx + Math.sin(ny * 1.6 + t) * 0.65;
          const qy = ny + Math.cos(nx * 1.4 - t * 0.85) * 0.65;

          const v1 = Math.sin(qx * 1.9 + qy * 1.5 + t * 0.7);
          const v2 = Math.cos(qx * 2.3 - qy * 2.1 - t * 0.55);
          // Ridged multifractal fold -> bright razor filaments
          const ridge = 1 - Math.abs((v1 + v2) * 0.5);
          const filament = Math.pow(Math.max(0, ridge), 4.2);

          const n = filament > 0.03 ? noise[rowOff + x]! : noise[rowOff + x]! * 0.2;
          const idx = Math.max(0, Math.min(255, Math.round((filament + n) * 255))) * 3;
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
