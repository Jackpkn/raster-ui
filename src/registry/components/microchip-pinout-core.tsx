"use client";

import { useEffect, useRef } from "react";

export interface MicrochipPinoutCoreProps {
  /** Center processor label etched onto the die. */
  chipLabel?: string;
  /** Active signal pin and packet accent color. */
  accentColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Signal pulse speed multiplier. */
  speed?: number;
  /** Pause radiating pinout pulses. */
  paused?: boolean;
  className?: string;
}

/**
 * Architectural QFN Microprocessor Package & Radiating Pinout Core.
 * Draws a precision central silicon die with perimeter metallic leads,
 * pin-1 registration dot, and live pulses radiating outward to PCB pads.
 */
export function MicrochipPinoutCore({
  chipLabel = "R-01",
  accentColor = "#f27c63",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: MicrochipPinoutCoreProps) {
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
      const t = paused || prefersReduced ? 0.6 : timeSec * 0.75 * speed;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const dieSize = Math.min(width, height) * 0.42;
      const half = dieSize / 2;
      const pinsPerSide = 6;
      const leadLen = Math.min(width, height) * 0.24;

      const drawPin = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        index: number
      ) => {
        // Static PCB trace lead
        ctx.strokeStyle = "rgba(248, 245, 240, 0.18)";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Outer solder pad
        ctx.fillStyle = "rgba(248, 245, 240, 0.25)";
        ctx.beginPath();
        ctx.arc(x2, y2, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing data packet radiating from selected active pins
        const cycle = (t + index * 0.27) % 1.8;
        if (cycle < 1) {
          const px = x1 + (x2 - x1) * cycle;
          const py = y1 + (y2 - y1) * cycle;
          const tx = x1 + (x2 - x1) * Math.max(0, cycle - 0.28);
          const ty = y1 + (y2 - y1) * Math.max(0, cycle - 0.28);

          const grad = ctx.createLinearGradient(tx, ty, px, py);
          grad.addColorStop(0, "rgba(255,255,255,0)");
          grad.addColorStop(1, accentColor);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(px, py);
          ctx.stroke();

          ctx.fillStyle = "#f8f5f0";
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Top, Bottom, Left, Right pins
      for (let i = 0; i < pinsPerSide; i++) {
        const offset = -half * 0.72 + (i / (pinsPerSide - 1)) * (dieSize * 0.72);
        // Top
        drawPin(cx + offset, cy - half, cx + offset, cy - half - leadLen, i);
        // Bottom
        drawPin(cx + offset, cy + half, cx + offset, cy + half + leadLen, i + 6);
        // Left
        drawPin(cx - half, cy + offset, cx - half - leadLen * 1.25, cy + offset, i + 12);
        // Right
        drawPin(cx + half, cy + offset, cx + half + leadLen * 1.25, cy + offset, i + 18);
      }

      // Outer QFN package casing
      ctx.fillStyle = "#0c0c12";
      ctx.strokeStyle = "rgba(248, 245, 240, 0.28)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(cx - half, cy - half, dieSize, dieSize, 8);
      ctx.fill();
      ctx.stroke();

      // Inner etched silicon frame
      const inset = dieSize * 0.16;
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cx - half + inset, cy - half + inset, dieSize - inset * 2, dieSize - inset * 2, 4);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Pin-1 registration dot
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(cx - half + 9, cy - half + 9, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Laser-etched silicon die code
      ctx.fillStyle = "#f8f5f0";
      ctx.font = `600 ${Math.max(10, Math.round(dieSize * 0.19))}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(chipLabel, cx, cy + 1);
    };

    resize();
    draw(0.6);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 0.6 : (performance.now() - startMs) / 1000);
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
  }, [chipLabel, accentColor, speed, paused]);

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
