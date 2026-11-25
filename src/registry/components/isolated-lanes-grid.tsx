"use client";

import { useEffect, useRef } from "react";

export interface IsolatedLanesGridProps {
  /** Primary 1-bit monochrome dither color. */
  color?: string;
  /** Highlight accent for the center active node. */
  accentColor?: string;
  /** Background surface color. */
  backgroundColor?: string;
  /** Animation speed multiplier. */
  speed?: number;
  /** Pause lane oscillation. */
  paused?: boolean;
  className?: string;
}

const BAYER_4X4 = [
  0 / 16, 8 / 16, 2 / 16, 10 / 16,
  12 / 16, 4 / 16, 14 / 16, 6 / 16,
  3 / 16, 11 / 16, 1 / 16, 9 / 16,
  15 / 16, 7 / 16, 13 / 16, 5 / 16,
];

function pointInPoly(px: number, py: number, pts: Array<[number, number]>): boolean {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]!;
    const [xj, yj] = pts[j]!;
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi + 1e-6) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function drawMiniCube(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  fill: string
) {
  const h = s * 0.96;
  const top: Array<[number, number]> = [
    [cx, cy - s * 0.52],
    [cx + s, cy],
    [cx, cy + s * 0.52],
    [cx - s, cy],
  ];
  const left: Array<[number, number]> = [
    [cx - s, cy],
    [cx, cy + s * 0.52],
    [cx, cy + s * 0.52 + h],
    [cx - s, cy + h],
  ];
  const right: Array<[number, number]> = [
    [cx + s, cy],
    [cx, cy + s * 0.52],
    [cx, cy + s * 0.52 + h],
    [cx + s, cy + h],
  ];

  ctx.fillStyle = fill;
  for (let y = Math.floor(cy - s * 0.6); y <= Math.ceil(cy + s * 0.6 + h); y++) {
    const bRow = (y & 3) << 2;
    for (let x = Math.floor(cx - s); x <= Math.ceil(cx + s); x++) {
      const th = BAYER_4X4[bRow + (x & 3)]!;
      if (pointInPoly(x, y, top) && 0.72 > th) ctx.fillRect(x, y, 1, 1);
      else if (pointInPoly(x, y, left) && 0.5 > th) ctx.fillRect(x, y, 1, 1);
      else if (pointInPoly(x, y, right) && 0.28 > th) ctx.fillRect(x, y, 1, 1);
    }
  }
}

function drawDottedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  strokeColor: string
) {
  ctx.fillStyle = strokeColor;
  for (let px = x; px <= x + w; px += 2) {
    ctx.fillRect(px, y, 1, 1);
    ctx.fillRect(px, y + h, 1, 1);
  }
  for (let py = y; py <= y + h; py += 2) {
    ctx.fillRect(x, py, 1, 1);
    ctx.fillRect(x + w, py, 1, 1);
  }
}

/**
 * 1-Bit Bayer-Dithered Sandbox Isolation Diagram.
 * Depicts grouped workloads on the left separated into three isolated lanes on the right.
 */
export function IsolatedLanesGrid({
  color = "#e5e0d8",
  accentColor = "#d95238",
  backgroundColor = "#060608",
  speed = 1,
  paused = false,
  className = "",
}: IsolatedLanesGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const w = 152;
    const h = 96;
    canvas.width = w;
    canvas.height = h;

    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const draw = (timeSec: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = timeSec * speed;

      // Left shared container
      ctx.globalAlpha = 0.58;
      drawDottedRect(ctx, 12, 18, 54, 60, color);
      ctx.globalAlpha = 1;
      [24, 39, 54].forEach((cx, i) => {
        drawMiniCube(ctx, cx, 44, 7, i === 1 ? accentColor : color);
      });

      // Vertical dotted divider
      ctx.globalAlpha = 0.48;
      ctx.fillStyle = color;
      for (let py = 16; py <= 80; py += 4) {
        ctx.fillRect(75, py, 1, 1);
      }
      ctx.globalAlpha = 1;

      // Right three isolated vertical lanes
      const activeLane = Math.floor(t * 0.75) % 3;
      [84, 104, 124].forEach((bx, i) => {
        ctx.globalAlpha = 0.58;
        drawDottedRect(ctx, bx, 18, 16, 60, color);
        ctx.globalAlpha = 1;
        const lift = paused || prefersReduced ? 0 : i === activeLane ? Math.sin(t * 3.1) * 2.5 : 0;
        drawMiniCube(ctx, bx + 8, 44 + lift, 6, i === 1 ? accentColor : color);
      });
    };

    draw(0);

    const io = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    let lastMs = 0;
    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);
      if (!visible || paused || prefersReduced) return;
      if (now - lastMs < 42) return;
      lastMs = now;
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
