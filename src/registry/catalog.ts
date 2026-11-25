export type RasterCategoryId =
  | "all"
  | "dither"
  | "isometric"
  | "telemetry"
  | "physics"
  | "surfaces"
  | "ui-motion"
  | "typography"
  | "spatial";

export interface RasterCategory {
  id: RasterCategoryId;
  label: string;
  description: string;
}

export interface RasterComponentSpec {
  slug: string;
  name: string;
  category: Exclude<RasterCategoryId, "all">;
  tagline: string;
  description: string;
  technique: string;
  fileName: string;
  exportName: string;
  dependencies: string[];
  usageSnippet: string;
  featured?: boolean;
}

export const RASTER_CATEGORIES: RasterCategory[] = [
  { id: "all", label: "All Components", description: "Every zero-dependency procedural visual" },
  {
    id: "dither",
    label: "Bayer & Halftone",
    description: "1-bit ordered dithering, interactive halftones, and starfields",
  },
  {
    id: "isometric",
    label: "1-Bit Isometric",
    description: "Hardware-style pixelated isometric micro-scenes for feature cards",
  },
  {
    id: "telemetry",
    label: "Telemetry & Audio",
    description: "ASCII density shaders, phosphor oscilloscopes, radar sweeps, and pixel streams",
  },
  {
    id: "physics",
    label: "Physics & Particles",
    description: "Magnetic compass fields, constellation meshes, and interference pulse grids",
  },
  {
    id: "surfaces",
    label: "Interactive Surfaces",
    description: "Orbital border beams, cursor spotlight masks, and editorial mesh gradients",
  },
  {
    id: "ui-motion",
    label: "UI Micro-Motion",
    description: "Magnetic docks, edge-feathered marquee tickers, and metallic command pills",
  },
  {
    id: "typography",
    label: "CRT & Kinetic Type",
    description: "Scanline display headlines, cipher scramble text, and magnetic wordmarks",
  },
  {
    id: "spatial",
    label: "3D & Topography",
    description: "Draggable 3D Fibonacci spheres, parametric torus wireframes, and contour maps",
  },
];

