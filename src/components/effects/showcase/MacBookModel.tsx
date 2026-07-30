"use client";

import { useMemo, type ReactNode } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  Dimensions (local units — the whole device is scaled by the scene)        */
/* -------------------------------------------------------------------------- */

const BASE_W = 3.25;
const BASE_D = 2.24;
const BASE_H = 0.11;

const LID_W = 3.2;
const LID_H = 1.98;
const LID_T = 0.07;

/** Thin uniform bezel around the active display. */
const BEZEL = 0.085;
export const SCREEN_W = LID_W - BEZEL * 2;
export const SCREEN_H = LID_H - BEZEL * 2;

/** Lid lean, measured back from vertical (negative tips the top away). */
const LID_TILT = -0.34;

const GRAPHITE = "#26262b";
const GRAPHITE_DARK = "#1a1a1f";

/* -------------------------------------------------------------------------- */
/*  Procedural keyboard + trackpad texture (1 draw call for the whole deck)   */
/* -------------------------------------------------------------------------- */

function useDeckTexture() {
  return useMemo(() => {
    const w = 1024;
    const h = 704;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Deck base.
    ctx.fillStyle = "#202024";
    ctx.fillRect(0, 0, w, h);

    // Speaker grills flanking the keyboard.
    const drawGrill = (x0: number) => {
      ctx.fillStyle = "#17171b";
      for (let gx = 0; gx < 60; gx += 7) {
        for (let gy = 60; gy < h - 300; gy += 7) {
          ctx.beginPath();
          ctx.arc(x0 + gx, gy, 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    drawGrill(70);
    drawGrill(w - 130);

    // Keyboard well (recessed dark tray).
    const kbX = 150;
    const kbY = 70;
    const kbW = w - 300;
    const kbH = 360;
    roundRect(ctx, kbX, kbY, kbW, kbH, 14);
    ctx.fillStyle = "#111114";
    ctx.fill();

    // Keys.
    const cols = 14;
    const rows = 6;
    const gap = 8;
    const keyW = (kbW - gap * (cols + 1)) / cols;
    const keyH = (kbH - gap * (rows + 1)) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const kx = kbX + gap + c * (keyW + gap);
        const ky = kbY + gap + r * (keyH + gap);
        roundRect(ctx, kx, ky, keyW, keyH, 5);
        const grad = ctx.createLinearGradient(kx, ky, kx, ky + keyH);
        grad.addColorStop(0, "#34343a");
        grad.addColorStop(1, "#232329");
        ctx.fillStyle = grad;
        ctx.fill();
        // Subtle keycap highlight.
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Trackpad.
    const tpW = w * 0.34;
    const tpH = 200;
    const tpX = (w - tpW) / 2;
    const tpY = kbY + kbH + 30;
    roundRect(ctx, tpX, tpY, tpW, tpH, 16);
    ctx.fillStyle = "#2a2a30";
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* -------------------------------------------------------------------------- */
/*  Model                                                                     */
/* -------------------------------------------------------------------------- */

interface MacBookModelProps {
  /** Rendered on the display plane (the live portfolio screen). */
  children?: ReactNode;
  /** Emissive tint of the backlight glow behind the screen. */
  glowColor?: string;
  glowIntensity?: number;
}

/**
 * A parametric, photorealistic MacBook Pro built from rounded primitives.
 * PBR graphite aluminium + a procedural keyboard deck. The `children` are
 * mounted on the display plane so they inherit the lid's transform (float,
 * idle rotation, scroll tilt) automatically.
 */
export function MacBookModel({
  children,
  glowColor = "#cfe6dc",
  glowIntensity = 1.15,
}: MacBookModelProps) {
  const deck = useDeckTexture();

  return (
    <group>
      {/* Bottom case */}
      <RoundedBox
        args={[BASE_W, BASE_H, BASE_D]}
        radius={0.05}
        smoothness={5}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={GRAPHITE} metalness={0.92} roughness={0.36} />
      </RoundedBox>

      {/* Keyboard deck (procedural texture) */}
      <mesh position={[0, BASE_H / 2 + 0.001, 0.06]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[BASE_W * 0.985, BASE_D * 0.985]} />
        {deck ? (
          <meshStandardMaterial map={deck} metalness={0.5} roughness={0.55} />
        ) : (
          <meshStandardMaterial color={GRAPHITE_DARK} metalness={0.5} roughness={0.6} />
        )}
      </mesh>

      {/* Rubber feet */}
      {[
        [-BASE_W / 2 + 0.2, -0.2 + BASE_D / 2],
        [BASE_W / 2 - 0.2, -0.2 + BASE_D / 2],
        [-BASE_W / 2 + 0.2, 0.2 - BASE_D / 2],
        [BASE_W / 2 - 0.2, 0.2 - BASE_D / 2],
      ].map(([fx, fz], i) => (
        <mesh key={i} position={[fx, -BASE_H / 2 - 0.01, fz]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshStandardMaterial color="#0c0c0e" roughness={0.8} />
        </mesh>
      ))}

      {/* Lid assembly — pivots at the rear hinge */}
      <group position={[0, BASE_H / 2, -BASE_D / 2]} rotation={[LID_TILT, 0, 0]}>
        {/* Hinge bar */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, BASE_W * 0.96, 24]} />
          <meshStandardMaterial color={GRAPHITE_DARK} metalness={0.8} roughness={0.4} />
        </mesh>

        {/* Everything above the hinge is centred at +LID_H/2 */}
        <group position={[0, LID_H / 2, 0]}>
          {/* Lid back shell */}
          <RoundedBox
            args={[LID_W, LID_H, LID_T]}
            radius={0.05}
            smoothness={5}
            position={[0, 0, -LID_T / 2]}
            castShadow
          >
            <meshStandardMaterial color={GRAPHITE} metalness={0.92} roughness={0.34} />
          </RoundedBox>

          {/* Black glass front (bezel) */}
          <mesh position={[0, 0, 0.001]}>
            <planeGeometry args={[LID_W, LID_H]} />
            <meshStandardMaterial color="#050506" metalness={0.2} roughness={0.35} />
          </mesh>

          {/* Emissive backlight — feeds bloom + illuminates the keyboard */}
          <mesh position={[0, 0, 0.004]}>
            <planeGeometry args={[SCREEN_W, SCREEN_H]} />
            <meshStandardMaterial
              color="#05070c"
              emissive={new THREE.Color(glowColor)}
              emissiveIntensity={glowIntensity}
              toneMapped={false}
            />
          </mesh>

          {/* Notch */}
          <mesh position={[0, SCREEN_H / 2 - 0.02, 0.006]}>
            <planeGeometry args={[0.34, 0.05]} />
            <meshBasicMaterial color="#050506" toneMapped={false} />
          </mesh>

          {/* Live portfolio screen (drei <Html transform>). Seated flush on
              the display surface — coplanar with the emissive plane (z≈0.004),
              not floating in front — so the CSS-3D content shares the lid's
              exact tilt and its corners pin to the screen corners (no parallax
              gap that would reveal the bezel glow). */}
          <group position={[0, 0, 0.006]}>{children}</group>
        </group>
      </group>
    </group>
  );
}
