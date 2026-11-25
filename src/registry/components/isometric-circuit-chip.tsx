"use client";

import { useEffect, useRef } from "react";

export interface IsometricCircuitChipProps {
  /** Base 1-bit monochrome ink color. */
  color?: string;
  /** Active circuit pulse and core accent color. */
  accentColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Pulse oscillation speed multiplier. */
  speed?: number;
  /** Pause chip pulse motion. */
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
 * 1-Bit Bayer-Dithered Isometric Microprocessor Socket & Bus Leads.
 * Renders a crisp pixelated isometric chip seated on a dark PCB base
 * with animated trace pulses converging into the elevated silicon die.
 */
export function IsometricCircuitChip({
  color = "#e7e2da",
  accentColor = "#f27c63",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: IsometricCircuitChipProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const w = 152;
    const h = 92;
    canvas.width = w;
    canvas.height = h;

    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const iso = (x: number, y: number, z: number): [number, number] => [
      w / 2 + (x - y) * 0.92,
      h * 0.56 + (x + y) * 0.46 - z * 0.9,
    ];

    const fillDitherPoly = (pts: Array<[number, number]>, density: number, fill: string) => {
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

      ctx.fillStyle = fill;
      for (let py = Math.max(0, Math.floor(minY)); py <= Math.min(h - 1, Math.ceil(maxY)); py++) {
        for (let px = Math.max(0, Math.floor(minX)); px <= Math.min(w - 1, Math.ceil(maxX)); px++) {
          let inside = false;
          for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            const xi = pts[i]![0];
            const yi = pts[i]![1];
            const xj = pts[j]![0];
            const yj = pts[j]![1];
            const intersect =
              yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi + 1e-6) + xi;
            if (intersect) inside = !inside;
          }
          if (!inside) continue;
          const threshold = (BAYER_4X4[py & 3]![px & 3]! + 0.5) / 16;
          if (density > threshold) {
            ctx.fillRect(px, py, 1, 1);
          }
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

      fillDitherPoly([p001, p101, p111, p011], topD, ink);
      fillDitherPoly([p011, p111, p110, p010], leftD, ink);
      fillDitherPoly([p101, p111, p110, p100], rightD, ink);
    };

    const drawLine = (a: [number, number], b: [number, number], ink: string) => {
      const steps = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), 1);
      ctx.fillStyle = ink;
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        ctx.fillRect(Math.round(a[0] + (b[0] - a[0]) * u), Math.round(a[1] + (b[1] - a[1]) * u), 1, 1);
      }
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 0.5 : timeSec * 1.4 * speed;
      ctx.clearRect(0, 0, w, h);

      // Isometric PCB lead traces radiating outward from chip perimeter
      const leadOffsets = [-16, -6, 4, 14];
      leadOffsets.forEach((off, idx) => {
        const pulse = (t * 0.8 + idx * 0.23) % 1;
        // Left-front leads
        const s1 = iso(off, 22, 0);
        const e1 = iso(off, 42, 0);
        drawLine(s1, e1, "rgba(231, 226, 218, 0.35)");
        const px1 = Math.round(e1[0] + (s1[0] - e1[0]) * pulse);
        const py1 = Math.round(e1[1] + (s1[1] - e1[1]) * pulse);
        ctx.fillStyle = accentColor;
        ctx.fillRect(px1, py1, 2, 2);

        // Right-front leads
        const s2 = iso(22, off, 0);
        const e2 = iso(42, off, 0);
        drawLine(s2, e2, "rgba(231, 226, 218, 0.35)");
        const px2 = Math.round(e2[0] + (s2[0] - e2[0]) * ((pulse + 0.5) % 1));
        const py2 = Math.round(e2[1] + (s2[1] - e2[1]) * ((pulse + 0.5) % 1));
        ctx.fillStyle = accentColor;
        ctx.fillRect(px2, py2, 2, 2);
      });

      // Lower PCB substrate slab
      drawBox(-24, -24, 0, 48, 48, 4, 0.18, 0.45, 0.26, color);

      // Floating silicon processor package
      const hover = paused || prefersReduced ? 2 : Math.sin(t * 1.4) * 2.2 + 2.5;
      drawBox(-18, -18, 7 + hover, 36, 36, 9, 0.85, 0.5, 0.25, color);

      // Center accent core die cap
      drawBox(-8, -8, 16 + hover, 16, 16, 3, 0.96, 0.6, 0.35, accentColor);
    };

    draw(0.5);

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
