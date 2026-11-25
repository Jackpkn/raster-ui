"use client";

import { useEffect, useRef } from "react";

export interface NeuralLayerGraphProps {
  /** Active synaptic pulse and firing neuron accent color. */
  accentColor?: string;
  /** Static synapse edge stroke color. */
  synapseColor?: string;
  /** Background obsidian color. */
  backgroundColor?: string;
  /** Forward-pass propagation speed multiplier. */
  speed?: number;
  /** Pause synaptic propagation. */
  paused?: boolean;
  className?: string;
}

const LAYER_SIZES = [4, 6, 6, 3];

/**
 * Multi-Layer Neural Network Forward-Pass Visualizer.
 * Projects a 4-layer fully-connected architecture on Canvas2D with luminous weighted
 * synaptic pulses cascading cleanly left-to-right across obsidian.
 */
export function NeuralLayerGraph({
  accentColor = "#f27c63",
  synapseColor = "rgba(248, 245, 240, 0.11)",
  backgroundColor = "#060609",
  speed = 1,
  paused = false,
  className = "",
}: NeuralLayerGraphProps) {
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
      const t = paused || prefersReduced ? 1.4 : timeSec * 0.75 * speed;
      ctx.clearRect(0, 0, width, height);

      const padX = width * 0.14;
      const padY = height * 0.16;
      const layerGap = (width - padX * 2) / (LAYER_SIZES.length - 1);

      const layers: Array<Array<{ x: number; y: number; energy: number }>> = LAYER_SIZES.map(
        (count, lIdx) => {
          const lx = padX + lIdx * layerGap;
          const spanY = height - padY * 2;
          return Array.from({ length: count }, (_, nIdx) => {
            const ly = count === 1 ? height / 2 : padY + (nIdx / (count - 1)) * spanY;
            const wave = 0.5 + 0.5 * Math.sin(t * 2.3 - lIdx * 1.15 + nIdx * 0.9);
            return { x: lx, y: ly, energy: wave };
          });
        }
      );

      // Draw static synapses + propagating forward-pass pulses
      for (let l = 0; l < layers.length - 1; l++) {
        const fromLayer = layers[l]!;
        const toLayer = layers[l + 1]!;

        fromLayer.forEach((src, sIdx) => {
          toLayer.forEach((dst, dIdx) => {
            ctx.strokeStyle = synapseColor;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(src.x, src.y);
            ctx.lineTo(dst.x, dst.y);
            ctx.stroke();

            // Select sparse active pathways to keep visual calm and legible
            if ((sIdx + dIdx + l) % 3 !== 0) return;
            const cycle = (t * 0.72 - l * 0.34 + (sIdx * 0.17 + dIdx * 0.13)) % 1.4;
            if (cycle < 0 || cycle > 1) return;

            const px = src.x + (dst.x - src.x) * cycle;
            const py = src.y + (dst.y - src.y) * cycle;
            const tx = src.x + (dst.x - src.x) * Math.max(0, cycle - 0.22);
            const ty = src.y + (dst.y - src.y) * Math.max(0, cycle - 0.22);

            const grad = ctx.createLinearGradient(tx, ty, px, py);
            grad.addColorStop(0, "rgba(255,255,255,0)");
            grad.addColorStop(1, accentColor);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.65;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(px, py);
            ctx.stroke();

            ctx.fillStyle = "#f8f5f0";
            ctx.beginPath();
            ctx.arc(px, py, 1.7, 0, Math.PI * 2);
            ctx.fill();
          });
        });
      }

      // Draw neuron nodes
      layers.forEach((layer) => {
        layer.forEach((node) => {
          const hot = node.energy > 0.76;
          ctx.fillStyle = "#0b0b11";
          ctx.strokeStyle = hot ? accentColor : "rgba(248, 245, 240, 0.3)";
          ctx.lineWidth = hot ? 1.5 : 1;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = hot ? accentColor : "rgba(248, 245, 240, 0.5)";
          ctx.beginPath();
          ctx.arc(node.x, node.y, hot ? 2.1 : 1.4, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    };

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
    };
  }, [accentColor, synapseColor, speed, paused]);

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
