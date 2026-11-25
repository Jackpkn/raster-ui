"use client";

import { useEffect, useRef } from "react";

export interface DataFunnelPrismProps {
  /** Verified filtered output beam and prism accent color. */
  accentColor?: string;
  /** Raw noisy incoming particle tint. */
  rawColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Flow speed multiplier. */
  speed?: number;
  /** Pause stream particles. */
  paused?: boolean;
  className?: string;
}

/**
 * Architectural Data Ingestion & Filtering Prism Canvas.
 * Scattered raw signals converge into a precision central optical gate and emerge
 * as clean, structured high-signal streams on the right.
 */
export function DataFunnelPrism({
  accentColor = "#f27c63",
  rawColor = "rgba(248, 245, 240, 0.36)",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: DataFunnelPrismProps) {
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

    const particles = Array.from({ length: 34 }, (_, i) => ({
      offset: (i * 0.6180339) % 1,
      entryY: ((i * 37) % 100) / 100,
      lane: i % 3,
      rate: 0.72 + (i % 5) * 0.08,
      verified: i % 3 !== 2,
    }));

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
      const t = paused || prefersReduced ? 1.5 : timeSec * 0.34 * speed;
      ctx.clearRect(0, 0, width, height);

      const gateX = width * 0.5;
      const cy = height * 0.5;
      const outYs = [height * 0.32, height * 0.5, height * 0.68];

      // Subtle funnel guide lines on left
      ctx.strokeStyle = "rgba(248, 245, 240, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width * 0.04, height * 0.14);
      ctx.lineTo(gateX - 18, height * 0.34);
      ctx.moveTo(width * 0.04, height * 0.86);
      ctx.lineTo(gateX - 18, height * 0.66);
      ctx.stroke();

      // Clean parallel structured output rails on right
      for (const oy of outYs) {
        ctx.strokeStyle = "rgba(248, 245, 240, 0.14)";
        ctx.beginPath();
        ctx.moveTo(gateX + 18, oy);
        ctx.lineTo(width * 0.96, oy);
        ctx.stroke();
      }

      // Draw flowing particles transforming across central filter gate
      for (const p of particles) {
        const u = (t * p.rate + p.offset) % 1;
        if (u < 0.5) {
          // Raw chaotic stream converging toward filter gate
          const k = u * 2;
          const x = width * 0.04 + (gateX - 16 - width * 0.04) * k;
          const rawY = height * (0.14 + p.entryY * 0.72);
          const targetY = cy + (p.entryY - 0.5) * height * 0.24;
          const wobble = Math.sin(k * 9 + p.offset * 12) * (1 - k) * 6;
          const y = rawY + (targetY - rawY) * (k * k) + wobble;

          ctx.fillStyle = rawColor;
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.verified) {
          // Clean verified structured packets gliding along right rails
          const k = (u - 0.5) * 2;
          const x = gateX + 18 + (width * 0.96 - (gateX + 18)) * k;
          const y = outYs[p.lane]!;

          const tailX = Math.max(gateX + 18, x - 24);
          const grad = ctx.createLinearGradient(tailX, y, x, y);
          grad.addColorStop(0, "rgba(255,255,255,0)");
          grad.addColorStop(1, accentColor);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(tailX, y);
          ctx.lineTo(x, y);
          ctx.stroke();

          ctx.fillStyle = "#f8f5f0";
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Central vertical prism / filter gate slab
      const slabW = 32;
      const slabH = height * 0.54;
      ctx.fillStyle = "#0d0d14";
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.roundRect(gateX - slabW / 2, cy - slabH / 2, slabW, slabH, 8);
      ctx.fill();
      ctx.stroke();

      // Inner optical slit lines
      ctx.strokeStyle = "rgba(248, 245, 240, 0.28)";
      ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) {
        const sy = cy + i * 11;
        ctx.beginPath();
        ctx.moveTo(gateX - 7, sy);
        ctx.lineTo(gateX + 7, sy);
        ctx.stroke();
      }
    };

    resize();
    draw(1.5);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.5 : (performance.now() - startMs) / 1000);
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
  }, [accentColor, rawColor, speed, paused]);

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
