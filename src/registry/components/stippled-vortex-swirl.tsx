"use client";

import { useEffect, useRef } from "react";

export interface StippledVortexSwirlProps {
  /** 4-stop color ramp from black hole core to luminous spiral arms. */
  colors?: [string, string, string, string];
  /** Analog grain scatter intensity (0.08-0.36). */
  grain?: number;
  /** Spiral rotation speed multiplier. */
  speed?: number;
  /** Pause swirl rotation. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_COLORS: [string, string, string, string] = [
  "#030307",
  "#5b21b6",
  "#f0abfc",
  "#00c2ff",
];

function parseHex(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const n = Number.parseInt(c.length === 3 ? c.replace(/(.)/g, "$1$1") : c, 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function createLut(stops: [string, string, string, string]): Uint8Array {
  const rgb = stops.map(parseHex);
  const pos = [0, 0.35, 0.7, 1];
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
 * Stippled Chromatic Spiral Vortex Shader.
 * Twists multi-arm polar ribbons around an obsidian singularity and disperses
 * their boundaries through tactile stochastic film grain on pure Canvas2D.
 */
export function StippledVortexSwirl({
  colors = DEFAULT_COLORS,
  grain = 0.22,
  speed = 1,
  paused = false,
  className = "",
}: StippledVortexSwirlProps) {
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
    const grainAmt = Math.max(0.05, Math.min(0.4, grain));

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
      const t = paused || prefersReduced ? 1.4 : Math.max(0, timeSec) * 0.7 * speed;
      const data = img.data;
      const aspect = w / Math.max(1, h);

      for (let y = 0; y < h; y++) {
        const ny = (y / h) * 2 - 1;
        const rowOff = y * w;
        for (let x = 0; x < w; x++) {
          const nx = ((x / w) * 2 - 1) * aspect;
          const r = Math.sqrt(nx * nx + ny * ny);
          const a = Math.atan2(ny, nx);

          // Twisting 3-arm logarithmic spiral fading softly at the center singularity
          const twist = a * 3 + r * 4.8 - t * 1.4;
          const arms = 0.5 + 0.5 * Math.sin(twist + Math.sin(r * 3 - t * 0.7) * 0.6);
          const ringMask = Math.min(1, r * 2.1) * Math.exp(-r * 0.85);
          const field = Math.min(1, Math.pow(arms, 1.45) * ringMask * 1.65);

          const n = field > 0.02 ? noise[rowOff + x]! : noise[rowOff + x]! * 0.22;
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
