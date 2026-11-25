"use client";

import { useEffect, useRef } from "react";

export interface RetroPerspectiveGridProps {
  /** Horizon glow and active meridian pulse accent color. */
  accentColor?: string;
  /** Wireframe grid hairline stroke color. */
  lineColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Forward glide speed multiplier. */
  speed?: number;
  /** Pause perspective scroll. */
  paused?: boolean;
  className?: string;
}

/**
 * Architectural Dark-Mode 3D Perspective Runway Grid.
 * Projects infinite vanishing-point ground lines gliding cleanly toward the viewer
 * beneath a restrained duotone horizon glow on pure Canvas2D.
 */
export function RetroPerspectiveGrid({
  accentColor = "#f27c63",
  lineColor = "rgba(248, 245, 240, 0.16)",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: RetroPerspectiveGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 440;
    let height = 220;
    let visible = true;
    let rafId = 0;
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
      const t = paused || prefersReduced ? 0.45 : Math.max(0, timeSec) * 0.65 * speed;
      ctx.clearRect(0, 0, width, height);

      const horizonY = height * 0.36;
      const vpX = width * 0.5;
      const floorH = height - horizonY;

      // Restrained horizon band glow
      const glow = ctx.createLinearGradient(0, horizonY - 26, 0, horizonY + 34);
      glow.addColorStop(0, "rgba(255,255,255,0)");
      glow.addColorStop(0.5, `${accentColor}30`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, horizonY - 26, width, 60);

      // Perspective converging longitudinal lines
      const cols = 12;
      for (let i = -cols; i <= cols; i++) {
        const bottomX = vpX + i * (width * 0.12);
        const isCenter = i === 0;
        ctx.strokeStyle = isCenter ? accentColor : lineColor;
        ctx.globalAlpha = isCenter ? 0.65 : 1;
        ctx.lineWidth = isCenter ? 1.3 : 0.9;
        ctx.beginPath();
        ctx.moveTo(vpX + i * 3, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Exponentially spaced scrolling transverse depth lines
      const rows = 11;
      const offset = t % 1;
      for (let r = 0; r < rows; r++) {
        const depth = (r + offset) / rows;
        const curved = depth * depth;
        const y = horizonY + curved * floorH;
        const isPulse = r === rows - 2;

        ctx.strokeStyle = isPulse ? accentColor : lineColor;
        ctx.globalAlpha = Math.min(0.9, 0.12 + curved * 0.88);
        ctx.lineWidth = isPulse ? 1.3 : 0.9;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Razor-sharp horizon hairline
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    resize();
    draw(0.45);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 0.45 : (performance.now() - startMs) / 1000);
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
  }, [accentColor, lineColor, speed, paused]);

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
