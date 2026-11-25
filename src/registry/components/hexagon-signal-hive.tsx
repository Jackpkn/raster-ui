"use client";

import { useEffect, useRef } from "react";

export interface HexagonSignalHiveProps {
  /** Active hexagonal pulse wave accent color. */
  accentColor?: string;
  /** Static cell border hairline color. */
  cellStroke?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Hexagon radius in CSS px (12-26). */
  hexRadius?: number;
  /** Wave propagation speed multiplier. */
  speed?: number;
  /** Pause wave propagation. */
  paused?: boolean;
  className?: string;
}

/**
 * Architectural Hexagonal Compute Lattice & Signal Wave Hive.
 * Propagates radial signal waves smoothly across crisp obsidian honeycomb cells
 * with interactive pointer-proximity ripple illumination on pure Canvas2D.
 */
export function HexagonSignalHive({
  accentColor = "#f27c63",
  cellStroke = "rgba(248, 245, 240, 0.14)",
  backgroundColor = "#060609",
  hexRadius = 17,
  speed = 1,
  paused = false,
  className = "",
}: HexagonSignalHiveProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const r = Math.max(11, Math.min(28, hexRadius));
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

    const traceHex = (cx: number, cy: number, rad: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = cx + rad * Math.cos(angle);
        const hy = cy + rad * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 2.1 : timeSec * 1.45 * speed;
      ctx.clearRect(0, 0, width, height);

      const dx = Math.sqrt(3) * r;
      const dy = 1.5 * r;
      const cols = Math.ceil(width / dx) + 2;
      const rows = Math.ceil(height / dy) + 2;

      const emitterX = ptrX > 0 ? ptrX : width * (0.5 + 0.22 * Math.cos(t * 0.45));
      const emitterY = ptrY > 0 ? ptrY : height * (0.5 + 0.18 * Math.sin(t * 0.6));

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx = col * dx + (row % 2 !== 0 ? dx / 2 : 0);
          const cy = row * dy;
          if (cx < -r || cx > width + r || cy < -r || cy > height + r) continue;

          const dist = Math.hypot(cx - emitterX, cy - emitterY);
          const ring = 0.5 + 0.5 * Math.sin(dist * 0.055 - t * 2.1);
          const falloff = Math.max(0, 1 - dist / (Math.max(width, height) * 0.68));
          const energy = ring * ring * falloff;

          traceHex(cx, cy, r - 1.5);
          if (energy > 0.22) {
            ctx.fillStyle = accentColor;
            ctx.globalAlpha = Math.min(0.45, energy * 0.48);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = energy > 0.55 ? 1.2 : 0.85;
            ctx.stroke();
          } else {
            ctx.strokeStyle = cellStroke;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
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
    draw(2.1);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 2.1 : (performance.now() - startMs) / 1000);
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
  }, [accentColor, cellStroke, hexRadius, speed, paused]);

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
