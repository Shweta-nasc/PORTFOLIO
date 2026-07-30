"use client";

import { Suspense, useEffect, useMemo, useRef, type ReactNode, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { clamp, mapRange } from "@/lib/utils";
import { MacBookModel, SCREEN_W, SCREEN_H } from "./MacBookModel";
import { PhoneModel, PHONE_SCREEN_W, PHONE_SCREEN_H } from "./PhoneModel";
import { ScreenContent } from "./ScreenContent";

export type ShowcaseDevice = "laptop" | "phone";

/* Screen backlight that spills onto the keyboard — a soft neutral with a
   faint aurora tint (no longer a cold blue). */
const GLOW = "#cfe6dc";
/* Cinematic rim pair: warm ember (campfire) from one side + cool aurora teal
   from the other, for complementary, dimensional light on the aluminium. */
const RIM_WARM = "#F0A857";
const RIM_COOL = "#4EBA8C";

/* -------------------------------------------------------------------------- */
/*  Rig — float, idle rotation, entrance scale, scroll-driven tilt            */
/* -------------------------------------------------------------------------- */

interface RigProps {
  progressRef: MutableRefObject<number>;
  reduced: boolean;
  baseYaw: number;
  baseY: number;
  lookY: number;
  children: ReactNode;
}

function Rig({ progressRef, reduced, baseYaw, baseY, lookY, children }: RigProps) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, lookY, 0);
  }, [camera, lookY]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current;

    // Entrance: scale 0.9 -> 1.0 across the first slice of the scroll range.
    const enter = clamp(p / 0.14, 0, 1);
    g.scale.setScalar(0.9 + 0.1 * enter);

    // Continuous, subtle float + idle rotation.
    const floatY = reduced ? 0 : Math.sin(t * 0.85) * 0.03;
    const idleYaw = reduced ? 0 : Math.sin(t * 0.4) * 0.03;
    const idlePitch = reduced ? 0 : Math.sin(t * 0.7) * 0.012;

    // Small rotation while scrolling.
    const scrollYaw = mapRange(p, 0, 1, 0.14, -0.08);

    g.position.y = baseY + floatY;
    g.rotation.y = baseYaw + idleYaw + scrollYaw;
    g.rotation.x = idlePitch;
  });

  return (
    <group ref={group} position={[0, baseY, 0]} rotation={[0, baseYaw, 0]}>
      {children}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  Studio backdrop — a soft radial pool of light behind the device           */
/* -------------------------------------------------------------------------- */

function StudioBackdrop() {
  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const grad = ctx.createRadialGradient(
      size / 2,
      size * 0.44,
      size * 0.04,
      size / 2,
      size * 0.5,
      size * 0.62,
    );
    grad.addColorStop(0, "#1b2138");
    grad.addColorStop(0.5, "#0c0d17");
    grad.addColorStop(1, "#06060b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <mesh position={[0, 0.5, -6]} scale={[34, 20, 1]}>
      <planeGeometry />
      <meshBasicMaterial
        map={texture ?? null}
        color={texture ? "#ffffff" : "#07070d"}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Self-contained HDR-style environment (no external file fetch)             */
/* -------------------------------------------------------------------------- */

function StudioEnvironment() {
  return (
    <Environment resolution={256}>
      {/* Soft key from above */}
      <Lightformer
        form="rect"
        intensity={2.2}
        color="#ffffff"
        position={[0, 5, 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[10, 10, 1]}
      />
      {/* Warm ember rim from back-left */}
      <Lightformer
        form="rect"
        intensity={2.4}
        color={RIM_WARM}
        position={[-5, 1, -4]}
        rotation={[0, Math.PI / 3, 0]}
        scale={[6, 6, 1]}
      />
      {/* Cool aurora-teal rim from back-right */}
      <Lightformer
        form="rect"
        intensity={2.2}
        color={RIM_COOL}
        position={[5, 1, -4]}
        rotation={[0, -Math.PI / 3, 0]}
        scale={[6, 6, 1]}
      />
      {/* Gentle front fill for the aluminium */}
      <Lightformer
        form="circle"
        intensity={1.1}
        color="#dfe8ff"
        position={[0, 1, 6]}
        scale={[5, 5, 1]}
      />
    </Environment>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

interface DeviceShowcaseSceneProps {
  device: ShowcaseDevice;
  progressRef: MutableRefObject<number>;
  iframeRef: MutableRefObject<HTMLIFrameElement | null>;
  reduced: boolean;
  /** Off-screen? Pause the render loop entirely to save the GPU. */
  paused: boolean;
}

export default function DeviceShowcaseScene({
  device,
  progressRef,
  iframeRef,
  reduced,
  paused,
}: DeviceShowcaseSceneProps) {
  const isPhone = device === "phone";

  // Framing tuned per device for a ~40° three-quarter view.
  const camPos: [number, number, number] = isPhone ? [0.15, 0.6, 5.4] : [0.35, 1.3, 6.3];
  const fov = isPhone ? 26 : 30;
  const baseYaw = isPhone ? -0.32 : -0.3;
  const baseY = isPhone ? -0.15 : -0.62;
  const lookY = isPhone ? 0.0 : 0.28;

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      frameloop={paused ? "never" : "always"}
      camera={{ position: camPos, fov, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
    >
      {/* Opaque studio background so bloom / DoF / vignette composite correctly. */}
      <color attach="background" args={["#07070d"]} />
      <Suspense fallback={null}>
        <StudioBackdrop />
        <StudioEnvironment />

        {/* Base ambient + key */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 6, 5]} intensity={1.4} color="#ffffff" />

        {/* Cinematic rim accents — warm ember + cool aurora teal */}
        <spotLight position={[-6, 2, -3]} angle={0.7} penumbra={1} intensity={40} color={RIM_WARM} distance={20} />
        <spotLight position={[6, 3, -2]} angle={0.7} penumbra={1} intensity={34} color={RIM_COOL} distance={20} />

        <Rig progressRef={progressRef} reduced={reduced} baseYaw={baseYaw} baseY={baseY} lookY={lookY}>
          {/* Screen glow spilling onto the keyboard (moves with the device) */}
          <pointLight position={isPhone ? [0, 0.2, 0.5] : [0, 0.85, 0.7]} intensity={isPhone ? 2 : 3.2} distance={3} decay={2} color={GLOW} />

          {isPhone ? (
            <PhoneModel glowColor={GLOW} glowIntensity={1.1}>
              <ScreenContent
                screenWidth={PHONE_SCREEN_W}
                screenHeight={PHONE_SCREEN_H}
                pixelWidth={430}
                cornerRadius={26}
                iframeRef={iframeRef}
                progressRef={progressRef}
              />
            </PhoneModel>
          ) : (
            <MacBookModel glowColor={GLOW} glowIntensity={1.1}>
              <ScreenContent
                screenWidth={SCREEN_W}
                screenHeight={SCREEN_H}
                pixelWidth={1440}
                cornerRadius={8}
                iframeRef={iframeRef}
                progressRef={progressRef}
              />
            </MacBookModel>
          )}
        </Rig>

        {/* Soft grounded contact shadow */}
        <ContactShadows
          position={[0, baseY - (isPhone ? 1.05 : 0.16), 0]}
          opacity={0.55}
          scale={isPhone ? 5 : 8}
          blur={2.6}
          far={5}
          color="#000000"
          frames={reduced ? 1 : Infinity}
        />

        <EffectComposer multisampling={4} enableNormalPass={false}>
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <DepthOfField
            focusDistance={0.015}
            focalLength={0.025}
            bokehScale={isPhone ? 1.2 : 1.8}
          />
          <Vignette eskil={false} offset={0.32} darkness={0.62} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
