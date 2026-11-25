"use client";

import { useEffect, useRef } from "react";

export interface BiometricIrisScannerProps {
  /** Optical verification beam and iris ring accent color. */
  accentColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Scan sweep speed multiplier. */
  speed?: number;
  /** Pause laser verification scan. */
  paused?: boolean;
  className?: string;
}

/**
 * Optical Biometric Iris Verification Scanner Reticle.
 * Draws fine radial iris striations, segmented aperture arcs, and a sweeping
 * horizontal optical laser beam on pure Canvas2D.
 */
export function BiometricIrisScanner({
  accentColor = "#f27c63",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: BiometricIrisScannerProps) {
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
      const t = paused || prefersReduced ? 1.2 : Math.max(0, timeSec) * 0.9 * speed;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const rMax = Math.min(width, height) * 0.4;
      const rPupil = rMax * 0.34;
      const scanY = cy + Math.sin(t * 1.4) * (rMax * 0.92);

      // Corner optical viewfinder brackets
      const br = rMax * 1.12;
      const bl = 12;
      ctx.strokeStyle = "rgba(248, 245, 240, 0.25)";
      ctx.lineWidth = 1.2;
      const corners: Array<[number, number, number, number]> = [
        [-1, -1, 1, 1],
        [1, -1, -1, 1],
        [-1, 1, 1, -1],
        [1, 1, -1, -1],
      ];
      for (const [sx, sy, dx, dy] of corners) {
        const px = cx + sx * br;
        const py = cy + sy * br;
        ctx.beginPath();
        ctx.moveTo(px + dx * bl, py);
        ctx.lineTo(px, py);
        ctx.lineTo(px, py + dy * bl);
        ctx.stroke();
      }

      // Fine radial iris fibers illuminating near laser sweep height
      const rays = 64;
      for (let i = 0; i < rays; i++) {
        const a = (i / rays) * Math.PI * 2 + t * 0.08;
        const jitter = ((i * 19) % 7) * 0.03;
        const r1 = rPupil * (1.05 + jitter);
        const r2 = rMax * (0.86 + ((i * 11) % 5) * 0.025);
        const midY = cy + Math.sin(a) * ((r1 + r2) * 0.5);
        const lit = Math.abs(midY - scanY) < 16;

        ctx.strokeStyle = lit ? accentColor : "rgba(248, 245, 240, 0.22)";
        ctx.lineWidth = lit ? 1.2 : 0.75;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        ctx.stroke();
      }

      // Outer aperture & inner pupil ring
      ctx.strokeStyle = "rgba(248, 245, 240, 0.28)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(cx, cy, rMax, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#040407";
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(cx, cy, rPupil, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Horizontal laser verification beam clipped across iris diameter
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, rMax * 1.06, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx - rMax * 1.1, scanY);
      ctx.lineTo(cx + rMax * 1.1, scanY);
      ctx.stroke();

      const glow = ctx.createLinearGradient(0, scanY - 14, 0, scanY + 14);
      glow.addColorStop(0, "rgba(255,255,255,0)");
      glow.addColorStop(0.5, `${accentColor}30`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - rMax * 1.1, scanY - 14, rMax * 2.2, 28);
      ctx.restore();
    };

    resize();
    draw(1.2);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.2 : (performance.now() - startMs) / 1000);
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
  }, [accentColor, speed, paused]);

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
