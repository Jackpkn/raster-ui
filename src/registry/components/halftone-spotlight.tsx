"use client";

import { useEffect, useRef } from "react";

export interface HalftoneSpotlightProps {
  /** Dot spacing in CSS px (10-28). */
  gridGap?: number;
  /** Base dot color. */
  dotColor?: string;
  /** Highlight color near cursor spotlight. */
  accentColor?: string;
  /** Background surface color. */
  backgroundColor?: string;
  /** Spotlight radius in CSS px. */
  spotlightRadius?: number;
  /** Pause idle wave animation. */
  paused?: boolean;
  className?: string;
}

/**
 * Interactive cursor-tracking halftone dot field.
 * Smoothly expands dots around the pointer and falls back to a calm ambient ripple when idle.
 */
export function HalftoneSpotlight({
  gridGap = 16,
  dotColor = "#a8a29e",
  accentColor = "#f27c63",
  backgroundColor = "#08080b",
  spotlightRadius = 170,
  paused = false,
  className = "",
}: HalftoneSpotlightProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: -999, y: -999, active: false });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 400;
    let height = 260;
    let dpr = 1;
    let visible = true;
    let rafId = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(120, Math.floor(rect.width));
      height = Math.max(120, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const t = paused || prefersReduced ? 1.5 : now * 0.0012;
      ctx.clearRect(0, 0, width, height);

      const p = pointerRef.current;
      const focusX = p.active ? p.x : width * (0.5 + Math.cos(t * 0.7) * 0.24);
      const focusY = p.active ? p.y : height * (0.5 + Math.sin(t * 0.55) * 0.22);

      const gap = Math.max(10, Math.min(32, gridGap));
      const radius = Math.max(80, spotlightRadius);

      for (let y = gap * 0.5; y < height; y += gap) {
        for (let x = gap * 0.5; x < width; x += gap) {
          const dist = Math.hypot(x - focusX, y - focusY);
          const prox = Math.max(0, 1 - dist / radius);
          const eased = prox * prox * (3 - 2 * prox);
          const ambient = 0.5 + 0.5 * Math.sin(x * 0.025 + y * 0.02 - t * 1.4);

          const dotR = 1.0 + ambient * 0.8 + eased * (gap * 0.26);
          ctx.beginPath();
          ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.globalAlpha = 0.16 + ambient * 0.16 + eased * 0.68;
          ctx.fillStyle = eased > 0.42 ? accentColor : dotColor;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    draw(performance.now());

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const loop = (now: number) => {
      rafId = window.requestAnimationFrame(loop);
      if (!visible) return;
      draw(now);
    };

    if (!paused && !prefersReduced) {
      rafId = window.requestAnimationFrame(loop);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [gridGap, dotColor, accentColor, spotlightRadius, paused]);

  return (
    <div
      ref={containerRef}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
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
