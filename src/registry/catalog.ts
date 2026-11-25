export type RasterCategoryId =
  | "all"
  | "shaders"
  | "editorial"
  | "website-blocks"
  | "security"
  | "ai-agents"
  | "data-flow"
  | "circuits"
  | "dither"
  | "isometric"
  | "telemetry"
  | "physics"
  | "surfaces"
  | "ui-motion"
  | "loaders"
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
    id: "shaders",
    label: "Shaders & Grain",
    description: "Paper-style stochastic grain gradients, warped color meshes, smoke rings, god rays, and caustics",
  },
  {
    id: "editorial",
    label: "Editorial & Craft",
    description: "Calligraphic SVG signatures, fanned 3D card decks, liquid metaballs, and changelog timelines",
  },
  {
    id: "website-blocks",
    label: "Website Essentials",
    description: "Interactive Cmd+K palettes, before/after sliders, code diffs, pricing cards, navbars, and accordions",
  },
  {
    id: "security",
    label: "Security & Crypto",
    description: "Cipher lock vaults, zero-trust packet firewalls, immutable hash chains, and iris scanners",
  },
  {
    id: "ai-agents",
    label: "AI & Agents",
    description: "Streaming token composers, neural layer graphs, tool-calling orbits, vector clouds, and attention maps",
  },
  {
    id: "data-flow",
    label: "Data Flow & Streams",
    description: "Animated multi-node beams, fiber ribbons, packet queues, prisms, and trace waterfalls",
  },
  {
    id: "circuits",
    label: "Circuits & Silicon",
    description: "Routed PCB bus traces, interactive logic schematics, silicon wafers, and chip pinouts",
  },
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
    description: "Magnetic docks, animated CLI steppers, marquees, and metallic command pills",
  },
  {
    id: "loaders",
    label: "Loaders & Progress",
    description: "1-bit pixel dissolve matrices and SVG counter-harmonic orbital telemetry rings",
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
  {
    slug: "tilt-glass-card",
    name: "Tilt Glass Card",
    category: "surfaces",
    tagline: "3D perspective pointer-tilt obsidian card with angle-tracking specular glare.",
    description:
      "Tracks pointer coordinates to rotate a crisp hairline obsidian surface in 3D perspective space while casting a dynamic radial glare sheen with zero animation libraries.",
    technique: "CSS 3D Perspective + Specular Glare",
    fileName: "tilt-glass-card.tsx",
    exportName: "TiltGlassCard",
    dependencies: [],
    featured: true,
    usageSnippet: `import { TiltGlassCard } from "@/components/raster/tilt-glass-card";

export function PricingSpotlight() {
  return (
    <TiltGlassCard maxTiltDeg={10} accentColor="#f27c63">
      <h3 className="text-lg font-semibold text-white">Pro Telemetry</h3>
    </TiltGlassCard>
  );
}`,
  },
  {
    slug: "terminal-command-stepper",
    name: "Terminal Command Stepper",
    category: "ui-motion",
    tagline: "Animated agent & CLI terminal window stepping through live output with a blinking cursor.",
    description:
      "Sequentially reveals shell commands and status badges inside an obsidian terminal chrome with a hardware-stepped blinking cursor and reduced-motion static reveal.",
    technique: "Pure React CLI Stepper + CSS Cursor",
    fileName: "terminal-command-stepper.tsx",
    exportName: "TerminalCommandStepper",
    dependencies: [],
    featured: true,
    usageSnippet: `import { TerminalCommandStepper } from "@/components/raster/terminal-command-stepper";

export function InstallPreview() {
  return (
    <TerminalCommandStepper
      title="raster-cli"
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "pixel-dissolve-loader",
    name: "Pixel Dissolve Loader",
    category: "loaders",
    tagline: "1-bit LED pixel matrix sweeping across diagonal harmonic interference waves.",
    description:
      "Crisp square LED matrix loader rendered on Canvas2D that illuminates peak interference cells in your brand accent while automatically pausing off-screen.",
    technique: "1-Bit Matrix Canvas2D Loader",
    fileName: "pixel-dissolve-loader.tsx",
    exportName: "PixelDissolveLoader",
    dependencies: [],
    featured: true,
    usageSnippet: `import { PixelDissolveLoader } from "@/components/raster/pixel-dissolve-loader";

export function PendingState() {
  return (
    <PixelDissolveLoader
      gridSize={7}
      accentColor="#f27c63"
      sizePx={92}
    />
  );
}`,
  },
  {
    slug: "orbital-ring-loader",
    name: "Orbital Ring Loader",
    category: "loaders",
    tagline: "Pure SVG counter-harmonic dashed orbital rings rotating around a glowing telemetry beacon.",
    description:
      "Zero JavaScript runtime loop: three concentric SVG rings spin in opposing harmonic periods via GPU-composited CSS transforms around a central indicator dot.",
    technique: "Pure SVG + CSS Orbital Rings",
    fileName: "orbital-ring-loader.tsx",
    exportName: "OrbitalRingLoader",
    dependencies: [],
    usageSnippet: `import { OrbitalRingLoader } from "@/components/raster/orbital-ring-loader";

export function SyncStatus() {
  return (
    <OrbitalRingLoader
      sizePx={96}
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "chromatic-noise-veil",
    name: "Chromatic Noise Veil",
    category: "dither",
    tagline: "Drifting obsidian duotone light beams layered beneath animated analog film grain.",
    description:
      "Synthesizes crisp low-contrast monochrome film noise on an off-grid pixel canvas blended over slow-drifting radial light lobes for tactile editorial headers.",
    technique: "Procedural Film Grain Canvas2D + CSS Veil",
    fileName: "chromatic-noise-veil.tsx",
    exportName: "ChromaticNoiseVeil",
    dependencies: [],
    usageSnippet: `import { ChromaticNoiseVeil } from "@/components/raster/chromatic-noise-veil";

export function AtmosphericBackdrop() {
  return (
    <ChromaticNoiseVeil
      accentColor="#f27c63"
      grainOpacity={0.14}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "vector-circuit-trace",
    name: "Vector Circuit Trace",
    category: "circuits",
    tagline: "Architectural 45-degree routed PCB bus traces feeding luminous data pulses into a compute die.",
    description:
      "Draws precision solder pads, orthogonal silicon traces, and gradient-tailed signal packets converging continuously toward a central chip outline on pure Canvas2D.",
    technique: "Vector Bus Routing Canvas2D",
    fileName: "vector-circuit-trace.tsx",
    exportName: "VectorCircuitTrace",
    dependencies: [],
    featured: true,
    usageSnippet: `import { VectorCircuitTrace } from "@/components/raster/vector-circuit-trace";

export function ComputeDiagram() {
  return (
    <VectorCircuitTrace
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "bento-sparkline-tile",
    name: "Bento Sparkline Tile",
    category: "telemetry",
    tagline: "Interactive zero-dependency Canvas2D sparkline card with crosshair pointer scrub readout.",
    description:
      "Combines a gradient-filled vector area chart, live delta percentage badge, and smooth pointer-scrubbing hairline crosshair inside a dark bento KPI tile.",
    technique: "Interactive Scrubbing Canvas2D Chart",
    fileName: "bento-sparkline-tile.tsx",
    exportName: "BentoSparklineTile",
    dependencies: [],
    usageSnippet: `import { BentoSparklineTile } from "@/components/raster/bento-sparkline-tile";

export function ThroughputKpi() {
  return (
    <BentoSparklineTile
      label="Edge Throughput"
      unit="k/s"
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "split-flap-counter",
    name: "Split Flap Counter",
    category: "typography",
    tagline: "Mechanical Braun-style split-flap numeric ticker with center hinge and tabular glyphs.",
    description:
      "Cycles padded monospace values across split-hinged dark mechanical tiles with crisp specular top bevels and an accent telemetry status indicator.",
    technique: "Pure React Split-Flap Mechanical Board",
    fileName: "split-flap-counter.tsx",
    exportName: "SplitFlapCounter",
    dependencies: [],
    usageSnippet: `import { SplitFlapCounter } from "@/components/raster/split-flap-counter";

export function LiveMetricsBoard() {
  return (
    <SplitFlapCounter
      values={["00184", "00429", "01280", "03642"]}
      caption="LIVE VERIFIED ROLES INDEXED"
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "silicon-wafer-grid",
    name: "Silicon Wafer Grid",
    category: "circuits",
    tagline: "Circular semiconductor silicon wafer die map with sweeping laser inspection crosshair.",
    description:
      "Renders a circular clipped lattice of semiconductor dies with a notched orientation edge, active tested sectors, and an optical laser sweep on pure Canvas2D.",
    technique: "Semiconductor Die Canvas2D",
    fileName: "silicon-wafer-grid.tsx",
    exportName: "SiliconWaferGrid",
    dependencies: [],
    featured: true,
    usageSnippet: `import { SiliconWaferGrid } from "@/components/raster/silicon-wafer-grid";

export function HardwareHero() {
  return (
    <SiliconWaferGrid
      accentColor="#f27c63"
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "pcb-logic-gates",
    name: "PCB Logic Gates",
    category: "circuits",
    tagline: "Interactive digital logic PCB schematic with clickable A, B, and CLK switches.",
    description:
      "Pure SVG printed-circuit schematic routing 45-degree copper traces through live XOR, AND, and OUT logic stages with interactive click-to-toggle input pads.",
    technique: "Interactive SVG Logic Schematic",
    fileName: "pcb-logic-gates.tsx",
    exportName: "PcbLogicGates",
    dependencies: [],
    featured: true,
    usageSnippet: `import { PcbLogicGates } from "@/components/raster/pcb-logic-gates";

export function InteractiveCircuit() {
  return (
    <PcbLogicGates
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "motherboard-bus-matrix",
    name: "Motherboard Bus Matrix",
    category: "circuits",
    tagline: "Parallel chamfered copper bus lanes with plated vias and pointer-reactive trace glow.",
    description:
      "Draws multi-lane differential motherboard traces with 45-degree jog bends, plated via rings, bi-directional signal packets, and live hover illumination.",
    technique: "Multi-Lane PCB Bus Canvas2D",
    fileName: "motherboard-bus-matrix.tsx",
    exportName: "MotherboardBusMatrix",
    dependencies: [],
    featured: true,
    usageSnippet: `import { MotherboardBusMatrix } from "@/components/raster/motherboard-bus-matrix";

export function BusBackdrop() {
  return (
    <MotherboardBusMatrix
      lanes={9}
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "microchip-pinout-core",
    name: "Microchip Pinout Core",
    category: "circuits",
    tagline: "QFN microprocessor die package with 24 perimeter leads radiating live signal pulses.",
    description:
      "Precision central silicon package with laser-etched die label, Pin-1 index marker, and 24 metallic perimeter traces pulsing outward to solder pads.",
    technique: "QFN Pinout Canvas2D",
    fileName: "microchip-pinout-core.tsx",
    exportName: "MicrochipPinoutCore",
    dependencies: [],
    usageSnippet: `import { MicrochipPinoutCore } from "@/components/raster/microchip-pinout-core";

export function ProcessorTile() {
  return (
    <MicrochipPinoutCore
      chipLabel="R-01"
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "oscillator-clock-rail",
    name: "Oscillator Clock Rail",
    category: "circuits",
    tagline: "4-channel digital logic analyzer timing diagram streaming CLK, BUS, SYN, and ACK.",
    description:
      "Renders crisp square-wave digital bus signals across a scrolling calibrated timebase with rising-edge trigger hairlines on pure Canvas2D.",
    technique: "Digital Logic Timing Canvas2D",
    fileName: "oscillator-clock-rail.tsx",
    exportName: "OscillatorClockRail",
    dependencies: [],
    usageSnippet: `import { OscillatorClockRail } from "@/components/raster/oscillator-clock-rail";

export function TimingPanel() {
  return (
    <OscillatorClockRail
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "isometric-circuit-chip",
    name: "Isometric Circuit Chip",
    category: "isometric",
    tagline: "1-bit Bayer-dithered isometric processor package seated over animated PCB leads.",
    description:
      "Bridges 1-bit pixel dithering and silicon hardware design with a hovering isometric chip die, PCB substrate base, and animated copper lead pulses.",
    technique: "1-Bit Isometric Chip Canvas2D",
    fileName: "isometric-circuit-chip.tsx",
    exportName: "IsometricCircuitChip",
    dependencies: [],
    usageSnippet: `import { IsometricCircuitChip } from "@/components/raster/isometric-circuit-chip";

export function HardwareBento() {
  return (
    <IsometricCircuitChip
      color="#e7e2da"
      accentColor="#f27c63"
      className="h-52 w-full rounded-xl"
    />
  );
}`,
  },
  {
    slug: "stepper-progress-rail",
    name: "Stepper Progress Rail",
    category: "loaders",
    tagline: "Horizontal hardware pipeline rail with glowing progress beam across milestone nodes.",
    description:
      "Cycles smoothly through discrete build/deploy stages with crisp numbered nodes, completed checkmarks, and an illuminated hairline fill bar.",
    technique: "Pure React + CSS Pipeline Rail",
    fileName: "stepper-progress-rail.tsx",
    exportName: "StepperProgressRail",
    dependencies: [],
    usageSnippet: `import { StepperProgressRail } from "@/components/raster/stepper-progress-rail";

export function DeployStatus() {
  return (
    <StepperProgressRail
      steps={["Build", "Verify", "Sign", "Deploy"]}
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "magnetic-shutter-button",
    name: "Magnetic Shutter Button",
    category: "ui-motion",
    tagline: "Cursor-attracted obsidian CTA pill with vertical double-text shutter roll on hover.",
    description:
      "Tracks pointer proximity for subtle magnetic spring pull while rolling button typography smoothly upward into an accent highlight layer.",
    technique: "Magnetic Pointer Math + CSS Shutter",
    fileName: "magnetic-shutter-button.tsx",
    exportName: "MagneticShutterButton",
    dependencies: [],
    usageSnippet: `import { MagneticShutterButton } from "@/components/raster/magnetic-shutter-button";

export function PrimaryAction() {
  return (
    <MagneticShutterButton
      label="Deploy Circuit"
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "data-beam-hub",
    name: "Data Beam Hub",
    category: "data-flow",
    tagline: "Multi-input to multi-output SVG animated beams flowing through a central routing core.",
    description:
      "Pure SVG cubic-Bezier data conduits streaming luminous packets from three upstream sources through a central hub node to two downstream targets.",
    technique: "Pure SVG Cubic-Bezier Data Beams",
    fileName: "data-beam-hub.tsx",
    exportName: "DataBeamHub",
    dependencies: [],
    featured: true,
    usageSnippet: `import { DataBeamHub } from "@/components/raster/data-beam-hub";

export function ArchitectureVisual() {
  return (
    <DataBeamHub
      hubLabel="CORE"
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "fiber-optic-stream",
    name: "Fiber Optic Stream",
    category: "data-flow",
    tagline: "Undulating optical data ribbons carrying glowing photon bursts with pointer deflection.",
    description:
      "Smooth sinusoidal optical fiber splines sweep gently across obsidian while glowing data streaks race across each strand and deflect softly around the cursor.",
    technique: "Optical Spline Stream Canvas2D",
    fileName: "fiber-optic-stream.tsx",
    exportName: "FiberOpticStream",
    dependencies: [],
    featured: true,
    usageSnippet: `import { FiberOpticStream } from "@/components/raster/fiber-optic-stream";

export function PipelineBanner() {
  return (
    <FiberOpticStream
      strands={8}
      accentColor="#f27c63"
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "data-funnel-prism",
    name: "Data Funnel Prism",
    category: "data-flow",
    tagline: "Noisy raw incoming streams converging through a central optical gate into clean rails.",
    description:
      "Visualizes ETL ingestion, RAG ranking, or signal filtering as scattered input particles pass through a central prism gate and emerge as structured high-signal streams.",
    technique: "Stream Filtering Particle Canvas2D",
    fileName: "data-funnel-prism.tsx",
    exportName: "DataFunnelPrism",
    dependencies: [],
    featured: true,
    usageSnippet: `import { DataFunnelPrism } from "@/components/raster/data-funnel-prism";

export function FilterDiagram() {
  return (
    <DataFunnelPrism
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "mesh-topology-flow",
    name: "Mesh Topology Flow",
    category: "data-flow",
    tagline: "Distributed multi-region cluster graph with directional packet hops and arrival ripples.",
    description:
      "Connects regional compute nodes (US-E, EU-W, AP-S, EDGE, CORE, CACHE) with clean vector links carrying continuous multi-hop telemetry packets on Canvas2D.",
    technique: "Cluster Graph Routing Canvas2D",
    fileName: "mesh-topology-flow.tsx",
    exportName: "MeshTopologyFlow",
    dependencies: [],
    usageSnippet: `import { MeshTopologyFlow } from "@/components/raster/mesh-topology-flow";

export function GlobalMeshCard() {
  return (
    <MeshTopologyFlow
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "packet-queue-conveyor",
    name: "Packet Queue Conveyor",
    category: "data-flow",
    tagline: "Four parallel ingestion rails streaming discrete framed packets past a scanner beam.",
    description:
      "Illustrates streaming queues (INGEST, PARSE, INDEX, EMIT) where framed data blocks glide continuously across rails and verify dynamically at a central scan gate.",
    technique: "Multi-Lane Queue Canvas2D",
    fileName: "packet-queue-conveyor.tsx",
    exportName: "PacketQueueConveyor",
    dependencies: [],
    usageSnippet: `import { PacketQueueConveyor } from "@/components/raster/packet-queue-conveyor";

export function QueueVisual() {
  return (
    <PacketQueueConveyor
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "event-waterfall-stream",
    name: "Event Waterfall Stream",
    category: "data-flow",
    tagline: "Distributed trace waterfall timeline cycling live highlights across microservice spans.",
    description:
      "Clean observability span timeline showing staggered millisecond execution bars with glowing critical-path highlights and zero external dependencies.",
    technique: "Pure React Trace Waterfall",
    fileName: "event-waterfall-stream.tsx",
    exportName: "EventWaterfallStream",
    dependencies: [],
    usageSnippet: `import { EventWaterfallStream } from "@/components/raster/event-waterfall-stream";

export function ObservabilityCard() {
  return (
    <EventWaterfallStream accentColor="#f27c63" />
  );
}`,
  },
  {
    slug: "hexagon-signal-hive",
    name: "Hexagon Signal Hive",
    category: "circuits",
    tagline: "Obsidian hexagonal compute lattice pulsing with radial signal waves and pointer ripples.",
    description:
      "Architectural honeycomb substrate where luminous radial waves travel cleanly from cell to cell and lock onto pointer movement on pure Canvas2D.",
    technique: "Hexagonal Wave Lattice Canvas2D",
    fileName: "hexagon-signal-hive.tsx",
    exportName: "HexagonSignalHive",
    dependencies: [],
    usageSnippet: `import { HexagonSignalHive } from "@/components/raster/hexagon-signal-hive";

export function ComputeBackdrop() {
  return (
    <HexagonSignalHive
      hexRadius={17}
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "live-activity-stack",
    name: "Live Activity Stack",
    category: "ui-motion",
    tagline: "Flowing real-time stacked event cards sliding smoothly into focus with depth fade.",
    description:
      "Pure React and CSS live activity feed rotating telemetry events into the top slot with subtle scale depth, accent border highlights, and reduced-motion support.",
    technique: "Pure React + CSS Depth Stack",
    fileName: "live-activity-stack.tsx",
    exportName: "LiveActivityStack",
    dependencies: [],
    usageSnippet: `import { LiveActivityStack } from "@/components/raster/live-activity-stack";

export function RealtimeFeed() {
  return <LiveActivityStack accentColor="#f27c63" />;
}`,
  },
  {
    slug: "token-stream-composer",
    name: "Token Stream Composer",
    category: "ai-agents",
    tagline: "Live streaming LLM token output card with hardware caret and tok/s telemetry.",
    description:
      "Streams response chunks word-by-word inside an obsidian terminal card with a live token counter, throughput readout, and clean reduced-motion static fallback.",
    technique: "Pure React Streaming LLM Card",
    fileName: "token-stream-composer.tsx",
    exportName: "TokenStreamComposer",
    dependencies: [],
    featured: true,
    usageSnippet: `import { TokenStreamComposer } from "@/components/raster/token-stream-composer";

export function AiPreview() {
  return (
    <TokenStreamComposer
      modelLabel="raster-reason-v2"
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "neural-layer-graph",
    name: "Neural Layer Graph",
    category: "ai-agents",
    tagline: "4-layer feed-forward neural network with luminous synaptic pulses firing left-to-right.",
    description:
      "Draws a calm multi-layer perceptron topology on Canvas2D where sparse glowing synaptic signals cascade cleanly across layers and light up active neurons.",
    technique: "Neural Topology Canvas2D",
    fileName: "neural-layer-graph.tsx",
    exportName: "NeuralLayerGraph",
    dependencies: [],
    featured: true,
    usageSnippet: `import { NeuralLayerGraph } from "@/components/raster/neural-layer-graph";

export function InferencePanel() {
  return (
    <NeuralLayerGraph
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "agent-reasoning-orbit",
    name: "Agent Reasoning Orbit",
    category: "ai-agents",
    tagline: "Autonomous agent core firing sequential tool calls out to orbiting capability nodes.",
    description:
      "Pure SVG radial tool-calling schematic illustrating an autonomous agent sequentially invoking SEARCH, SQL, CODE, MEMORY, and SHELL tools with zero dependencies.",
    technique: "Pure SVG Agent Tool Orbit",
    fileName: "agent-reasoning-orbit.tsx",
    exportName: "AgentReasoningOrbit",
    dependencies: [],
    featured: true,
    usageSnippet: `import { AgentReasoningOrbit } from "@/components/raster/agent-reasoning-orbit";

export function AgentHero() {
  return (
    <AgentReasoningOrbit
      agentLabel="AGENT"
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "embedding-vector-cloud",
    name: "Embedding Vector Cloud",
    category: "ai-agents",
    tagline: "3D rotating semantic embedding clusters with live top-K nearest-neighbor lock-on.",
    description:
      "Projects three semantic neighborhoods in 3D space on pure Canvas2D while a drifting query vector dynamically connects to its closest matches.",
    technique: "3D Vector Space Canvas2D",
    fileName: "embedding-vector-cloud.tsx",
    exportName: "EmbeddingVectorCloud",
    dependencies: [],
    usageSnippet: `import { EmbeddingVectorCloud } from "@/components/raster/embedding-vector-cloud";

export function RagVisualizer() {
  return (
    <EmbeddingVectorCloud
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "attention-heatmap-matrix",
    name: "Attention Heatmap Matrix",
    category: "ai-agents",
    tagline: "Interactive transformer self-attention matrix with hoverable query/key weight inspection.",
    description:
      "Scans automatically across tokenized attention rows while allowing users to hover any (Query, Key) cell to read exact normalized attention weights.",
    technique: "Interactive Attention Matrix Grid",
    fileName: "attention-heatmap-matrix.tsx",
    exportName: "AttentionHeatmapMatrix",
    dependencies: [],
    usageSnippet: `import { AttentionHeatmapMatrix } from "@/components/raster/attention-heatmap-matrix";

export function TransformerCard() {
  return <AttentionHeatmapMatrix accentColor="#f27c63" />;
}`,
  },
  {
    slug: "bayer-dither-aurora",
    name: "Bayer Dither Aurora",
    category: "dither",
    tagline: "Billowing vertical northern-lights curtains quantized through a 4x4 Bayer matrix.",
    description:
      "Combines calm atmospheric aurora waves with unmistakable 1-bit ordered Bayer dithering on pure HTML5 Canvas2D with zero WebGL overhead.",
    technique: "4x4 Bayer Aurora Canvas2D",
    fileName: "bayer-dither-aurora.tsx",
    exportName: "BayerDitherAurora",
    dependencies: [],
    featured: true,
    usageSnippet: `import { BayerDitherAurora } from "@/components/raster/bayer-dither-aurora";

export function AuroraBanner() {
  return (
    <BayerDitherAurora
      pixelSize={3}
      accentRgb={[242, 124, 99]}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "isometric-server-rack",
    name: "Isometric Server Rack",
    category: "isometric",
    tagline: "1-bit Bayer-dithered isometric multi-blade server tower with blinking status LEDs.",
    description:
      "Crisp hardware-pixelated isometric compute stack cycling active blade indicators for cloud hosting, cluster scaling, and uptime feature cards.",
    technique: "1-Bit Isometric Rack Canvas2D",
    fileName: "isometric-server-rack.tsx",
    exportName: "IsometricServerRack",
    dependencies: [],
    usageSnippet: `import { IsometricServerRack } from "@/components/raster/isometric-server-rack";

export function ClusterTile() {
  return (
    <IsometricServerRack
      color="#e7e2da"
      accentColor="#f27c63"
      className="h-52 w-full rounded-xl"
    />
  );
}`,
  },
  {
    slug: "gravity-ripple-grid",
    name: "Gravity Ripple Grid",
    category: "physics",
    tagline: "Spacetime coordinate dot lattice warped inward by orbiting wells and pointer gravity.",
    description:
      "Displaces a clean architectural dot grid smoothly toward a drifting gravitational singularity or live cursor coordinates on pure Canvas2D.",
    technique: "Gravitational Field Canvas2D",
    fileName: "gravity-ripple-grid.tsx",
    exportName: "GravityRippleGrid",
    dependencies: [],
    usageSnippet: `import { GravityRippleGrid } from "@/components/raster/gravity-ripple-grid";

export function SpacetimeBackdrop() {
  return (
    <GravityRippleGrid
      gridGap={18}
      accentColor="#f27c63"
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "encryption-cipher-vault",
    name: "Encryption Cipher Vault",
    category: "security",
    tagline: "Counter-rotating calibrated cipher rings and rolling hex indices guarding a lock core.",
    description:
      "Hardware enclave visualizer pairing engraved radial tick rings, rotating hex keystreams, and a precision geometric lock emblem on pure Canvas2D.",
    technique: "Concentric Cipher Canvas2D",
    fileName: "encryption-cipher-vault.tsx",
    exportName: "EncryptionCipherVault",
    dependencies: [],
    featured: true,
    usageSnippet: `import { EncryptionCipherVault } from "@/components/raster/encryption-cipher-vault";

export function VaultCard() {
  return (
    <EncryptionCipherVault
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "zero-trust-firewall",
    name: "Zero Trust Firewall",
    category: "security",
    tagline: "Edge inspection barrier letting verified traffic glide through while deflecting threats.",
    description:
      "Streams incoming packets toward a segmented WAF shield wall where authorized requests pass cleanly and blocked probes spark and ricochet back.",
    technique: "Packet Inspection Canvas2D",
    fileName: "zero-trust-firewall.tsx",
    exportName: "ZeroTrustFirewall",
    dependencies: [],
    featured: true,
    usageSnippet: `import { ZeroTrustFirewall } from "@/components/raster/zero-trust-firewall";

export function FirewallHero() {
  return (
    <ZeroTrustFirewall
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "hash-chain-ledger",
    name: "Hash Chain Ledger",
    category: "security",
    tagline: "Immutable linked cryptographic audit blocks sealing sequentially with glowing digests.",
    description:
      "Displays an ordered audit-log ledger cycling active verification seals across linked hash blocks with zero external dependencies.",
    technique: "Pure React Hash-Chain Strip",
    fileName: "hash-chain-ledger.tsx",
    exportName: "HashChainLedger",
    dependencies: [],
    usageSnippet: `import { HashChainLedger } from "@/components/raster/hash-chain-ledger";

export function AuditLogCard() {
  return <HashChainLedger accentColor="#f27c63" />;
}`,
  },
  {
    slug: "biometric-iris-scanner",
    name: "Biometric Iris Scanner",
    category: "security",
    tagline: "Optical iris verification reticle with fine radial fibers and sweeping laser scan.",
    description:
      "Renders a high-contrast biometric optical viewfinder with 64 radial striations illuminating dynamically as a horizontal laser verification beam sweeps across.",
    technique: "Optical Reticle Canvas2D",
    fileName: "biometric-iris-scanner.tsx",
    exportName: "BiometricIrisScanner",
    dependencies: [],
    usageSnippet: `import { BiometricIrisScanner } from "@/components/raster/biometric-iris-scanner";

export function PasskeyCard() {
  return (
    <BiometricIrisScanner
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "retro-perspective-grid",
    name: "Retro Perspective Grid",
    category: "spatial",
    tagline: "Architectural obsidian vanishing-point runway scrolling beneath a subtle horizon glow.",
    description:
      "Clean, restrained dark-mode perspective grid with exponentially spaced depth lines and a glowing center meridian on pure Canvas2D.",
    technique: "3D Horizon Perspective Canvas2D",
    fileName: "retro-perspective-grid.tsx",
    exportName: "RetroPerspectiveGrid",
    dependencies: [],
    featured: true,
    usageSnippet: `import { RetroPerspectiveGrid } from "@/components/raster/retro-perspective-grid";

export function HorizonBackdrop() {
  return (
    <RetroPerspectiveGrid
      accentColor="#f27c63"
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "isometric-signal-tower",
    name: "Isometric Signal Tower",
    category: "isometric",
    tagline: "1-bit Bayer-dithered isometric broadcast spire radiating expanding pixel radio rings.",
    description:
      "Hardware-pixelated isometric radio tower over a dark pedestal emitting rhythmic concentric 1-bit broadcast waves for real-time edge or pub/sub cards.",
    technique: "1-Bit Isometric Spire Canvas2D",
    fileName: "isometric-signal-tower.tsx",
    exportName: "IsometricSignalTower",
    dependencies: [],
    usageSnippet: `import { IsometricSignalTower } from "@/components/raster/isometric-signal-tower";

export function BroadcastTile() {
  return (
    <IsometricSignalTower
      color="#e7e2da"
      accentColor="#f27c63"
      className="h-52 w-full rounded-xl"
    />
  );
}`,
  },
  {
    slug: "segmented-toggle-rail",
    name: "Segmented Toggle Rail",
    category: "ui-motion",
    tagline: "Interactive obsidian segmented tab bar with a smooth GPU-gliding specular capsule.",
    description:
      "Zero-dependency tactile segmented control using CSS spring easing to slide an elevated dark active pill and indicator dot seamlessly between views.",
    technique: "Pure React + GPU Sliding Pill",
    fileName: "segmented-toggle-rail.tsx",
    exportName: "SegmentedToggleRail",
    dependencies: [],
    usageSnippet: `import { SegmentedToggleRail } from "@/components/raster/segmented-toggle-rail";

export function ModeSwitcher() {
  return (
    <SegmentedToggleRail
      options={["Overview", "Streams", "Circuits", "Logs"]}
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "metric-gauge-arc",
    name: "Metric Gauge Arc",
    category: "telemetry",
    tagline: "Calibrated SVG radial instrument gauge with hairline ticks and smooth arc sweep.",
    description:
      "Precision Braun-inspired radial gauge animating a glowing SVG progress arc and tabular readout across calibrated degree ticks with zero external packages.",
    technique: "Pure SVG Radial Telemetry Dial",
    fileName: "metric-gauge-arc.tsx",
    exportName: "MetricGaugeArc",
    dependencies: [],
    usageSnippet: `import { MetricGaugeArc } from "@/components/raster/metric-gauge-arc";

export function SlaTile() {
  return (
    <MetricGaugeArc
      label="EDGE SLA"
      values={[84, 96, 91, 99]}
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "command-palette-preview",
    name: "Command Palette Preview",
    category: "website-blocks",
    tagline: "Interactive Cmd+K search palette with live filtering, active row indicator, and shortcuts.",
    description:
      "Production-ready obsidian command modal that filters actions in real time, highlights active rows cleanly, and showcases keyboard-first SaaS UX with zero dependencies.",
    technique: "Interactive React Cmd+K Palette",
    fileName: "command-palette-preview.tsx",
    exportName: "CommandPalettePreview",
    dependencies: [],
    featured: true,
    usageSnippet: `import { CommandPalettePreview } from "@/components/raster/command-palette-preview";

export function ProductDemo() {
  return <CommandPalettePreview accentColor="#f27c63" />;
}`,
  },
  {
    slug: "before-after-slider",
    name: "Before After Slider",
    category: "website-blocks",
    tagline: "Draggable split comparison curtain with luminous vertical handle and keyboard arrows.",
    description:
      "Lets visitors drag or scrub cleanly between two visual or performance states using CSS clip-path and native pointer capture with zero dependencies.",
    technique: "Pointer Capture + CSS clip-path",
    fileName: "before-after-slider.tsx",
    exportName: "BeforeAfterSlider",
    dependencies: [],
    featured: true,
    usageSnippet: `import { BeforeAfterSlider } from "@/components/raster/before-after-slider";

export function PerformanceProof() {
  return (
    <BeforeAfterSlider
      accentColor="#f27c63"
      className="h-64 w-full"
    />
  );
}`,
  },
  {
    slug: "code-diff-viewer",
    name: "Code Diff Viewer",
    category: "website-blocks",
    tagline: "IDE-grade interactive code diff card with Diff/Clean tabs and 1-click clipboard copy.",
    description:
      "Highlights removed dependencies and added clean imports side-by-side with instant toggle to the final copyable snippet for developer landing pages.",
    technique: "Interactive React Diff + Copy Card",
    fileName: "code-diff-viewer.tsx",
    exportName: "CodeDiffViewer",
    dependencies: [],
    featured: true,
    usageSnippet: `import { CodeDiffViewer } from "@/components/raster/code-diff-viewer";

export function MigrationCard() {
  return (
    <CodeDiffViewer
      fileName="src/components/hero.tsx"
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "pricing-toggle-card",
    name: "Pricing Toggle Card",
    category: "website-blocks",
    tagline: "Elevated obsidian pricing tier card with Monthly/Annual billing switch and tabular price.",
    description:
      "Clean SaaS monetization card with specular top rim lighting, instant billing cadence toggle, savings badge, and accessible contrast.",
    technique: "Interactive Billing Tier Card",
    fileName: "pricing-toggle-card.tsx",
    exportName: "PricingToggleCard",
    dependencies: [],
    usageSnippet: `import { PricingToggleCard } from "@/components/raster/pricing-toggle-card";

export function PricingSection() {
  return (
    <PricingToggleCard
      planName="Pro Studio"
      monthlyPrice={29}
      annualPrice={22}
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "interactive-accordion-list",
    name: "Interactive Accordion List",
    category: "website-blocks",
    tagline: "Silky pure-CSS grid-row FAQ & feature disclosure list with rotating plus indicator.",
    description:
      "Smoothly animates panel height via CSS grid-template-rows (0fr to 1fr) with a glowing active left hairline and zero layout jitter.",
    technique: "Pure CSS Grid-Row Accordion",
    fileName: "interactive-accordion-list.tsx",
    exportName: "InteractiveAccordionList",
    dependencies: [],
    usageSnippet: `import { InteractiveAccordionList } from "@/components/raster/interactive-accordion-list";

export function FaqBlock() {
  return <InteractiveAccordionList accentColor="#f27c63" />;
}`,
  },
  {
    slug: "floating-island-navbar",
    name: "Floating Island Navbar",
    category: "website-blocks",
    tagline: "Frosted obsidian pill navbar with a hover-gliding glass capsule behind navigation links.",
    description:
      "Apple and Linear inspired floating header bar that smoothly tracks hovered or active links using GPU-composited transforms and a specular rim border.",
    technique: "GPU Sliding Pill Floating Header",
    fileName: "floating-island-navbar.tsx",
    exportName: "FloatingIslandNavbar",
    dependencies: [],
    featured: true,
    usageSnippet: `import { FloatingIslandNavbar } from "@/components/raster/floating-island-navbar";

export function SiteHeader() {
  return (
    <FloatingIslandNavbar
      brand="raster"
      ctaLabel="Start"
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "bento-feature-switcher",
    name: "Bento Feature Switcher",
    category: "website-blocks",
    tagline: "Auto-advancing clickable feature tabs paired with a live telemetry spec stage.",
    description:
      "Cycles smoothly through core product pillars while letting visitors click any row directly to inspect specs and metrics with zero external libraries.",
    technique: "Interactive Feature Showcase Tabs",
    fileName: "bento-feature-switcher.tsx",
    exportName: "BentoFeatureSwitcher",
    dependencies: [],
    usageSnippet: `import { BentoFeatureSwitcher } from "@/components/raster/bento-feature-switcher";

export function FeatureTour() {
  return <BentoFeatureSwitcher accentColor="#f27c63" />;
}`,
  },
  {
    slug: "word-flip-headline",
    name: "Word Flip Headline",
    category: "typography",
    tagline: "Kinetic rotating hero headline cycling value-prop words with vertical blur-in entrance.",
    description:
      "Classic hero conversion headline that smoothly rotates emphasized adjectives with pure CSS blur-to-sharp upward motion and reduced-motion support.",
    technique: "Pure CSS Vertical Blur Flip Type",
    fileName: "word-flip-headline.tsx",
    exportName: "WordFlipHeadline",
    dependencies: [],
    featured: true,
    usageSnippet: `import { WordFlipHeadline } from "@/components/raster/word-flip-headline";

export function HeroHeading() {
  return (
    <WordFlipHeadline
      prefix="Build websites that feel"
      words={["effortless", "razor-sharp", "weightless", "unforgettable"]}
      accentColor="#f27c63"
      className="text-4xl sm:text-5xl"
    />
  );
}`,
  },
  {
    slug: "signature-draw-path",
    name: "Signature Draw Path",
    category: "editorial",
    tagline: "Calligraphic SVG fountain-pen signature drawing itself smoothly with an accent flourish.",
    description:
      "Pure CSS stroke-dashoffset signature reveal over a dashed editorial baseline rule. Built for founder notes, manifestos, and bespoke sign-off sections.",
    technique: "Pure SVG stroke-dashoffset Reveal",
    fileName: "signature-draw-path.tsx",
    exportName: "SignatureDrawPath",
    dependencies: [],
    featured: true,
    usageSnippet: `import { SignatureDrawPath } from "@/components/raster/signature-draw-path";

export function FounderNote() {
  return (
    <SignatureDrawPath
      caption="RASTER FOUNDRY · EDITION 01"
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "card-deck-fan",
    name: "Card Deck Fan",
    category: "editorial",
    tagline: "Interactive 3D fanned obsidian card stack that smoothly deals cards to the back on click.",
    description:
      "Tactile layered card fan with directional tilt, elevation shadow, and spring-eased cycling for changelogs, highlights, or interactive product decks.",
    technique: "Layered 3D CSS Fan Deck",
    fileName: "card-deck-fan.tsx",
    exportName: "CardDeckFan",
    dependencies: [],
    featured: true,
    usageSnippet: `import { CardDeckFan } from "@/components/raster/card-deck-fan";

export function HighlightStack() {
  return <CardDeckFan accentColor="#f27c63" />;
}`,
  },
  {
    slug: "timeline-milestone-rail",
    name: "Timeline Milestone Rail",
    category: "editorial",
    tagline: "Vertical changelog & roadmap timeline with a glowing spine and clickable release nodes.",
    description:
      "Clean obsidian version history rail illuminating the active spine segment and release badge with zero external libraries.",
    technique: "Interactive Vertical Spine Rail",
    fileName: "timeline-milestone-rail.tsx",
    exportName: "TimelineMilestoneRail",
    dependencies: [],
    usageSnippet: `import { TimelineMilestoneRail } from "@/components/raster/timeline-milestone-rail";

export function ChangelogRail() {
  return <TimelineMilestoneRail accentColor="#f27c63" />;
}`,
  },
  {
    slug: "liquid-metaball-blob",
    name: "Liquid Metaball Blob",
    category: "editorial",
    tagline: "Organic SVG gooey metaball droplets fusing and splitting cleanly like molten mercury.",
    description:
      "Uses a pure SVG Gaussian blur and alpha color-matrix threshold filter so orbiting spheres merge organically with zero JavaScript animation loops.",
    technique: "Pure SVG feColorMatrix Metaballs",
    fileName: "liquid-metaball-blob.tsx",
    exportName: "LiquidMetaballBlob",
    dependencies: [],
    featured: true,
    usageSnippet: `import { LiquidMetaballBlob } from "@/components/raster/liquid-metaball-blob";

export function FluidVisual() {
  return (
    <LiquidMetaballBlob
      accentColor="#f27c63"
      className="h-64 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "browser-frame-mockup",
    name: "Browser Frame Mockup",
    category: "website-blocks",
    tagline: "Interactive Desktop, Tablet, and Mobile viewport morpher window with live grid reflow.",
    description:
      "Click between device presets to smoothly resize an obsidian browser chrome and demonstrate responsive UI layouts inside feature sections.",
    technique: "Responsive CSS Width Morpher",
    fileName: "browser-frame-mockup.tsx",
    exportName: "BrowserFrameMockup",
    dependencies: [],
    featured: true,
    usageSnippet: `import { BrowserFrameMockup } from "@/components/raster/browser-frame-mockup";

export function ResponsiveDemo() {
  return (
    <BrowserFrameMockup
      url="raster.dev/showcase"
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "spotlight-testimonial-card",
    name: "Spotlight Testimonial Card",
    category: "website-blocks",
    tagline: "Editorial dark quote card cycling builder testimonials with clickable progress dots.",
    description:
      "Pairs oversized serif opening quotation marks, avatar monograms, and smooth progress indicators for clean social-proof sections.",
    technique: "Editorial Quote Switcher Card",
    fileName: "spotlight-testimonial-card.tsx",
    exportName: "SpotlightTestimonialCard",
    dependencies: [],
    usageSnippet: `import { SpotlightTestimonialCard } from "@/components/raster/spotlight-testimonial-card";

export function SocialProof() {
  return <SpotlightTestimonialCard accentColor="#f27c63" />;
}`,
  },
  {
    slug: "radial-context-menu",
    name: "Radial Context Menu",
    category: "ui-motion",
    tagline: "Clickable circular pie action wheel blooming six radial pills around a glowing core.",
    description:
      "Inspired by creative-tool radial wheels: click the central hub to fan out six crisp action pills with trigonometric layout and live selection feedback.",
    technique: "Trigonometric CSS Radial Wheel",
    fileName: "radial-context-menu.tsx",
    exportName: "RadialContextMenu",
    dependencies: [],
    featured: true,
    usageSnippet: `import { RadialContextMenu } from "@/components/raster/radial-context-menu";

export function QuickWheel() {
  return <RadialContextMenu accentColor="#f27c63" />;
}`,
  },
  {
    slug: "thermal-heatmap-calendar",
    name: "Thermal Heatmap Calendar",
    category: "telemetry",
    tagline: "Interactive 16-week contribution and deploy activity calendar with hover event readout.",
    description:
      "Deterministic multi-week thermal intensity lattice displaying live day-level event counts on hover with zero charting packages.",
    technique: "Interactive CSS Activity Matrix",
    fileName: "thermal-heatmap-calendar.tsx",
    exportName: "ThermalHeatmapCalendar",
    dependencies: [],
    usageSnippet: `import { ThermalHeatmapCalendar } from "@/components/raster/thermal-heatmap-calendar";

export function VelocityHeatmap() {
  return (
    <ThermalHeatmapCalendar
      weeks={16}
      accentColor="#f27c63"
    />
  );
}`,
  },
  {
    slug: "grain-gradient-orbs",
    name: "Grain Gradient Orbs",
    category: "shaders",
    tagline: "Opposite-corner iridescent chromatic orbs scattered through tactile analog film grain.",
    description:
      "Perturbs smooth breathing corner radial fields with screen-locked stochastic grain before multi-stop color lookup for authentic Paper-style stippled gradients with zero WebGL limits.",
    technique: "Stochastic LUT Grain Shader Canvas2D",
    fileName: "grain-gradient-orbs.tsx",
    exportName: "GrainGradientOrbs",
    dependencies: [],
    featured: true,
    usageSnippet: `import { GrainGradientOrbs } from "@/components/raster/grain-gradient-orbs";

export function ShaderHero() {
  return (
    <GrainGradientOrbs
      colors={["#030307", "#6d28d9", "#f0abfc", "#00c2ff", "#1d4ed8"]}
      grain={0.2}
      className="h-80 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "grain-mesh-warp",
    name: "Grain Mesh Warp",
    category: "shaders",
    tagline: "Two-stage domain-warped liquid color folds dissolved in fine stochastic film grain.",
    description:
      "Evaluates an animated trigonometric domain warp across a smooth 256-step chromatic LUT with crisp screen-space analog stippling and zero external dependencies.",
    technique: "Domain-Warp LUT Shader Canvas2D",
    fileName: "grain-mesh-warp.tsx",
    exportName: "GrainMeshWarp",
    dependencies: [],
    featured: true,
    usageSnippet: `import { GrainMeshWarp } from "@/components/raster/grain-mesh-warp";

export function FluidBanner() {
  return (
    <GrainMeshWarp
      grain={0.19}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "smoke-ring-shader",
    name: "Smoke Ring Shader",
    category: "shaders",
    tagline: "Luminous turbulent eclipse halo with curling atmospheric wisps and stippled grain falloff.",
    description:
      "Deforms a glowing orbital smoke ring with multi-harmonic angular waves and scatters its perimeter cleanly into deep obsidian using zero WebGL contexts.",
    technique: "Turbulent Ring LUT Shader Canvas2D",
    fileName: "smoke-ring-shader.tsx",
    exportName: "SmokeRingShader",
    dependencies: [],
    featured: true,
    usageSnippet: `import { SmokeRingShader } from "@/components/raster/smoke-ring-shader";

export function EclipseStage() {
  return (
    <SmokeRingShader
      grain={0.2}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "neuro-plasma-field",
    name: "Neuro Plasma Field",
    category: "shaders",
    tagline: "Bioluminescent ridged interference filaments glowing like neural silk across obsidian.",
    description:
      "Synthesizes sharp multifractal ridge creases that drift organically through a rich chromatic ramp with crisp tactile film grain.",
    technique: "Ridged Filament LUT Shader Canvas2D",
    fileName: "neuro-plasma-field.tsx",
    exportName: "NeuroPlasmaField",
    dependencies: [],
    usageSnippet: `import { NeuroPlasmaField } from "@/components/raster/neuro-plasma-field";

export function AiAtmosphere() {
  return (
    <NeuroPlasmaField
      grain={0.16}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "chromatic-god-rays",
    name: "Chromatic God Rays",
    category: "shaders",
    tagline: "Volumetric diagonal prism shafts sweeping through stippled dark atmospheric dust.",
    description:
      "Projects angular interference light beams down from an upper corner emitter with exponential depth falloff and screen-space analog film grain.",
    technique: "Volumetric Ray LUT Shader Canvas2D",
    fileName: "chromatic-god-rays.tsx",
    exportName: "ChromaticGodRays",
    dependencies: [],
    featured: true,
    usageSnippet: `import { ChromaticGodRays } from "@/components/raster/chromatic-god-rays";

export function LightBackdrop() {
  return (
    <ChromaticGodRays
      grain={0.19}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "liquid-chrome-ripple",
    name: "Liquid Chrome Ripple",
    category: "shaders",
    tagline: "Iridescent liquid mercury height waves with razor-sharp pearlescent specular bands.",
    description:
      "Interferes dual fluid wave emitters and maps specular reflection bands across an obsidian-to-pearl iridescent ramp with subtle analog grain.",
    technique: "Specular Fluid LUT Shader Canvas2D",
    fileName: "liquid-chrome-ripple.tsx",
    exportName: "LiquidChromeRipple",
    dependencies: [],
    usageSnippet: `import { LiquidChromeRipple } from "@/components/raster/liquid-chrome-ripple";

export function ChromeCard() {
  return (
    <LiquidChromeRipple
      grain={0.13}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "stippled-vortex-swirl",
    name: "Stippled Vortex Swirl",
    category: "shaders",
    tagline: "Twisting multi-arm chromatic spiral vortex dispersing into fine grain-dithered sparks.",
    description:
      "Combines polar logarithmic spiral ribbons, a deep black singularity center, and stochastic film grain dispersion on pure Canvas2D.",
    technique: "Polar Vortex LUT Shader Canvas2D",
    fileName: "stippled-vortex-swirl.tsx",
    exportName: "StippledVortexSwirl",
    dependencies: [],
    usageSnippet: `import { StippledVortexSwirl } from "@/components/raster/stippled-vortex-swirl";

export function VortexHero() {
  return (
    <StippledVortexSwirl
      grain={0.22}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
  {
    slug: "prism-caustic-veil",
    name: "Prism Caustic Veil",
    category: "shaders",
    tagline: "Refractive optical glass caustic webs with subtle RGB chromatic fringe dispersion.",
    description:
      "Evaluates phase-offset RGB caustic interference channels to synthesize prismatic water-and-glass light refractions layered with fine analog grain.",
    technique: "RGB Dispersion Caustic Canvas2D",
    fileName: "prism-caustic-veil.tsx",
    exportName: "PrismCausticVeil",
    dependencies: [],
    usageSnippet: `import { PrismCausticVeil } from "@/components/raster/prism-caustic-veil";

export function GlassBackdrop() {
  return (
    <PrismCausticVeil
      grain={0.16}
      className="h-72 w-full rounded-2xl"
    />
  );
}`,
  },
];

export function getComponentSpecBySlug(slug: string): RasterComponentSpec | undefined {
  return RASTER_COMPONENTS.find((c) => c.slug === slug);
}
