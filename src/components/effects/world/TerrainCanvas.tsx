"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sky, Stars, Cloud, Clouds, PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  buildTerrainGeometry,
  scatterTrees,
  timeOfDay,
  clamp,
  type TimeOfDay,
  type TreeInstance,
} from "./terrain-noise";
import { seasonAt, type Journey, type SeasonState } from "./season-config";
import { SeasonalParticles } from "./SeasonalParticles";

type MouseRef = MutableRefObject<{ x: number; y: number }>;

/* -------------------------------------------------------------------------- */
/*  Terrain — procedural alpine mesh, re-tinted per season on the GPU         */
/* -------------------------------------------------------------------------- */

function Terrain({ journeyRef }: { journeyRef: MutableRefObject<Journey> }) {
  const geometry = useMemo(() => buildTerrainGeometry(), []);
  const uniformsRef = useRef<{
    tint: THREE.IUniform<THREE.Color>;
    mix: THREE.IUniform<number>;
    snow: THREE.IUniform<number>;
  } | null>(null);

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.97,
      metalness: 0,
    });
    // Inject a season tint that follows terrain luminance (keeps ridge/valley
    // contrast) and spares bright snowy peaks so they stay capped year-round.
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uSeasonTint = { value: new THREE.Color("#5f8a3f") };
      shader.uniforms.uTintMix = { value: 0.7 };
      shader.uniforms.uSnow = { value: 0 };
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nuniform vec3 uSeasonTint;\nuniform float uTintMix;\nuniform float uSnow;",
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
           float _l = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
           float _amt = uTintMix * (1.0 - smoothstep(0.62, 0.86, _l) * 0.85);
           vec3 _tinted = uSeasonTint * (0.55 + _l * 1.05);
           diffuseColor.rgb = mix(diffuseColor.rgb, _tinted, _amt);
           diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.9, 0.94, 1.0), clamp(uSnow, 0.0, 1.0) * 0.7);`,
        );
      uniformsRef.current = {
        tint: shader.uniforms.uSeasonTint as THREE.IUniform<THREE.Color>,
        mix: shader.uniforms.uTintMix as THREE.IUniform<number>,
        snow: shader.uniforms.uSnow as THREE.IUniform<number>,
      };
    };
    return m;
  }, []);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((_, delta) => {
    const u = uniformsRef.current;
    const s = journeyRef.current?.season;
    if (!u || !s) return;
    const k = Math.min(1, delta * 1.4);
    u.tint.value.lerp(s.terrain, k);
    u.snow.value += (s.snow - u.snow.value) * k;
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} receiveShadow />;
}

/* -------------------------------------------------------------------------- */
/*  Instanced forest — two archetypes, per-instance variation, wind + seasons  */
/*                                                                            */
/*  No cones. Two merged low-poly archetypes give the forest a natural,        */
/*  non-repeating silhouette:                                                  */
/*    • conifer   — trunk + three stacked, tapering branch tiers (pine/fir)    */
/*    • broadleaf — trunk + an offset cluster of canopy blobs                  */
/*  Every instance gets a non-uniform height/width, a random Y rotation and an */
/*  `instanceColor` brightness/hue jitter. A cheap GPU wind sway (injected via */
/*  onBeforeCompile) bends the crowns — amplitude grows with vertex height and */
/*  with the season's storm/rain, so the canopy breathes without any CPU cost. */
/*  Seasonal tint is per-archetype: conifers stay evergreen and only frost in  */
/*  winter; broadleaf follows the full leaf cycle (green → gold → bare).        */
/*                                                                            */
/*  NOTE (honest scope): this is "selective realism" — two well-varied         */
/*  archetypes + clearings + saplings rather than six hand-modelled high-poly  */
/*  species with individual shadow maps, which would blow the draw-call and    */
/*  fill budget for a background and can't hold 60fps in a browser.            */
/* -------------------------------------------------------------------------- */

const FROST = new THREE.Color("#93a7ad");

type WindUniforms = { uTime: THREE.IUniform<number>; uWind: THREE.IUniform<number> };

/**
 * Merge trunk + foliage parts into one archetype geometry.
 *
 * CRITICAL: ConeGeometry/CylinderGeometry are INDEXED but IcosahedronGeometry
 * is NON-indexed, and `mergeGeometries` returns `null` on a mixed index mode.
 * Calling a method on that null used to throw during mount — and because the
 * whole world sits behind an ErrorBoundary with a null fallback, one bad tree
 * blanked the entire background. So we normalise every part to non-indexed
 * first (also fine for flat shading) and fall back to the trunk alone if the
 * merge ever still fails. A tree must never be able to take down the scene.
 */
function mergeParts(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const flat = parts.map((p) => (p.index ? p.toNonIndexed() : p));
  const merged = mergeGeometries(flat, false);
  const result = merged ?? parts[0].clone();
  // dispose the throwaway non-indexed copies, then the originals
  flat.forEach((f, i) => {
    if (f !== parts[i]) f.dispose();
  });
  parts.forEach((p) => p.dispose());
  result.computeVertexNormals();
  return result;
}

/** Conifer: trunk + three stacked cone tiers (pine/fir), merged. */
function buildConifer(): THREE.BufferGeometry {
  return mergeParts([
    new THREE.CylinderGeometry(0.14, 0.2, 1.0, 6).translate(0, 0.5, 0),
    new THREE.ConeGeometry(1.3, 2.0, 7).translate(0, 1.7, 0),
    new THREE.ConeGeometry(1.02, 1.7, 7).translate(0, 2.7, 0),
    new THREE.ConeGeometry(0.7, 1.4, 7).translate(0, 3.6, 0),
  ]);
}

/** Broadleaf: trunk + an offset cluster of low-poly canopy blobs. */
function buildBroadleaf(): THREE.BufferGeometry {
  return mergeParts([
    new THREE.CylinderGeometry(0.13, 0.2, 1.5, 6).translate(0, 0.75, 0),
    new THREE.IcosahedronGeometry(1.2, 0).translate(0, 2.25, 0),
    new THREE.IcosahedronGeometry(0.85, 0).translate(0.6, 1.85, 0.2),
    new THREE.IcosahedronGeometry(0.8, 0).translate(-0.55, 2.7, -0.15),
  ]);
}

function coniferTarget(s: SeasonState, out: THREE.Color) {
  out.set("#2f5a22").lerp(FROST, s.snow); // frosts over in winter
  out.multiplyScalar(1 - s.storm * 0.22); // darker under monsoon overcast
}

function broadleafTarget(s: SeasonState, out: THREE.Color) {
  out.copy(s.forest); // full seasonal leaf colour
}

/** Inject a cheap, per-instance vertex-shader wind sway into a std material. */
function installWindSway(mat: THREE.MeshStandardMaterial, uniformsOut: { current: WindUniforms | null }) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uWind = { value: 1 };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;\nuniform float uWind;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         // per-instance phase from the instance's world position
         float _wp = instanceMatrix[3].x * 0.08 + instanceMatrix[3].z * 0.08;
         float _h = max(transformed.y, 0.0);
         float _amt = _h * _h * 0.006 * uWind;
         transformed.x += sin(uTime * 1.1 + _wp) * _amt;
         transformed.z += cos(uTime * 0.9 + _wp * 1.3) * _amt * 0.7;`,
      );
    uniformsOut.current = { uTime: shader.uniforms.uTime, uWind: shader.uniforms.uWind };
  };
}

