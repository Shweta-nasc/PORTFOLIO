"use client";

import { type ReactNode } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const BODY_W = 1.02;
const BODY_H = 2.08;
const BODY_T = 0.12;
const RADIUS = 0.19;
const BEZEL = 0.028;

export const PHONE_SCREEN_W = BODY_W - BEZEL * 2;
export const PHONE_SCREEN_H = BODY_H - BEZEL * 2;

const TITANIUM = "#2b2b30";

interface PhoneModelProps {
  children?: ReactNode;
  glowColor?: string;
  glowIntensity?: number;
}

/**
 * A parametric, photorealistic smartphone (titanium frame, thin bezels,
 * dynamic-island) used on mobile in place of the MacBook. `children` mount on
 * the display plane so they inherit the device transform.
 */
export function PhoneModel({
  children,
  glowColor = "#cfe6dc",
  glowIntensity = 1.15,
}: PhoneModelProps) {
  return (
    <group>
      {/* Titanium body */}
      <RoundedBox
        args={[BODY_W, BODY_H, BODY_T]}
        radius={RADIUS}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={TITANIUM} metalness={0.95} roughness={0.3} />
      </RoundedBox>

      {/* Black glass front */}
      <mesh position={[0, 0, BODY_T / 2 + 0.006]}>
        <planeGeometry args={[BODY_W - BEZEL, BODY_H - BEZEL]} />
        <meshStandardMaterial color="#050506" metalness={0.2} roughness={0.3} />
      </mesh>

      {/* Emissive backlight */}
      <mesh position={[0, 0, BODY_T / 2 + 0.009]}>
        <planeGeometry args={[PHONE_SCREEN_W, PHONE_SCREEN_H]} />
        <meshStandardMaterial
          color="#05070c"
          emissive={new THREE.Color(glowColor)}
          emissiveIntensity={glowIntensity}
          toneMapped={false}
        />
      </mesh>

      {/* Dynamic island */}
      <mesh position={[0, PHONE_SCREEN_H / 2 - 0.12, BODY_T / 2 + 0.012]}>
        <planeGeometry args={[0.34, 0.09]} />
        <meshBasicMaterial color="#050506" toneMapped={false} />
      </mesh>

      {/* Live portfolio screen — seated flush on the display surface (coplanar
          with the emissive plane at z≈BODY_T/2+0.009) so the CSS-3D content
          shares the device tilt and pins to the screen corners. */}
      <group position={[0, 0, BODY_T / 2 + 0.011]}>{children}</group>
    </group>
  );
}
