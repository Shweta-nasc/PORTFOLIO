"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Journey } from "./season-config";

/* -------------------------------------------------------------------------- */
/*  Seasonal particles — "selective realism"                                  */
/*                                                                            */
/*  One GPU points system (a single draw call) whose motion, shape, size and  */
/*  colour cross-fade with the continuous season index. FEWER but higher-      */
/*  quality particles that never bury the UI:                                 */
/*                                                                            */
/*    0 Spring  → sakura petals   (slow flutter + tumble, veined, pink)       */
/*    1 Summer  → pollen motes    (near-still soft drift, tiny, warm)         */
/*    2 Monsoon → rain streaks    (fast, slanted, elongated, blue-grey)       */
/*    3 Autumn  → maple leaves    (medium fall, big tumble, 5-lobe, orange)   */
/*    4 Winter  → snow crystals   (slow drift, six-fold, sparkle, white)      */
/*                                                                            */
/*  Three pillars for readability + a premium feel:                           */
/*   1. DEPTH LAYERS  — background (small/faint/slow), mid, foreground (few/   */
/*      large/soft-blur) give parallax and a shallow depth-of-field look.     */
/*   2. CLUSTERED, EDGE-BIASED distribution leaves gaps in the middle, and a  */
/*      per-fragment center-of-screen fade guarantees text stays legible.     */
/*   3. REAL PROCEDURAL SHAPES drawn in the fragment shader (not blurred      */
/*      circles), each rotating/tumbling uniquely so no two read alike.       */
/* -------------------------------------------------------------------------- */

const BOX_X = 150; // half-width  (wraps in [-150, 150])
const BOX_Y = 96; // height      (falls & wraps in [0, 96])
const Z_NEAR = 60;
const Z_FAR = -160;

