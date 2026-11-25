"use client";

import { useEffect, useRef } from "react";

export interface GravityRippleGridProps {
  /** High-curvature spacetime well accent color. */
  accentColor?: string;
  /** Base dot RGB tuple. */
  baseRgb?: [number, number, number];
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Lattice spacing in CSS px (14-28). */
  gridGap?: number;
  /** Orbital well speed multiplier. */
  speed?: number;
  /** Pause orbiting gravity well. */
  paused?: boolean;
  className?: string;
}

/**
 * Interactive Gravitational Spacetime Distortion Dot Lattice.
 * Pulls a uniform obsidian coordinate mesh inward toward a drifting gravitational well
 * or live cursor coordinates on pure Canvas2D.
 */
export function GravityRippleGrid({
  accentColor = "#f27c63",
  baseRgb = [238, 234, 228],
  backgroundColor = "#060609",
  gridGap = 18,
  speed = 1,
  paused = false,
  className = "",
}: GravityRippleGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gap = Math.max(12, Math.min(28, Math.round(gridGap)));
    let width = 440;
    let height = 220;
    let visible = true;
    let rafId = 0;
    let ptrX = -999;
    let ptrY = -999;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(180, Math.floor(rect.width));
      height = Math.max(120, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 1.4 : timeSec * 0.85 * speed;
      ctx.clearRect(0, 0, width, height);

      const wellX = ptrX > 0 ? ptrX : width * (0.5 + 0.24 * Math.cos(t * 0.9));
      const wellY = ptrY > 0 ? ptrY : height * (0.5 + 0.22 * Math.sin(t * 1.1));
      const radius = Math.min(width, height) * 0.56;
      const [r, g, b] = baseRgb;

      for (let gy = gap; gy < height; gy += gap) {
        for (let gx = gap; gx < width; gx += gap) {
          const dx = wellX - gx;
          const dy = wellY - gy;
          const dist = Math.hypot(dx, dy);

          let px = gx;
          let py = gy;
          let pull = 0;

          if (dist > 1 && dist < radius) {
            const norm = 1 - dist / radius;
            pull = norm * norm;
            const shift = pull * Math.min(dist * 0.45, 22);
            px += (dx / dist) * shift;
            py += (dy / dist) * shift;
          }

          if (pull > 0.32) {
            ctx.fillStyle = accentColor;
            ctx.globalAlpha = Math.min(0.95, 0.35 + pull * 0.65);
          } else {
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(0.22 + pull * 0.45).toFixed(2)})`;
            ctx.globalAlpha = 1;
          }

          const dotR = 1.2 + pull * 1.7;
          ctx.beginPath();
          ctx.arc(px, py, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Subtle gravitational singularity ring
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(wellX, wellY, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      ptrX = e.clientX - rect.left;
      ptrY = e.clientY - rect.top;
    };
    const onLeave = () => {
      ptrX = -999;
      ptrY = -999;
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);

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
      draw((now - startMs) / 1000);
    };

    if (!paused && !prefersReduced) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [accentColor, baseRgb, gridGap, speed, paused]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
