"use client";

import { useEffect, useRef } from "react";

export interface EncryptionCipherVaultProps {
  /** Active cipher lock arc and verification indicator color. */
  accentColor?: string;
  /** Secondary engraved ring color. */
  ringColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Tumbler rotation speed multiplier. */
  speed?: number;
  /** Pause cipher ring rotation. */
  paused?: boolean;
  className?: string;
}

const HEX_CHARS = "0123456789ABCDEF";

/**
 * Cryptographic Concentric Cipher Vault & Tumbler Reticle.
 * Renders counter-rotating calibrated key rings, hex hash indices, and a central
 * hardware security enclave core on pure Canvas2D.
 */
export function EncryptionCipherVault({
  accentColor = "#f27c63",
  ringColor = "rgba(248, 245, 240, 0.2)",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: EncryptionCipherVaultProps) {
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
      const t = paused || prefersReduced ? 1.5 : Math.max(0, timeSec) * 0.65 * speed;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const rOuter = Math.min(width, height) * 0.42;
      const rMid = rOuter * 0.72;
      const rInner = rOuter * 0.44;

      // Outer calibrated tick ring rotating clockwise
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.35);
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        const major = i % 3 === 0;
        const inner = rOuter - (major ? 8 : 4);
        ctx.strokeStyle = major ? "rgba(248, 245, 240, 0.35)" : ringColor;
        ctx.lineWidth = major ? 1.2 : 0.8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
        ctx.lineTo(Math.cos(a) * rOuter, Math.sin(a) * rOuter);
        ctx.stroke();
      }
      ctx.restore();

      // Middle hex cipher ring rotating counter-clockwise
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.48);
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, rMid, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Active accent cipher lock segments
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, rMid, -0.4, 0.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, rMid, Math.PI - 0.3, Math.PI + 0.65);
      ctx.stroke();

      ctx.font = "600 8.5px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const hexShift = Math.floor(t * 2);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const ch = HEX_CHARS[(i * 3 + hexShift) & 15]!;
        ctx.fillStyle = i % 4 === 0 ? accentColor : "rgba(248, 245, 240, 0.45)";
        ctx.fillText(ch, Math.cos(a) * (rMid - 11), Math.sin(a) * (rMid - 11));
      }
      ctx.restore();

      // Central enclave lock core
      ctx.fillStyle = "#0b0b11";
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, rInner * 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Minimal geometric padlock glyph
      const lw = 12;
      const lh = 9;
      ctx.strokeStyle = "#f8f5f0";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy - 3.5, 4, Math.PI, 0);
      ctx.stroke();
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.roundRect(cx - lw / 2, cy - 3.5, lw, lh, 2);
      ctx.fill();
      ctx.fillStyle = "#060609";
      ctx.beginPath();
      ctx.arc(cx, cy + 1, 1.4, 0, Math.PI * 2);
      ctx.fill();
    };

    resize();
    draw(1.5);

    const ro = new ResizeObserver(() => {
      resize();
      draw(paused || prefersReduced ? 1.5 : (performance.now() - startMs) / 1000);
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
  }, [accentColor, ringColor, speed, paused]);

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