export const RASTER_COMPONENTS: RasterComponentSpec[] = [
  {
    slug: "bayer-dither-wave",
    name: "Bayer Dither Wave",
    category: "dither",
    tagline: "Ordered 4x4 Bayer dithering over smooth drifting fluid waves.",
    description:
      "Hardware-grade 1-bit pixel waves quantized with a 4x4 Bayer threshold matrix on pure HTML5 Canvas2D. Includes optional left-side obsidian feathering so headlines stay razor-sharp.",
    technique: "Canvas2D + 4x4 Bayer Matrix",
    fileName: "bayer-dither-wave.tsx",
    exportName: "BayerDitherWave",
    dependencies: [],
    featured: true,
    usageSnippet: `import { BayerDitherWave } from "@/components/raster/bayer-dither-wave";

export function HeroBanner() {
  return (
    <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10">
      <BayerDitherWave
        baseRgb={[238, 234, 228]}
        accentRgb={[242, 124, 99]}
        pixelSize={3}
        fadeLeft
        className="absolute inset-0"
      />
      <div className="relative z-10 flex h-full items-center px-8">
        <h2 className="text-2xl font-medium text-white">Quiet precision on obsidian.</h2>
      </div>
    </div>
  );
}`,
  },
  {
    slug: "halftone-spotlight",
    name: "Halftone Spotlight",
    category: "dither",
    tagline: "Cursor-reactive radial halftone dot grid with calm ambient fallback.",
    description:
      "Smoothly expands and tints halftone dots near the pointer with zero WebGL overhead. Falls back gracefully to a gentle drifting orbit when idle.",
    technique: "Interactive Canvas2D",
    fileName: "halftone-spotlight.tsx",
    exportName: "HalftoneSpotlight",
    dependencies: [],
    featured: true,
    usageSnippet: `import { HalftoneSpotlight } from "@/components/raster/halftone-spotlight";

export function FeatureSurface() {
  return (
    <HalftoneSpotlight
      gridGap={16}
      accentColor="#f27c63"
      spotlightRadius={180}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "obsidian-starfield",
    name: "Obsidian Starfield",
    category: "dither",
    tagline: "Multi-depth parallax micro-starfield with frosted top dome glow.",
    description:
      "Deterministic 150-star dust backdrop built for high-contrast dark cards, pricing highlights, and 3D stage containers with calm WCAG-safe shimmer.",
    technique: "Deterministic Canvas2D + CSS Radial Dome",
    fileName: "obsidian-starfield.tsx",
    exportName: "ObsidianStarfield",
    dependencies: [],
    usageSnippet: `import { ObsidianStarfield } from "@/components/raster/obsidian-starfield";

export function SpaceCard() {
  return (
    <div className="relative h-64 overflow-hidden rounded-2xl border border-white/15">
      <ObsidianStarfield starCount={160} topGlow className="absolute inset-0" />
    </div>
  );
}`,
  },
  {
    slug: "isometric-floating-cube",
    name: "Isometric Floating Cube",
    category: "isometric",
    tagline: "Hovering 1-bit dithered isometric cube, slab, crescent moon, and cross stars.",
    description:
      "Procedural 1-bit pixel illustration rendered cleanly via isometric polygon projection and Bayer 4x4 shading. Ideal for always-on agent, sleep/wake VM, or cloud bento cards.",
    technique: "Isometric Poly + 4x4 Bayer Canvas",
    fileName: "isometric-floating-cube.tsx",
    exportName: "IsometricFloatingCube",
    dependencies: [],
    featured: true,
    usageSnippet: `import { IsometricFloatingCube } from "@/components/raster/isometric-floating-cube";

export function BentoTile() {
  return (
    <IsometricFloatingCube
      color="#e7e2da"
      accentColor="#f27c63"
      className="h-52 w-full rounded-xl"
    />
  );
}`,
  },
  {
    slug: "dither-latency-meter",
    name: "Dither Latency Meter",
    category: "isometric",
    tagline: "1-bit Bayer-dithered precision telemetry slider with hardware tick marks.",
    description:
      "Pairs an oscillating accent threshold bar and needle against a monochrome reference rail with crisp pixelated scaling for performance or latency bento tiles.",
    technique: "1-Bit Pixel Canvas2D",
    fileName: "dither-latency-meter.tsx",
    exportName: "DitherLatencyMeter",
    dependencies: [],
    usageSnippet: `import { DitherLatencyMeter } from "@/components/raster/dither-latency-meter";

export function SpeedCard() {
  return (
    <DitherLatencyMeter
      accentColor="#d95238"
      trackColor="#dcd6cd"
      className="h-48 w-full rounded-xl"
    />
  );
}`,
  },
  {
    slug: "isolated-lanes-grid",
    name: "Isolated Lanes Grid",
    category: "isometric",
    tagline: "Grouped 1-bit isometric cubes splitting into three isolated vertical lanes.",
    description:
      "Communicates multi-tenant isolation, microVM sandboxes, or parallel pipelines in pure 1-bit bitmap graphics with an oscillating active-lane highlight.",
    technique: "1-Bit Isometric Canvas2D",
    fileName: "isolated-lanes-grid.tsx",
    exportName: "IsolatedLanesGrid",
    dependencies: [],
    usageSnippet: `import { IsolatedLanesGrid } from "@/components/raster/isolated-lanes-grid";

export function IsolationCard() {
  return (
    <IsolatedLanesGrid
      accentColor="#d95238"
      color="#e5e0d8"
      className="h-48 w-full rounded-xl"
    />
  );
}`,
  },
  {
    slug: "crt-scanline-text",
    name: "CRT Scanline Text",
    category: "typography",
    tagline: "Bold display typography masked with 2px horizontal scanlines and drifting light.",
    description:
      "Pure CSS display headline treatment combining repeating horizontal CRT scanlines with a slow atmospheric cloud sheen clipped inside the letters.",
    technique: "Pure CSS background-clip: text",
    fileName: "crt-scanline-text.tsx",
    exportName: "CrtScanlineText",
    dependencies: [],
    featured: true,
    usageSnippet: `import { CrtScanlineText } from "@/components/raster/crt-scanline-text";

export function Statement() {
  return (
    <CrtScanlineText
      text="Ship your craft. We run it."
      scanlineSize={2}
      className="text-5xl sm:text-7xl"
    />
  );
}`,
  },
  {
    slug: "magnetic-wave-wordmark",
    name: "Magnetic Wave Wordmark",
    category: "typography",
    tagline: "Oversized interactive footer wordmark with Gaussian cursor lift and tilt.",
    description:
      "Sweeping the cursor across the letters creates a fluid Gaussian wave with vertical lift, directional tilt, warm-ivory illumination, and optional CRT scanlines.",
    technique: "Zero-Dep Gaussian Cursor Math + CSS",
    fileName: "magnetic-wave-wordmark.tsx",
    exportName: "MagneticWaveWordmark",
    dependencies: [],
    usageSnippet: `import { MagneticWaveWordmark } from "@/components/raster/magnetic-wave-wordmark";

export function FooterBrand() {
  return <MagneticWaveWordmark text="raster" scanlines liftPx={18} />;
}`,
  },
  {
    slug: "fibonacci-dot-globe",
    name: "Fibonacci Dot Globe",
    category: "spatial",
    tagline: "Draggable 3D dotted sphere with inertia, geodesic arcs, and hub beacons.",
    description:
      "A reusable 3D Fibonacci lattice globe with drag-to-spin physics, momentum decay, glowing great-circle arcs, and pulsing city pins on pure Canvas2D (zero Three.js).",
    technique: "3D Projection + Fibonacci Sphere Canvas2D",
    fileName: "fibonacci-dot-globe.tsx",
    exportName: "FibonacciDotGlobe",
    dependencies: [],
    featured: true,
    usageSnippet: `import { FibonacciDotGlobe } from "@/components/raster/fibonacci-dot-globe";

export function GlobalSection() {
  return (
    <FibonacciDotGlobe
      dotCount={900}
      accentColor="#f27c63"
      className="h-96 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "editorial-mesh-gradient",
    name: "Editorial Mesh Gradient",
    category: "surfaces",
    tagline: "Painterly alabaster & obsidian drifting mesh surface with linen grain.",
    description:
      "Ultra-clean dual-mode atmospheric surface pairing slow organic radial drift with a fine tactile woven linen dot pattern. Zero JavaScript runtime loop.",
    technique: "Pure CSS Mesh + Tactile Linen Grain",
    fileName: "editorial-mesh-gradient.tsx",
    exportName: "EditorialMeshGradient",
    dependencies: [],
    usageSnippet: `import { EditorialMeshGradient } from "@/components/raster/editorial-mesh-gradient";

export function EditorialHero() {
  return (
    <div className="relative h-80 overflow-hidden rounded-2xl">
      <EditorialMeshGradient variant="obsidian" linenGrain className="absolute inset-0" />
    </div>
  );
}`,
  },
  {
    slug: "ascii-wave-field",
    name: "ASCII Wave Field",
    category: "telemetry",
    tagline: "Live monospace ASCII character density wave with interactive pointer ripples.",
    description:
      "Projects smooth animated 3D trigonometric waves onto a customizable ASCII ramp (` .:-=+*#%@`) with interactive cursor ripple distortion on pure Canvas2D.",
    technique: "Monospace Canvas2D ASCII Shader",
    fileName: "ascii-wave-field.tsx",
    exportName: "AsciiWaveField",
    dependencies: [],
    featured: true,
    usageSnippet: `import { AsciiWaveField } from "@/components/raster/ascii-wave-field";

export function TerminalHero() {
  return (
    <AsciiWaveField
      accentColor="#f27c63"
      cellSize={12}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "phosphor-waveform",
    name: "Phosphor Waveform",
    category: "telemetry",
    tagline: "Dual-trace oscilloscope and voice AI audio waveform with calibration grid.",
    description:
      "Renders multi-harmonic glowing oscilloscope traces windowed smoothly to zero at both edges. Built for voice AI assistants, audio streaming panels, and live status cards.",
    technique: "Canvas2D Harmonic Synthesis",
    fileName: "phosphor-waveform.tsx",
    exportName: "PhosphorWaveform",
    dependencies: [],
    usageSnippet: `import { PhosphorWaveform } from "@/components/raster/phosphor-waveform";

export function VoiceAgentCard() {
  return (
    <PhosphorWaveform
      accentColor="#f27c63"
      showGrid
      className="h-56 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "radar-sweep-grid",
    name: "Radar Sweep Grid",
    category: "telemetry",
    tagline: "Architectural polar radar sweep with fading phosphor trail and glowing blips.",
    description:
      "Rotates a multi-slice translucent sweep beam over concentric hairline range rings, brightening target blips dynamically on each pass with zero dependencies.",
    technique: "Polar Canvas2D Telemetry",
    fileName: "radar-sweep-grid.tsx",
    exportName: "RadarSweepGrid",
    dependencies: [],
    usageSnippet: `import { RadarSweepGrid } from "@/components/raster/radar-sweep-grid";

export function ScoutCard() {
  return (
    <RadarSweepGrid
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "pixel-matrix-stream",
    name: "Pixel Matrix Stream",
    category: "telemetry",
    tagline: "Restrained 1-bit pixel telemetry columns drifting calmly over a dark substrate.",
    description:
      "Clean, monochrome hardware data-stream aesthetic with subtle glowing accent head pixels. Designed to stay calm and readable behind product copy.",
    technique: "1-Bit Pixel Grid Canvas2D",
    fileName: "pixel-matrix-stream.tsx",
    exportName: "PixelMatrixStream",
    dependencies: [],
    usageSnippet: `import { PixelMatrixStream } from "@/components/raster/pixel-matrix-stream";

export function DataStreamBanner() {
  return (
    <PixelMatrixStream
      accentColor="#f27c63"
      blockSize={7}
      className="h-60 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "border-beam-card",
    name: "Border Beam Card",
    category: "surfaces",
    tagline: "Pure CSS orbital luminous arc tracing continuously around a hairline obsidian card.",
    description:
      "Uses hardware-composited CSS `offset-path` animation clipped cleanly to a 1px border ring with zero JavaScript overhead and built-in reduced-motion fallback.",
    technique: "Pure CSS offset-path Border",
    fileName: "border-beam-card.tsx",
    exportName: "BorderBeamCard",
    dependencies: [],
    featured: true,
    usageSnippet: `import { BorderBeamCard } from "@/components/raster/border-beam-card";

export function HighlightCard() {
  return (
    <BorderBeamCard accentColor="#f27c63" durationSec={7}>
      <h3 className="text-lg font-semibold text-white">Featured Tier</h3>
    </BorderBeamCard>
  );
}`,
  },
  {
    slug: "spotlight-bento-card",
    name: "Spotlight Bento Card",
    category: "surfaces",
    tagline: "Cursor-tracking obsidian spotlight revealing an architectural 14px dot lattice.",
    description:
      "Tracks pointer coordinates to illuminate a feathered radial glow and masked micro-dot grid across dark cards with zero external libraries.",
    technique: "CSS Radial Mask + Pointer Tracking",
    fileName: "spotlight-bento-card.tsx",
    exportName: "SpotlightBentoCard",
    dependencies: [],
    usageSnippet: `import { SpotlightBentoCard } from "@/components/raster/spotlight-bento-card";

export function BentoFeature() {
  return (
    <SpotlightBentoCard glowRgb="242, 124, 99" radiusPx={280}>
      <h3 className="text-lg font-semibold text-white">Interactive Surface</h3>
    </SpotlightBentoCard>
  );
}`,
  },
  {
    slug: "topographic-contours",
    name: "Topographic Contours",
    category: "spatial",
    tagline: "Real-time marching-squares elevation isolines drifting across obsidian.",
    description:
      "Computes smooth vector topographic contour lines on every frame from an animated 2D scalar elevation field, highlighting summit ridges in your brand accent.",
    technique: "Marching-Squares Vector Canvas2D",
    fileName: "topographic-contours.tsx",
    exportName: "TopographicContours",
    dependencies: [],
    featured: true,
    usageSnippet: `import { TopographicContours } from "@/components/raster/topographic-contours";

export function TerrainSection() {
  return (
    <TopographicContours
      accentColor="#f27c63"
      levels={8}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "terminal-scramble-text",
    name: "Terminal Scramble Text",
    category: "typography",
    tagline: "Kinetic cipher-decode headline that scrambles cleanly on mount, hover, or click.",
    description:
      "Locks characters left-to-right from a customizable glyph pool with accent flash highlighting and zero horizontal layout shift.",
    technique: "Kinetic Cipher RAF Decoder",
    fileName: "terminal-scramble-text.tsx",
    exportName: "TerminalScrambleText",
    dependencies: [],
    usageSnippet: `import { TerminalScrambleText } from "@/components/raster/terminal-scramble-text";

export function KineticTitle() {
  return (
    <TerminalScrambleText
      text="ZERO-DEPENDENCY MOTION"
      accentColor="#f27c63"
      className="text-2xl font-semibold"
    />
  );
}`,
  },
  {
    slug: "magnetic-field-lines",
    name: "Magnetic Field Lines",
    category: "physics",
    tagline: "Architectural vector compass grid where hairline needles align smoothly to the pointer.",
    description:
      "Computes real-time vector angles across hundreds of fine compass needles tracking the cursor or an idle orbiting magnetic dipole with high-flux accent tips.",
    technique: "Vector Field Canvas2D",
    fileName: "magnetic-field-lines.tsx",
    exportName: "MagneticFieldLines",
    dependencies: [],
    featured: true,
    usageSnippet: `import { MagneticFieldLines } from "@/components/raster/magnetic-field-lines";

export function PhysicsBackdrop() {
  return (
    <MagneticFieldLines
      gridGap={22}
      accentColor="#f27c63"
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "constellation-mesh",
    name: "Constellation Mesh",
    category: "physics",
    tagline: "Minimalist drifting particle graph with distance-weighted hairlines and cursor links.",
    description:
      "Lightweight network graph where autonomous particles dynamically form hairline edges on proximity and latch cleanly onto pointer movement.",
    technique: "Spatial Particle Graph Canvas2D",
    fileName: "constellation-mesh.tsx",
    exportName: "ConstellationMesh",
    dependencies: [],
    usageSnippet: `import { ConstellationMesh } from "@/components/raster/constellation-mesh";

export function NetworkSurface() {
  return (
    <ConstellationMesh
      nodeCount={38}
      accentColor="#f27c63"
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "voronoi-pulse-grid",
    name: "Voronoi Pulse Grid",
    category: "physics",
    tagline: "Quantized micro-tile lattice pulsing along dual drifting wave interference emitters.",
    description:
      "Dual harmonic wave emitters create crisp interference crests across a clean architectural grid of dark obsidian micro-tiles.",
    technique: "Dual-Emitter Wave Lattice Canvas2D",
    fileName: "voronoi-pulse-grid.tsx",
    exportName: "VoronoiPulseGrid",
    dependencies: [],
    usageSnippet: `import { VoronoiPulseGrid } from "@/components/raster/voronoi-pulse-grid";

export function ComputePanel() {
  return (
    <VoronoiPulseGrid
      tileSize={14}
      accentRgb={[242, 124, 99]}
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "wireframe-torus-knot",
    name: "Wireframe Torus Knot",
    category: "spatial",
    tagline: "Depth-shaded 3D parametric wireframe torus sculpture with pointer tilt on Canvas2D.",
    description:
      "Projects a rotating 3D parametric torus lattice with perspective foreshortening, depth-fog opacity, and subtle cursor tilt using zero WebGL or Three.js.",
    technique: "3D Parametric Projection Canvas2D",
    fileName: "wireframe-torus-knot.tsx",
    exportName: "WireframeTorusKnot",
    dependencies: [],
    featured: true,
    usageSnippet: `import { WireframeTorusKnot } from "@/components/raster/wireframe-torus-knot";

export function SculptureTile() {
  return (
    <WireframeTorusKnot
      accentColor="#f27c63"
      className="h-80 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "pixel-sunburst-dither",
    name: "Pixel Sunburst Dither",
    category: "dither",
    tagline: "Radial 4x4 Bayer-dithered solar corona rays rising smoothly from the horizon.",
    description:
      "Quantizes rotating radial horizon rays and a glowing core corona through an ordered 4x4 Bayer matrix for retro-futuristic hero backdrops and launch announcements.",
    technique: "Radial 4x4 Bayer Canvas2D",
    fileName: "pixel-sunburst-dither.tsx",
    exportName: "PixelSunburstDither",
    dependencies: [],
    usageSnippet: `import { PixelSunburstDither } from "@/components/raster/pixel-sunburst-dither";

export function LaunchHeader() {
  return (
    <PixelSunburstDither
      pixelSize={3}
      accentRgb={[242, 124, 99]}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "dock-magnify-bar",
    name: "Dock Magnify Bar",
    category: "ui-motion",
    tagline: "Gaussian magnetic horizontal dock bar with fluid magnification and hover tooltips.",
    description:
      "Zero-dependency interactive dock where moving the cursor across minimal monochrome action pills smoothly magnifies and lifts adjacent targets with cubic-bezier spring easing.",
    technique: "Gaussian Pointer Math + CSS Transform",
    fileName: "dock-magnify-bar.tsx",
    exportName: "DockMagnifyBar",
    dependencies: [],
    featured: true,
    usageSnippet: `import { DockMagnifyBar } from "@/components/raster/dock-magnify-bar";

export function FloatingNav() {
  return <DockMagnifyBar accentColor="#f27c63" maxScale={1.42} />;
}`,
  },
  {
    slug: "marquee-logo-ribbon",
    name: "Marquee Logo Ribbon",
    category: "ui-motion",
    tagline: "Pure CSS seamless infinite ticker with edge-feathered mask and pause-on-hover.",
    description:
      "Hardware-composited dual-copy marquee with gradient edge fading, automatic hover pause, and full prefers-reduced-motion grid wrap fallback.",
    technique: "Pure CSS Mask + Composited Marquee",
    fileName: "marquee-logo-ribbon.tsx",
    exportName: "MarqueeLogoRibbon",
    dependencies: [],
    usageSnippet: `import { MarqueeLogoRibbon } from "@/components/raster/marquee-logo-ribbon";

export function TrustStrip() {
  return <MarqueeLogoRibbon accentColor="#f27c63" durationSec={24} />;
}`,
  },
  {
    slug: "shimmer-command-pill",
    name: "Shimmer Command Pill",
    category: "ui-motion",
    tagline: "Obsidian CTA pill with a sleek diagonal metallic specular glint sweep and ⌘K badge.",
    description:
      "Pure CSS diagonal light sweep across an elevated dark command button with crisp top specular inset border and tactile active press scale.",
    technique: "Pure CSS Specular Sweep Button",
    fileName: "shimmer-command-pill.tsx",
    exportName: "ShimmerCommandPill",
    dependencies: [],
    usageSnippet: `import { ShimmerCommandPill } from "@/components/raster/shimmer-command-pill";

export function HeroCta() {
  return (
    <ShimmerCommandPill
      label="Open Command Palette"
      badge="⌘K"
      accentColor="#f27c63"
    />
  );
}`,
  },
];

export function getComponentSpecBySlug(slug: string): RasterComponentSpec | undefined {
  return RASTER_COMPONENTS.find((c) => c.slug === slug);
}
