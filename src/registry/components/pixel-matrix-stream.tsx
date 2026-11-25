"use client";

import { useEffect, useRef } from "react";

export interface PixelMatrixStreamProps {
  /** Base monochrome pixel block color. */
  color?: string;
  /** Leading stream head accent color. */
  accentColor?: string;
  /** Background surface color. */
  backgroundColor?: string;
  /** Pixel block size in CSS px (4-12). */
  blockSize?: number;
  /** Fall speed multiplier. */
  speed?: number;
  /** Pause stream motion. */
  paused?: boolean;
  className?: string;
}

interface ColumnState {
  offset: number;
  velocity: number;
  length: number;
  accent: boolean;
}

function createColumns(count: number): ColumnState[] {
  let seed = 918273;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    offset: rand() * 34,
    velocity: 0.45 + rand() * 0.9,
    length: 5 + Math.floor(rand() * 10),
    accent: rand() > 0.72,
  }));
}

/**
 * Restrained 1-Bit Architectural Pixel Data Stream.
 * Calm monochrome pixel columns with subtle accent heads for dark infrastructure hero cards.
 */
export function PixelMatrixStream({
  color = "#ded8cf",
  accentColor = "#f27c63",
  backgroundColor = "#060609",
  blockSize = 7,
  speed = 1,
  paused = false,
  className = "",
}: PixelMatrixStreamProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 400;
    let height = 220;
    let dpr = 1;
    let cols: ColumnState[] = [];
    let visible = true;
    let rafId = 0;
    const startMs = performance.now();

    const step = Math.max(5, Math.min(14, Math.round(blockSize))) + 3;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(140, Math.floor(rect.width));
      height = Math.max(100, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = createColumns(Math.ceil(width / step));
    };

    const draw = (timeSec: number) => {
      ctx.clearRect(0, 0, width, height);
      const rows = Math.ceil(height / step) + 12;
      const px = Math.max(3, step - 3);

      // Faint static substrate grid
      ctx.fillStyle = "rgba(255, 250, 245, 0.04)";
      for (let c = 0; c < cols.length; c++) {
        const x = c * step + 1;
        for (let r = 0; r < rows - 10; r++) {
          ctx.fillRect(x, r * step + 1, px, px);
        }
      }

      for (let c = 0; c < cols.length; c++) {
        const col = cols[c]!;
        const x = c * step + 1;
        const head = ((col.offset + timeSec * 4.5 * col.velocity * speed) % rows + rows) % rows;
        const headRow = Math.floor(head);

        for (let tail = 0; tail < col.length; tail++) {
          const row = headRow - tail;
          if (row < 0 || row * step > height) continue;
          const fade = 1 - tail / col.length;
          ctx.fillStyle = tail === 0 && col.accent ? accentColor : color;
          ctx.globalAlpha = tail === 0 ? 0.92 : fade * fade * 0.42;
          ctx.fillRect(x, row * step + 1, px, px);
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    draw(2.0);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 2.0 : (performance.now() - startMs) / 1000);
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
      if (now - lastMs < 40) return;
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
  }, [color, accentColor, blockSize, speed, paused]);

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
