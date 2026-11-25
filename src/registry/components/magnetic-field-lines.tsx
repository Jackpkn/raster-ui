"use client";

import { useEffect, useRef } from "react";

export interface MagneticFieldLinesProps {
  /** Spacing between compass needles in CSS px (16-32). */
  gridGap?: number;
  /** Base hairline needle color. */
  needleColor?: string;
  /** Highlight accent for needles near peak magnetic flux. */
  accentColor?: string;
  /** Background surface color. */
  backgroundColor?: string;
  /** Idle dipole orbit speed multiplier. */
  speed?: number;
  /** Pause idle orbit motion. */
  paused?: boolean;
  className?: string;
}

/**
 * Interactive Vector Magnetic Field Needle Grid.
 * Hundreds of crisp architectural needles align smoothly toward the cursor or a calm orbiting dipole.
 */
export function MagneticFieldLines({
  gridGap = 22,
  needleColor = "#a8a29e",
  accentColor = "#f27c63",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: MagneticFieldLinesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 420;
    let height = 240;
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

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 1.2 : timeSec * 0.7 * speed;
      ctx.clearRect(0, 0, width, height);

      const p = pointerRef.current;
      const targetX = p.active ? p.x : width * (0.5 + Math.cos(t) * 0.26);
      const targetY = p.active ? p.y : height * (0.5 + Math.sin(t * 0.85) * 0.24);

      const gap = Math.max(14, Math.min(34, Math.round(gridGap)));
      const halfLen = gap * 0.34;
      const fluxRadius = Math.max(140, Math.min(width, height) * 0.65);

      ctx.lineCap = "round";

      for (let y = gap * 0.6; y < height - gap * 0.2; y += gap) {
        for (let x = gap * 0.6; x < width - gap * 0.2; x += gap) {
          const dx = targetX - x;
          const dy = targetY - y;
          const dist = Math.hypot(dx, dy);
          const angle = Math.atan2(dy, dx);
          const prox = Math.max(0, 1 - dist / fluxRadius);
          const eased = prox * prox;

          const len = halfLen * (0.72 + eased * 0.55);
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);

          ctx.strokeStyle = eased > 0.36 ? accentColor : needleColor;
          ctx.lineWidth = eased > 0.36 ? 1.6 : 1.1;
          ctx.globalAlpha = 0.22 + eased * 0.72;
          ctx.beginPath();
          ctx.moveTo(x - cos * len, y - sin * len);
          ctx.lineTo(x + cos * len, y + sin * len);
          ctx.stroke();

          // Tiny polarity tip on high-flux needles
          if (eased > 0.48) {
            ctx.fillStyle = accentColor;
            ctx.beginPath();
            ctx.arc(x + cos * len, y + sin * len, 1.35, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
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
      if (!visible) return;
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
  }, [gridGap, needleColor, accentColor, speed, paused]);

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
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
