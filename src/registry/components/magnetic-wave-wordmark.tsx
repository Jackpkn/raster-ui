"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface MagneticWaveWordmarkProps {
  /** Wordmark string rendered as oversized interactive letters. */
  text?: string;
  /** Letter color RGB array [R, G, B]. */
  letterRgb?: [number, number, number];
  /** Vertical lift amplitude in px on cursor hover. */
  liftPx?: number;
  /** Overlay horizontal CRT scanlines across the wordmark. */
  scanlines?: boolean;
  className?: string;
}

interface CharState {
  intensity: number;
  tilt: number;
}

/**
 * Interactive Architectural Wave Wordmark.
 * Sweeping the cursor across letters creates a Gaussian lift, directional tilt, and soft illumination.
 */
export function MagneticWaveWordmark({
  text = "raster",
  letterRgb = [248, 245, 240],
  liftPx = 18,
  scanlines = true,
  className = "",
}: MagneticWaveWordmarkProps) {
  const letters = Array.from(text);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const metricsRef = useRef<Array<{ centerX: number; width: number }>>([]);
  const [pointer, setPointer] = useState({ active: false, x: 0, y: 0 });
  const [states, setStates] = useState<CharState[]>(() =>
    letters.map(() => ({ intensity: 0, tilt: 0 }))
  );

  const measure = useCallback(() => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    metricsRef.current = letters.map((_, i) => {
      const el = letterRefs.current[i];
      if (!el) return { centerX: 0, width: 90 };
      const r = el.getBoundingClientRect();
      return { centerX: r.left - box.left + r.width / 2, width: r.width };
    });
  }, [letters.length]);

  useEffect(() => {
    setStates(letters.map(() => ({ intensity: 0, tilt: 0 })));
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [text, measure]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    if (metricsRef.current.length !== letters.length) measure();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    setPointer({ active: true, x, y });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStates(
      letters.map((_, i) => {
        const m = metricsRef.current[i];
        if (!m || m.width <= 0) return { intensity: 0, tilt: 0 };
        const dx = x - m.centerX;
        const radius = Math.max(m.width * 1.9, 130);
        const sigma = radius * 0.52;
        const intensity = Math.exp(-(dx * dx) / (2 * sigma * sigma));
        const tilt = reduced ? 0 : Math.max(-1, Math.min(1, dx / radius)) * 4.5 * intensity;
        return { intensity, tilt };
      })
    );
  };

  const [r, g, b] = letterRgb;

  return (
    <div
      ref={containerRef}
      onPointerEnter={measure}
      onPointerMove={handleMove}
      onPointerLeave={() => {
        setPointer((p) => ({ ...p, active: false }));
        setStates(letters.map(() => ({ intensity: 0, tilt: 0 })));
      }}
      className={`relative select-none overflow-hidden py-8 text-center leading-[0.88] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pointer.active ? 1 : 0,
          background: `radial-gradient(240px circle at ${pointer.x}px ${pointer.y}px, rgba(${r},${g},${b},0.09), transparent 72%)`,
        }}
      />

      {scanlines && (
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(6,6,9,0.52) 2px, rgba(6,6,9,0.52) 4px)",
          }}
        />
      )}

      <div className="relative z-10 inline-flex items-baseline justify-center">
        {letters.map((ch, idx) => {
          const st = states[idx] ?? { intensity: 0, tilt: 0 };
          const alpha = 0.16 + st.intensity * 0.8;
          return (
            <span
              key={`${ch}-${idx}`}
              ref={(el) => {
                letterRefs.current[idx] = el;
              }}
              className="inline-block cursor-default px-[0.015em] text-[clamp(3.6rem,11vw,9.5rem)] font-bold tracking-[-0.055em] will-change-transform"
              style={{
                color: `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`,
                transform: `translate3d(0, ${(-st.intensity * liftPx).toFixed(2)}px, 0) scale(${(
                  1 +
                  st.intensity * 0.06
                ).toFixed(3)}) rotate(${st.tilt.toFixed(2)}deg)`,
                transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), color 180ms ease",
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          );
        })}
      </div>
    </div>
  );
}
