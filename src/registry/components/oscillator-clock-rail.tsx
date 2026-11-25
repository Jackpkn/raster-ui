"use client";

import { useEffect, useRef } from "react";

export interface OscillatorClockRailProps {
  /** Primary CLK trigger and rising-edge highlight color. */
  accentColor?: string;
  /** Secondary signal rail trace color. */
  railColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Timing sweep speed multiplier. */
  speed?: number;
  /** Pause digital wave scroll. */
  paused?: boolean;
  className?: string;
}

const CHANNELS = [
  { name: "CLK", pattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], accent: true },
  { name: "BUS", pattern: [0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1], accent: false },
  { name: "SYN", pattern: [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0], accent: false },
  { name: "ACK", pattern: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], accent: true },
];

/**
 * 4-Channel Hardware Logic Analyzer & Digital Clock Timing Rail.
 * Streams crisp square-wave digital telemetry (CLK, BUS, SYN, ACK) across a calibrated timebase grid.
 */
export function OscillatorClockRail({
  accentColor = "#f27c63",
  railColor = "#e7e2da",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: OscillatorClockRailProps) {
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
      const t = paused || prefersReduced ? 1.2 : timeSec * 1.45 * speed;
      ctx.clearRect(0, 0, width, height);

      const labelW = 46;
      const plotX = labelW + 8;
      const plotW = Math.max(80, width - plotX - 14);
      const stepPx = Math.max(18, Math.round(plotW / 14));
      const rowH = (height - 24) / CHANNELS.length;

      // Vertical timing division hairlines
      ctx.strokeStyle = "rgba(248, 245, 240, 0.06)";
      ctx.lineWidth = 1;
      const gridShift = (t * stepPx) % stepPx;
      for (let x = plotX + stepPx - gridShift; x < width - 10; x += stepPx) {
        ctx.beginPath();
        ctx.moveTo(x, 12);
        ctx.lineTo(x, height - 12);
        ctx.stroke();
      }

      // Draw each digital square-wave channel
      CHANNELS.forEach((ch, rIdx) => {
        const topY = 16 + rIdx * rowH;
        const highY = topY + rowH * 0.22;
        const lowY = topY + rowH * 0.74;

        // Channel label
        ctx.fillStyle = ch.accent ? accentColor : "rgba(248, 245, 240, 0.52)";
        ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(ch.name, 14, (highY + lowY) / 2);

        // Baseline separator
        ctx.strokeStyle = "rgba(248, 245, 240, 0.05)";
        ctx.beginPath();
        ctx.moveTo(plotX, lowY + 4);
        ctx.lineTo(width - 14, lowY + 4);
        ctx.stroke();

        // Square wave polyline
        const pat = ch.pattern;
        const patLen = pat.length;
        const totalSteps = Math.ceil(plotW / stepPx) + 2;
        const phaseInt = Math.floor(t);
        const phaseFrac = t - phaseInt;

        ctx.save();
        ctx.beginPath();
        ctx.rect(plotX, topY, plotW, rowH);
        ctx.clip();

        ctx.strokeStyle = ch.accent ? accentColor : railColor;
        ctx.globalAlpha = ch.accent ? 0.92 : 0.62;
        ctx.lineWidth = ch.accent ? 1.6 : 1.25;
        ctx.beginPath();

        let prevY = lowY;
        for (let s = 0; s <= totalSteps; s++) {
          const bit = pat[(s + phaseInt) % patLen] ?? 0;
          const x = plotX + (s - phaseFrac) * stepPx;
          const y = bit ? highY : lowY;

          if (s === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, prevY);
            ctx.lineTo(x, y);
          }
          prevY = y;
        }
        ctx.stroke();
        ctx.restore();
      });

      // Vertical live trigger cursor line
      const trigX = plotX + plotW * 0.68;
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.55;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(trigX, 10);
      ctx.lineTo(trigX, height - 10);
      ctx.stroke();
      ctx.setLineDash([]);
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
  }, [accentColor, railColor, speed, paused]);

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
