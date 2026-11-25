"use client";

import { useEffect, useRef } from "react";

export interface AsciiWaveFieldProps {
  /** Monospace glyph ramp ordered from darkest to brightest. */
  charset?: string;
  /** Primary glyph color. */
  color?: string;
  /** Crest highlight color for high-density peaks. */
  accentColor?: string;
  /** Background surface color. */
  backgroundColor?: string;
  /** Character cell size in CSS px (9-18). */
  cellSize?: number;
  /** Wave animation speed multiplier. */
  speed?: number;
  /** Pause animation. */
  paused?: boolean;
  className?: string;
}

/**
 * Zero-Dependency Interactive ASCII Density Wave Field.
 * Projects animated 3D trigonometric ripples onto a crisp monospace character ramp with pointer distortion.
 */
export function AsciiWaveField({
  charset = " .:-=+*#%@",
  color = "#b8b2a8",
  accentColor = "#f27c63",
  backgroundColor = "#060609",
  cellSize = 12,
  speed = 1,
  paused = false,
  className = "",
}: AsciiWaveFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: -1, y: -1, active: false });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars = charset.length >= 2 ? charset : " .:-=+*#%@";
    let width = 420;
    let height = 240;
    let dpr = 1;
    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(140, Math.floor(rect.width));
      height = Math.max(120, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (timeSec: number) => {
      const t = timeSec * 0.85 * speed;
      const step = Math.max(9, Math.min(20, Math.round(cellSize)));
      ctx.clearRect(0, 0, width, height);
      ctx.font = `500 ${Math.round(step * 0.92)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const p = pointerRef.current;
      const cols = Math.ceil(width / step);
      const rows = Math.ceil(height / step);

      for (let r = 0; r < rows; r++) {
        const y = r * step + step * 0.5;
        const ny = r / Math.max(1, rows);
        for (let c = 0; c < cols; c++) {
          const x = c * step + step * 0.5;
          const nx = c / Math.max(1, cols);

          let wave =
            Math.sin(nx * 7.5 + t + Math.cos(ny * 4.5 - t * 0.6)) * 0.48 +
            Math.cos((nx * 4.2 - ny * 6.0) + t * 0.7) * 0.34 +
            Math.sin((nx + ny) * 9.0 - t * 1.1) * 0.18;

          if (p.active) {
            const dist = Math.hypot(x - p.x, y - p.y);
            if (dist < 130) {
              wave += Math.cos(dist * 0.08 - t * 3.5) * (1 - dist / 130) * 0.55;
            }
          }

          const norm = Math.max(0, Math.min(1, 0.48 + wave * 0.52));
          const charIdx = Math.min(chars.length - 1, Math.floor(norm * chars.length));
          const ch = chars[charIdx]!;
          if (ch === " ") continue;

          const isPeak = norm > 0.78;
          ctx.fillStyle = isPeak ? accentColor : color;
          ctx.globalAlpha = isPeak ? 0.92 : 0.22 + norm * 0.58;
          ctx.fillText(ch, x, y);
        }
      }
      ctx.globalAlpha = 1;
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
      ro.disconnect();
      io.disconnect();
    };
  }, [charset, color, accentColor, cellSize, speed, paused]);

  return (
    <div
      ref={containerRef}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointerRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
      className={`relative overflow-hidden select-none ${className}`}
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
