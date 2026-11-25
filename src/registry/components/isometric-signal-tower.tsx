"use client";

import { useEffect, useRef } from "react";

export interface IsometricSignalTowerProps {
  /** Base 1-bit monochrome ink color. */
  color?: string;
  /** Emitted radio wave and beacon tip accent color. */
  accentColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Radio pulse speed multiplier. */
  speed?: number;
  /** Pause broadcast waves. */
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
 * 1-Bit Bayer-Dithered Isometric Signal Broadcast Tower.
 * Renders a crisp pixelated isometric hardware pedestal and antenna spire radiating
 * expanding 1-bit radio arcs across obsidian.
 */
export function IsometricSignalTower({
  color = "#e7e2da",
  accentColor = "#f27c63",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: IsometricSignalTowerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const w = 148;
    const h = 92;
    canvas.width = w;
    canvas.height = h;

    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const iso = (x: number, y: number, z: number): [number, number] => [
      w / 2 + (x - y) * 0.9,
      h * 0.72 + (x + y) * 0.45 - z * 0.9,
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

    const drawBox = (
      x0: number,
      y0: number,
      z0: number,
      dx: number,
      dy: number,
      dz: number,
      topD: number,
      leftD: number,
      rightD: number,
      ink: string
    ) => {
      const p001 = iso(x0, y0, z0 + dz);
      const p101 = iso(x0 + dx, y0, z0 + dz);
      const p111 = iso(x0 + dx, y0 + dy, z0 + dz);
      const p011 = iso(x0, y0 + dy, z0 + dz);
      const p100 = iso(x0 + dx, y0, z0);
      const p110 = iso(x0 + dx, y0 + dy, z0);
      const p010 = iso(x0, y0 + dy, z0);
      fillPoly([p001, p101, p111, p011], topD, ink);
      fillPoly([p011, p111, p110, p010], leftD, ink);
      fillPoly([p101, p111, p110, p100], rightD, ink);
    };

    const drawPixelRing = (cx: number, cy: number, rx: number, ry: number, ink: string) => {
      ctx.fillStyle = ink;
      const steps = 40;
      for (let i = 0; i < steps; i++) {
        if (i % 2 === 1) continue;
        const a = (i / steps) * Math.PI * 2;
        ctx.fillRect(Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * ry), 1, 1);
      }
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 0.6 : Math.max(0, timeSec) * 0.9 * speed;
      ctx.clearRect(0, 0, w, h);

      // Isometric hardware foundation slab & transmitter cabinet
      drawBox(-20, -20, 0, 40, 40, 5, 0.28, 0.48, 0.24, color);
      drawBox(-10, -10, 5, 20, 20, 12, 0.78, 0.44, 0.22, color);

      // Vertical antenna mast pixels
      const base = iso(0, 0, 17);
      const tip = iso(0, 0, 48);
      ctx.fillStyle = color;
      for (let y = Math.round(tip[1]); y <= Math.round(base[1]); y++) {
        ctx.fillRect(Math.round(tip[0]), y, 2, 1);
      }

      // Expanding pixelated radio rings around antenna spire
      for (let r = 0; r < 3; r++) {
        const phase = (t * 0.65 + r / 3) % 1;
        const radX = 6 + phase * 34;
        const radY = 3 + phase * 16;
        drawPixelRing(tip[0] + 1, tip[1] + 2, radX, radY, phase < 0.45 ? accentColor : color);
      }

      // Glowing beacon cap at spire apex
      ctx.fillStyle = accentColor;
      ctx.fillRect(Math.round(tip[0] - 1), Math.round(tip[1] - 2), 4, 4);
    };

    draw(0.6);

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