function TreeBatch({
  journeyRef,
  trees,
  geometry,
  target,
}: {
  journeyRef: MutableRefObject<Journey>;
  trees: TreeInstance[];
  geometry: THREE.BufferGeometry;
  target: (s: SeasonState, out: THREE.Color) => void;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const windRef = useRef<WindUniforms | null>(null);
  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: "#3f7a34", roughness: 0.95, metalness: 0, flatShading: true });
    installWindSway(m, windRef);
    return m;
  }, []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const col = new THREE.Color();
    trees.forEach((t, i) => {
      p.set(t.x, t.y, t.z);
      q.setFromAxisAngle(up, t.rot);
      s.set(t.width * t.scale, t.scale * 1.35, t.width * t.scale);
      m.compose(p, q, s);
      ref.current!.setMatrixAt(i, m);
      // per-instance brightness/hue jitter (modulates the seasonal colour)
      const b = 0.82 + Math.random() * 0.3;
      col.setRGB(b, b * (0.93 + Math.random() * 0.12), b * (0.9 + Math.random() * 0.1));
      ref.current!.setColorAt(i, col);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    if (ref.current!.instanceColor) ref.current!.instanceColor.needsUpdate = true;
  }, [trees]);

  useEffect(() => () => {
    geometry.dispose();
    mat.dispose();
  }, [geometry, mat]);

  useFrame((state, delta) => {
    const s = journeyRef.current?.season;
    if (!s) return;
    target(s, tmp);
    mat.color.lerp(tmp, Math.min(1, delta * 1.4));
    const w = windRef.current;
    if (w) {
      w.uTime.value = state.clock.elapsedTime;
      w.uWind.value = 0.6 + s.storm * 1.6 + s.rain * 0.5;
    }
  });

  return <instancedMesh ref={ref} args={[geometry, mat, trees.length]} frustumCulled={false} />;
}

