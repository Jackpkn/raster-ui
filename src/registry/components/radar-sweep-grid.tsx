"use client";

import { useEffect, useRef } from "react";

export interface RadarSweepGridProps {
  /** Sweep beam and active blip accent color. */
  accentColor?: string;
  /** Ring and crosshair hairline color. */
  ringColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Sweep rotation speed multiplier. */
  speed?: number;
  /** Pause sweep rotation. */
  paused?: boolean;
  className?: string;
}

const BLIPS: Array<{ angle: number; dist: number }> = [
  { angle: 0.55, dist: 0.38 },
  { angle: 1.85, dist: 0.68 },
  { angle: 2.95, dist: 0.52 },
  { angle: 4.15, dist: 0.78 },
  { angle: 5.3, dist: 0.34 },
  { angle: 5.95, dist: 0.64 },
];

/**
 * Architectural Polar Radar Sweep with Trailing Blips.
 * Zero-dependency Canvas2D telemetry radar suited for monitoring, agent discovery, and security cards.
 */
export function RadarSweepGrid({
  accentColor = "#f27c63",
  ringColor = "rgba(255, 250, 245, 0.14)",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: RadarSweepGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 320;
    let height = 240;
    let dpr = 1;
    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(140, Math.floor(rect.width));
      height = Math.max(140, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (timeSec: number) => {
      const sweepAngle = ((timeSec * 0.9 * speed) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(width, height) * 0.43;

      // Concentric range rings
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 1;
      for (const f of [0.28, 0.54, 0.78, 1]) {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * f, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.stroke();

      // Layered phosphor sweep wedge (no conicGradient polyfill needed)
      const trailSlices = 18;
      const trailSpan = 0.95;
      for (let i = 0; i < trailSlices; i++) {
        const f0 = i / trailSlices;
        const f1 = (i + 1) / trailSlices;
        const a0 = sweepAngle - f1 * trailSpan;
        const a1 = sweepAngle - f0 * trailSpan;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, a0, a1);
        ctx.closePath();
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = (1 - f0) * 0.14;
        ctx.fill();
      }

      // Leading beam line
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR);
      ctx.stroke();

      // Blips that brighten right as the sweep passes over them
      for (const blip of BLIPS) {
        const delta = ((sweepAngle - blip.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const glow = Math.max(0.18, 1 - delta / 3.4);
        const bx = cx + Math.cos(blip.angle) * (blip.dist * maxR);
        const by = cy + Math.sin(blip.angle) * (blip.dist * maxR);

        ctx.globalAlpha = glow * 0.35;
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(bx, by, 3 + glow * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = glow;
        ctx.beginPath();
        ctx.arc(bx, by, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Center core dot
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "#f8f5f0";
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    resize();
    draw(1.0);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.0 : (performance.now() - startMs) / 1000);
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
    };
  }, [accentColor, ringColor, speed, paused]);

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
