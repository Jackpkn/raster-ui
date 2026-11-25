"use client";

import { useState } from "react";

export interface CodeDiffViewerProps {
  /** File path shown in editor header. */
  fileName?: string;
  /** Accent highlight for active tab and indicator. */
  accentColor?: string;
  className?: string;
}

const DIFF_LINES = [
  { num: 1, type: "remove" as const, code: 'import { HeavyStage } from "@legacy/webgl-kit";' },
  { num: 2, type: "remove" as const, code: 'import { SpringEngine } from "@legacy/anim-core";' },
  { num: 3, type: "add" as const, code: 'import { BayerDitherWave } from "@/components/raster";' },
  { num: 4, type: "context" as const, code: "export function Hero() {" },
  { num: 5, type: "add" as const, code: '  return <BayerDitherWave pixelSize={3} fadeLeft />;' },
  { num: 6, type: "context" as const, code: "}" },
];

/**
 * Developer-Grade Code Diff & Clean Snippet Viewer Card.
 * Switches smoothly between git diff and final clean view with one-click copy and zero dependencies.
 */
export function CodeDiffViewer({
  fileName = "src/components/hero.tsx",
  accentColor = "#f27c63",
  className = "",
}: CodeDiffViewerProps) {
  const [mode, setMode] = useState<"diff" | "clean">("diff");
  const [copied, setCopied] = useState(false);

  const visibleLines =
    mode === "diff" ? DIFF_LINES : DIFF_LINES.filter((l) => l.type !== "remove");

  async function handleCopy() {
    const cleanText = DIFF_LINES.filter((l) => l.type !== "remove")
      .map((l) => l.code)
      .join("\n");
    try {
      await navigator.clipboard.writeText(cleanText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Ignore clipboard failures
    }
  }

  return (
    <div
      className={`w-full max-w-md overflow-hidden rounded-2xl border border-white/14 bg-[#07070b] font-mono text-[11px] ${className}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-white/[0.02] px-3 py-2">
        <span className="truncate text-[10px] text-[#9c978f]">{fileName}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {(["diff", "clean"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMode(tab)}
              className="rounded px-2 py-0.5 text-[10px] capitalize cursor-pointer transition-colors"
              style={{
                backgroundColor: mode === tab ? `${accentColor}24` : "transparent",
                color: mode === tab ? accentColor : "#8d8880",
              }}
            >
              {tab}
            </button>
          ))}
          <button
            type="button"
            onClick={handleCopy}
            className="rounded border border-white/12 px-2 py-0.5 text-[10px] text-[#e7e2da] hover:border-white/25 cursor-pointer"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="py-2 leading-relaxed">
        {visibleLines.map((line, i) => {
          const isAdd = mode === "diff" && line.type === "add";
          const isRem = mode === "diff" && line.type === "remove";
          return (
            <div
              key={`${line.num}-${i}`}
              className="flex items-center gap-2.5 px-3 py-0.5"
              style={{
                backgroundColor: isAdd
                  ? "rgba(52, 211, 153, 0.09)"
                  : isRem
                    ? "rgba(242, 124, 99, 0.1)"
                    : "transparent",
              }}
            >
              <span className="w-3 shrink-0 select-none text-right text-[9.5px] text-[#5c5852]">
                {i + 1}
              </span>
              <span
                className="w-2.5 shrink-0 select-none text-[10px]"
                style={{
                  color: isAdd ? "#34d399" : isRem ? accentColor : "transparent",
                }}
              >
                {isAdd ? "+" : isRem ? "-" : " "}
              </span>
              <span
                className="truncate text-[10.5px]"
                style={{
                  color: isRem ? "#9c746c" : isAdd ? "#d1fae5" : "#d8d3ca",
                  textDecoration: isRem ? "line-through" : "none",
                }}
              >
                {line.code}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
