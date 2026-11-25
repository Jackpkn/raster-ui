"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface TerminalScrambleTextProps {
  /** Target string revealed after glyph decoding finishes. */
  text?: string;
  /** Glyph pool displayed while characters decode. */
  glyphs?: string;
  /** Accent tint for currently decoding glyph slots. */
  accentColor?: string;
  /** Base resolved character color. */
  color?: string;
  /** Decode speed multiplier (0.4-2.5). */
  speed?: number;
  /** Replay scramble whenever hovered or clicked. */
  interactive?: boolean;
  className?: string;
}

/**
 * Kinetic Terminal Cipher Scramble Text.
 * Decodes characters left-to-right on mount and hover/click with zero layout shift and zero external deps.
 */
export function TerminalScrambleText({
  text = "ZERO-DEPENDENCY MOTION",
  glyphs = "01/\\#%*+=<>_",
  accentColor = "#f27c63",
  color = "#f8f5f0",
  speed = 1,
  interactive = true,
  className = "",
}: TerminalScrambleTextProps) {
  const [slots, setSlots] = useState<Array<{ ch: string; locked: boolean }>>(() =>
    Array.from(text).map((ch) => ({ ch, locked: true }))
  );
  const rafRef = useRef(0);

  const runDecode = useCallback(() => {
    window.cancelAnimationFrame(rafRef.current);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars = Array.from(text);
    if (reduced) {
      setSlots(chars.map((ch) => ({ ch, locked: true })));
      return;
    }

    const pool = glyphs.length > 0 ? glyphs : "01/#%*";
    const startMs = performance.now();
    const totalMs = Math.max(320, (chars.length * 42) / Math.max(0.4, speed));

    const step = (now: number) => {
      const progress = Math.min(1, (now - startMs) / totalMs);
      const lockedCount = Math.floor(progress * chars.length);

      setSlots(
        chars.map((target, i) => {
          if (target === " " || i < lockedCount) {
            return { ch: target, locked: true };
          }
          const idx = Math.floor((now * 0.04 + i * 7) % pool.length);
          return { ch: pool[idx]!, locked: false };
        })
      );

      if (progress < 1) {
        rafRef.current = window.requestAnimationFrame(step);
      } else {
        setSlots(chars.map((ch) => ({ ch, locked: true })));
      }
    };

    rafRef.current = window.requestAnimationFrame(step);
  }, [text, glyphs, speed]);

  useEffect(() => {
    runDecode();
    return () => window.cancelAnimationFrame(rafRef.current);
  }, [runDecode]);

  return (
    <span
      onPointerEnter={interactive ? runDecode : undefined}
      onClick={interactive ? runDecode : undefined}
      className={`inline-block font-mono tracking-[0.04em] ${
        interactive ? "cursor-pointer" : ""
      } ${className}`}
    >
      {slots.map((slot, idx) => (
        <span
          key={idx}
          style={{ color: slot.locked ? color : accentColor }}
        >
          {slot.ch === " " ? "\u00A0" : slot.ch}
        </span>
      ))}
    </span>
  );
}
