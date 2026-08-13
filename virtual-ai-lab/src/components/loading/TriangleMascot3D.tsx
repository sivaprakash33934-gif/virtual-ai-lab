"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import type { QualityTier } from "./webgl";
import { progressStore } from "@/lib/loadingProgress";

interface TriangleMascot3DProps {
  phase: string;
  tier: QualityTier;
}

const FACE_LERP = 0.15;

const LAUNCH_DURATION = 0.25;
const SPIN_DURATION = 1.5;
const HANG_DURATION = 0.7;
const FALL_DURATION = 0.35;

const BOUNCE_DECAY = 0.88;
const BOUNCE_FREQ = 18;

const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeInQuad = (t: number) => t * t;
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

// Triangle body shape
const bodyShape = new THREE.Shape();
bodyShape.moveTo(0, 0.7);
bodyShape.lineTo(-0.6, -0.5);
bodyShape.lineTo(0.6, -0.5);
bodyShape.closePath();

// Face screen shape — inset 25% toward centroid
const screenShape = new THREE.Shape();
screenShape.moveTo(0, 0.5);
screenShape.lineTo(-0.45, -0.4);
screenShape.lineTo(0.45, -0.4);
screenShape.closePath();

export default function TriangleMascot3D({ phase, tier }: TriangleMascot3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const transformRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftTailRef = useRef<THREE.Mesh>(null);
  const rightTailRef = useRef<THREE.Mesh>(null);
  const determinedRef = useRef<THREE.Group>(null);
  const strainedRef = useRef<THREE.Group>(null);
  const happyRef = useRef<THREE.Group>(null);
  const growT = useRef(0);

  const prevPhaseRef = useRef(phase);
  const phaseChangeTime = useRef(0);
  const bounceEnergy = useRef(0);

  const isStrained = phase === "spin";
  const isHappy = phase === "recovery" || phase === "done";
  const isRecovery = phase === "recovery";
  const isAirborne = phase === "spin";
  const isRunning = phase === "run" || phase === "done";

  // Flat materials — MeshBasicMaterial ignores lights, toneMapped=false for vivid neon
  const bodyMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#00D4FF", toneMapped: false }),
    []
  );
  const screenMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#0B0B12", toneMapped: false }),
    []
  );
  const limbMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#6FE7FF", toneMapped: false }),
    []
  );
  const headbandMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#4DC9FF", toneMapped: false }),
    []
  );

  const applyFace = (group: THREE.Group | null, target: number) => {
    if (!group) return;
    group.children.forEach((child) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, target, FACE_LERP);
    });
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const speed = 8 * (0.7 + 0.3 * progressStore.value);
    const amplitude = tier.spin ? 0.6 : 0.3;

    if (!groupRef.current) return;

    if (phase !== prevPhaseRef.current) {
      phaseChangeTime.current = t;
      prevPhaseRef.current = phase;
      if (phase === "recovery") {
        bounceEnergy.current = Math.abs(groupRef.current.position.y) * 2.5;
      }
    }
    const phaseElapsed = t - phaseChangeTime.current;

    // Growth transform
    const targetGrow = isAirborne && tier.spin ? 1 : 0;
    growT.current = THREE.MathUtils.lerp(growT.current, targetGrow, 0.08);
    const growScale = 1 + 0.32 * easeOutBack(growT.current);
    if (transformRef.current) {
      transformRef.current.scale.set(growScale, growScale, growScale);
    }

    // --- Body position & rotation ---
    if (isRunning) {
      const lean = progressStore.value * 0.12;
      const bob = Math.sin(t * speed * 2) * 0.03;
      groupRef.current.position.y = bob;
      groupRef.current.rotation.z = 0;
      groupRef.current.rotation.x = lean;
      const strike = Math.abs(Math.sin(t * speed * 2));
      groupRef.current.scale.set(
        1 + strike * 0.03,
        1 - strike * 0.05,
        1 + strike * 0.03
      );
    } else if (isAirborne && tier.spin) {
      let yPos = 0;
      let zRot = 0;
      let xRot = 0;
      let squishX = 1;
      let squishY = 1;

      if (phaseElapsed < LAUNCH_DURATION) {
        const lt = phaseElapsed / LAUNCH_DURATION;
        yPos = easeOutQuad(lt) * 1.0;
        zRot = lt * Math.PI * 0.5;
        xRot = lt * 0.3;
        squishX = 1 - lt * 0.15;
        squishY = 1 + lt * 0.25;
      } else if (phaseElapsed < LAUNCH_DURATION + SPIN_DURATION) {
        const st = (phaseElapsed - LAUNCH_DURATION) / SPIN_DURATION;
        yPos = 0.8 + Math.sin(st * Math.PI * 4) * 0.15;
        zRot = Math.PI * 0.5 + st * Math.PI * 8;
        xRot = Math.sin(st * Math.PI * 6) * 0.3;
      } else if (phaseElapsed < LAUNCH_DURATION + SPIN_DURATION + HANG_DURATION) {
        const ht = (phaseElapsed - LAUNCH_DURATION - SPIN_DURATION) / HANG_DURATION;
        yPos = 0.85 + Math.sin(ht * Math.PI) * 0.1;
        zRot = Math.PI * 8.5 + easeOutQuad(ht) * Math.PI * 0.3;
        xRot = Math.sin(ht * Math.PI) * 0.15;
        squishX = 1 - ht * 0.05;
        squishY = 1 + ht * 0.08;
      } else {
        const ft = Math.min(
          (phaseElapsed - LAUNCH_DURATION - SPIN_DURATION - HANG_DURATION) / FALL_DURATION,
          1
        );
        yPos = (1 - easeInQuad(ft)) * 0.85;
        zRot = Math.PI * 8.8 + ft * Math.PI * 0.5;
        xRot = (1 - ft) * 0.15;
        squishX = 1 + ft * 0.1;
        squishY = 1 - ft * 0.12;
      }

      groupRef.current.position.y = yPos;
      groupRef.current.rotation.z = zRot;
      groupRef.current.rotation.x = xRot;
      groupRef.current.scale.set(squishX, squishY, squishX);
    } else if (isRecovery) {
      const decay = Math.pow(BOUNCE_DECAY, phaseElapsed * 60);
      const bounce = bounceEnergy.current * decay * Math.cos(phaseElapsed * BOUNCE_FREQ);
      groupRef.current.position.y = bounce;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
      const squash = bounce < 0 ? 1 + Math.abs(bounce) * 0.3 : 1 - Math.abs(bounce) * 0.15;
      groupRef.current.scale.set(squash, 2 - squash, squash);
    }

    // Leg animation
    if (leftLegRef.current && rightLegRef.current) {
      if (isRunning) {
        leftLegRef.current.rotation.z = Math.sin(t * speed) * amplitude;
        rightLegRef.current.rotation.z = Math.sin(t * speed + Math.PI) * amplitude;
      } else if (isRecovery) {
        leftLegRef.current.rotation.z = THREE.MathUtils.lerp(leftLegRef.current.rotation.z, 0, 0.1);
        rightLegRef.current.rotation.z = THREE.MathUtils.lerp(rightLegRef.current.rotation.z, 0, 0.1);
      } else if (isAirborne) {
        const spinLocal = phaseElapsed - LAUNCH_DURATION;
        const flailSpeed = spinLocal > 0 && spinLocal < SPIN_DURATION ? 22 : 10;
        leftLegRef.current.rotation.z = Math.sin(t * flailSpeed + 3) * 0.4;
        rightLegRef.current.rotation.z = Math.sin(t * flailSpeed) * 0.4;
      }
    }

    // Arm animation
    if (leftArmRef.current && rightArmRef.current) {
      if (isRunning) {
        leftArmRef.current.rotation.z = Math.sin(t * speed + Math.PI) * (amplitude * 0.8);
        rightArmRef.current.rotation.z = Math.sin(t * speed) * (amplitude * 0.8);
      } else if (isRecovery) {
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0, 0.1);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, 0.1);
      } else if (isAirborne) {
        const spinLocal = phaseElapsed - LAUNCH_DURATION;
        const armSpeed = spinLocal > 0 && spinLocal < SPIN_DURATION ? 18 : 8;
        leftArmRef.current.rotation.z = Math.sin(t * armSpeed) * 1.2;
        rightArmRef.current.rotation.z = Math.sin(t * armSpeed + 2) * 1.2;
      }
    }

    // Headband tails
    if (leftTailRef.current && rightTailRef.current) {
      if (isAirborne) {
        leftTailRef.current.rotation.z = Math.sin(t * 14) * 1.1 + Math.sin(t * 30) * 0.4;
        rightTailRef.current.rotation.z = Math.sin(t * 14 + 1.5) * 1.1 + Math.sin(t * 30) * 0.4;
      } else {
        leftTailRef.current.rotation.z = Math.sin(t * 10) * 0.5;
        rightTailRef.current.rotation.z = Math.sin(t * 10 + 0.8) * 0.5;
      }
    }

    // Face expression crossfade
    applyFace(determinedRef.current, isStrained || isHappy ? 0 : 1);
    applyFace(strainedRef.current, isStrained ? 1 : 0);
    applyFace(happyRef.current, isHappy ? 1 : 0);
  });

  // Cleanup: dispose geometries and materials
  useEffect(() => {
    return () => {
      bodyMat.dispose();
      screenMat.dispose();
      limbMat.dispose();
      headbandMat.dispose();
      // Dispose geometries created inline in JSX
      // Note: ShapeGeometry, torusGeometry, boxGeometry, cylinderGeometry
      // are created inline and will be GC'd, but materials need explicit disposal
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: dispose once on unmount
  }, []);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <group ref={transformRef}>
        {/* Main triangle body — flat cyan with neon Edges glow */}
        <group position={[0, 0.3, 0]}>
          <mesh geometry={new THREE.ShapeGeometry(bodyShape)} material={bodyMat} castShadow />
          <Edges threshold={15} color="#6FE7FF" lineWidth={2} scale={1.0} />

          {/* Face screen — dark inset triangle */}
          <mesh position={[0, 0, 0.01]} geometry={new THREE.ShapeGeometry(screenShape)} material={screenMat} />
          <Edges threshold={15} color="#1A1A2E" lineWidth={1.5} scale={1.0} />

          {/* Headband */}
          <mesh position={[0, 0.6, 0.02]} material={headbandMat}>
            <torusGeometry args={[0.35, 0.04, 8, 16, Math.PI * 0.6]} />
          </mesh>

          {/* Fluttering headband tails */}
          <mesh
            ref={leftTailRef}
            position={[-0.32, 0.88, 0.02]}
            material={headbandMat}
            castShadow
          >
            <boxGeometry args={[0.028, 0.18, 0.015]} />
          </mesh>
          <mesh
            ref={rightTailRef}
            position={[0.32, 0.88, 0.02]}
            material={headbandMat}
            castShadow
          >
            <boxGeometry args={[0.028, 0.18, 0.015]} />
          </mesh>

          {/* Face — three expression states, crossfaded */}
          <group position={[0, 0.0, 0.03]}>
            {/* Determined: slanted eyes + gritted mouth */}
            <group ref={determinedRef}>
              <mesh position={[-0.13, 0.02, 0]} rotation={[0, 0, 0.28]}>
                <boxGeometry args={[0.1, 0.025, 0.02]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={1} toneMapped={false} />
              </mesh>
              <mesh position={[0.13, 0.02, 0]} rotation={[0, 0, -0.28]}>
                <boxGeometry args={[0.1, 0.025, 0.02]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={1} toneMapped={false} />
              </mesh>
              <mesh position={[0, -0.1, 0]}>
                <boxGeometry args={[0.14, 0.03, 0.02]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={1} toneMapped={false} />
              </mesh>
            </group>

            {/* Strained >_< : crossed eyes + small frown */}
            <group ref={strainedRef}>
              <mesh position={[-0.13, 0.02, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.09, 0.02, 0.02]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
              </mesh>
              <mesh position={[-0.13, 0.02, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.09, 0.02, 0.02]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
              </mesh>
              <mesh position={[0.13, 0.02, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.09, 0.02, 0.02]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
              </mesh>
              <mesh position={[0.13, 0.02, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.09, 0.02, 0.02]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
              </mesh>
              <mesh position={[0, -0.11, 0]} rotation={[0, 0, 0.25]}>
                <boxGeometry args={[0.08, 0.018, 0.02]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
              </mesh>
            </group>

            {/* Happy: soft curved eyes + smile */}
            <group ref={happyRef}>
              <mesh position={[-0.13, 0.03, 0]}>
                <torusGeometry args={[0.04, 0.01, 8, 12, Math.PI]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
              </mesh>
              <mesh position={[0.13, 0.03, 0]}>
                <torusGeometry args={[0.04, 0.01, 8, 12, Math.PI]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
              </mesh>
              <mesh position={[0, -0.09, 0]} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.06, 0.01, 8, 12, Math.PI]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Tube (noodle) limbs */}
        <group ref={leftArmRef} position={[-0.55, 0.2, 0.04]}>
          <mesh position={[0, -0.175, 0]} material={limbMat} castShadow>
            <cylinderGeometry args={[0.03, 0.025, 0.35, 8]} />
          </mesh>
          <Edges threshold={15} color="#6FE7FF" lineWidth={1} />
        </group>
        <group ref={rightArmRef} position={[0.55, 0.2, 0.04]}>
          <mesh position={[0, -0.175, 0]} material={limbMat} castShadow>
            <cylinderGeometry args={[0.03, 0.025, 0.35, 8]} />
          </mesh>
          <Edges threshold={15} color="#6FE7FF" lineWidth={1} />
        </group>
        <group ref={leftLegRef} position={[-0.2, -0.35, 0.04]}>
          <mesh position={[0, -0.15, 0]} material={limbMat} castShadow>
            <cylinderGeometry args={[0.03, 0.025, 0.3, 8]} />
          </mesh>
          <Edges threshold={15} color="#6FE7FF" lineWidth={1} />
        </group>
        <group ref={rightLegRef} position={[0.2, -0.35, 0.04]}>
          <mesh position={[0, -0.15, 0]} material={limbMat} castShadow>
            <cylinderGeometry args={[0.03, 0.025, 0.3, 8]} />
          </mesh>
          <Edges threshold={15} color="#6FE7FF" lineWidth={1} />
        </group>
      </group>

      {/* Local glow light */}
      <pointLight
        position={[0, 0.3, 0.5]}
        intensity={isStrained ? 1.5 : 0.8}
        color={isStrained ? "#FF2D2D" : "#00D4FF"}
        distance={3}
      />
    </group>
  );
}
