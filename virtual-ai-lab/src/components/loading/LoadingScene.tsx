"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import TriangleMascot3D from "./TriangleMascot3D";
import Treadmill3D from "./Treadmill3D";
import GymSet3D from "./GymSet3D";
import FloatingCode3D from "./FloatingCode3D";
import LoadingParticles from "./LoadingParticles";
import LoadingFloor from "./LoadingFloor";
import type { QualityTier } from "./webgl";
import { progressStore } from "@/lib/loadingProgress";
import { loadingConfig } from "@/lib/animationConfig";

type Phase = "run" | "spin" | "recovery" | "done";

interface LoadingSceneProps {
  tier: QualityTier;
  onPhaseComplete: () => void;
}

export const MIN_DISPLAY_MS = loadingConfig.minDisplayMs;
export const FAILURE_TIMEOUT_MS = loadingConfig.failureTimeoutMs;
const RUN_BEAT_MS = loadingConfig.runBeatMs;
const RECOVERY_MS = loadingConfig.recoveryMs;
const EXIT_DURATION = loadingConfig.exitDuration;

// Frontal 3/4 camera — face always visible, treadmill depth readable
const CAMERA_START = new THREE.Vector3(-1.3, 0.35, 5.0);
const CAMERA_SPIN = new THREE.Vector3(-0.9, 0.25, 3.8);
const CAMERA_EXIT = new THREE.Vector3(-0.6, 0.5, 2.6);
const tmpVec = new THREE.Vector3();

// Deep cyan → near-black radial gradient backdrop
function GradientBackdrop({ danger }: { danger: boolean }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(512, 360, 40, 512, 512, 800);
    if (danger) {
      grad.addColorStop(0, "#FF2D2D");
      grad.addColorStop(0.45, "#6B1A2A");
      grad.addColorStop(1, "#04141A");
    } else {
      grad.addColorStop(0, "#062C38");
      grad.addColorStop(0.55, "#031A24");
      grad.addColorStop(1, "#04141A");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: texture must be created in effect (client-only canvas API)
    setTexture(tex);
    return () => tex.dispose();
  }, [danger]);

  if (!texture) return null;

  return (
    <mesh position={[0, 0.3, -6]}>
      <planeGeometry args={[46, 28]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

export default function LoadingScene({
  tier,
  onPhaseComplete,
}: LoadingSceneProps) {
  const [phase, setPhase] = useState<Phase>("run");
  const startTime = useRef<number | undefined>(undefined);
  const phaseStartTime = useRef<number | undefined>(undefined);
  const runHoldUntil = useRef(0);
  const groupRef = useRef<THREE.Group>(null);

  const isInDanger = phase === "spin";
  const isShaking = phase === "spin";
  const isDone = phase === "done";

  useFrame((state) => {
    if (startTime.current === undefined) {
      const now = Date.now();
      startTime.current = now;
      phaseStartTime.current = now;
    }
    const elapsed = Date.now() - startTime.current!;
    const ready = progressStore.ready;

    if (phase === "run") {
      if (ready && elapsed >= Math.max(MIN_DISPLAY_MS, runHoldUntil.current)) {
        phaseStartTime.current = elapsed;
        setPhase("done");
      } else if (!ready && tier.spin && elapsed >= FAILURE_TIMEOUT_MS) {
        phaseStartTime.current = elapsed;
        setPhase("spin");
      }
    } else if (phase === "spin") {
      if (ready) {
        phaseStartTime.current = elapsed;
        setPhase("recovery");
      }
    } else if (phase === "recovery") {
      if (elapsed - phaseStartTime.current! >= RECOVERY_MS) {
        phaseStartTime.current = elapsed;
        runHoldUntil.current = elapsed + RUN_BEAT_MS;
        setPhase("run");
      }
    } else if (phase === "done") {
      if (elapsed - phaseStartTime.current! >= EXIT_DURATION) {
        onPhaseComplete();
      }
    }

    // Camera
    const cam = state.camera;
    if (isDone) {
      const exitT = THREE.MathUtils.clamp(
        (elapsed - phaseStartTime.current!) / EXIT_DURATION, 0, 1
      );
      const eased = 1 - Math.pow(1 - exitT, 3);
      tmpVec.copy(CAMERA_START).lerp(CAMERA_EXIT, eased);
      cam.position.lerp(tmpVec, 0.12);
      cam.lookAt(0, 0.2, 0);
    } else {
      const bob = Math.sin(state.clock.elapsedTime * Math.PI * 2 * 1.5) * 0.04;
      const camTarget = isInDanger ? CAMERA_SPIN : CAMERA_START;
      tmpVec.copy(camTarget);
      tmpVec.x += state.pointer.x * 0.25;
      tmpVec.y += bob + state.pointer.y * 0.15;
      if (isShaking) {
        tmpVec.x += Math.sin(elapsed * 0.013) * 0.045 + Math.sin(elapsed * 0.031) * 0.03;
        tmpVec.y += Math.cos(elapsed * 0.017) * 0.035 + Math.sin(elapsed * 0.029) * 0.025;
      }
      cam.position.lerp(tmpVec, isInDanger ? 0.06 : 0.04);
      cam.lookAt(0, 0.2, 0);
    }

    // Scene group rotation + exit scale
    if (groupRef.current) {
      const targetRot = isDone ? 0 : Math.sin(elapsed * 0.0003) * 0.05;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 0.05);
      const targetScale = isDone ? 1.15 : 1;
      groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05);
      groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.05);
      groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, 0.05);
    }
  });

  return (
    <>
      {/* Background */}
      <color attach="background" args={["#04141A"]} />
      <GradientBackdrop danger={isInDanger} />

      {/* No fog, no lights — flat MeshBasicMaterial ignores them. Bloom is the glow. */}

      {/* Scene group */}
      <group ref={groupRef}>
        <LoadingFloor />
        <TriangleMascot3D phase={phase} tier={tier} />
        <Treadmill3D phase={phase} />
        <GymSet3D phase={phase} />
        <FloatingCode3D phase={phase} />
        {tier.particles && <LoadingParticles phase={phase} />}
      </group>

      {/* Post-processing — neon glow */}
      {tier.bloom && (
        <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceThreshold={isInDanger ? 0.3 : 0.5}
            intensity={isInDanger ? 1.4 : 1.0}
            radius={0.8}
          />
        </EffectComposer>
      )}
    </>
  );
}
