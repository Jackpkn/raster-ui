"use client";

import { useEffect, useRef } from "react";

export interface IsometricServerRackProps {
  /** Base 1-bit monochrome ink color. */
  color?: string;
  /** Active blade status LED accent color. */
  accentColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Telemetry LED blink speed multiplier. */
  speed?: number;
  /** Pause blinking blade LEDs. */
  paused?: boolean;
  className?: string;
}

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/**
 * 1-Bit Bayer-Dithered Isometric Stacked Server Blades.
 * Renders four stacked hardware compute blades with crisp ordered dithering
 * and oscillating status LEDs for cloud infrastructure bento tiles.
 */
export function IsometricServerRack({
  color = "#e7e2da",
  accentColor = "#f27c63",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: IsometricServerRackProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const w = 144;
    const h = 92;
    canvas.width = w;
    canvas.height = h;

    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const iso = (x: number, y: number, z: number): [number, number] => [
      w / 2 + (x - y) * 0.9,
      h * 0.72 + (x + y) * 0.44 - z * 0.92,
    ];

    const fillPoly = (pts: Array<[number, number]>, density: number, ink: string) => {
      let minX = w;
      let maxX = 0;
      let minY = h;
      let maxY = 0;
      for (const [px, py] of pts) {
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }
      ctx.fillStyle = ink;
      for (let py = Math.max(0, Math.floor(minY)); py <= Math.min(h - 1, Math.ceil(maxY)); py++) {
        for (let px = Math.max(0, Math.floor(minX)); px <= Math.min(w - 1, Math.ceil(maxX)); px++) {
          let inside = false;
          for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            const xi = pts[i]![0];
            const yi = pts[i]![1];
            const xj = pts[j]![0];
            const yj = pts[j]![1];
            const hit = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi + 1e-6) + xi;
            if (hit) inside = !inside;
          }
          if (!inside) continue;
          const thr = (BAYER_4X4[py & 3]![px & 3]! + 0.5) / 16;
          if (density > thr) ctx.fillRect(px, py, 1, 1);
        }
      }
    };

    const drawBlade = (z: number, isActive: boolean) => {
      const dx = 34;
      const dy = 26;
      const dz = 7;
      const x0 = -dx / 2;
      const y0 = -dy / 2;

      const p001 = iso(x0, y0, z + dz);
      const p101 = iso(x0 + dx, y0, z + dz);
      const p111 = iso(x0 + dx, y0 + dy, z + dz);
      const p011 = iso(x0, y0 + dy, z + dz);
      const p100 = iso(x0 + dx, y0, z);
      const p110 = iso(x0 + dx, y0 + dy, z);
      const p010 = iso(x0, y0 + dy, z);

      fillPoly([p001, p101, p111, p011], isActive ? 0.9 : 0.65, isActive ? accentColor : color);
      fillPoly([p011, p111, p110, p010], 0.45, color);
      fillPoly([p101, p111, p110, p100], 0.24, color);

      // Front blade status indicator pixel
      const led = iso(x0 + 6, y0 + dy, z + 3.5);
      ctx.fillStyle = isActive ? accentColor : "#f8f5f0";
      ctx.fillRect(Math.round(led[0]), Math.round(led[1]), 2, 2);
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 1 : Math.max(0, timeSec) * 1.4 * speed;
      ctx.clearRect(0, 0, w, h);

      const activeBlade = ((Math.floor(t) % 4) + 4) % 4;
      for (let b = 0; b < 4; b++) {
        drawBlade(b * 12, b === activeBlade);
      }
    };

    draw(1);

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
  }, [color, accentColor, speed, paused]);

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
