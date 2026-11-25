"use client";

import { useEffect, useRef } from "react";

export interface IsometricFloatingCubeProps {
  /** Primary 1-bit monochrome dither color. */
  color?: string;
  /** Accent tint for twinkling pixel stars. */
  accentColor?: string;
  /** Background color behind the illustration. */
  backgroundColor?: string;
  /** Floating bob speed multiplier. */
  speed?: number;
  /** Pause floating motion. */
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

function drawIsoCube(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  hScale: number,
  topD: number,
  leftD: number,
  rightD: number,
  fill: string
) {
  const h = s * hScale;
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
  const minX = Math.floor(cx - s - 1);
  const maxX = Math.ceil(cx + s + 1);
  const minY = Math.floor(cy - s * 0.6 - 1);
  const maxY = Math.ceil(cy + s * 0.6 + h + 1);

  for (let y = minY; y <= maxY; y++) {
    const bRow = (y & 3) << 2;
    for (let x = minX; x <= maxX; x++) {
      const th = BAYER_4X4[bRow + (x & 3)]!;
      if (pointInPoly(x, y, top) && topD > th) ctx.fillRect(x, y, 1, 1);
      else if (pointInPoly(x, y, left) && leftD > th) ctx.fillRect(x, y, 1, 1);
      else if (pointInPoly(x, y, right) && rightD > th) ctx.fillRect(x, y, 1, 1);
    }
  }
}

/**
 * 1-Bit Bayer-Dithered Hovering Isometric Cube + Crescent Moon + Pixel Stars.
 * Pure Canvas2D pixel art with crisp pixelated scaling and zero dependencies.
 */
export function IsometricFloatingCube({
  color = "#e7e2da",
  accentColor = "#f27c63",
  backgroundColor = "#060608",
  speed = 1,
  paused = false,
  className = "",
}: IsometricFloatingCubeProps) {
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

      // Dithered crescent moon
      ctx.fillStyle = color;
      for (let y = 18; y <= 56; y++) {
        const bRow = (y & 3) << 2;
        for (let x = 18; x <= 56; x++) {
          const d1 = Math.hypot(x - 36, y - 37);
          const d2 = Math.hypot(x - 43, y - 32);
          if (d1 < 13.5 && d2 > 11.2 && 0.62 > BAYER_4X4[bRow + (x & 3)]!) {
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }

      // Cross stars
      const stars: Array<[number, number, number]> = [
        [27, 16, 0],
        [52, 13, 1.8],
        [53, 52, 3.1],
      ];
      for (const [sx, sy, ph] of stars) {
        ctx.globalAlpha = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.2 + ph));
        ctx.fillStyle = accentColor;
        ctx.fillRect(sx - 1, sy, 3, 1);
        ctx.fillRect(sx, sy - 1, 1, 3);
      }
      ctx.globalAlpha = 1;

      // Base isometric slab
      drawIsoCube(ctx, 94, 61, 28, 0.36, 0.68, 0.48, 0.28, color);

      // Hovering isometric cube
      const bob = paused || prefersReduced ? 0 : Math.sin(t * 1.45) * 4;
      drawIsoCube(ctx, 94, 25 + bob, 18, 0.92, 0.34, 0.54, 0.22, color);
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
