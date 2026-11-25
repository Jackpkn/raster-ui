"use client";

import { useEffect, useRef } from "react";

export interface VectorCircuitTraceProps {
  /** Traveling data packet accent color. */
  accentColor?: string;
  /** Static PCB bus trace color. */
  traceColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Signal propagation speed multiplier. */
  speed?: number;
  /** Pause signal packets. */
  paused?: boolean;
  className?: string;
}

type TracePath = Array<[number, number]>;

const TRACE_PATHS: TracePath[] = [
  [[0.04, 0.22], [0.24, 0.22], [0.34, 0.38], [0.44, 0.38]],
  [[0.04, 0.5], [0.42, 0.5]],
  [[0.04, 0.78], [0.22, 0.78], [0.33, 0.62], [0.44, 0.62]],
  [[0.96, 0.22], [0.76, 0.22], [0.66, 0.38], [0.56, 0.38]],
  [[0.96, 0.5], [0.58, 0.5]],
  [[0.96, 0.78], [0.78, 0.78], [0.67, 0.62], [0.56, 0.62]],
  [[0.5, 0.06], [0.5, 0.34]],
  [[0.5, 0.94], [0.5, 0.66]],
];

/**
 * Architectural Silicon Bus & Vector Circuit Trace Canvas.
 * Luminous telemetry pulses travel smoothly along 45-degree routed paths into a central compute core.
 */
export function VectorCircuitTrace({
  accentColor = "#f27c63",
  traceColor = "rgba(248, 245, 240, 0.16)",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: VectorCircuitTraceProps) {
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
    let dpr = 1;
    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(160, Math.floor(rect.width));
      height = Math.max(120, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const samplePointOnPath = (pts: TracePath, t: number): [number, number] => {
      const segLengths: number[] = [];
      let total = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const dx = (pts[i + 1]![0] - pts[i]![0]) * width;
        const dy = (pts[i + 1]![1] - pts[i]![1]) * height;
        const len = Math.hypot(dx, dy);
        segLengths.push(len);
        total += len;
      }
      let dist = t * total;
      for (let i = 0; i < segLengths.length; i++) {
        const sl = segLengths[i]!;
        if (dist <= sl || i === segLengths.length - 1) {
          const localT = sl > 0 ? Math.max(0, Math.min(1, dist / sl)) : 0;
          const x = (pts[i]![0] + (pts[i + 1]![0] - pts[i]![0]) * localT) * width;
          const y = (pts[i]![1] + (pts[i + 1]![1] - pts[i]![1]) * localT) * height;
          return [x, y];
        }
        dist -= sl;
      }
      return [width / 2, height / 2];
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 0.45 : timeSec * 0.42 * speed;
      ctx.clearRect(0, 0, width, height);

      // Draw static orthogonal routed traces + via pads
      ctx.strokeStyle = traceColor;
      ctx.lineWidth = 1.1;
      for (const path of TRACE_PATHS) {
        ctx.beginPath();
        path.forEach(([nx, ny], idx) => {
          const x = nx * width;
          const y = ny * height;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Outer solder pad
        const [sx, sy] = path[0]!;
        ctx.fillStyle = traceColor;
        ctx.beginPath();
        ctx.arc(sx * width, sy * height, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Moving luminous data pulses
      TRACE_PATHS.forEach((path, idx) => {
        const phase = (t + idx * 0.17) % 1;
        const [px, py] = samplePointOnPath(path, phase);
        const [tx, ty] = samplePointOnPath(path, Math.max(0, phase - 0.14));

        const grad = ctx.createLinearGradient(tx, ty, px, py);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, accentColor);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.fillStyle = "#f8f5f0";
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Central compute die
      const dieW = 54;
      const dieH = 44;
      const dx = width / 2 - dieW / 2;
      const dy = height / 2 - dieH / 2;
      ctx.fillStyle = "#0e0e15";
      ctx.strokeStyle = "rgba(248, 245, 240, 0.24)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(dx, dy, dieW, dieH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.65;
      ctx.beginPath();
      ctx.roundRect(dx + 8, dy + 8, dieW - 16, dieH - 16, 4);
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
  }, [accentColor, traceColor, speed, paused]);

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
