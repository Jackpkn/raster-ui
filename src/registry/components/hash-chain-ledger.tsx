"use client";

import { useEffect, useState } from "react";

export interface HashChainLedgerProps {
  /** Sealed active block highlight accent color. */
  accentColor?: string;
  /** Seal cadence speed multiplier. */
  speed?: number;
  /** Pause block sealing cycle. */
  paused?: boolean;
  className?: string;
}

const BLOCKS = [
  { id: "#9401", hash: "7f4a..c1e2" },
  { id: "#9402", hash: "b82d..91a4" },
  { id: "#9403", hash: "3e90..4f8b" },
  { id: "#9404", hash: "d17c..8a20" },
];

/**
 * Cryptographic Audit Log & Immutable Hash-Chain Strip.
 * Sequentially verifies and seals linked hash blocks across obsidian with zero dependencies.
 */
export function HashChainLedger({
  accentColor = "#f27c63",
  speed = 1,
  paused = false,
  className = "",
}: HashChainLedgerProps) {
  const [sealedIdx, setSealedIdx] = useState(2);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;

    const ms = Math.max(580, Math.round(1450 / Math.max(0.4, speed)));
    const id = window.setInterval(() => {
      setSealedIdx((prev) => (prev + 1) % BLOCKS.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [speed, paused]);

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono ${className}`}>
      {BLOCKS.map((blk, idx) => {
        const isCurrent = idx === sealedIdx;
        const isSigned = idx <= sealedIdx;
        return (
          <div key={blk.id} className="flex items-center gap-1.5">
            <div
              className="w-[82px] rounded-xl border px-2.5 py-2.5 transition-all duration-300"
              style={{
                backgroundColor: isCurrent ? "#131018" : "#0a0a0f",
                borderColor: isCurrent
                  ? accentColor
                  : isSigned
                    ? "rgba(248, 245, 240, 0.22)"
                    : "rgba(248, 245, 240, 0.1)",
                boxShadow: isCurrent ? `0 0 18px -6px ${accentColor}` : "none",
              }}
            >
              <div className="flex items-center justify-between text-[9.5px]">
                <span className="text-[#f8f5f0] font-semibold">{blk.id}</span>
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: isCurrent
                      ? accentColor
                      : isSigned
                        ? "#34d399"
                        : "rgba(248,245,240,0.2)",
                  }}
                />
              </div>
              <div className="mt-1.5 truncate text-[9px] text-[#8d8880]">{blk.hash}</div>
            </div>

            {idx < BLOCKS.length - 1 && (
              <div
                aria-hidden="true"
                className="h-[1.5px] w-3.5 transition-colors duration-300"
                style={{
                  backgroundColor: idx < sealedIdx ? accentColor : "rgba(248, 245, 240, 0.16)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
