"use client";

import { AsciiWaveField } from "@/registry/components/ascii-wave-field";
import { BayerDitherWave } from "@/registry/components/bayer-dither-wave";
import { BentoSparklineTile } from "@/registry/components/bento-sparkline-tile";
import { BorderBeamCard } from "@/registry/components/border-beam-card";
import { ChromaticNoiseVeil } from "@/registry/components/chromatic-noise-veil";
import { ConstellationMesh } from "@/registry/components/constellation-mesh";
import { CrtScanlineText } from "@/registry/components/crt-scanline-text";
import { DataBeamHub } from "@/registry/components/data-beam-hub";
import { DataFunnelPrism } from "@/registry/components/data-funnel-prism";
import { DitherLatencyMeter } from "@/registry/components/dither-latency-meter";
import { DockMagnifyBar } from "@/registry/components/dock-magnify-bar";
import { EditorialMeshGradient } from "@/registry/components/editorial-mesh-gradient";
import { EventWaterfallStream } from "@/registry/components/event-waterfall-stream";
import { FiberOpticStream } from "@/registry/components/fiber-optic-stream";
import { FibonacciDotGlobe } from "@/registry/components/fibonacci-dot-globe";
import { HalftoneSpotlight } from "@/registry/components/halftone-spotlight";
import { HexagonSignalHive } from "@/registry/components/hexagon-signal-hive";
import { IsolatedLanesGrid } from "@/registry/components/isolated-lanes-grid";
import { IsometricCircuitChip } from "@/registry/components/isometric-circuit-chip";
import { IsometricFloatingCube } from "@/registry/components/isometric-floating-cube";
import { LiveActivityStack } from "@/registry/components/live-activity-stack";
import { MagneticFieldLines } from "@/registry/components/magnetic-field-lines";
import { MagneticShutterButton } from "@/registry/components/magnetic-shutter-button";
import { MagneticWaveWordmark } from "@/registry/components/magnetic-wave-wordmark";
import { MarqueeLogoRibbon } from "@/registry/components/marquee-logo-ribbon";
import { MeshTopologyFlow } from "@/registry/components/mesh-topology-flow";
import { MicrochipPinoutCore } from "@/registry/components/microchip-pinout-core";
import { MotherboardBusMatrix } from "@/registry/components/motherboard-bus-matrix";
import { ObsidianStarfield } from "@/registry/components/obsidian-starfield";
import { OrbitalRingLoader } from "@/registry/components/orbital-ring-loader";
import { OscillatorClockRail } from "@/registry/components/oscillator-clock-rail";
import { PacketQueueConveyor } from "@/registry/components/packet-queue-conveyor";
import { PcbLogicGates } from "@/registry/components/pcb-logic-gates";
import { PhosphorWaveform } from "@/registry/components/phosphor-waveform";
import { PixelDissolveLoader } from "@/registry/components/pixel-dissolve-loader";
import { PixelMatrixStream } from "@/registry/components/pixel-matrix-stream";
import { PixelSunburstDither } from "@/registry/components/pixel-sunburst-dither";
import { RadarSweepGrid } from "@/registry/components/radar-sweep-grid";
import { ShimmerCommandPill } from "@/registry/components/shimmer-command-pill";
import { SiliconWaferGrid } from "@/registry/components/silicon-wafer-grid";
import { SplitFlapCounter } from "@/registry/components/split-flap-counter";
import { SpotlightBentoCard } from "@/registry/components/spotlight-bento-card";
import { StepperProgressRail } from "@/registry/components/stepper-progress-rail";
import { TerminalCommandStepper } from "@/registry/components/terminal-command-stepper";
import { TerminalScrambleText } from "@/registry/components/terminal-scramble-text";
import { TiltGlassCard } from "@/registry/components/tilt-glass-card";
import { TopographicContours } from "@/registry/components/topographic-contours";
import { VectorCircuitTrace } from "@/registry/components/vector-circuit-trace";
import { VoronoiPulseGrid } from "@/registry/components/voronoi-pulse-grid";
import { WireframeTorusKnot } from "@/registry/components/wireframe-torus-knot";

export type PalettePresetId = "terracotta" | "cobalt" | "mono" | "emerald";

export const PALETTE_PRESETS: Record<
  PalettePresetId,
  {
    label: string;
    baseRgb: [number, number, number];
    accentRgb: [number, number, number];
    accentHex: string;
    monoHex: string;
  }
