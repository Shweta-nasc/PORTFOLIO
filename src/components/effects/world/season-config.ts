import * as THREE from "three";
import { clamp, smoothstep, type TimeOfDay } from "./terrain-noise";

/* -------------------------------------------------------------------------- */
/*  Season Manager                                                            */
/*                                                                            */
/*  Scroll progress (0..1) is a journey through the year. This module turns   */
/*  that scalar into a fully-interpolated atmosphere: terrain/forest/fog      */
/*  tints, weather weights (rain/snow/storm), cloud cover and a continuous    */
/*  `index` (0..4) that the particle shader uses to cross-fade between        */
/*  petals → pollen → rain → leaves → snow. Nothing ever snaps; every value   */
/*  eases between the two nearest season stops.                               */
/* -------------------------------------------------------------------------- */

export type SeasonName = "Spring" | "Summer" | "Monsoon" | "Autumn" | "Winter";

export interface SeasonState {
  progress: number;
  /** Continuous 0..4 — drives the particle behaviour cross-fade. */
  index: number;
  name: SeasonName;
  /** Tint targets (consumers ease their own colour toward these). */
  terrain: THREE.Color;
  forest: THREE.Color;
  fog: THREE.Color;
  fogNear: number;
  fogFar: number;
  /** Multiplier applied to the sun so monsoon reads dim & overcast. */
  sunDim: number;
  rain: number;
  snow: number;
  storm: number;
  cloudCover: number;
  cloudOpacity: number;
  accent: string;
}

interface SeasonStop {
  p: number;
  name: SeasonName;
  terrain: string;
  forest: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  sunDim: number;
  rain: number;
  snow: number;
  storm: number;
  cloudCover: number;
  cloudOpacity: number;
  accent: string;
}

const STOPS: SeasonStop[] = [
  // Spring — fresh green valleys, cherry-blossom air, soft morning haze.
  { p: 0.0, name: "Spring", terrain: "#5f8a3f", forest: "#3f7a34", fog: "#d6e4e4", fogNear: 62, fogFar: 360, sunDim: 1.0, rain: 0, snow: 0, storm: 0, cloudCover: 0.4, cloudOpacity: 0.42, accent: "#f4a9c4" },
  // Summer — lush deep green, bright blue sky, big fluffy clouds.
  { p: 0.24, name: "Summer", terrain: "#3f6f2b", forest: "#2f5a22", fog: "#bcd6ea", fogNear: 72, fogFar: 410, sunDim: 1.12, rain: 0, snow: 0, storm: 0, cloudCover: 0.5, cloudOpacity: 0.5, accent: "#4eba8c" },
  // Monsoon — overcast, dim, dense fog, rain & lightning.
  { p: 0.5, name: "Monsoon", terrain: "#33512c", forest: "#254019", fog: "#59636e", fogNear: 34, fogFar: 205, sunDim: 0.4, rain: 1, snow: 0, storm: 1, cloudCover: 1.0, cloudOpacity: 0.92, accent: "#8ea3b5" },
  // Autumn — golden hills, warm haze, falling maple leaves.
  { p: 0.74, name: "Autumn", terrain: "#9c6b2b", forest: "#a55a1e", fog: "#caa26a", fogNear: 55, fogFar: 335, sunDim: 0.95, rain: 0, snow: 0, storm: 0, cloudCover: 0.35, cloudOpacity: 0.4, accent: "#e08a3c" },
  // Winter — snow-white peaks, pale icy air, still & peaceful.
  { p: 1.0, name: "Winter", terrain: "#e7eef5", forest: "#9fb1bd", fog: "#c8d6e2", fogNear: 48, fogFar: 300, sunDim: 0.78, rain: 0, snow: 1, storm: 0, cloudCover: 0.6, cloudOpacity: 0.55, accent: "#bfe3ff" },
];

// Pre-parse stop colours once so `seasonAt` only allocates the 3 output colours.
const STOP_COLORS = STOPS.map((s) => ({
  terrain: new THREE.Color(s.terrain),
  forest: new THREE.Color(s.forest),
  fog: new THREE.Color(s.fog),
}));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Interpolated season atmosphere for a scroll position `p` in [0,1]. */
export function seasonAt(p: number): SeasonState {
  const prog = clamp(p, 0, 1);
  let i = 0;
  for (let k = 0; k < STOPS.length - 1; k += 1) {
    if (prog >= STOPS[k].p && prog <= STOPS[k + 1].p) {
      i = k;
      break;
    }
    if (prog > STOPS[k + 1].p) i = k + 1;
  }
  const lo = STOPS[i];
  const hi = STOPS[Math.min(i + 1, STOPS.length - 1)];
  const span = hi.p - lo.p || 1;
  const t = smoothstep(0, 1, (prog - lo.p) / span);

  return {
    progress: prog,
    index: i + t,
    name: t < 0.5 ? lo.name : hi.name,
    terrain: new THREE.Color().lerpColors(STOP_COLORS[i].terrain, STOP_COLORS[Math.min(i + 1, 4)].terrain, t),
    forest: new THREE.Color().lerpColors(STOP_COLORS[i].forest, STOP_COLORS[Math.min(i + 1, 4)].forest, t),
    fog: new THREE.Color().lerpColors(STOP_COLORS[i].fog, STOP_COLORS[Math.min(i + 1, 4)].fog, t),
    fogNear: lerp(lo.fogNear, hi.fogNear, t),
    fogFar: lerp(lo.fogFar, hi.fogFar, t),
    sunDim: lerp(lo.sunDim, hi.sunDim, t),
    rain: lerp(lo.rain, hi.rain, t),
    snow: lerp(lo.snow, hi.snow, t),
    storm: lerp(lo.storm, hi.storm, t),
    cloudCover: lerp(lo.cloudCover, hi.cloudCover, t),
    cloudOpacity: lerp(lo.cloudOpacity, hi.cloudOpacity, t),
    accent: t < 0.5 ? lo.accent : hi.accent,
  };
}

/**
 * The full journey state carried through the scene as a mutable ref (updated
 * on scroll, read every frame). Continuous values are eased by each consumer
 * so transitions stay cinematic and never snap.
 */
export interface Journey {
  progress: number;
  tod: TimeOfDay;
  season: SeasonState;
}

/** Short time-of-day phase label for the on-screen journey HUD. */
export function phaseLabel(p: number): string {
  if (p < 0.34) return "Morning";
  if (p < 0.55) return "Midday";
  if (p < 0.7) return "Golden hour";
  if (p < 0.86) return "Dusk";
  return "Night";
}
