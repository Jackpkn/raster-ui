"use client";

import { useEffect, useRef } from "react";

export interface ObsidianStarfieldProps {
  /** Number of deterministic micro-stars (40-260). */
  starCount?: number;
  /** Base star tint in RGB. */
  starRgb?: [number, number, number];
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Show soft frosted dome glow at top center. */
  topGlow?: boolean;
  /** Drift speed multiplier. */
  speed?: number;
  /** Pause drift & shimmer. */
  paused?: boolean;
  className?: string;
}

interface Star {
  u: number;
  v: number;
  r: number;
  alpha: number;
  phase: number;
  depth: number;
}

function buildStars(count: number): Star[] {
  let seed = 739391;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const bright = rand() > 0.85;
    stars.push({
      u: rand(),
      v: rand(),
      r: bright ? 1.0 + rand() * 0.55 : 0.42 + rand() * 0.45,
      alpha: bright ? 0.46 + rand() * 0.36 : 0.14 + rand() * 0.28,
      phase: rand() * Math.PI * 2,
      depth: 0.35 + rand() * 0.9,
    });
  }
  return stars;
}

/**
 * Multi-depth obsidian micro-starfield with frosted top dome glow.
 * Sub-0.3Hz shimmer rate stays comfortable and WCAG safe.
 */
export function ObsidianStarfield({
  starCount = 150,
  starRgb = [248, 245, 240],
  backgroundColor = "#08080b",
  topGlow = true,
  speed = 1,
  paused = false,
  className = "",
}: ObsidianStarfieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sr = starRgb[0];
  const sg = starRgb[1];
  const sb = starRgb[2];

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars = buildStars(Math.max(30, Math.min(300, starCount)));
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
      const t = paused || prefersReduced ? 0 : now * 0.00085 * speed;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]!;
        const x = (((s.u * width + t * 10 * s.depth) % width) + width) % width;
        const y = (((s.v * height - t * 4 * s.depth) % height) + height) % height;
        const shimmer = 0.72 + 0.28 * Math.sin(t * 1.2 + s.phase);
        const alpha = Math.min(0.9, s.alpha * shimmer);
        ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    draw(0);

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

    const tick = (now: number) => {
      rafId = window.requestAnimationFrame(tick);
      if (!visible || paused || prefersReduced) return;
      draw(now);
    };

    if (!paused && !prefersReduced) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [starCount, sr, sg, sb, speed, paused]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor,
        backgroundImage: topGlow
          ? "radial-gradient(85% 58% at 50% 0%, rgba(255, 255, 255, 0.095) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 76%)"
          : undefined,
      }}
    >
      <canvas ref={canvasRef} className="pointer-events-none block h-full w-full" />
    </div>
  );
}
