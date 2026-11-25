export type RasterCategoryId =
  | "all"
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
];

export function getComponentSpecBySlug(slug: string): RasterComponentSpec | undefined {
  return RASTER_COMPONENTS.find((c) => c.slug === slug);
}
