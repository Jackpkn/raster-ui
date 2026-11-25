"use client";

import { useEffect, useState } from "react";

export interface QuoteItem {
  quote: string;
  author: string;
  role: string;
  initials: string;
}

export interface SpotlightTestimonialCardProps {
  /** Builder testimonials rotated cleanly with clickable indicator pills. */
  quotes?: QuoteItem[];
  /** Quote mark and active indicator dot accent color. */
  accentColor?: string;
  /** Auto-rotate cadence multiplier. */
  speed?: number;
  /** Pause automatic rotation. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_QUOTES: QuoteItem[] = [
  {
    quote: "Replaced 190 KB of animation packages with three copy-pasted Raster files in ten minutes.",
    author: "Elena Vance",
    role: "Design Engineer · Arcflow",
    initials: "EV",
  },
  {
    quote: "Our dark-mode launch page finally feels like hardware instead of a recycled SaaS template.",
    author: "Marcus Chen",
    role: "Staff Frontend · Lattice",
    initials: "MC",
  },
  {
    quote: "Zero WebGL crashes on low-power laptops and silky 60 FPS across every scroll section.",
    author: "Priya Nair",
    role: "Founder · Signalworks",
    initials: "PN",
  },
];

/**
 * Editorial Obsidian Social-Proof Testimonial Switcher Card.
 * Cycles crisp customer quotes with serif punctuation, avatar monogram, and clickable progress dots.
 */
export function SpotlightTestimonialCard({
  quotes = DEFAULT_QUOTES,
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: SpotlightTestimonialCardProps) {
  const safeQuotes = quotes.length > 0 ? quotes : DEFAULT_QUOTES;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused || safeQuotes.length <= 1) return;

    const ms = Math.max(1600, Math.round(3800 / Math.max(0.4, speed)));
    const id = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % safeQuotes.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [safeQuotes.length, speed, paused]);

  const current = safeQuotes[idx] ?? safeQuotes[0]!;

  return (
    <div
      className={`w-full max-w-md rounded-2xl border border-white/14 bg-[#09090e] p-4 space-y-3 ${className}`}
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden="true"
          className="font-serif text-3xl leading-none select-none"
          style={{ color: accentColor }}
        >
          &ldquo;
        </span>
        <p className="text-xs leading-relaxed text-[#f8f5f0]">{current.quote}</p>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/8 pt-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] font-mono text-[10px] font-semibold"
            style={{ color: accentColor }}
          >
            {current.initials}
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#f8f5f0]">{current.author}</div>
            <div className="font-mono text-[9.5px] text-[#8d8880]">{current.role}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {safeQuotes.map((q, i) => {
            const active = i === idx;
            return (
              <button
                key={q.author}
                type="button"
                aria-label={`Read quote by ${q.author}`}
                onClick={() => setIdx(i)}
                className="h-1.5 rounded-full transition-all duration-250 cursor-pointer"
                style={{
                  width: active ? "16px" : "6px",
                  backgroundColor: active ? accentColor : "rgba(248, 245, 240, 0.22)",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
