"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const BODY_COLOR = "#c4c0b6";
const JOINT_COLOR = "#3a3a3e";
const DARK_COLOR = "#1a1a1e";
const SCREEN_COLOR = "#111111";

export default function Robot() {
  const bodyGroupRef = useRef<THREE.Group>(null);
  const neckRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const leftShoulderRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const antennaBallRef = useRef<THREE.Mesh>(null);

  const isMobileRef = useRef(false);

  useEffect(() => {
    const check = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;
    const isMobile = isMobileRef.current;

    // === IDLE BASE LAYER (always running) ===
    const idleHeadY = Math.sin(t * 0.5) * 0.06;
    const idleHeadX = Math.sin(t * 0.8) * 0.03;
    const idleTorsoY = Math.sin(t * 0.4) * 0.02;
    const idleTorsoX = Math.sin(t * 0.6) * 0.015;
    const idleArmZ = Math.sin(t * 0.7) * 0.03;
    const idleBodyY = Math.sin(t * 0.3) * 0.01;
    const idleBodyX = Math.sin(t * 0.5) * 0.008;

    // === CURSOR LAYER (desktop only) ===
    const cursorEyeX = isMobile ? 0 : THREE.MathUtils.clamp(mouseX * 0.06, -0.06, 0.06);
    const cursorEyeY = isMobile ? 0 : THREE.MathUtils.clamp(-mouseY * 0.04, -0.04, 0.04);
    const cursorHeadY = isMobile ? 0 : THREE.MathUtils.clamp(mouseX * 0.35, -0.35, 0.35);
    const cursorHeadX = isMobile ? 0 : THREE.MathUtils.clamp(-mouseY * 0.18, -0.18, 0.18);
    const cursorNeckY = isMobile ? 0 : THREE.MathUtils.clamp(mouseX * 0.15, -0.15, 0.15);
    const cursorNeckX = isMobile ? 0 : THREE.MathUtils.clamp(-mouseY * 0.08, -0.08, 0.08);
    const cursorTorsoY = isMobile ? 0 : THREE.MathUtils.clamp(mouseX * 0.08, -0.08, 0.08);
    const cursorTorsoX = isMobile ? 0 : THREE.MathUtils.clamp(-mouseY * 0.04, -0.04, 0.04);
    const cursorBodyY = isMobile ? 0 : THREE.MathUtils.clamp(mouseX * 0.03, -0.03, 0.03);
    const cursorBodyX = isMobile ? 0 : THREE.MathUtils.clamp(-mouseY * 0.02, -0.02, 0.02);

    // === BLEND: idle + cursor ===
    const headTargetY = THREE.MathUtils.clamp(cursorHeadY + idleHeadY, -0.4, 0.4);
    const headTargetX = THREE.MathUtils.clamp(cursorHeadX + idleHeadX, -0.2, 0.2);
    const neckTargetY = THREE.MathUtils.clamp(cursorNeckY + idleHeadY * 0.5, -0.18, 0.18);
    const neckTargetX = THREE.MathUtils.clamp(cursorNeckX + idleHeadX * 0.5, -0.1, 0.1);
    const torsoTargetY = THREE.MathUtils.clamp(cursorTorsoY + idleTorsoY, -0.1, 0.1);
    const torsoTargetX = THREE.MathUtils.clamp(cursorTorsoX + idleTorsoX, -0.06, 0.06);
    const bodyTargetY = THREE.MathUtils.clamp(cursorBodyY + idleBodyY, -0.04, 0.04);
    const bodyTargetX = THREE.MathUtils.clamp(cursorBodyX + idleBodyX, -0.03, 0.03);

    // === APPLY: EYES (strongest — lerp 0.12) ===
    if (leftEyeRef.current) {
      leftEyeRef.current.position.x = THREE.MathUtils.lerp(
        leftEyeRef.current.position.x, -0.2 + cursorEyeX, 0.12
      );
      leftEyeRef.current.position.y = THREE.MathUtils.lerp(
        leftEyeRef.current.position.y, 1.55 + cursorEyeY, 0.12
      );
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.position.x = THREE.MathUtils.lerp(
        rightEyeRef.current.position.x, 0.2 + cursorEyeX, 0.12
      );
      rightEyeRef.current.position.y = THREE.MathUtils.lerp(
        rightEyeRef.current.position.y, 1.55 + cursorEyeY, 0.12
      );
    }

    // === APPLY: HEAD (strong — lerp 0.07) ===
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.y, headTargetY, 0.07
      );
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.x, headTargetX, 0.07
      );
    }

    // === APPLY: NECK (medium — lerp 0.06) ===
    if (neckRef.current) {
      neckRef.current.rotation.y = THREE.MathUtils.lerp(
        neckRef.current.rotation.y, neckTargetY, 0.06
      );
      neckRef.current.rotation.x = THREE.MathUtils.lerp(
        neckRef.current.rotation.x, neckTargetX, 0.06
      );
    }

    // === APPLY: TORSO (slow — lerp 0.05) ===
    if (torsoRef.current) {
      torsoRef.current.rotation.y = THREE.MathUtils.lerp(
        torsoRef.current.rotation.y, torsoTargetY, 0.05
      );
      torsoRef.current.rotation.x = THREE.MathUtils.lerp(
        torsoRef.current.rotation.x, torsoTargetX, 0.05
      );
    }

    // === APPLY: BODY TILT (very slow — lerp 0.04) ===
    if (bodyGroupRef.current) {
      bodyGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        bodyGroupRef.current.rotation.y, bodyTargetY, 0.04
      );
      bodyGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        bodyGroupRef.current.rotation.x, bodyTargetX, 0.04
      );
    }

    // === APPLY: SHOULDER COUNTER-MOVEMENT ===
    if (leftShoulderRef.current && torsoRef.current) {
      const counterY = -torsoRef.current.rotation.y * 0.6;
      leftShoulderRef.current.rotation.y = THREE.MathUtils.lerp(
        leftShoulderRef.current.rotation.y, counterY + idleArmZ, 0.04
      );
    }
    if (rightShoulderRef.current && torsoRef.current) {
      const counterY = -torsoRef.current.rotation.y * 0.6;
      rightShoulderRef.current.rotation.y = THREE.MathUtils.lerp(
        rightShoulderRef.current.rotation.y, counterY - idleArmZ, 0.04
      );
    }

    // === APPLY: ANTENNA BALL PULSE ===
    if (antennaBallRef.current) {
      const s = 1 + Math.sin(t * 3) * 0.15;
      antennaBallRef.current.scale.set(s, s, s);
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      {/* ============ BODY GROUP (full-body tilt) ============ */}
      <group ref={bodyGroupRef} position={[0, 0.3, 0]}>

        {/* ============ NECK (follows cursor with delay) ============ */}
        <group ref={neckRef} position={[0, 0.85, 0]}>
          {/* ============ HEAD GROUP (tracks cursor) ============ */}
          <group ref={headGroupRef} position={[0, 0.65, 0]}>
            {/* Head block */}
            <RoundedBox args={[1.4, 1.3, 1.2]} radius={0.25}>
              <meshStandardMaterial
                color={BODY_COLOR}
                metalness={0.15}
                roughness={0.6}
              />
            </RoundedBox>

            {/* Face screen (glossy black) */}
            <RoundedBox
              args={[0.95, 0.75, 0.06]}
              radius={0.12}
              position={[0, 0.02, 0.61]}
            >
              <meshStandardMaterial
                color={SCREEN_COLOR}
                metalness={0.9}
                roughness={0.1}
              />
            </RoundedBox>

            {/* Left eye */}
            <mesh ref={leftEyeRef} position={[-0.2, 1.55, 0.66]}>
              <RoundedBox args={[0.16, 0.28, 0.05]} radius={0.08}>
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={1.5}
                />
              </RoundedBox>
            </mesh>

            {/* Right eye */}
            <mesh ref={rightEyeRef} position={[0.2, 1.55, 0.66]}>
              <RoundedBox args={[0.16, 0.28, 0.05]} radius={0.08}>
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={1.5}
                />
              </RoundedBox>
            </mesh>

            {/* ---- Rainbow ring around face screen ---- */}
            <RoundedBox
              args={[0.12, 0.5, 0.06]}
              radius={0.03}
              position={[-0.54, 0.25, 0.62]}
            >
              <meshStandardMaterial
                color="#3b82f6"
                emissive="#06b6d4"
                emissiveIntensity={1.5}
              />
            </RoundedBox>
            <RoundedBox
              args={[0.75, 0.1, 0.06]}
              radius={0.03}
              position={[0, 0.5, 0.62]}
            >
              <meshStandardMaterial
                color="#a855f7"
                emissive="#a855f7"
                emissiveIntensity={1.5}
              />
            </RoundedBox>
            <RoundedBox
              args={[0.12, 0.5, 0.06]}
              radius={0.03}
              position={[0.54, 0.25, 0.62]}
            >
              <meshStandardMaterial
                color="#ec4899"
                emissive="#ec4899"
                emissiveIntensity={1.5}
              />
            </RoundedBox>
            <RoundedBox
              args={[0.12, 0.5, 0.06]}
              radius={0.03}
              position={[0.54, -0.25, 0.62]}
            >
              <meshStandardMaterial
                color="#f97316"
                emissive="#ef4444"
                emissiveIntensity={1.5}
              />
            </RoundedBox>
            <RoundedBox
              args={[0.75, 0.1, 0.06]}
              radius={0.03}
              position={[0, -0.46, 0.62]}
            >
              <meshStandardMaterial
                color="#22c55e"
                emissive="#22c55e"
                emissiveIntensity={1.5}
              />
            </RoundedBox>
            <RoundedBox
              args={[0.12, 0.5, 0.06]}
              radius={0.03}
              position={[-0.54, -0.25, 0.62]}
            >
              <meshStandardMaterial
                color="#eab308"
                emissive="#eab308"
                emissiveIntensity={1.5}
              />
            </RoundedBox>

            {/* Antenna base */}
            <RoundedBox
              args={[0.65, 0.28, 0.65]}
              radius={0.06}
              position={[0, 0.82, 0]}
            >
              <meshStandardMaterial
                color={DARK_COLOR}
                metalness={0.3}
                roughness={0.5}
              />
            </RoundedBox>
            {[-0.06, 0, 0.06].map((y, i) => (
              <RoundedBox
                key={i}
                args={[0.68, 0.02, 0.68]}
                radius={0.005}
                position={[0, 0.82 + y, 0]}
              >
                <meshStandardMaterial
                  color="#0f0f12"
                  metalness={0.2}
                  roughness={0.6}
                />
              </RoundedBox>
            ))}

            {/* Side knob */}
            <group position={[0.78, 0, 0]}>
              <RoundedBox args={[0.12, 0.12, 0.15]} radius={0.03}>
                <meshStandardMaterial
                  color="#888888"
                  metalness={0.4}
                  roughness={0.35}
                />
              </RoundedBox>
              <mesh position={[0.08, 0, 0]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial
                  color="#666666"
                  metalness={0.5}
                  roughness={0.3}
                />
              </mesh>
            </group>

            {/* Rainbow ring glow */}
            <pointLight position={[-0.5, 0.4, 1]} color="#06b6d4" intensity={0.4} distance={2} />
            <pointLight position={[0.5, 0.4, 1]} color="#ec4899" intensity={0.4} distance={2} />
            <pointLight position={[0.5, -0.4, 1]} color="#ef4444" intensity={0.3} distance={2} />
            <pointLight position={[-0.5, -0.4, 1]} color="#eab308" intensity={0.3} distance={2} />

            {/* Antenna ball (pulsing) */}
            <mesh ref={antennaBallRef} position={[0, 1.05, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial
                color="#00ff88"
                emissive="#00ff88"
                emissiveIntensity={2}
              />
            </mesh>
            <pointLight position={[0, 1.2, 0]} color="#00ff88" intensity={0.3} distance={2} />
          </group>
        </group>

        {/* ============ TORSO GROUP ============ */}
        <group ref={torsoRef}>
          {/* Torso */}
          <RoundedBox args={[1.3, 1.4, 0.9]} radius={0.2} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={BODY_COLOR}
              metalness={0.15}
              roughness={0.6}
            />
          </RoundedBox>

          {/* Chest LEDs */}
          <mesh position={[-0.15, 0.2, 0.46]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color="#ff6b9d" emissive="#ff6b9d" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0, 0.2, 0.46]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0.15, 0.2, 0.46]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
          </mesh>

          {/* ============ LEFT ARM (counter-movement) ============ */}
          <group ref={leftShoulderRef} position={[-0.78, 0.55, 0]}>
            {/* Shoulder */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color={JOINT_COLOR} metalness={0.3} roughness={0.4} />
            </mesh>
            {/* Upper arm */}
            <RoundedBox args={[0.28, 0.5, 0.28]} radius={0.06} position={[0, -0.4, 0]}>
              <meshStandardMaterial color={BODY_COLOR} metalness={0.15} roughness={0.6} />
            </RoundedBox>
            {/* Elbow */}
            <mesh position={[0, -0.7, 0]}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={JOINT_COLOR} metalness={0.3} roughness={0.4} />
            </mesh>
            {/* Lower arm */}
            <RoundedBox args={[0.25, 0.45, 0.25]} radius={0.06} position={[0, -1.0, 0]}>
              <meshStandardMaterial color={BODY_COLOR} metalness={0.15} roughness={0.6} />
            </RoundedBox>
            {/* Hand */}
            <RoundedBox args={[0.3, 0.15, 0.22]} radius={0.05} position={[0, -1.3, 0]}>
              <meshStandardMaterial color={BODY_COLOR} metalness={0.15} roughness={0.6} />
            </RoundedBox>
          </group>

          {/* ============ RIGHT ARM (counter-movement) ============ */}
          <group ref={rightShoulderRef} position={[0.78, 0.55, 0]}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color={JOINT_COLOR} metalness={0.3} roughness={0.4} />
            </mesh>
            <RoundedBox args={[0.28, 0.5, 0.28]} radius={0.06} position={[0, -0.4, 0]}>
              <meshStandardMaterial color={BODY_COLOR} metalness={0.15} roughness={0.6} />
            </RoundedBox>
            <mesh position={[0, -0.7, 0]}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={JOINT_COLOR} metalness={0.3} roughness={0.4} />
            </mesh>
            <RoundedBox args={[0.25, 0.45, 0.25]} radius={0.06} position={[0, -1.0, 0]}>
              <meshStandardMaterial color={BODY_COLOR} metalness={0.15} roughness={0.6} />
            </RoundedBox>
            <RoundedBox args={[0.3, 0.15, 0.22]} radius={0.05} position={[0, -1.3, 0]}>
              <meshStandardMaterial color={BODY_COLOR} metalness={0.15} roughness={0.6} />
            </RoundedBox>
          </group>
        </group>

        {/* ============ LEGS (static) ============ */}
        {/* Left leg */}
        <group position={[-0.3, 0, 0]}>
          <RoundedBox args={[0.35, 0.5, 0.35]} radius={0.06} position={[0, -1.05, 0]}>
            <meshStandardMaterial color={BODY_COLOR} metalness={0.15} roughness={0.6} />
          </RoundedBox>
          <RoundedBox args={[0.36, 0.08, 0.15]} radius={0.02} position={[0, -1.0, 0.18]}>
            <meshStandardMaterial color={DARK_COLOR} metalness={0.2} roughness={0.5} />
          </RoundedBox>
          <RoundedBox args={[0.36, 0.08, 0.15]} radius={0.02} position={[0, -1.12, 0.18]}>
            <meshStandardMaterial color={DARK_COLOR} metalness={0.2} roughness={0.5} />
          </RoundedBox>
          <mesh position={[0, -1.35, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color={JOINT_COLOR} metalness={0.3} roughness={0.4} />
          </mesh>
          <RoundedBox args={[0.32, 0.4, 0.32]} radius={0.06} position={[0, -1.65, 0]}>
            <meshStandardMaterial color={BODY_COLOR} metalness={0.15} roughness={0.6} />
          </RoundedBox>
          <RoundedBox args={[0.38, 0.18, 0.48]} radius={0.05} position={[0, -1.92, 0.04]}>
            <meshStandardMaterial color={BODY_COLOR} metalness={0.15} roughness={0.6} />
          </RoundedBox>
        </group>

        {/* Right leg */}
        <group position={[0.3, 0, 0]}>
          <RoundedBox args={[0.35, 0.5, 0.35]} radius={0.06} position={[0, -1.05, 0]}>
            <meshStandardMaterial color={BODY_COLOR} metalness={0.15} roughness={0.6} />
          </RoundedBox>
          <RoundedBox args={[0.36, 0.08, 0.15]} radius={0.02} position={[0, -1.0, 0.18]}>
            <meshStandardMaterial color={DARK_COLOR} metalness={0.2} roughness={0.5} />
          </RoundedBox>
          <RoundedBox args={[0.36, 0.08, 0.15]} radius={0.02} position={[0, -1.12, 0.18]}>
            <meshStandardMaterial color={DARK_COLOR} metalness={0.2} roughness={0.5} />
          </RoundedBox>
          <mesh position={[0, -1.35, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color={JOINT_COLOR} metalness={0.3} roughness={0.4} />
          </mesh>
          <RoundedBox args={[0.32, 0.4, 0.32]} radius={0.06} position={[0, -1.65, 0]}>
            <meshStandardMaterial color={BODY_COLOR} metalness={0.15} roughness={0.6} />
          </RoundedBox>
          <RoundedBox args={[0.38, 0.18, 0.48]} radius={0.05} position={[0, -1.92, 0.04]}>
            <meshStandardMaterial color={BODY_COLOR} metalness={0.15} roughness={0.6} />
          </RoundedBox>
        </group>

        {/* ============ PEDESTAL (static) ============ */}
        <RoundedBox args={[1.6, 0.3, 1.6]} radius={0.05} position={[0, -2.15, 0]}>
          <meshStandardMaterial color={DARK_COLOR} metalness={0.8} roughness={0.15} />
        </RoundedBox>
      </group>
    </Float>
  );
}
