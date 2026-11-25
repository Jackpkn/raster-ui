"use client";

import { useEffect, useRef } from "react";

export interface ChromaticNoiseVeilProps {
  /** Primary atmospheric glow hex color. */
  accentColor?: string;
  /** Secondary mist tint color. */
  secondaryColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Film grain intensity (0.04-0.25). */
  grainOpacity?: number;
  /** Veil drift speed multiplier. */
  speed?: number;
  /** Pause veil drift & grain refresh. */
  paused?: boolean;
  className?: string;
}

/**
 * Analog Film Grain + Subtle Drifting Duotone Atmospheric Veil.
 * Synthesizes crisp low-contrast monochrome film noise over slow-moving obsidian light beams.
 */
export function ChromaticNoiseVeil({
  accentColor = "#f27c63",
  secondaryColor = "#e8e3dc",
  backgroundColor = "#060609",
  grainOpacity = 0.14,
  speed = 1,
  paused = false,
  className = "",
}: ChromaticNoiseVeilProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = 128;
    canvas.width = size;
    canvas.height = size;
    const img = ctx.createImageData(size, size);
    const data = img.data;

    let seed = 135791;
    let visible = true;
    let rafId = 0;

    const paintNoise = () => {
      for (let i = 0; i < data.length; i += 4) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        const v = (seed >>> 24) & 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };

    paintNoise();

    const io = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    let lastMs = 0;
    const frameInterval = Math.max(55, Math.round(110 / Math.max(0.4, speed)));

    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);
      if (!visible || paused || prefersReduced) return;
      if (now - lastMs < frameInterval) return;
      lastMs = now;
      paintNoise();
    };

    if (!paused && !prefersReduced) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      io.disconnect();
    };
  }, [speed, paused]);

  const driftSec = Math.max(8, Math.round(18 / Math.max(0.4, speed)));

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <style>{`
        @keyframes raster-veil-drift {
          0%, 100% { transform: translate3d(-6%, -4%, 0) scale(1); }
          50% { transform: translate3d(6%, 5%, 0) scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-veil-lobe { animation: none !important; }
        }
      `}</style>

      <div
        className="raster-veil-lobe pointer-events-none absolute -top-1/3 left-1/4 h-[130%] w-[70%] rounded-full blur-3xl opacity-25"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 68%)`,
          animation: paused ? "none" : `raster-veil-drift ${driftSec}s ease-in-out infinite`,
        }}
      />
      <div
        className="raster-veil-lobe pointer-events-none absolute -bottom-1/2 -left-1/4 h-[120%] w-[75%] rounded-full blur-3xl opacity-15"
        style={{
          background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)`,
          animation: paused
            ? "none"
            : `raster-veil-drift ${Math.round(driftSec * 1.3)}s ease-in-out infinite reverse`,
        }}
      />

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay"
        style={{ opacity: grainOpacity, imageRendering: "pixelated" }}
      />
    </div>
  );
}
