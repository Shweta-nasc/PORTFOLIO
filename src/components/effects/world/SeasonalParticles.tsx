"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Journey } from "./season-config";

/* -------------------------------------------------------------------------- */
/*  Seasonal particles                                                        */
/*                                                                            */
/*  A single GPU points system (one draw call) whose motion, size and colour  */
/*  cross-fade with the continuous season index:                             */
/*    0 Spring  → cherry petals (slow, big flutter, pink)                     */
/*    1 Summer  → pollen / motes (near-still drift, tiny, warm)               */
/*    2 Monsoon → rain (fast, slanted, blue-grey, elongated sprite)           */
/*    3 Autumn  → maple leaves (medium fall, big tumble, orange)              */
/*    4 Winter  → snow (slow, gentle drift, white)                            */
/*                                                                            */
/*  All behaviour is derived on the GPU from `uSeason`, so seasons blend      */
/*  seamlessly and the whole field costs a single buffer + one shader.        */
/* -------------------------------------------------------------------------- */

const BOX_X = 150; // half-width  (wraps in [-150, 150])
const BOX_Y = 96; // height      (falls & wraps in [0, 96])
const Z_NEAR = 60;
const Z_FAR = -160;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSeason;  // eased 0..4
  uniform float uOpacity; // global fade-in
  uniform float uPixel;   // device pixel ratio
  uniform float uWind;    // storm wind (monsoon)

  attribute vec3 aRnd;    // x: phase, y: speed jitter, z: size jitter

  varying float vAlpha;
  varying vec3 vColor;
  varying float vRain;    // 0..1 how "rain-like" this frame is (fragment squash)

  // triangular weight peaking at center c, zero >1 away
  float wpeak(float x, float c) { return clamp(1.0 - abs(x - c), 0.0, 1.0); }

  void main() {
    float phase = aRnd.x;
    float sj = aRnd.y;
    float zj = aRnd.z;

    float wSpring = wpeak(uSeason, 0.0);
    float wSummer = wpeak(uSeason, 1.0);
    float wMon    = wpeak(uSeason, 2.0);
    float wAut    = wpeak(uSeason, 3.0);
    float wWin    = wpeak(uSeason, 4.0);
    float wsum = wSpring + wSummer + wMon + wAut + wWin + 1e-4;

    // Per-behaviour parameters, blended by weight.
    float fall = (wSpring * 4.0 + wSummer * 1.1 + wMon * 48.0 + wAut * 7.5 + wWin * 3.2) / wsum;
    float sway = (wSpring * 5.5 + wSummer * 3.2 + wMon * 0.5 + wAut * 6.5 + wWin * 3.6) / wsum;
    float freq = (wSpring * 0.9 + wSummer * 0.7 + wMon * 2.2 + wAut * 1.1 + wWin * 0.65) / wsum;
    float psize = (wSpring * 9.0 + wSummer * 3.0 + wMon * 4.5 + wAut * 12.0 + wWin * 8.5) / wsum;
    float pop  = (wSpring * 0.9 + wSummer * 0.5 + wMon * 0.5 + wAut * 0.95 + wWin * 0.9) / wsum;

    vRain = wMon / wsum;

    vec3 cPetal  = vec3(0.98, 0.72, 0.82);
    vec3 cPollen = vec3(1.0, 0.94, 0.68);
    vec3 cRain   = vec3(0.62, 0.72, 0.86);
    vec3 cLeaf   = vec3(0.86, 0.44, 0.15);
    vec3 cSnow   = vec3(0.95, 0.97, 1.0);
    vColor = (cPetal * wSpring + cPollen * wSummer + cRain * wMon + cLeaf * wAut + cSnow * wWin) / wsum;

    float t = uTime;

    // Fall along -Y and wrap so the field is endless.
    float y = mod(position.y - t * fall * sj, ${BOX_Y.toFixed(1)});

    // Bounded horizontal flutter + rain slant + storm wind.
    float sw = sin(t * freq + phase * 6.2831) * sway;
    float slant = vRain * (-0.42 * y) + uWind * vRain * 7.0 * sin(phase * 6.2831);
    float x = mod((position.x + sw + slant) + ${BOX_X.toFixed(1)}, ${(BOX_X * 2.0).toFixed(1)}) - ${BOX_X.toFixed(1)};
    float z = position.z + cos(t * freq * 0.8 + phase * 6.2831) * sway * 0.55;

    vec4 mv = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = psize * zj * uPixel * (300.0 / max(-mv.z, 1.0));
    gl_PointSize = clamp(size, 1.0, 64.0);

    // Center-of-screen readability fade: particles crossing the central UI
    // text column drop to ~12% opacity, ramping back to full toward the edges.
    // This is what keeps the environment from drowning the content — the field
    // stays lively at the margins where there's nothing to read.
    vec2 ndc = gl_Position.xy / max(gl_Position.w, 0.0001);
    float centerDist = length(ndc * vec2(1.0, 0.72));
    float readable = smoothstep(0.14, 0.62, centerDist); // 0 center → 1 edges

    vAlpha = pop * uOpacity * mix(0.12, 1.0, readable);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying float vAlpha;
  varying vec3 vColor;
  varying float vRain;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    uv.y *= mix(1.0, 0.34, vRain); // squash -> elongated rain streaks
    float d = length(uv);
    float a = smoothstep(0.5, 0.06, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

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
    for (let i = 0; i < count; i += 1) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * BOX_X * 2;
      pos[i * 3 + 1] = Math.random() * BOX_Y;
      pos[i * 3 + 2] = Z_FAR + Math.random() * (Z_NEAR - Z_FAR);
      rnd[i * 3 + 0] = Math.random();
      rnd[i * 3 + 1] = 0.6 + Math.random() * 0.8;
      rnd[i * 3 + 2] = 0.5 + Math.random() * 1.0;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 3));
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
