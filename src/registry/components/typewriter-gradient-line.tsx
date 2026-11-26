"use client";

import { useEffect, useState } from "react";

export interface TypewriterGradientLineProps {
  /** Sequence of hero statements typed and erased smoothly. */
  phrases?: string[];
  /** Gradient accent and glowing vertical cursor color. */
  accentColor?: string;
  /** Typing cadence speed multiplier. */
  speed?: number;
  /** Pause typewriter cycling. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_PHRASES = [
  "Zero external dependencies.",
  "Copy one single TSX file.",
  "Built for dark interfaces.",
];

/**
 * Metallic Gradient Hero Typewriter Headline.
 * Smoothly types and deletes concise product statements with a glowing vertical caret
 * and reduced-motion static fallback.
 */
export function TypewriterGradientLine({
  phrases = DEFAULT_PHRASES,
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: TypewriterGradientLineProps) {
  const safePhrases = phrases.length > 0 ? phrases : DEFAULT_PHRASES;
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charCount, setCharCount] = useState(safePhrases[0]!.length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) {
      setCharCount(safePhrases[phraseIdx]?.length ?? 0);
      return;
    }

    const full = safePhrases[phraseIdx] ?? "";
    const stepMs = deleting
      ? Math.max(24, Math.round(42 / Math.max(0.4, speed)))
      : charCount >= full.length
        ? Math.max(700, Math.round(1500 / Math.max(0.4, speed)))
        : Math.max(35, Math.round(72 / Math.max(0.4, speed)));

    const timer = window.setTimeout(() => {
      if (!deleting) {
        if (charCount < full.length) {
          setCharCount((c) => c + 1);
        } else {
          setDeleting(true);
        }
      } else if (charCount > 0) {
        setCharCount((c) => c - 1);
      } else {
        setDeleting(false);
        setPhraseIdx((i) => (i + 1) % safePhrases.length);
      }
    }, stepMs);

    return () => window.clearTimeout(timer);
  }, [safePhrases, phraseIdx, charCount, deleting, speed, paused]);

  const displayed = (safePhrases[phraseIdx] ?? "").slice(0, charCount);

  return (
    <div className={`inline-flex items-center font-semibold tracking-[-0.03em] ${className}`}>
      <span
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(95deg, #f8f5f0 18%, ${accentColor} 95%)`,
        }}
      >
        {displayed || "\u00A0"}
      </span>
      <span
        aria-hidden="true"
        className="ml-1 inline-block h-[1em] w-[2.5px] rounded-full"
        style={{
          backgroundColor: accentColor,
          boxShadow: `0 0 12px ${accentColor}`,
        }}
      />
    </div>
  );
}
