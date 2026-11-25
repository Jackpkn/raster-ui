"use client";

import { useEffect, useRef } from "react";

export interface ZeroTrustFirewallProps {
  /** Shield barrier and blocked threat spark color. */
  accentColor?: string;
  /** Verified pass-through request color. */
  allowColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Packet flow speed multiplier. */
  speed?: number;
  /** Pause packet traffic. */
  paused?: boolean;
  className?: string;
}

/**
 * Zero-Trust Edge Firewall & Packet Deflection Visualizer.
 * Streams mixed traffic toward a vertical inspection shield: authorized requests pass
 * cleanly to the right while blocked probes spark and deflect off the barrier.
 */
export function ZeroTrustFirewall({
  accentColor = "#f27c63",
  allowColor = "#34d399",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: ZeroTrustFirewallProps) {
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

    const packets = Array.from({ length: 20 }, (_, i) => ({
      offset: (i * 0.413) % 1,
      laneY: 0.16 + ((i * 29) % 68) / 100,
      blocked: i % 3 === 0,
      deflectDir: i % 2 === 0 ? -1 : 1,
      rate: 0.78 + (i % 4) * 0.1,
    }));

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
      const t = paused || prefersReduced ? 1.6 : Math.max(0, timeSec) * 0.36 * speed;
      ctx.clearRect(0, 0, width, height);

      const wallX = width * 0.52;

      // Subtle shield aura field
      const aura = ctx.createLinearGradient(wallX - 28, 0, wallX + 28, 0);
      aura.addColorStop(0, "rgba(255,255,255,0)");
      aura.addColorStop(0.5, `${accentColor}24`);
      aura.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = aura;
      ctx.fillRect(wallX - 28, 12, 56, height - 24);

      // Vertical segmented inspection barrier
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([12, 6]);
      ctx.beginPath();
      ctx.moveTo(wallX, 16);
      ctx.lineTo(wallX, height - 16);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw incoming traffic, pass-through beams, and deflected threat sparks
      for (const p of packets) {
        const u = (t * p.rate + p.offset) % 1;
        const y0 = height * p.laneY;

        if (u < 0.52) {
          // Approaching shield from left
          const k = u / 0.52;
          const x = width * 0.04 + (wallX - 6 - width * 0.04) * k;
          const color = p.blocked ? accentColor : "rgba(248, 245, 240, 0.72)";
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(Math.max(width * 0.04, x - 14), y0);
          ctx.lineTo(x, y0);
          ctx.stroke();
          ctx.globalAlpha = 1;

          ctx.fillStyle = p.blocked ? accentColor : "#f8f5f0";
          ctx.beginPath();
          ctx.arc(x, y0, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.blocked) {
          // Deflect back & fade with shield impact ring
          const k = (u - 0.52) / 0.48;
          const alpha = Math.max(0, 1 - k * 1.4);
          if (alpha > 0.02) {
            const dx = wallX - 6 - k * 36;
            const dy = y0 + p.deflectDir * k * 28;
            ctx.strokeStyle = accentColor;
            ctx.globalAlpha = alpha * 0.7;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(wallX - 3, y0, 3 + k * 14, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = accentColor;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        } else {
          // Verified request gliding cleanly past shield
          const k = (u - 0.52) / 0.48;
          const x = wallX + 6 + (width * 0.96 - (wallX + 6)) * k;
          const tail = Math.max(wallX + 6, x - 24);

          const grad = ctx.createLinearGradient(tail, y0, x, y0);
          grad.addColorStop(0, "rgba(52, 211, 153, 0)");
          grad.addColorStop(1, allowColor);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(tail, y0);
          ctx.lineTo(x, y0);
          ctx.stroke();

          ctx.fillStyle = "#f8f5f0";
          ctx.beginPath();
          ctx.arc(x, y0, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Shield status label
      ctx.fillStyle = "rgba(248, 245, 240, 0.55)";
      ctx.font = "600 9px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillText("WAF", wallX, 11);
    };

    resize();
    draw(1.6);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.6 : (performance.now() - startMs) / 1000);
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
  }, [accentColor, allowColor, speed, paused]);

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