/* ----------------------------- vertex shader ------------------------------ */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSeason;  // eased 0..4
  uniform float uOpacity; // global fade-in
  uniform float uPixel;   // device pixel ratio
  uniform float uWind;    // storm wind (monsoon)

  attribute vec3 aRnd;    // x: phase, y: speed jitter, z: size jitter
  attribute vec3 aMisc;   // x: rot speed, y: layer (0/1/2), z: colour jitter

  varying float vAlpha;
  varying vec3  vColor;
  varying vec3  vW1;      // shape weights: petal, mote, rain
  varying vec2  vW2;      // shape weights: leaf, snow
  varying float vRot;     // per-particle rotation angle
  varying float vTumble;  // 0..1 aspect squash (edge-on tumble)
  varying float vSoft;    // foreground bokeh softness
  varying float vTwinkle; // snow sparkle modulation

  // triangular weight peaking at center c, zero >=1 away
  float wpeak(float x, float c) { return clamp(1.0 - abs(x - c), 0.0, 1.0); }

  void main() {
    float phase = aRnd.x;
    float sj    = aRnd.y;
    float zj    = aRnd.z;
    float layer = aMisc.y;

    float wSpring = wpeak(uSeason, 0.0);
    float wSummer = wpeak(uSeason, 1.0);
    float wMon    = wpeak(uSeason, 2.0);
    float wAut    = wpeak(uSeason, 3.0);
    float wWin    = wpeak(uSeason, 4.0);
    float wsum = wSpring + wSummer + wMon + wAut + wWin + 1e-4;

    // Shape weights handed to the fragment shader (normalised).
    vW1 = vec3(wSpring, wSummer, wMon) / wsum;
    vW2 = vec2(wAut, wWin) / wsum;
    float rainW = vW1.z;

    // Per-behaviour motion parameters, blended by weight.
    float fall  = (wSpring * 4.0 + wSummer * 1.1 + wMon * 48.0 + wAut * 7.5 + wWin * 3.2) / wsum;
    float sway  = (wSpring * 5.5 + wSummer * 3.2 + wMon * 0.5  + wAut * 6.5 + wWin * 3.6) / wsum;
    float freq  = (wSpring * 0.9 + wSummer * 0.7 + wMon * 2.2  + wAut * 1.1 + wWin * 0.65) / wsum;
    float psize = (wSpring * 10.0+ wSummer * 3.4 + wMon * 5.0  + wAut * 13.0+ wWin * 9.5) / wsum;
    float pop   = (wSpring * 0.92+ wSummer * 0.5 + wMon * 0.55 + wAut * 0.95+ wWin * 0.92) / wsum;

    // Depth layers: bg small/faint/slow, mid neutral, fg large/near/soft.
    float layerSize = layer < 0.5 ? 0.55 : (layer < 1.5 ? 1.0  : 1.9);
    float layerOp   = layer < 0.5 ? 0.5  : (layer < 1.5 ? 0.85 : 1.0);
    float layerSpd  = layer < 0.5 ? 0.6  : (layer < 1.5 ? 1.0  : 1.28);
    vSoft = layer < 1.5 ? 0.0 : 1.0;

    float t = uTime;

    // Coherent wind gust that varies over time; nearer layers move more, and
    // storm wind (uWind) shoves rain hardest.
    float gust  = (sin(t * 0.12 + phase * 2.0) + sin(t * 0.31)) * 0.5;
    float windX = gust * (2.5 + layer * 3.0) + uWind * 8.0 * rainW * sin(phase * 6.2831);

    // Fall along -Y and wrap so the field is endless.
    float y = mod(position.y - t * fall * sj * layerSpd, ${BOX_Y.toFixed(1)});

    // Bounded horizontal flutter + rain slant + wind, wrapped in X.
    float sw = sin(t * freq + phase * 6.2831) * sway;
    float slant = rainW * (-0.42 * y);
    float x = mod((position.x + sw + slant + windX) + ${BOX_X.toFixed(1)}, ${(BOX_X * 2.0).toFixed(1)}) - ${BOX_X.toFixed(1)};
    float z = position.z + cos(t * freq * 0.8 + phase * 6.2831) * sway * 0.55;

    vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = psize * zj * layerSize * uPixel * (300.0 / max(-mv.z, 1.0));
    gl_PointSize = clamp(size, 1.0, 96.0);

    // Rotation + tumble (rain stays vertical, so damp both by rainW).
    vRot     = phase * 6.2831 + t * aMisc.x * (1.0 - rainW);
    vTumble  = mix(0.5 + 0.5 * sin(t * (0.6 + aMisc.x) + phase * 6.2831), 1.0, rainW);
    vTwinkle = 0.5 + 0.5 * sin(t * 3.0 * (0.5 + sj) + phase * 20.0);

    // Colour per season, plus a subtle per-particle jitter so a field is never
    // monochrome.
    vec3 cPetal  = vec3(0.98, 0.72, 0.82);
    vec3 cPollen = vec3(1.0, 0.94, 0.68);
    vec3 cRain   = vec3(0.62, 0.72, 0.86);
    vec3 cLeaf   = vec3(0.86, 0.44, 0.15);
    vec3 cSnow   = vec3(0.95, 0.97, 1.0);
    vec3 col = (cPetal * wSpring + cPollen * wSummer + cRain * wMon + cLeaf * wAut + cSnow * wWin) / wsum;
    float cj = (aMisc.z - 0.5) * 0.16;
    col += vec3(cj, cj * 0.35, -cj * 0.5);
    vColor = clamp(col, 0.0, 1.2);

    // Base alpha: behaviour pop * layer * global fade * per-particle jitter.
    float aBase = pop * layerOp * uOpacity * (0.72 + aMisc.z * 0.5);

    // Center-of-screen readability fade — never bury the UI text column.
    vec2 ndc = gl_Position.xy / max(gl_Position.w, 0.0001);
    float centerDist = length(ndc * vec2(1.0, 0.72));
    float readable = smoothstep(0.12, 0.62, centerDist); // 0 center → 1 edges
    aBase *= mix(0.09, 1.0, readable);

    vAlpha = aBase;
  }
