"use client";

import { useEffect, useState } from "react";

export interface TokenStreamComposerProps {
  /** Model badge label in header. */
  modelLabel?: string;
  /** Prompt / response text streamed word by word. */
  streamText?: string;
  /** Caret and live status accent color. */
  accentColor?: string;
  /** Streaming cadence speed multiplier. */
  speed?: number;
  /** Pause token streaming. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_TEXT =
  "Synthesizing zero-dependency canvas shaders with 4x4 Bayer dithering, intersection observers, and strict reduced-motion fallbacks across 58 reusable components.";

/**
 * Live Streaming LLM Token Output Card.
 * Streams prose chunk-by-chunk with an active hardware caret, live throughput counter,
 * and clean dark surface chrome using zero external libraries.
 */
export function TokenStreamComposer({
  modelLabel = "raster-reason-v2",
  streamText = DEFAULT_TEXT,
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: TokenStreamComposerProps) {
  const tokens = streamText.split(/\s+/).filter(Boolean);
  const [count, setCount] = useState(Math.min(6, tokens.length));

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) {
      setCount(tokens.length);
      return;
    }

    const ms = Math.max(70, Math.round(180 / Math.max(0.4, speed)));
    let holdTicks = 0;
    const id = window.setInterval(() => {
      setCount((prev) => {
        if (prev >= tokens.length) {
          holdTicks += 1;
          if (holdTicks >= 10) {
            holdTicks = 0;
            return 2;
          }
          return prev;
        }
        return prev + 1;
      });
    }, ms);

    return () => window.clearInterval(id);
  }, [tokens.length, speed, paused]);

  const visibleText = tokens.slice(0, count).join(" ");
  const isDone = count >= tokens.length;
  const tokPerSec = Math.round(64 * Math.max(0.5, speed) + (count % 9));

  return (
    <div
      className={`w-full rounded-2xl border border-white/12 bg-[#08080c] overflow-hidden ${className}`}
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2 font-mono text-[10.5px]">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: isDone ? "#34d399" : accentColor }}
            aria-hidden="true"
          />
          <span className="text-[#e7e2da]">{modelLabel}</span>
        </div>
        <span className="tabular-nums text-[#8d8880]">
          {count}/{tokens.length} tok · {tokPerSec} t/s
        </span>
      </div>

      <div className="min-h-[96px] p-4 text-xs leading-relaxed text-[#e7e2da]">
        <span>{visibleText}</span>
        {!isDone && !paused && (
          <span
            aria-hidden="true"
            className="ml-1 inline-block h-3.5 w-1.5 align-middle"
            style={{ backgroundColor: accentColor }}
          />
        )}
      </div>
    </div>
  );
}
