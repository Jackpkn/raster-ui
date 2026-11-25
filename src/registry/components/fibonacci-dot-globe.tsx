"use client";

import { useEffect, useRef } from "react";

export interface FibonacciDotGlobeProps {
  /** Number of Fibonacci lattice dots on the sphere (500-2200). */
  dotCount?: number;
  /** Dot color in RGB [R, G, B]. */
  dotRgb?: [number, number, number];
  /** Beacon & geodesic arc accent hex color. */
  accentColor?: string;
  /** Background surface color. */
  backgroundColor?: string;
  /** Auto-rotation speed multiplier. */
  speed?: number;
  /** Pause auto-rotation (dragging still works). */
  paused?: boolean;
  className?: string;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const HUBS: Array<{ lat: number; lng: number }> = [
  { lat: 37.77, lng: -122.41 }, // San Francisco
  { lat: 40.71, lng: -74.0 }, // New York
  { lat: 51.5, lng: -0.12 }, // London
  { lat: 48.13, lng: 11.58 }, // Munich
  { lat: 12.97, lng: 77.59 }, // Bengaluru
  { lat: 35.67, lng: 139.65 }, // Tokyo
  { lat: 1.35, lng: 103.82 }, // Singapore
];

const ARCS: Array<[number, number]> = [
  [0, 2],
  [2, 4],
  [4, 5],
  [1, 3],
  [4, 6],
];

function latLngToVec3(latDeg: number, lngDeg: number): Vec3 {
  const lat = (latDeg * Math.PI) / 180;
  const lng = (lngDeg * Math.PI) / 180;
  const cos = Math.cos(lat);
  return { x: cos * Math.sin(lng), y: Math.sin(lat), z: cos * Math.cos(lng) };
}

function rotate(p: Vec3, yaw: number, pitch: number): Vec3 {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return { x: x1, y: p.y * cp - z1 * sp, z: p.y * sp + z1 * cp };
}

function buildSphereDots(n: number): Vec3[] {
  const pts: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r });
  }
  return pts;
}

/**
 * Zero-Dependency Interactive 3D Fibonacci Dot Globe.
 * Supports pointer drag + momentum inertia, glowing geodesic arcs, and hub beacons on pure Canvas2D.
 */
export function FibonacciDotGlobe({
  dotCount = 900,
  dotRgb = [245, 240, 233],
  accentColor = "#f27c63",
  backgroundColor = "#08080b",
  speed = 1,
  paused = false,
  className = "",
}: FibonacciDotGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef({
    yaw: 0.9,
    pitch: 0.3,
    dragging: false,
    lastX: 0,
    lastY: 0,
    velYaw: 0,
  });

  const dr = dotRgb[0];
  const dg = dotRgb[1];
  const db = dotRgb[2];

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dots = buildSphereDots(Math.max(300, Math.min(2400, dotCount)));
    const hubVecs = HUBS.map((h) => latLngToVec3(h.lat, h.lng));
    const arcCurves = ARCS.map(([a, b]) => {
      const v0 = hubVecs[a]!;
      const v1 = hubVecs[b]!;
      const curve: Vec3[] = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const x = v0.x * (1 - t) + v1.x * t;
        const y = v0.y * (1 - t) + v1.y * t;
        const z = v0.z * (1 - t) + v1.z * t;
        const len = Math.hypot(x, y, z) || 1;
        const lift = 1 + 0.16 * Math.sin(Math.PI * t);
        curve.push({ x: (x / len) * lift, y: (y / len) * lift, z: (z / len) * lift });
      }
      return curve;
    });

    let width = 320;
    let height = 320;
    let dpr = 1;
    let visible = true;
    let rafId = 0;
    let lastTime = performance.now();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(160, Math.floor(rect.width));
      height = Math.max(160, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const draw = (now: number) => {
      rafId = window.requestAnimationFrame(draw);
      if (!visible) return;

      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const st = dragRef.current;

      if (!st.dragging) {
        if (Math.abs(st.velYaw) > 0.0008) {
          st.yaw += st.velYaw;
          st.velYaw *= 0.92;
        } else if (!paused && !prefersReduced) {
          st.yaw += dt * 0.22 * speed;
        }
      }

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.4;

      ctx.clearRect(0, 0, width, height);

      // Sphere shading
      const grad = ctx.createRadialGradient(
        cx - radius * 0.34,
        cy - radius * 0.34,
        radius * 0.08,
        cx,
        cy,
        radius
      );
      grad.addColorStop(0, "#23212a");
      grad.addColorStop(0.65, "#131218");
      grad.addColorStop(1, "#09080c");
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 250, 245, 0.14)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Fibonacci lattice dots
      for (let i = 0; i < dots.length; i++) {
        const rp = rotate(dots[i]!, st.yaw, st.pitch);
        if (rp.z <= -0.02) continue;
        const depth = Math.max(0, Math.min(1, rp.z));
        ctx.fillStyle = `rgba(${dr}, ${dg}, ${db}, ${(0.12 + depth * 0.56).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(cx + rp.x * radius, cy - rp.y * radius, 0.8 + depth * 0.85, 0, Math.PI * 2);
        ctx.fill();
      }

      // Geodesic arcs
      ctx.strokeStyle = `${accentColor}66`;
      ctx.lineWidth = 1.25;
      for (const pts of arcCurves) {
        ctx.beginPath();
        let active = false;
        for (const p of pts) {
          const rp = rotate(p, st.yaw, st.pitch);
          if (rp.z > -0.02) {
            const sx = cx + rp.x * radius;
            const sy = cy - rp.y * radius;
            if (!active) {
              ctx.moveTo(sx, sy);
              active = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            active = false;
          }
        }
        ctx.stroke();
      }

      // Pulsing hub beacons
      const pulse = paused || prefersReduced ? 0.5 : 0.5 + 0.5 * Math.sin(now * 0.0022);
      for (const hv of hubVecs) {
        const rp = rotate(hv, st.yaw, st.pitch);
        if (rp.z <= 0.08) continue;
        const sx = cx + rp.x * radius;
        const sy = cy - rp.y * radius;
        ctx.beginPath();
        ctx.arc(sx, sy, 4 + pulse * 4, 0, Math.PI * 2);
        ctx.fillStyle = `${accentColor}38`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.fill();
      }
    };

    rafId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [dotCount, dr, dg, db, accentColor, speed, paused]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none touch-none ${className}`}
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive 3D Fibonacci dot globe. Drag to rotate."
        className="block h-full w-full cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          dragRef.current.dragging = true;
          dragRef.current.velYaw = 0;
          dragRef.current.lastX = e.clientX;
          dragRef.current.lastY = e.clientY;
        }}
        onPointerMove={(e) => {
          if (!dragRef.current.dragging) return;
          const dx = e.clientX - dragRef.current.lastX;
          const dy = e.clientY - dragRef.current.lastY;
          dragRef.current.yaw += dx * 0.008;
          dragRef.current.pitch = Math.max(-0.8, Math.min(0.8, dragRef.current.pitch + dy * 0.007));
          dragRef.current.velYaw = dx * 0.002;
          dragRef.current.lastX = e.clientX;
          dragRef.current.lastY = e.clientY;
        }}
        onPointerUp={() => {
          dragRef.current.dragging = false;
        }}
        onPointerCancel={() => {
          dragRef.current.dragging = false;
        }}
      />
    </div>
  );
}
