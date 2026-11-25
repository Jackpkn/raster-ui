"use client";

import { useEffect, useState } from "react";

export interface AttentionHeatmapMatrixProps {
  /** Token axis labels (up to 6 compact tokens). */
  tokens?: string[];
  /** Peak attention weight highlight accent color. */
  accentColor?: string;
  /** Active head scan speed multiplier. */
  speed?: number;
  /** Pause active row sweep. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_TOKENS = ["SYS", "CTX", "DOC", "RAG", "KEY", "OUT"];

const WEIGHTS: number[][] = [
  [0.92, 0.34, 0.14, 0.12, 0.18, 0.1],
  [0.44, 0.88, 0.62, 0.25, 0.16, 0.14],
  [0.18, 0.56, 0.94, 0.78, 0.32, 0.2],
  [0.12, 0.28, 0.82, 0.96, 0.64, 0.38],
  [0.15, 0.2, 0.36, 0.71, 0.91, 0.68],
  [0.24, 0.35, 0.52, 0.86, 0.74, 0.95],
];

/**
 * Interactive Transformer Self-Attention Weight Matrix.
 * Scans across query/key token pairs automatically and lets users hover any cell
 * to inspect exact normalized attention scores with zero external dependencies.
 */
export function AttentionHeatmapMatrix({
  tokens = DEFAULT_TOKENS,
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: AttentionHeatmapMatrixProps) {
  const safeTokens = tokens.length >= 4 ? tokens.slice(0, 6) : DEFAULT_TOKENS;
  const n = safeTokens.length;
  const [scanRow, setScanRow] = useState(3);
  const [hovered, setHovered] = useState<{ r: number; c: number } | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;

    const ms = Math.max(550, Math.round(1350 / Math.max(0.4, speed)));
    const id = window.setInterval(() => {
      setScanRow((r) => (r + 1) % n);
    }, ms);
    return () => window.clearInterval(id);
  }, [n, speed, paused]);

  const activeR = hovered ? hovered.r : scanRow;
  const activeC = hovered ? hovered.c : Math.min(n - 1, (scanRow + 1) % n);
  const activeScore = WEIGHTS[activeR % 6]?.[activeC % 6] ?? 0.5;

  return (
    <div
      className={`inline-flex flex-col gap-2.5 rounded-2xl border border-white/12 bg-[#08080c] p-3.5 font-mono ${className}`}
    >
      <div className="flex items-center justify-between gap-4 text-[10px]">
        <span className="text-[#9c978f]">
          Q:{safeTokens[activeR]} -&gt; K:{safeTokens[activeC]}
        </span>
        <span className="tabular-nums font-semibold" style={{ color: accentColor }}>
          α = {activeScore.toFixed(2)}
        </span>
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: `28px repeat(${n}, 1fr)` }}>
        <div />
        {safeTokens.map((tok, cIdx) => (
          <div
            key={`col-${tok}-${cIdx}`}
            className="text-center text-[8.5px]"
            style={{ color: cIdx === activeC ? "#f8f5f0" : "#78746c" }}
          >
            {tok}
          </div>
        ))}

        {safeTokens.map((tok, rIdx) => (
          <div key={`row-${tok}-${rIdx}`} className="contents">
            <div
              className="flex items-center text-[8.5px]"
              style={{ color: rIdx === activeR ? "#f8f5f0" : "#78746c" }}
            >
              {tok}
            </div>
            {safeTokens.map((_, cIdx) => {
              const score = WEIGHTS[rIdx % 6]?.[cIdx % 6] ?? 0.2;
              const isFocus = rIdx === activeR && cIdx === activeC;
              const isRowActive = rIdx === activeR;
              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  type="button"
                  onPointerEnter={() => setHovered({ r: rIdx, c: cIdx })}
                  onPointerLeave={() => setHovered(null)}
                  aria-label={`${safeTokens[rIdx]} to ${safeTokens[cIdx]} score ${score.toFixed(2)}`}
                  className="h-5 w-7 rounded-[4px] border transition-transform duration-150 cursor-crosshair"
                  style={{
                    backgroundColor:
                      score > 0.62 || isRowActive
                        ? accentColor
                        : "rgba(248, 245, 240, 0.85)",
                    opacity: Math.max(0.08, score * (isRowActive ? 0.95 : 0.48)),
                    borderColor: isFocus ? "#f8f5f0" : "transparent",
                    transform: isFocus ? "scale(1.08)" : "scale(1)",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