> = {
  terracotta: {
    label: "Silver + Terracotta",
    baseRgb: [238, 234, 228],
    accentRgb: [242, 124, 99],
    accentHex: "#f27c63",
    monoHex: "#e7e2da",
  },
  cobalt: {
    label: "Maritime Cobalt",
    baseRgb: [112, 150, 255],
    accentRgb: [152, 186, 255],
    accentHex: "#4f7cff",
    monoHex: "#d6e2ff",
  },
  mono: {
    label: "Pure Monochrome",
    baseRgb: [238, 238, 242],
    accentRgb: [255, 255, 255],
    accentHex: "#f4f4f5",
    monoHex: "#e4e4e7",
  },
  emerald: {
    label: "Phosphor Emerald",
    baseRgb: [216, 238, 228],
    accentRgb: [52, 211, 153],
    accentHex: "#34d399",
    monoHex: "#d1fae5",
  },
};

export interface StageControlProps {
  slug: string;
  palette?: PalettePresetId;
  speed?: number;
  pixelSize?: number;
  paused?: boolean;
  customText?: string;
  meshVariant?: "obsidian" | "alabaster";
  compact?: boolean;
}

export function ComponentStage({
  slug,
  palette = "terracotta",
  speed = 1,
  pixelSize = 3,
  paused = false,
  customText,
  meshVariant = "obsidian",
  compact = false,
}: StageControlProps) {
  const pal = PALETTE_PRESETS[palette];
  const heightClass = compact ? "h-48" : "h-[360px] sm:h-[420px]";

  switch (slug) {
    case "bayer-dither-wave":
      return (
        <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl bg-[#08080b]`}>
          <BayerDitherWave
            baseRgb={pal.baseRgb}
            accentRgb={pal.accentRgb}
            pixelSize={pixelSize}
            speed={speed}
            paused={paused}
            fadeLeft={!compact}
            className="h-full w-full"
          />
          {!compact && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex flex-col justify-center px-8 max-w-md">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9c978f]">
                4x4 Ordered Bayer Shader
              </span>
              <p className="mt-1 text-2xl font-medium tracking-tight text-[#f8f5f0]">
                Quiet precision on obsidian.
              </p>
            </div>
          )}
        </div>
      );

    case "halftone-spotlight":
      return (
        <HalftoneSpotlight
          gridGap={Math.max(12, Math.min(26, pixelSize * 5))}
          accentColor={pal.accentHex}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "obsidian-starfield":
      return (
        <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl bg-[#08080b]`}>
          <ObsidianStarfield
            starRgb={pal.baseRgb}
            speed={speed}
            paused={paused}
            topGlow
            className="h-full w-full"
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-[#e7e2da]">
              Zero-dependency dust field
            </span>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-[#f8f5f0]">
              Deep Space Canvas
            </p>
          </div>
        </div>
      );

    case "isometric-floating-cube":
      return (
        <IsometricFloatingCube
          color={pal.monoHex}
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl p-4`}
        />
      );

    case "dither-latency-meter":
      return (
        <DitherLatencyMeter
          accentColor={pal.accentHex}
          trackColor={pal.monoHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl p-4`}
        />
      );

    case "isolated-lanes-grid":
      return (
        <IsolatedLanesGrid
          color={pal.monoHex}
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl p-4`}
        />
      );

    case "crt-scanline-text":
      return (
        <div
          className={`flex w-full ${heightClass} items-center justify-center rounded-xl bg-[#060609] px-6 text-center`}
        >
          <CrtScanlineText
            text={customText?.trim() || "Ship your craft. We run it."}
            scanlineSize={Math.max(1, Math.min(4, Math.round(pixelSize * 0.75)))}
            durationSec={Math.max(4, Math.round(11 / Math.max(0.4, speed)))}
            highlightColor={pal.monoHex}
            paused={paused}
            className={compact ? "text-2xl sm:text-3xl" : "text-4xl sm:text-6xl"}
          />
        </div>
      );

    case "magnetic-wave-wordmark":
      return (
        <div
          className={`flex w-full ${heightClass} items-center justify-center rounded-xl bg-[#060609] px-4`}
        >
          <MagneticWaveWordmark
            text={customText?.trim() || "raster"}
            letterRgb={pal.baseRgb}
            liftPx={compact ? 12 : 20}
            scanlines
            className="w-full"
          />
        </div>
      );

    case "fibonacci-dot-globe":
      return (
        <FibonacciDotGlobe
          dotCount={compact ? 650 : 1050}
          dotRgb={pal.baseRgb}
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "editorial-mesh-gradient":
      return (
        <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl`}>
          <EditorialMeshGradient
            variant={meshVariant}
            durationSec={Math.max(8, Math.round(18 / Math.max(0.4, speed)))}
            paused={paused}
            linenGrain
            className="h-full w-full"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
            <span
              className={`font-serif text-3xl ${
                meshVariant === "alabaster" ? "text-[#1a1715]" : "text-[#f8f5f0]"
              }`}
            >
              Warm Editorial Atmosphere
            </span>
          </div>
        </div>
      );

    case "ascii-wave-field":
      return (
        <AsciiWaveField
          color={pal.monoHex}
          accentColor={pal.accentHex}
          cellSize={Math.max(10, Math.min(18, pixelSize * 4))}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "phosphor-waveform":
      return (
        <PhosphorWaveform
          accentColor={pal.accentHex}
          secondaryColor={pal.monoHex}
          speed={speed}
          paused={paused}
          showGrid
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "radar-sweep-grid":
      return (
        <RadarSweepGrid
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "pixel-matrix-stream":
      return (
        <PixelMatrixStream
          color={pal.monoHex}
          accentColor={pal.accentHex}
          blockSize={Math.max(5, Math.min(11, pixelSize * 2 + 1))}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "border-beam-card":
      return (
        <div
          className={`flex w-full ${heightClass} items-center justify-center rounded-xl bg-[#050507] p-5`}
        >
          <BorderBeamCard
            accentColor={pal.accentHex}
            secondaryColor={pal.monoHex}
            durationSec={Math.max(3, Math.round(7 / Math.max(0.4, speed)))}
            paused={paused}
            className="w-full max-w-md"
          />
        </div>
      );

    case "spotlight-bento-card":
      return (
        <div
          className={`flex w-full ${heightClass} items-center justify-center rounded-xl bg-[#050507] p-5`}
        >
          <SpotlightBentoCard
            glowRgb={pal.accentRgb.join(", ")}
            radiusPx={compact ? 210 : 300}
            className="w-full max-w-md"
          />
        </div>
      );

    case "topographic-contours":
      return (
        <TopographicContours
          accentColor={pal.accentHex}
          levels={compact ? 7 : 9}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "terminal-scramble-text":
      return (
        <div
          className={`flex w-full ${heightClass} flex-col items-center justify-center gap-2 rounded-xl bg-[#060609] px-6 text-center`}
        >
          <TerminalScrambleText
            text={customText?.trim() || "ZERO-DEPENDENCY MOTION"}
            accentColor={pal.accentHex}
            color={pal.monoHex}
            speed={speed}
            className={compact ? "text-lg sm:text-xl font-semibold" : "text-2xl sm:text-4xl font-semibold"}
          />
          <span className="font-mono text-[11px] text-[#8d8880]">
            Hover or click text to replay cipher decode
          </span>
        </div>
      );

    case "magnetic-field-lines":
      return (
        <MagneticFieldLines
          gridGap={Math.max(16, Math.min(30, pixelSize * 7))}
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "constellation-mesh":
      return (
        <ConstellationMesh
          nodeCount={compact ? 30 : 46}
          nodeRgb={pal.baseRgb}
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "voronoi-pulse-grid":
      return (
        <VoronoiPulseGrid
          tileSize={Math.max(10, Math.min(22, pixelSize * 4 + 2))}
          baseRgb={pal.baseRgb}
          accentRgb={pal.accentRgb}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "wireframe-torus-knot":
      return (
        <WireframeTorusKnot
          strokeRgb={pal.baseRgb}
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "pixel-sunburst-dither":
      return (
        <PixelSunburstDither
          baseRgb={pal.baseRgb}
          accentRgb={pal.accentRgb}
          pixelSize={pixelSize}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "dock-magnify-bar":
      return (
        <div
          className={`flex w-full ${heightClass} flex-col items-center justify-center gap-4 rounded-xl bg-[#060609] px-4`}
        >
          <DockMagnifyBar accentColor={pal.accentHex} />
          <span className="font-mono text-[11px] text-[#8d8880]">
            Glide pointer horizontally across dock items
          </span>
        </div>
      );

    case "marquee-logo-ribbon":
      return (
        <div
          className={`flex w-full ${heightClass} flex-col items-center justify-center gap-3 rounded-xl bg-[#060609] px-2`}
        >
          <MarqueeLogoRibbon
            accentColor={pal.accentHex}
            durationSec={Math.max(10, Math.round(24 / Math.max(0.4, speed)))}
            paused={paused}
            className="w-full"
          />
          {!compact && (
            <MarqueeLogoRibbon
              accentColor={pal.accentHex}
              durationSec={Math.max(12, Math.round(28 / Math.max(0.4, speed)))}
              reverse
              paused={paused}
              className="w-full"
            />
          )}
        </div>
      );

    case "shimmer-command-pill":
      return (
        <div
          className={`flex w-full ${heightClass} flex-col items-center justify-center gap-3 rounded-xl bg-[#060609] px-4`}
        >
          <ShimmerCommandPill
            label={customText?.trim() || "Open Command Palette"}
            badge="⌘K"
            accentColor={pal.accentHex}
            durationSec={Math.max(1.8, 3.6 / Math.max(0.4, speed))}
            paused={paused}
          />
          <span className="font-mono text-[11px] text-[#8d8880]">
            Pure CSS diagonal metallic specular glint
          </span>
        </div>
      );

    case "tilt-glass-card":
      return (
        <div
          className={`flex w-full ${heightClass} items-center justify-center overflow-hidden rounded-xl bg-[#050507] p-4`}
        >
          <TiltGlassCard
            accentColor={pal.accentHex}
            className={compact ? "w-full max-w-sm scale-[0.9]" : "w-full max-w-md"}
          />
        </div>
      );

    case "terminal-command-stepper":
      return (
        <div
          className={`flex w-full ${heightClass} items-center justify-center overflow-hidden rounded-xl bg-[#050507] p-4`}
        >
          <TerminalCommandStepper
            accentColor={pal.accentHex}
            speed={speed}
            paused={paused}
            className={compact ? "w-full max-w-md scale-[0.86]" : "w-full max-w-lg"}
          />
        </div>
      );

    case "pixel-dissolve-loader":
      return (
        <div
          className={`flex w-full ${heightClass} flex-col items-center justify-center gap-3 rounded-xl bg-[#060609] px-4`}
        >
          <PixelDissolveLoader
            gridSize={Math.max(5, Math.min(9, pixelSize * 2 + 1))}
            color={pal.monoHex}
            accentColor={pal.accentHex}
            sizePx={compact ? 84 : 136}
            speed={speed}
            paused={paused}
          />
          <span className="font-mono text-[11px] text-[#8d8880]">
            1-bit harmonic LED pixel matrix
          </span>
        </div>
      );

    case "orbital-ring-loader":
      return (
        <div
          className={`flex w-full ${heightClass} flex-col items-center justify-center gap-3 rounded-xl bg-[#060609] px-4`}
        >
          <OrbitalRingLoader
            sizePx={compact ? 92 : 148}
            accentColor={pal.accentHex}
            speed={speed}
            paused={paused}
          />
          <span className="font-mono text-[11px] text-[#8d8880]">
            Pure SVG counter-harmonic telemetry rings
          </span>
        </div>
      );

    case "chromatic-noise-veil":
      return (
        <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl bg-[#060609]`}>
          <ChromaticNoiseVeil
            accentColor={pal.accentHex}
            secondaryColor={pal.monoHex}
            speed={speed}
            paused={paused}
            className="h-full w-full"
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#9c978f]">
              35mm Analog Grain + Duotone Veil
            </span>
            {!compact && (
              <p className="mt-2 font-serif text-3xl text-[#f8f5f0]">
                Quiet Tactile Atmosphere
              </p>
            )}
          </div>
        </div>
      );

    case "vector-circuit-trace":
      return (
        <VectorCircuitTrace
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "bento-sparkline-tile":
      return (
        <div
          className={`flex w-full ${heightClass} items-center justify-center overflow-hidden rounded-xl bg-[#050507] p-4`}
        >
          <BentoSparklineTile
            accentColor={pal.accentHex}
            className={compact ? "w-full max-w-md scale-[0.86]" : "w-full max-w-md"}
          />
        </div>
      );

    case "split-flap-counter":
      return (
        <div
          className={`flex w-full ${heightClass} items-center justify-center rounded-xl bg-[#060609] px-4`}
        >
          <SplitFlapCounter
            accentColor={pal.accentHex}
            caption={customText?.trim() || "LIVE VERIFIED ROLES INDEXED"}
            speed={speed}
            paused={paused}
            className={compact ? "scale-90" : ""}
          />
        </div>
      );

    case "silicon-wafer-grid":
      return (
        <SiliconWaferGrid
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "pcb-logic-gates":
      return (
        <div className={`relative w-full ${heightClass} overflow-hidden rounded-xl bg-[#060609]`}>
          <PcbLogicGates
            accentColor={pal.accentHex}
            speed={speed}
            paused={paused}
            className="h-full w-full p-2"
          />
          <span className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px] text-[#7e7a72]">
            Click A / B / CLK
          </span>
        </div>
      );

    case "motherboard-bus-matrix":
      return (
        <MotherboardBusMatrix
          accentColor={pal.accentHex}
          lanes={Math.max(6, Math.min(14, pixelSize * 3))}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "microchip-pinout-core":
      return (
        <MicrochipPinoutCore
          chipLabel={customText?.trim() || "R-01"}
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "oscillator-clock-rail":
      return (
        <OscillatorClockRail
          accentColor={pal.accentHex}
          railColor={pal.monoHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "isometric-circuit-chip":
      return (
        <IsometricCircuitChip
          color={pal.monoHex}
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl p-3`}
        />
      );

    case "stepper-progress-rail":
      return (
        <div
          className={`flex w-full ${heightClass} flex-col items-center justify-center gap-4 rounded-xl bg-[#060609] px-4`}
        >
          <StepperProgressRail
            accentColor={pal.accentHex}
            speed={speed}
            paused={paused}
          />
          <span className="font-mono text-[11px] text-[#8d8880]">
            Continuous hardware pipeline stepper
          </span>
        </div>
      );

    case "magnetic-shutter-button":
      return (
        <div
          className={`flex w-full ${heightClass} flex-col items-center justify-center gap-3 rounded-xl bg-[#060609] px-4`}
        >
          <MagneticShutterButton
            label={customText?.trim() || "Deploy Circuit"}
            accentColor={pal.accentHex}
          />
          <span className="font-mono text-[11px] text-[#8d8880]">
            Hover &amp; move pointer for magnetic shutter pull
          </span>
        </div>
      );

    case "data-beam-hub":
      return (
        <DataBeamHub
          hubLabel={customText?.trim() || "CORE"}
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl p-2`}
        />
      );

    case "fiber-optic-stream":
      return (
        <FiberOpticStream
          accentColor={pal.accentHex}
          strands={Math.max(5, Math.min(12, pixelSize * 2 + 2))}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "data-funnel-prism":
      return (
        <DataFunnelPrism
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "mesh-topology-flow":
      return (
        <MeshTopologyFlow
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "packet-queue-conveyor":
      return (
        <PacketQueueConveyor
          accentColor={pal.accentHex}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "event-waterfall-stream":
      return (
        <div
          className={`flex w-full ${heightClass} items-center justify-center overflow-hidden rounded-xl bg-[#050507] p-4`}
        >
          <EventWaterfallStream
            accentColor={pal.accentHex}
            speed={speed}
            paused={paused}
            className={compact ? "max-w-md scale-[0.9]" : "max-w-lg"}
          />
        </div>
      );

    case "hexagon-signal-hive":
      return (
        <HexagonSignalHive
          accentColor={pal.accentHex}
          hexRadius={Math.max(12, Math.min(26, pixelSize * 5 + 2))}
          speed={speed}
          paused={paused}
          className={`w-full ${heightClass} rounded-xl`}
        />
      );

    case "live-activity-stack":
      return (
        <div
          className={`flex w-full ${heightClass} items-center justify-center overflow-hidden rounded-xl bg-[#050507] p-4`}
        >
          <LiveActivityStack
            accentColor={pal.accentHex}
            speed={speed}
            paused={paused}
            className={compact ? "scale-[0.88]" : ""}
          />
        </div>
      );

    default:
      return null;
  }
}
