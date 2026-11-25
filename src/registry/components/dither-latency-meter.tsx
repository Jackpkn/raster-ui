"use client";

import { useEffect, useRef } from "react";

export interface DitherLatencyMeterProps {
  /** Accent color for the active dithered gauge bar & cursor. */
  accentColor?: string;
  /** Monochrome track & tick mark color. */
  trackColor?: string;
  /** Background surface color. */
  backgroundColor?: string;
  /** Sweep speed multiplier. */
  speed?: number;
  /** Pause sweep motion. */
  paused?: boolean;
  className?: string;
}

const BAYER_4X4 = [
  0 / 16, 8 / 16, 2 / 16, 10 / 16,
  12 / 16, 4 / 16, 14 / 16, 6 / 16,
  3 / 16, 11 / 16, 1 / 16, 9 / 16,
  15 / 16, 7 / 16, 13 / 16, 5 / 16,
];

function fillDitherRect(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  w: number,
  h: number,
  density: number,
  color: string
) {
  ctx.fillStyle = color;
  for (let y = Math.floor(y0); y < Math.floor(y0 + h); y++) {
    const bRow = (y & 3) << 2;
    for (let x = Math.floor(x0); x < Math.floor(x0 + w); x++) {
      if (density > BAYER_4X4[bRow + (x & 3)]!) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

/**
 * 1-Bit Bayer-Dithered Hardware Latency / Progress Meter.
 * Pairs an animated accent threshold slider with a crisp monochrome reference rail and tick marks.
 */
export function DitherLatencyMeter({
  accentColor = "#d95238",
  trackColor = "#dcd6cd",
  backgroundColor = "#060608",
  speed = 1,
  paused = false,
  className = "",
}: DitherLatencyMeterProps) {
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
      const phase = paused || prefersReduced ? 0.32 : 0.5 + 0.5 * Math.sin(timeSec * 1.15 * speed);
      const barLeft = 18;
      const barWidth = 112;
      const split = Math.round(28 + phase * 62);

      // Upper accent slider bar
      fillDitherRect(ctx, barLeft, 24, split, 9, 0.72, accentColor);
      ctx.globalAlpha = 0.38;
      fillDitherRect(ctx, barLeft + split, 24, barWidth - split, 9, 0.28, trackColor);
      ctx.globalAlpha = 1;

      // Vertical marker needle
      ctx.fillStyle = accentColor;
      ctx.fillRect(barLeft + split, 17, 2, 23);

      // Tick marks row 1
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = trackColor;
      for (let x = barLeft; x <= barLeft + barWidth; x += 14) {
        ctx.fillRect(x, 38, 1, 3);
      }

      // Lower full monochrome reference bar + dithered round end-cap
      ctx.globalAlpha = 0.85;
      fillDitherRect(ctx, barLeft, 56, barWidth - 8, 10, 0.62, trackColor);
      const capX = barLeft + barWidth - 6;
      const capY = 61;
      for (let y = capY - 8; y <= capY + 8; y++) {
        const bRow = (y & 3) << 2;
        for (let x = capX - 8; x <= capX + 8; x++) {
          if (Math.hypot(x - capX, y - capY) <= 7.2 && 0.68 > BAYER_4X4[bRow + (x & 3)]!) {
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }

      // Tick marks row 2
      ctx.globalAlpha = 0.45;
      for (let x = barLeft; x <= barLeft + barWidth; x += 14) {
        ctx.fillRect(x, 71, 1, 3);
      }
      ctx.globalAlpha = 1;
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
  }, [accentColor, trackColor, speed, paused]);

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
