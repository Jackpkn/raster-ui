"use client";

import { useEffect, useRef, useState } from "react";

export interface BentoSparklineTileProps {
  /** Metric title displayed top-left. */
  label?: string;
  /** Numeric series plotted across the sparkline. */
  series?: number[];
  /** Unit suffix (e.g. "ms", "req/s", "%"). */
  unit?: string;
  /** Line and crosshair accent color. */
  accentColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  className?: string;
}

const DEFAULT_SERIES = [
  42, 46, 44, 51, 55, 49, 58, 63, 61, 68, 72, 69, 76, 81, 79, 85, 89, 86, 93, 96,
];

/**
 * Interactive Zero-Dependency Canvas2D Bento Sparkline Tile.
 * Supports smooth pointer scrub inspection with vertical hairline crosshair and live value readout.
 */
export function BentoSparklineTile({
  label = "Edge Throughput",
  series = DEFAULT_SERIES,
  unit = "k/s",
  accentColor = "#f27c63",
  backgroundColor = "#09090d",
  className = "",
}: BentoSparklineTileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const safeSeries = series.length >= 2 ? series : DEFAULT_SERIES;
  const activeIdx = hoverIdx ?? safeSeries.length - 1;
  const currentVal = safeSeries[activeIdx] ?? 0;
  const firstVal = safeSeries[0] ?? 1;
  const deltaPct = Math.round(((currentVal - firstVal) / Math.max(1, Math.abs(firstVal))) * 100);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(140, Math.floor(rect.width));
      const height = Math.max(70, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const min = Math.min(...safeSeries) * 0.9;
      const max = Math.max(...safeSeries) * 1.06;
      const span = Math.max(1, max - min);
      const padY = 12;

      const coords = safeSeries.map((v, i) => ({
        x: (i / (safeSeries.length - 1)) * width,
        y: height - padY - ((v - min) / span) * (height - padY * 2),
      }));

      // Area gradient fill under sparkline
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, `${accentColor}38`);
      grad.addColorStop(1, `${accentColor}00`);
      ctx.beginPath();
      ctx.moveTo(coords[0]!.x, height);
      for (const pt of coords) ctx.lineTo(pt.x, pt.y);
      ctx.lineTo(coords[coords.length - 1]!.x, height);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Main crisp vector line
      ctx.beginPath();
      coords.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Active scrub crosshair + glowing marker dot
      const target = coords[activeIdx];
      if (target) {
        ctx.strokeStyle = "rgba(248, 245, 240, 0.24)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(target.x, 0);
        ctx.lineTo(target.x, height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#f8f5f0";
        ctx.beginPath();
        ctx.arc(target.x, target.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(container);
    return () => ro.disconnect();
  }, [safeSeries, activeIdx, accentColor]);

  return (
    <div
      className={`rounded-2xl border border-white/12 p-5 space-y-4 ${className}`}
      style={{ backgroundColor }}
    >
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#9c978f]">
            {label}
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold text-[#f8f5f0] tabular-nums">
            {currentVal}
            <span className="ml-1 text-xs font-normal text-[#9c978f]">{unit}</span>
          </div>
        </div>
        <span
          className="rounded-full border border-white/12 px-2.5 py-0.5 font-mono text-[11px]"
          style={{ color: deltaPct >= 0 ? "#34d399" : accentColor }}
        >
          {deltaPct >= 0 ? `+${deltaPct}%` : `${deltaPct}%`}
        </span>
      </div>

      <div
        ref={containerRef}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          setHoverIdx(Math.round(ratio * (safeSeries.length - 1)));
        }}
        onPointerLeave={() => setHoverIdx(null)}
        className="h-24 w-full cursor-crosshair"
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
    </div>
  );
}
