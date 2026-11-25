"use client";

import { useEffect, useRef } from "react";

export interface MotherboardBusMatrixProps {
  /** Signal packet and active bus highlight color. */
  accentColor?: string;
  /** Static copper lane tint. */
  traceColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Number of parallel routed lanes (6-14). */
  lanes?: number;
  /** Signal speed multiplier. */
  speed?: number;
  /** Pause traveling packets. */
  paused?: boolean;
  className?: string;
}

/**
 * Parallel High-Speed Motherboard Copper Bus Matrix.
 * Renders chamfered 45-degree multi-lane differential traces with plated via holes,
 * pointer-proximity bus glow, and synchronized high-frequency signal bursts.
 */
export function MotherboardBusMatrix({
  accentColor = "#f27c63",
  traceColor = "rgba(248, 245, 240, 0.14)",
  backgroundColor = "#060609",
  lanes = 9,
  speed = 1,
  paused = false,
  className = "",
}: MotherboardBusMatrixProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const laneCount = Math.max(5, Math.min(14, Math.round(lanes)));
    let width = 440;
    let height = 220;
    let visible = true;
    let rafId = 0;
    let pointerY = -999;
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

    const getLanePoints = (idx: number): Array<[number, number]> => {
      const norm = (idx + 0.5) / laneCount;
      const yBase = height * (0.12 + norm * 0.76);
      const stepOffset = (idx % 2 === 0 ? -1 : 1) * Math.min(26, height * 0.11);
      const jog1 = width * (0.24 + (idx % 3) * 0.05);
      const jog2 = jog1 + Math.abs(stepOffset);
      const jog3 = width * (0.68 - (idx % 2) * 0.06);
      const jog4 = jog3 + Math.abs(stepOffset);
      return [
        [width * 0.04, yBase],
        [jog1, yBase],
        [jog2, yBase + stepOffset],
        [jog3, yBase + stepOffset],
        [jog4, yBase],
        [width * 0.96, yBase],
      ];
    };

    const samplePolyline = (pts: Array<[number, number]>, t: number): [number, number] => {
      const lens: number[] = [];
      let total = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const l = Math.hypot(pts[i + 1]![0] - pts[i]![0], pts[i + 1]![1] - pts[i]![1]);
        lens.push(l);
        total += l;
      }
      let d = t * total;
      for (let i = 0; i < lens.length; i++) {
        const l = lens[i]!;
        if (d <= l || i === lens.length - 1) {
          const u = l > 0 ? Math.max(0, Math.min(1, d / l)) : 0;
          return [
            pts[i]![0] + (pts[i + 1]![0] - pts[i]![0]) * u,
            pts[i]![1] + (pts[i + 1]![1] - pts[i]![1]) * u,
          ];
        }
        d -= l;
      }
      return pts[0]!;
    };

    const draw = (timeSec: number) => {
      const t = paused || prefersReduced ? 0.35 : timeSec * 0.32 * speed;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < laneCount; i++) {
        const pts = getLanePoints(i);
        const midY = pts[0]![1];
        const hovered = Math.abs(pointerY - midY) < 20;

        ctx.strokeStyle = hovered ? `${accentColor}77` : traceColor;
        ctx.lineWidth = hovered ? 1.5 : 1;
        ctx.beginPath();
        pts.forEach(([x, y], pIdx) => {
          if (pIdx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Start and end plated via holes
        for (const endPt of [pts[0]!, pts[pts.length - 1]!]) {
          ctx.beginPath();
          ctx.arc(endPt[0], endPt[1], 2.6, 0, Math.PI * 2);
          ctx.fillStyle = backgroundColor;
          ctx.fill();
          ctx.strokeStyle = hovered ? accentColor : "rgba(248, 245, 240, 0.28)";
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }

        // Traveling signal packet along lane
        const reverse = i % 3 === 1;
        const rawPhase = (t * (0.85 + (i % 4) * 0.14) + i * 0.19) % 1;
        const headT = reverse ? 1 - rawPhase : rawPhase;
        const tailT = reverse ? Math.min(1, headT + 0.14) : Math.max(0, headT - 0.14);

        const [hx, hy] = samplePolyline(pts, headT);
        const [tx, ty] = samplePolyline(pts, tailT);

        const grad = ctx.createLinearGradient(tx, ty, hx, hy);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, accentColor);

        ctx.strokeStyle = grad;
        ctx.lineWidth = hovered ? 2.4 : 1.8;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();

        ctx.fillStyle = "#f8f5f0";
        ctx.beginPath();
        ctx.arc(hx, hy, hovered ? 2.6 : 1.9, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerY = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointerY = -999;
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);

    resize();
    draw(0.35);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 0.35 : (performance.now() - startMs) / 1000);
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
  }, [accentColor, traceColor, backgroundColor, lanes, speed, paused]);

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