function Forest({ journeyRef, count }: { journeyRef: MutableRefObject<Journey>; count: number }) {
  const trees = useMemo(() => scatterTrees(count), [count]);
  const conifers = useMemo(() => trees.filter((t) => t.kind === 0), [trees]);
  const broadleaf = useMemo(() => trees.filter((t) => t.kind === 1), [trees]);
  const coniferGeo = useMemo(() => buildConifer(), []);
  const broadleafGeo = useMemo(() => buildBroadleaf(), []);

  return (
    <>
      {conifers.length > 0 && (
        <TreeBatch journeyRef={journeyRef} trees={conifers} geometry={coniferGeo} target={coniferTarget} />
      )}
      {broadleaf.length > 0 && (
        <TreeBatch journeyRef={journeyRef} trees={broadleaf} geometry={broadleafGeo} target={broadleafTarget} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Atmospherics — fog, sun / hemisphere lighting, monsoon lightning          */
/* -------------------------------------------------------------------------- */

function Atmospherics({
  journeyRef,
  flashRef,
}: {
  journeyRef: MutableRefObject<Journey>;
  flashRef: MutableRefObject<number>;
}) {
  const scene = useThree((s) => s.scene);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const boltRef = useRef<THREE.DirectionalLight>(null);

  const tmpFog = useMemo(() => new THREE.Color(), []);
  const tmpA = useMemo(() => new THREE.Color(), []);
  const tmpB = useMemo(() => new THREE.Color(), []);
  const tmpC = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    const j = journeyRef.current;
    if (!j) return;
    const { tod, season } = j;
    const k = Math.min(1, delta * 1.5);

    // Fog — blend the time-of-day tint with the seasonal tint, ease near/far.
    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      tmpFog.set(tod.fog).lerp(season.fog, 0.55);
      fog.color.lerp(tmpFog, k);
      fog.near += (season.fogNear - fog.near) * k;
      fog.far += (season.fogFar - fog.far) * k;
    }

    // Sun — position from time-of-day, intensity dimmed by the season (monsoon).
    const dir = dirRef.current;
    if (dir) {
      const sd = tod.sunDir;
      dir.position.set(sd[0] * 300, Math.max(sd[1], -0.2) * 300, sd[2] * 300);
      dir.color.lerp(tmpA.set(tod.sunColor), k);
      dir.intensity += (tod.sunIntensity * season.sunDim - dir.intensity) * k;
    }

    // Hemisphere ambient.
    const hemi = hemiRef.current;
    if (hemi) {
      hemi.color.lerp(tmpB.set(tod.hemiSky), k);
      hemi.groundColor.lerp(tmpC.set(tod.hemiGround), k);
      hemi.intensity += (tod.hemiIntensity - hemi.intensity) * k;
    }

    // Lightning — random flashes during storms, exponential decay.
    let flash = flashRef.current;
    if (season.storm > 0.5 && Math.random() < season.storm * 0.012) flash = 1;
    flash *= Math.exp(-delta * 4.5);
    if (flash < 0.001) flash = 0;
    flashRef.current = flash;
    if (boltRef.current) boltRef.current.intensity = flash * 5.5;
  });

  return (
    <>
      <hemisphereLight ref={hemiRef} args={["#87b0e0", "#33352c", 0.95]} />
      <directionalLight ref={dirRef} position={[100, 180, 60]} color="#fff2e0" intensity={2.3} />
      {/* Lightning bolt fill light (intensity animated) */}
      <directionalLight ref={boltRef} position={[0, 320, -120]} color="#dfeaff" intensity={0} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Camera parallax rig (+ subtle storm shake)                                */
/* -------------------------------------------------------------------------- */

function CameraRig({
  mouse,
  reduced,
  flashRef,
}: {
  mouse: MouseRef;
  reduced: boolean;
  flashRef: MutableRefObject<number>;
}) {
  const target = useMemo(() => new THREE.Vector3(0, 24, -150), []);
  const base = useMemo(() => new THREE.Vector3(0, 15, 78), []);

  useFrame((state) => {
    const cam = state.camera;
    const t = state.clock.elapsedTime;
    const amp = reduced ? 0 : 1;
    const drift = reduced ? 0 : Math.sin(t * 0.05) * 1.4;

    const tx = base.x + mouse.current.x * 6 * amp + drift;
    const ty = base.y - mouse.current.y * 3 * amp;

    cam.position.x += (tx - cam.position.x) * 0.045;
    cam.position.y += (ty - cam.position.y) * 0.045;
    cam.position.z += (base.z - cam.position.z) * 0.045;

    const f = flashRef.current;
    if (f > 0.02 && !reduced) {
      cam.position.x += (Math.random() - 0.5) * f * 1.6;
      cam.position.y += (Math.random() - 0.5) * f * 1.2;
    }

    cam.lookAt(target);
  });

  return null;
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

interface SceneProps {
  mouse: MouseRef;
  reduced: boolean;
  particleCount: number;
  treeCount: number;
  usePost: boolean;
}

function Scene({ mouse, reduced, particleCount, treeCount, usePost }: SceneProps) {
  const journeyRef = useRef<Journey>({ progress: 0, tod: timeOfDay(0), season: seasonAt(0) });
  const flashRef = useRef(0);
  // Coarse state that drives React-managed nodes (Sky / Stars / Clouds).
  const [step, setStep] = useState<{ tod: TimeOfDay; season: SeasonState }>(() => ({
    tod: timeOfDay(0),
    season: seasonAt(0),
  }));

  useEffect(() => {
    let raf = 0;
    let lastP = -1;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      const tod = timeOfDay(p);
      const season = seasonAt(p);
      journeyRef.current = { progress: p, tod, season };
      if (Math.abs(p - lastP) > 0.01) {
        lastP = p;
        setStep({ tod, season });
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const sun = step.tod.sunDir;
  const cloudColor = useMemo(
    () => new THREE.Color("#eef3fb").lerp(new THREE.Color("#5c626b"), step.season.storm).getStyle(),
    [step.season.storm],
  );

  return (
    <>
      {/* fog is created here and animated imperatively in <Atmospherics> */}
      <fog attach="fog" args={["#bcd6ea", 62, 360]} />

      <Sky
        distance={4500}
        sunPosition={[sun[0], sun[1], sun[2]]}
        turbidity={8 + step.season.storm * 8}
        rayleigh={2.2 + step.season.storm * 1.4}
        mieCoefficient={0.005}
        mieDirectionalG={0.85}
      />

      <Atmospherics journeyRef={journeyRef} flashRef={flashRef} />

      {step.tod.starOpacity > 0.2 && (
        <Stars radius={320} depth={80} count={1500} factor={4} saturation={0} fade speed={0.4} />
      )}

      <Suspense fallback={null}>
        <Terrain journeyRef={journeyRef} />
        <Forest journeyRef={journeyRef} count={treeCount} />
        <SeasonalParticles journeyRef={journeyRef} count={particleCount} reduced={reduced} />

        {!reduced && step.season.cloudOpacity > 0.05 && (
          <Clouds material={THREE.MeshBasicMaterial} limit={80}>
            <Cloud seed={1} position={[-70, 62, -150]} bounds={[70, 10, 40]} volume={26} color={cloudColor} opacity={step.season.cloudOpacity} speed={0.14} segments={20} />
            <Cloud seed={7} position={[80, 74, -190]} bounds={[90, 12, 46]} volume={30} color={cloudColor} opacity={step.season.cloudOpacity * 0.9} speed={0.1} segments={22} />
            <Cloud seed={4} position={[10, 88, -230]} bounds={[110, 14, 50]} volume={34} color={cloudColor} opacity={step.season.cloudOpacity * step.season.cloudCover} speed={0.08} segments={22} />
          </Clouds>
        )}
      </Suspense>

      <CameraRig mouse={mouse} reduced={reduced} flashRef={flashRef} />

      {usePost && (
        <EffectComposer multisampling={4}>
          <Bloom intensity={0.5} luminanceThreshold={0.62} luminanceSmoothing={0.2} mipmapBlur radius={0.6} />
          <Vignette eskil={false} offset={0.32} darkness={0.7} />
        </EffectComposer>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Canvas host — adaptive quality + input                                    */
/* -------------------------------------------------------------------------- */

export default function TerrainCanvas() {
  const mouse = useRef({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [degraded, setDegraded] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mob = window.matchMedia("(max-width: 768px)");
    const sync = () => {
      setReduced(rm.matches);
      setMobile(mob.matches);
    };
    sync();
    rm.addEventListener("change", sync);
    mob.addEventListener("change", sync);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      rm.removeEventListener("change", sync);
      mob.removeEventListener("change", sync);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  // Adaptive budgets — "selective realism": ~65% fewer particles than the
  // original (2400→820), each higher quality and depth-layered, so they read
  // as atmosphere rather than noise. Post-processing only on capable desktops.
  const particleCount = mobile ? 320 : reduced ? 260 : 820;
  const treeCount = mobile ? 420 : 850;
  const usePost = !mobile && !reduced && !degraded;

  return (
    <Canvas
      dpr={[1, mobile ? 1.4 : 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 15, 78], fov: 50, near: 0.1, far: 2000 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
      }}
    >
      <PerformanceMonitor flipflops={3} onFallback={() => setDegraded(true)} onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated={false} />
      <Scene
        mouse={mouse}
        reduced={reduced}
        particleCount={particleCount}
        treeCount={treeCount}
        usePost={usePost}
      />
    </Canvas>
  );
}
