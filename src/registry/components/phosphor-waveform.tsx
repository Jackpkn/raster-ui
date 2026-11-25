"use client";

import { useEffect, useRef } from "react";

export interface PhosphorWaveformProps {
  /** Primary oscilloscope trace color. */
  accentColor?: string;
  /** Secondary harmonic trace color. */
  secondaryColor?: string;
  /** Background surface color. */
  backgroundColor?: string;
  /** Wave modulation speed multiplier. */
  speed?: number;
  /** Show faint calibration gridlines. */
  showGrid?: boolean;
  /** Pause waveform motion. */
  paused?: boolean;
  className?: string;
}

/**
 * Dual-Trace Phosphor Oscilloscope & Voice AI Waveform.
 * Ideal for voice agents, real-time streaming indicators, and telemetry headers.
 */
export function PhosphorWaveform({
  accentColor = "#f27c63",
  secondaryColor = "#e7e2da",
  backgroundColor = "#060609",
  speed = 1,
  showGrid = true,
  paused = false,
  className = "",
}: PhosphorWaveformProps) {
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
      width = Math.max(140, Math.floor(rect.width));
      height = Math.max(100, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (timeSec: number) => {
      const t = timeSec * 1.6 * speed;
      ctx.clearRect(0, 0, width, height);

      if (showGrid) {
        ctx.strokeStyle = "rgba(255, 250, 245, 0.06)";
        ctx.lineWidth = 1;
        const cols = 8;
        const rows = 4;
        for (let i = 1; i < cols; i++) {
          const x = (width / cols) * i;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let j = 1; j < rows; j++) {
          const y = (height / rows) * j;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      const midY = height / 2;
      const amp = height * 0.28;

      const drawTrace = (
        freqA: number,
        freqB: number,
        phaseShift: number,
        stroke: string,
        lineWidth: number,
        alpha: number
      ) => {
        ctx.save();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        const steps = Math.max(80, Math.floor(width / 3));
        for (let i = 0; i <= steps; i++) {
          const u = i / steps;
          const x = u * width;
          // Smooth Hann window envelope so edges rest quietly at zero
          const env = Math.sin(Math.PI * u);
          const windowAmp = env * env;
          const y =
            midY +
            (Math.sin(u * Math.PI * freqA - t + phaseShift) * 0.58 +
              Math.sin(u * Math.PI * freqB + t * 1.45 - phaseShift) * 0.28 +
              Math.cos(u * Math.PI * (freqA + freqB) * 0.5 - t * 0.7) * 0.14) *
              amp *
              windowAmp;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      };

      // Soft harmonic ghost traces
      drawTrace(4.5, 9.0, 0.9, secondaryColor, 1.1, 0.22);
      drawTrace(6.0, 11.5, 2.1, accentColor, 4.5, 0.14);
      drawTrace(5.2, 10.4, 0.4, secondaryColor, 1.35, 0.5);
      // Sharp primary trace
      drawTrace(6.0, 11.5, 2.1, accentColor, 1.8, 0.95);
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
  }, [accentColor, secondaryColor, speed, showGrid, paused]);

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
