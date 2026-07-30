import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  Math helpers                                                              */
/* -------------------------------------------------------------------------- */

export const clamp = (x: number, lo: number, hi: number) =>
  x < lo ? lo : x > hi ? hi : x;

export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* -------------------------------------------------------------------------- */
/*  Value noise + ridged fBm                                                  */
/* -------------------------------------------------------------------------- */

function hash(x: number, z: number): number {
  const n = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function valueNoise(x: number, z: number): number {
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const xf = x - xi;
  const zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = zf * zf * (3 - 2 * zf);
  const a = hash(xi, zi);
  const b = hash(xi + 1, zi);
  const c = hash(xi, zi + 1);
  const d = hash(xi + 1, zi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}

/** Ridged multifractal — sharp alpine ridgelines. Returns roughly 0..1. */
function ridged(x: number, z: number): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let prev = 1;
  for (let i = 0; i < 5; i += 1) {
    let n = valueNoise(x * freq + 13.7, z * freq + 4.2);
    n = 1 - Math.abs(2 * n - 1);
    n *= n;
    sum += n * amp * prev;
    prev = n;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum;
}

export const TERRAIN = {
  size: 420,
  segments: 256,
  maxHeight: 78,
  minHeight: -8,
  snowLine: 0.52,
  treeLine: 34,
} as const;

/**
 * World-space height. Distant band (-z) rises into mountains; the near band
 * (+z, toward camera) settles into a gentle valley.
 *
 * Silhouette = ridged multifractal (sharp alpine ridgelines) shaped by a domain
 * warp, then two high-frequency crag octaves + an erosion notch are layered on
 * the mountains only and weighted toward the upper slopes. That turns rounded
 * blobs into rocky, faceted peaks while leaving the valley the camera sits in
 * smooth and readable.
 */
export function terrainHeight(x: number, z: number): number {
  const freq = 0.0075;
  const mountainMask = smoothstep(70, -150, z); // 0 near → 1 far

  // Domain warp the ridge lookup so ranges meander instead of running straight.
  const wx = x + (valueNoise(x * 0.004 + 2.1, z * 0.004) - 0.5) * 90;
  const wz = z + (valueNoise(x * 0.004, z * 0.004 - 5.3) - 0.5) * 90;
  const ridge = ridged(wx * freq, wz * freq);
  const ridgeHeight = ridge * TERRAIN.maxHeight * mountainMask;

  const rolling = (valueNoise(x * 0.02, z * 0.02) - 0.5) * 10;
  const valley = (1 - mountainMask) * rolling;

  // subtle large-scale warp so ranges aren't uniform
  const warp = (valueNoise(x * 0.003, z * 0.003) - 0.5) * 14 * mountainMask;

  // Detail intensifies with altitude → smooth lower flanks, broken high crags.
  const alp = smoothstep(0.24, 0.72, ridge);
  const crag =
    (valueNoise(x * 0.05 + 7.3, z * 0.05 - 2.1) - 0.5) * 3.4 * mountainMask * (0.35 + alp);
  const crag2 =
    (valueNoise(x * 0.11 - 3.7, z * 0.11 + 5.9) - 0.5) * 1.6 * mountainMask * alp;
  // Erosion channels — sharp V-notches carved down the steepest upper slopes.
  const erosion = -Math.pow(Math.abs(valueNoise(x * 0.03, z * 0.03) - 0.5) * 2, 1.5) * 6 * mountainMask * alp;

  return ridgeHeightSafe(ridgeHeight) + valley + warp + crag + crag2 + erosion - 3;
}

function ridgeHeightSafe(v: number): number {
  return Number.isFinite(v) ? v : 0;
}

/* -------------------------------------------------------------------------- */
/*  Terrain geometry (positions + normals + vertex colors)                    */
/* -------------------------------------------------------------------------- */

const COL_GRASS = new THREE.Color("#4a6b34"); // valley meadow
const COL_VALLEY = new THREE.Color("#3d5a34");
const COL_FOREST = new THREE.Color("#2f4a2c");
const COL_MOSS = new THREE.Color("#435a2f"); // damp mid-slope
const COL_DIRT = new THREE.Color("#5c4a35"); // exposed earth
const COL_ROCK = new THREE.Color("#6d6355");
const COL_ROCK_DARK = new THREE.Color("#4a4238");
const COL_SCREE = new THREE.Color("#8a8478"); // loose grey talus near peaks
const COL_SNOW = new THREE.Color("#eef3fb");

export function buildTerrainGeometry(): THREE.BufferGeometry {
  const { size, segments, maxHeight, minHeight } = TERRAIN;
  const half = size / 2;
  const cols = segments + 1;

  const positions = new Float32Array(cols * cols * 3);
  const colors = new Float32Array(cols * cols * 3);

  for (let j = 0; j < cols; j += 1) {
    for (let i = 0; i < cols; i += 1) {
      const idx = (j * cols + i) * 3;
      const x = -half + (i / segments) * size;
      const z = -half + (j / segments) * size;
      const y = terrainHeight(x, z);
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
    }
  }

  // Indices
  const indices: number[] = [];
  for (let j = 0; j < segments; j += 1) {
    for (let i = 0; i < segments; i += 1) {
      const a = j * cols + i;
      const b = j * cols + i + 1;
      const c = (j + 1) * cols + i;
      const d = (j + 1) * cols + i + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  // Colour pass — slope- and height-aware material blend (grass → forest →
  // moss/dirt → rock → scree → snow), plus rocky cliffs on steep faces and
  // sedimentary strata banding so exposed rock reads as real geology.
  const normals = geometry.getAttribute("normal");
  const tmp = new THREE.Color();
  for (let v = 0; v < cols * cols; v += 1) {
    const y = positions[v * 3 + 1];
    const up = normals.getY(v); // 0..1, 1 = flat/upward
    const t = clamp((y - minHeight) / (maxHeight - minHeight), 0, 1);
    const steep = smoothstep(0.78, 0.42, up); // 0 flat → 1 cliff face

    // Height ramp of the "soft" materials (what grows where it isn't cliff).
    tmp.copy(COL_GRASS).lerp(COL_VALLEY, smoothstep(0.02, 0.1, t));
    tmp.lerp(COL_FOREST, smoothstep(0.08, 0.22, t));
    tmp.lerp(COL_MOSS, smoothstep(0.22, 0.34, t));
    tmp.lerp(COL_DIRT, smoothstep(0.34, 0.46, t));
    tmp.lerp(COL_ROCK, smoothstep(0.46, 0.6, t));
    tmp.lerp(COL_SCREE, smoothstep(0.6, 0.72, t));

    // Steep faces are bare rock regardless of altitude → cliffs & crevices.
    const rockCol = COL_ROCK_DARK.clone().lerp(COL_ROCK, smoothstep(0.3, 0.7, t));
    tmp.lerp(rockCol, steep * 0.85);

    // Sedimentary strata on the exposed rock zone, broken up by noise.
    const rockZone = clamp(smoothstep(0.4, 0.56, t) + steep * 0.5, 0, 1) * (1 - smoothstep(0.66, 0.8, t));
    const band = Math.sin(y * 0.55 + hash(v * 0.05, 0) * 1.6) * 0.5 + 0.5;
    tmp.lerp(COL_ROCK_DARK, band * rockZone * 0.35);

    // Snow: accumulates high AND on flatter aspects; steep faces stay bare.
    const snow = smoothstep(TERRAIN.snowLine, 0.74, t) * smoothstep(0.5, 0.86, up);
    tmp.lerp(COL_SNOW, snow);

    // tiny per-vertex variation
    const tint = (hash(v * 0.13, v * 0.71) - 0.5) * 0.05;
    colors[v * 3] = clamp(tmp.r + tint, 0, 1);
    colors[v * 3 + 1] = clamp(tmp.g + tint, 0, 1);
    colors[v * 3 + 2] = clamp(tmp.b + tint, 0, 1);
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

/* -------------------------------------------------------------------------- */
/*  Forest scatter — ecosystem-aware placement                                */
/*                                                                            */
/*  Each instance carries a `kind` (0 conifer, 1 broadleaf), an independent    */
/*  height `scale` and `width`, and a random `rot`, so the two archetypes      */
/*  render with heavy non-uniform variation (saplings → mature trees).         */
/*  Broadleaf favours the warm valley floor; conifers climb higher and thin    */
/*  out toward the tree line. A low-frequency noise gate opens natural forest  */
/*  clearings so the canopy never reads as a uniform carpet.                   */
/* -------------------------------------------------------------------------- */

export interface TreeInstance {
  x: number;
  y: number; // ground height — geometry base sits at y = 0
  z: number;
  scale: number; // height multiplier
  width: number; // independent width multiplier
  rot: number; // random Y rotation
  kind: 0 | 1; // 0 conifer, 1 broadleaf
}

export function scatterTrees(count: number): TreeInstance[] {
  const trees: TreeInstance[] = [];
  let attempts = 0;
  while (trees.length < count && attempts < count * 16) {
    attempts += 1;
    const x = (Math.random() - 0.5) * 300;
    const z = -70 + Math.random() * 120; // mid/near band, visible
    const y = terrainHeight(x, z);
    if (y < 1.0 || y > TERRAIN.treeLine) continue;

    // approximate slope: reject steep spots (looser now terrain is craggier)
    const dh =
      Math.abs(terrainHeight(x + 2, z) - y) + Math.abs(terrainHeight(x, z + 2) - y);
    if (dh > 7) continue;

    // Forest clearings — a soft low-frequency mask carves open meadows.
    const clearing = valueNoise(x * 0.012 + 40, z * 0.012 - 20);
    if (clearing < 0.34 && Math.random() > clearing * 1.8) continue;

    // Elevation ratio 0 (valley) → 1 (tree line); thin the canopy near peaks.
    const tElev = clamp((y - 1) / (TERRAIN.treeLine - 1), 0, 1);
    if (tElev > 0.55 && Math.random() < (tElev - 0.55) * 1.5) continue;

    // Low ground favours broadleaf; high ground favours conifer.
    const kind: 0 | 1 = Math.random() < clamp(1 - tElev * 1.2, 0, 1) ? 1 : 0;

    // Wide size spread including the occasional sapling.
    const young = Math.random() < 0.16;
    const base = kind === 0 ? 0.75 + Math.random() * 1.15 : 0.7 + Math.random() * 0.95;
    const scale = young ? 0.3 + Math.random() * 0.25 : base;
    const width = (0.78 + Math.random() * 0.5) * (young ? 0.85 : 1);
    const rot = Math.random() * Math.PI * 2;

    trees.push({ x, y, z, scale, width, rot, kind });
  }
  return trees;
}

/* -------------------------------------------------------------------------- */
/*  Time of day (driven by scroll progress 0..1)                              */
/* -------------------------------------------------------------------------- */

export interface TimeOfDay {
  sunDir: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  fog: string;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  starOpacity: number;
}

type RGB = [number, number, number];

interface TodStop {
  p: number;
  elev: number; // degrees
  azim: number; // degrees
  sun: RGB;
  sunI: number;
  fog: RGB;
  hemiSky: RGB;
  hemiGround: RGB;
  hemiI: number;
  stars: number;
}

const STOPS: TodStop[] = [
  { p: 0.0, elev: 24, azim: 55, sun: [1.0, 0.94, 0.83], sunI: 2.3, fog: [0.72, 0.81, 0.9], hemiSky: [0.55, 0.71, 0.96], hemiGround: [0.32, 0.34, 0.28], hemiI: 0.95, stars: 0 },
  { p: 0.42, elev: 34, azim: 108, sun: [1.0, 0.98, 0.92], sunI: 2.7, fog: [0.7, 0.8, 0.9], hemiSky: [0.6, 0.76, 1.0], hemiGround: [0.34, 0.36, 0.3], hemiI: 1.05, stars: 0 },
  { p: 0.66, elev: 5, azim: 150, sun: [1.0, 0.62, 0.34], sunI: 2.1, fog: [0.86, 0.62, 0.46], hemiSky: [0.72, 0.56, 0.6], hemiGround: [0.3, 0.25, 0.22], hemiI: 0.72, stars: 0.05 },
  { p: 0.82, elev: -3, azim: 172, sun: [0.55, 0.42, 0.58], sunI: 0.7, fog: [0.28, 0.3, 0.48], hemiSky: [0.3, 0.36, 0.56], hemiGround: [0.16, 0.17, 0.22], hemiI: 0.42, stars: 0.55 },
  { p: 1.0, elev: -12, azim: 195, sun: [0.42, 0.47, 0.72], sunI: 0.16, fog: [0.05, 0.07, 0.14], hemiSky: [0.11, 0.14, 0.28], hemiGround: [0.05, 0.06, 0.11], hemiI: 0.26, stars: 1 },
];

const lerpRGB = (a: RGB, b: RGB, t: number): RGB => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

const toHex = (c: RGB): string => {
  const h = (v: number) =>
    Math.round(clamp(v, 0, 1) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${h(c[0])}${h(c[1])}${h(c[2])}`;
};

const deg = (d: number) => (d * Math.PI) / 180;

export function timeOfDay(progress: number): TimeOfDay {
  const p = clamp(progress, 0, 1);
  let lo = STOPS[0];
  let hi = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i += 1) {
    if (p >= STOPS[i].p && p <= STOPS[i + 1].p) {
      lo = STOPS[i];
      hi = STOPS[i + 1];
      break;
    }
  }
  const span = hi.p - lo.p || 1;
  const t = smoothstep(0, 1, (p - lo.p) / span);

  const elev = deg(lerp(lo.elev, hi.elev, t));
  const azim = deg(lerp(lo.azim, hi.azim, t));
  const sunDir: [number, number, number] = [
    Math.cos(elev) * Math.cos(azim),
    Math.sin(elev),
    Math.cos(elev) * Math.sin(azim),
  ];

  return {
    sunDir,
    sunColor: toHex(lerpRGB(lo.sun, hi.sun, t)),
    sunIntensity: lerp(lo.sunI, hi.sunI, t),
    fog: toHex(lerpRGB(lo.fog, hi.fog, t)),
    hemiSky: toHex(lerpRGB(lo.hemiSky, hi.hemiSky, t)),
    hemiGround: toHex(lerpRGB(lo.hemiGround, hi.hemiGround, t)),
    hemiIntensity: lerp(lo.hemiI, hi.hemiI, t),
    starOpacity: lerp(lo.stars, hi.stars, t),
  };
}
