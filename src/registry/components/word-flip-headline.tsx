"use client";

import { useEffect, useState } from "react";

export interface WordFlipHeadlineProps {
  /** Static leading hero phrase. */
  prefix?: string;
  /** Words rotated smoothly with vertical blur-in entrance. */
  words?: string[];
  /** Accent highlight for the active rotating word. */
  accentColor?: string;
  /** Word rotation speed multiplier. */
  speed?: number;
  /** Pause word rotation. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_WORDS = ["effortless", "razor-sharp", "weightless", "unforgettable"];

/**
 * Kinetic Hero Rotating Flip-Word Headline.
 * Smoothly transitions hero value-proposition adjectives with pure CSS vertical blur motion.
 */
export function WordFlipHeadline({
  prefix = "Build websites that feel",
  words = DEFAULT_WORDS,
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: WordFlipHeadlineProps) {
  const safeWords = words.length > 0 ? words : DEFAULT_WORDS;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused || safeWords.length <= 1) return;

    const ms = Math.max(950, Math.round(2200 / Math.max(0.4, speed)));
    const id = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % safeWords.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [safeWords.length, speed, paused]);

  const current = safeWords[idx] ?? safeWords[0]!;

  return (
    <div className={`inline-flex flex-wrap items-baseline justify-center gap-x-2.5 gap-y-1 font-semibold tracking-[-0.03em] text-[#f8f5f0] ${className}`}>
      <style>{`
        @keyframes raster-word-flip {
          0% { opacity: 0; transform: translateY(10px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .raster-flip-word { animation: none !important; }
        }
      `}</style>

      <span>{prefix}</span>
      <span
        key={`${current}-${idx}`}
        className="raster-flip-word inline-block border-b-2 pb-0.5"
        style={{
          color: accentColor,
          borderColor: `${accentColor}66`,
          animation: paused ? "none" : "raster-word-flip 360ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {current}
      </span>
    </div>
  );
}
