"use client";

import { useEffect, useRef } from "react";

export interface FiberOpticStreamProps {
  /** Flowing photon packet accent color. */
  accentColor?: string;
  /** Base translucent fiber spline stroke color. */
  strandColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Number of harmonic fiber strands (5-12). */
  strands?: number;
  /** Stream velocity multiplier. */
  speed?: number;
  /** Pause flowing fiber animation. */
  paused?: boolean;
  className?: string;
}

/**
 * Flowing Fiber-Optic Data Ribbon & Photon Bursts Canvas.
 * Draws undulating smooth sinusoidal optical conduits carrying glowing data streaks
 * with gentle pointer-deflection physics on pure Canvas2D.
 */
export function FiberOpticStream({
  accentColor = "#f27c63",
  strandColor = "rgba(248, 245, 240, 0.14)",
  backgroundColor = "#060609",
  strands = 8,
  speed = 1,
  paused = false,
  className = "",
}: FiberOpticStreamProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = Math.max(4, Math.min(12, Math.round(strands)));
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

    const evalStrandY = (sIdx: number, nx: number, t: number): number => {
      const center = height * 0.5;
      const spread = (sIdx - (count - 1) / 2) * (height * 0.068);
      const envelope = 0.45 + 0.55 * Math.sin(nx * Math.PI);
      const waveA = Math.sin(nx * 5.2 - t * 1.4 + sIdx * 0.55) * (height * 0.13) * envelope;
      const waveB = Math.cos(nx * 2.8 + t * 0.85 - sIdx * 0.35) * (height * 0.05);
      let y = center + spread * (0.65 + 0.55 * envelope) + waveA + waveB;

      // Gentle cursor magnetic deflection
      if (ptrX > 0) {
        const dx = nx * width - ptrX;
        const dy = y - ptrY;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          const push = (1 - dist / 110) * 18;
          y += dy >= 0 ? push : -push;
        }
      }
      return y;
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 1.4 : timeSec * 0.9 * speed;
      ctx.clearRect(0, 0, width, height);

      const segments = 56;

      for (let s = 0; s < count; s++) {
        const pts: Array<[number, number]> = [];
        for (let i = 0; i <= segments; i++) {
          const nx = i / segments;
          pts.push([nx * width, evalStrandY(s, nx, t)]);
        }

        // Base optical strand
        ctx.strokeStyle = strandColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        pts.forEach(([x, y], idx) => {
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Flowing photon pulse along strand
        const headN = (t * (0.28 + (s % 3) * 0.07) + s * 0.17) % 1.2 - 0.1;
        const tailN = headN - 0.16;
        const startI = Math.max(0, Math.floor(tailN * segments));
        const endI = Math.min(segments, Math.ceil(headN * segments));

        if (endI > startI) {
          const pTail = pts[startI]!;
          const pHead = pts[endI]!;
          const grad = ctx.createLinearGradient(pTail[0], pTail[1], pHead[0], pHead[1]);
          grad.addColorStop(0, "rgba(255,255,255,0)");
          grad.addColorStop(0.75, accentColor);
          grad.addColorStop(1, "#f8f5f0");

          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.1;
          ctx.lineCap = "round";
          ctx.beginPath();
          for (let i = startI; i <= endI; i++) {
            const [x, y] = pts[i]!;
            if (i === startI) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Luminous photon head
          ctx.fillStyle = "#f8f5f0";
          ctx.beginPath();
          ctx.arc(pHead[0], pHead[1], 2.1, 0, Math.PI * 2);
          ctx.fill();
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
    draw(1.4);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.4 : (performance.now() - startMs) / 1000);
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
  }, [accentColor, strandColor, strands, speed, paused]);

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