`;

/* ---------------------------- fragment shader ----------------------------- */

const fragmentShader = /* glsl */ `
  precision mediump float;

  varying float vAlpha;
  varying vec3  vColor;
  varying vec3  vW1;   // petal, mote, rain
  varying vec2  vW2;   // leaf, snow
  varying float vRot;
  varying float vTumble;
  varying float vSoft;
  varying float vTwinkle;

  const float PI = 3.14159265;

  // Sakura petal: soft oval with a notch at the tip.
  float petalShape(vec2 p) {
    p.y += 0.02;
    float r = length(vec2(p.x * 1.75, p.y * 1.12));
    float a = smoothstep(0.45, 0.28, r);
    float notch = smoothstep(0.2, 0.0, length(vec2(p.x * 1.5, (p.y - 0.33) * 1.1)));
    a -= notch * step(0.0, p.y);
    return clamp(a, 0.0, 1.0);
  }
  // Central vein used to brighten the petal a touch (translucency read).
  float petalVein(vec2 p) {
    return smoothstep(0.045, 0.0, abs(p.x)) * smoothstep(0.32, -0.12, p.y);
  }

  // Pollen mote: plain soft disc.
  float moteShape(vec2 p) {
    return smoothstep(0.46, 0.04, length(p));
  }

  // Rain: thin elongated vertical streak.
  float rainShape(vec2 p) {
    p.y *= 0.42;
    return smoothstep(0.085, 0.0, abs(p.x)) * smoothstep(0.21, 0.02, abs(p.y));
  }

  // Maple leaf: five pointed lobes + a short stem.
  float leafShape(vec2 p) {
    float ang = atan(p.y, p.x);
    float rad = length(p);
    float lobes = 0.3 + 0.11 * cos(5.0 * ang + PI * 0.5) + 0.045 * cos(10.0 * ang);
    float a = smoothstep(lobes, lobes - 0.05, rad);
    float stem = smoothstep(0.028, 0.0, abs(p.x)) * smoothstep(0.0, -0.46, p.y);
    return clamp(max(a, stem), 0.0, 1.0);
  }

  // Snow: six-fold crystal (spoke + side branches + bright core).
  float snowShape(vec2 p, out float core) {
    float ang = atan(p.y, p.x);
    float rad = length(p);
    float a6 = mod(ang, PI / 3.0) - PI / 6.0;
    vec2 q = vec2(cos(a6), sin(a6)) * rad;
    float spoke  = smoothstep(0.05, 0.0, abs(q.y)) * smoothstep(0.46, 0.05, q.x);
    float branch = smoothstep(0.033, 0.0, abs(abs(q.y) - q.x * 0.45))
                 * smoothstep(0.34, 0.08, q.x) * step(0.12, q.x);
    core = smoothstep(0.11, 0.0, rad);
    return clamp(max(max(spoke, branch), core), 0.0, 1.0);
  }

  void main() {
    vec2 c = gl_PointCoord - 0.5;

    // Rotated + tumbled uv for the spinning shapes (petal/leaf/snow).
    float s = sin(vRot), co = cos(vRot);
    vec2 ruv = mat2(co, -s, s, co) * c;
    ruv.x *= 1.0 / max(vTumble, 0.22); // squash toward edge-on while tumbling

    float wPetal = vW1.x;
    float wMote  = vW1.y;
    float wRain  = vW1.z;
    float wLeaf  = vW2.x;
    float wSnow  = vW2.y;

    float core = 0.0;
    float aPetal = petalShape(ruv);
    float aMote  = moteShape(c);
    float aRain  = rainShape(c);
    float aLeaf  = leafShape(ruv);
    float aSnow  = snowShape(ruv, core);

    float shape = aPetal * wPetal + aMote * wMote + aRain * wRain + aLeaf * wLeaf + aSnow * wSnow;

    // Foreground bokeh: soften and lower peak for a shallow depth-of-field feel.
    shape = mix(shape, shape * 0.68 + smoothstep(0.5, 0.0, length(c)) * 0.32, vSoft * 0.6);

    float a = shape * vAlpha;
    if (a < 0.006) discard;

    vec3 col = vColor;
    col += vec3(0.1, 0.06, 0.08) * petalVein(ruv) * wPetal;         // veined translucency
    col += vec3(0.55, 0.68, 0.9) * core * vTwinkle * wSnow;          // icy sparkle

    gl_FragColor = vec4(col, a);
  }
