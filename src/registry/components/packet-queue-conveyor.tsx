"use client";

import { useEffect, useRef } from "react";

export interface PacketQueueConveyorProps {
  /** Verified processed packet accent color. */
  accentColor?: string;
  /** Rail track stroke color. */
  railColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Conveyor speed multiplier. */
  speed?: number;
  /** Pause streaming packets. */
  paused?: boolean;
  className?: string;
}

const LANE_LABELS = ["INGEST", "PARSE", "INDEX", "EMIT"];

/**
 * Multi-Lane Streaming Packet Queue Conveyor Canvas.
 * Discrete framed telemetry packets glide across four ingestion tracks and light up
 * in accent tone as they cross the central verification scanner beam.
 */
export function PacketQueueConveyor({
  accentColor = "#f27c63",
  railColor = "rgba(248, 245, 240, 0.14)",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: PacketQueueConveyorProps) {
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
      const t = paused || prefersReduced ? 1.3 : timeSec * 0.28 * speed;
      ctx.clearRect(0, 0, width, height);

      const leftPad = 60;
      const rightPad = 18;
      const trackW = Math.max(80, width - leftPad - rightPad);
      const scanX = leftPad + trackW * 0.56;
      const rowH = (height - 28) / LANE_LABELS.length;

      // Vertical central scanner line
      ctx.strokeStyle = accentColor;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(scanX, 12);
      ctx.lineTo(scanX, height - 12);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      LANE_LABELS.forEach((label, rowIdx) => {
        const cy = 14 + (rowIdx + 0.5) * rowH;

        // Lane label
        ctx.fillStyle = "rgba(248, 245, 240, 0.52)";
        ctx.font = "600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(label, 14, cy);

        // Track hairline
        ctx.strokeStyle = railColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(leftPad, cy);
        ctx.lineTo(width - rightPad, cy);
        ctx.stroke();

        // Streaming discrete framed data packets on this lane
        const packetCount = 4;
        const laneRate = 0.85 + rowIdx * 0.12;
        const pktW = 24;
        const pktH = Math.min(16, rowH * 0.48);

        for (let p = 0; p < packetCount; p++) {
          const u = (t * laneRate + p / packetCount + rowIdx * 0.14) % 1;
          const px = leftPad + u * (trackW - pktW);
          const verified = px + pktW / 2 >= scanX;

          ctx.fillStyle = verified ? "#141016" : "#0c0c12";
          ctx.strokeStyle = verified ? accentColor : "rgba(248, 245, 240, 0.25)";
          ctx.lineWidth = verified ? 1.25 : 1;
          ctx.beginPath();
          ctx.roundRect(px, cy - pktH / 2, pktW, pktH, 4);
          ctx.fill();
          ctx.stroke();

          // Tiny inner payload status dot
          ctx.fillStyle = verified ? accentColor : "rgba(248, 245, 240, 0.35)";
          ctx.beginPath();
          ctx.arc(px + 6, cy, 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Payload bars inside packet
          ctx.fillStyle = verified ? "rgba(248, 245, 240, 0.72)" : "rgba(248, 245, 240, 0.24)";
          ctx.fillRect(px + 11, cy - 1, 8, 2);
        }
      });
    };

    resize();
    draw(1.3);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.3 : (performance.now() - startMs) / 1000);
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
