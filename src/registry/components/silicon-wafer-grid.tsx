"use client";

import { useEffect, useRef } from "react";

export interface SiliconWaferGridProps {
  /** Active inspected die and laser crosshair accent color. */
  accentColor?: string;
  /** Base silicon die outline tint. */
  dieColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Laser scan sweep speed multiplier. */
  speed?: number;
  /** Pause wafer scan sweep. */
  paused?: boolean;
  className?: string;
}

/**
 * Semiconductor Silicon Wafer Die Map & Laser Inspection Sweep.
 * Renders a circular die lattice with a notched wafer edge, active tested sectors,
 * and a sweeping optical verification crosshair on pure Canvas2D.
 */
export function SiliconWaferGrid({
  accentColor = "#f27c63",
  dieColor = "rgba(248, 245, 240, 0.22)",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: SiliconWaferGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 420;
    let height = 220;
    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(160, Math.floor(rect.width));
      height = Math.max(120, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 1.8 : timeSec * 0.7 * speed;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.42;
      const cell = Math.max(10, Math.round(radius / 5.2));
      const pad = 2;

      // Sweeping optical inspection focus point inside wafer
      const scanAngle = t * 1.1;
      const scanR = radius * (0.28 + 0.34 * Math.sin(t * 0.75));
      const scanX = cx + Math.cos(scanAngle) * scanR;
      const scanY = cy + Math.sin(scanAngle) * scanR;

      // Subtle wafer rim glow
      const rimGrad = ctx.createRadialGradient(cx, cy, radius * 0.55, cx, cy, radius * 1.12);
      rimGrad.addColorStop(0, "rgba(255,255,255,0)");
      rimGrad.addColorStop(0.85, "rgba(248, 245, 240, 0.04)");
      rimGrad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.12, 0, Math.PI * 2);
      ctx.fill();

      // Draw circular clipped silicon die grid
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      const cols = Math.ceil((radius * 2) / cell);
      const rows = Math.ceil((radius * 2) / cell);
      const startX = cx - (cols * cell) / 2;
      const startY = cy - (rows * cell) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * cell;
          const y = startY + r * cell;
          const dx = x + cell / 2 - cx;
          const dy = y + cell / 2 - cy;
          if (Math.hypot(dx, dy) > radius - 3) continue;

          const distScan = Math.hypot(x + cell / 2 - scanX, y + cell / 2 - scanY);
          const hash = ((r * 73 + c * 37) % 19) / 19;
          const activeWave = 0.5 + 0.5 * Math.sin(t * 2.2 + hash * 6.28);

          // Highlight dies near laser focus or periodically pulsing tested dies
          if (distScan < cell * 1.35) {
            ctx.fillStyle = accentColor;
            ctx.globalAlpha = 0.72 * (1 - distScan / (cell * 1.5));
            ctx.fillRect(x + pad, y + pad, cell - pad * 2, cell - pad * 2);
          } else if (hash > 0.78 && activeWave > 0.65) {
            ctx.fillStyle = accentColor;
            ctx.globalAlpha = 0.24;
            ctx.fillRect(x + pad, y + pad, cell - pad * 2, cell - pad * 2);
          } else {
            ctx.fillStyle = "rgba(248, 245, 240, 0.03)";
            ctx.globalAlpha = 1;
            ctx.fillRect(x + pad, y + pad, cell - pad * 2, cell - pad * 2);
          }

          ctx.globalAlpha = 1;
          ctx.strokeStyle = distScan < cell * 1.6 ? accentColor : dieColor;
          ctx.lineWidth = distScan < cell * 1.2 ? 1.1 : 0.7;
          ctx.strokeRect(x + pad, y + pad, cell - pad * 2, cell - pad * 2);
        }
      }

      // Optical laser inspection crosshair
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      ctx.moveTo(cx - radius, scanY);
      ctx.lineTo(cx + radius, scanY);
      ctx.moveTo(scanX, cy - radius);
      ctx.lineTo(scanX, cy + radius);
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#f8f5f0";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(scanX - cell * 0.55, scanY - cell * 0.55, cell * 1.1, cell * 1.1);
      ctx.restore();

      // Wafer perimeter hairline with bottom orientation flat notch
      ctx.strokeStyle = "rgba(248, 245, 240, 0.28)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, -Math.PI * 0.46, Math.PI * 1.46);
      ctx.stroke();

      // Bottom calibration notch accent
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(cx, cy + radius, 2.4, 0, Math.PI * 2);
      ctx.fill();
    };

    resize();
    draw(1.8);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.8 : (performance.now() - startMs) / 1000);
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
  }, [accentColor, dieColor, speed, paused]);

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