`;

/* -------------------------- geometry generation --------------------------- */

/** Standard-normal sample (Box–Muller) for soft gaussian clusters. */
function gaussian(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const wrapX = (x: number) =>
  (((x + BOX_X) % (BOX_X * 2)) + BOX_X * 2) % (BOX_X * 2) - BOX_X;

const wrapY = (y: number) => ((y % BOX_Y) + BOX_Y) % BOX_Y;

/** Depth per layer: background far, foreground near the camera. */
function layerDepth(layer: number): number {
  if (layer === 0) return Z_FAR + Math.random() * (-40 - Z_FAR); // far
  if (layer === 1) return -40 + Math.random() * 55; // mid
  return 12 + Math.random() * (Z_NEAR - 12); // foreground
}

export function SeasonalParticles({
  journeyRef,
  count,
  reduced,
}: {
  journeyRef: MutableRefObject<Journey>;
  count: number;
  reduced: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const easedSeason = useRef(0);
  const fade = useRef(0);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count * 3);
    const misc = new Float32Array(count * 3);

    // Edge-biased gaussian clusters leave a readable gap down the middle.
    const clusterCount = Math.max(8, Math.min(20, Math.round(count / 45)));
    const clusters = Array.from({ length: clusterCount }, () => ({
      x: (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 0.6) * BOX_X,
      y: Math.random() * BOX_Y,
      spread: 12 + Math.random() * 24,
    }));

    for (let i = 0; i < count; i += 1) {
      // Layer mix: 45% background, 40% mid, 15% foreground.
      const r = Math.random();
      const layer = r < 0.45 ? 0 : r < 0.85 ? 1 : 2;

      const cl = clusters[(Math.random() * clusters.length) | 0];
      pos[i * 3 + 0] = wrapX(cl.x + gaussian() * cl.spread);
      pos[i * 3 + 1] = wrapY(cl.y + gaussian() * cl.spread * 0.85);
      pos[i * 3 + 2] = layerDepth(layer);

      rnd[i * 3 + 0] = Math.random(); // phase
      rnd[i * 3 + 1] = 0.6 + Math.random() * 0.8; // speed jitter
      rnd[i * 3 + 2] = 0.45 + Math.random() * 1.15; // size jitter (wide)

      misc[i * 3 + 0] = (Math.random() - 0.5) * 1.7; // rotation speed (± both ways)
      misc[i * 3 + 1] = layer; // depth layer
      misc[i * 3 + 2] = Math.random(); // colour jitter
    }

    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 3));
    g.setAttribute("aMisc", new THREE.BufferAttribute(misc, 3));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSeason: { value: 0 },
      uOpacity: { value: 0 },
      uPixel: { value: 1 },
      uWind: { value: 0 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const u = matRef.current?.uniforms;
    const j = journeyRef.current;
    if (!u || !j) return;
    const d = Math.min(1, delta);
    // Ease the season index for cross-fades, and fade the whole field in on load.
    easedSeason.current += (j.season.index - easedSeason.current) * d * 1.8;
    fade.current += ((reduced ? 0.7 : 1) - fade.current) * d * 0.9;
    u.uTime.value = state.clock.elapsedTime;
    u.uSeason.value = easedSeason.current;
    u.uOpacity.value = fade.current;
    u.uPixel.value = state.gl.getPixelRatio();
    u.uWind.value = j.season.storm;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        toneMapped={false}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
