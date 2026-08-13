"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { progressStore } from "@/lib/loadingProgress";

interface Treadmill3DProps {
  phase: string;
}

const LED_COUNT = 8;
const DANGER_TEXT_PERIOD = 1 / 3;

export default function Treadmill3D({ phase }: Treadmill3DProps) {
  const beltRef = useRef<THREE.Mesh>(null);
  const ledRefs = useRef<THREE.Mesh[]>([]);
  const dangerMatRef = useRef<THREE.MeshBasicMaterial>(null);

  const isInDanger = phase === "spin";
  const isRecovery = phase === "recovery";

  const beltTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = "rgba(0, 240, 160, 0.15)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 256; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 64);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
    return texture;
  }, []);

  const dangerTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 48;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 256, 48);
    ctx.fillStyle = "#FF2D2D";
    ctx.font = "bold 22px monospace";
    for (let i = 0; i < 3; i++) {
      ctx.fillText("!! DANGER !!", i * 85.33, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    return texture;
  }, []);

  const ledBaseColors = useMemo(
    () => ["#00D4FF","#00D4FF","#00D4FF","#00D4FF","#00D4FF","#00D4FF","#6FE7FF","#6FE7FF"],
    []
  );

  useFrame(() => {
    if (beltRef.current) {
      const mat = beltRef.current.material as THREE.MeshBasicMaterial;
      if (mat.map) {
        const baseSpeed = isInDanger ? 0.001 : isRecovery ? 0.008 : 0.02;
        mat.map.offset.x += baseSpeed * (0.4 + 0.6 * progressStore.value);
      }
    }
    if (dangerMatRef.current && dangerMatRef.current.map) {
      dangerMatRef.current.map.offset.x += 0.006;
      if (dangerMatRef.current.map.offset.x >= DANGER_TEXT_PERIOD) {
        dangerMatRef.current.map.offset.x -= DANGER_TEXT_PERIOD;
      }
    }
    const litCount = Math.max(1, Math.ceil(LED_COUNT * progressStore.value));
    ledRefs.current.forEach((led, i) => {
      if (!led) return;
      const mat = led.material as THREE.MeshBasicMaterial;
      if (isInDanger) {
        mat.color.set("#FF2D2D");
        // Brightness via alpha since BasicMaterial has no emissive
        mat.opacity = 1;
      } else {
        mat.color.set(ledBaseColors[i]);
        const pulse = 0.6 + Math.sin(Date.now() * 0.003 + i * 0.5) * 0.4;
        mat.opacity = i < litCount ? pulse : 0.1;
      }
    });
  });

  // Cleanup: dispose textures and materials
  useEffect(() => {
    const dangerMat = dangerMatRef.current;
    const leds = ledRefs.current;
    return () => {
      beltTexture.dispose();
      dangerTexture.dispose();
      dangerMat?.dispose();
      leds.forEach((led) => {
        if (led) {
          (led.material as THREE.Material).dispose();
          (led.geometry as THREE.BufferGeometry).dispose();
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: dispose once on unmount
  }, []);

  return (
    <group position={[0, -1.2, 0]}>
      {/* Base frame — flat dark with Edges */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 0.12, 0.8]} />
        <meshBasicMaterial color="#23232B" toneMapped={false} />
        <Edges threshold={15} color="#3A3A3E" lineWidth={1.5} />
      </mesh>

      {/* Belt surface */}
      <mesh ref={beltRef} position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 0.6]} />
        <meshBasicMaterial map={beltTexture} toneMapped={false} />
      </mesh>

      {/* Side rails */}
      <mesh position={[0, 0.35, 0.35]}>
        <boxGeometry args={[2.2, 0.04, 0.04]} />
        <meshBasicMaterial color="#4A4A52" toneMapped={false} />
        <Edges threshold={15} color="#6A6A72" lineWidth={1} />
      </mesh>
      <mesh position={[0, 0.35, -0.35]}>
        <boxGeometry args={[2.2, 0.04, 0.04]} />
        <meshBasicMaterial color="#4A4A52" toneMapped={false} />
        <Edges threshold={15} color="#6A6A72" lineWidth={1} />
      </mesh>

      {/* Uprights */}
      <mesh position={[-0.9, 0.25, 0.35]}>
        <boxGeometry args={[0.04, 0.5, 0.04]} />
        <meshBasicMaterial color="#4A4A52" toneMapped={false} />
        <Edges threshold={15} color="#6A6A72" lineWidth={1} />
      </mesh>
      <mesh position={[-0.9, 0.25, -0.35]}>
        <boxGeometry args={[0.04, 0.5, 0.04]} />
        <meshBasicMaterial color="#4A4A52" toneMapped={false} />
        <Edges threshold={15} color="#6A6A72" lineWidth={1} />
      </mesh>

      {/* Console — angled toward camera */}
      <group position={[-0.9, 0.25, 0.35]} rotation={[0, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[0.02, 0.15, 0.5]} />
          <meshBasicMaterial color="#0B0B12" toneMapped={false} />
          <Edges threshold={15} color="#2A2A32" lineWidth={1} />
        </mesh>

        {/* LED bars */}
        {Array.from({ length: LED_COUNT }, (_, i) => (
          <mesh
            key={i}
            ref={(el) => { if (el) ledRefs.current[i] = el; }}
            position={[0.034, -0.05 + (i % 4) * 0.035, -0.18 + Math.floor(i / 4) * 0.36]}
          >
            <boxGeometry args={[0.01, 0.025, 0.04]} />
            <meshBasicMaterial color="#00D4FF" toneMapped={false} transparent opacity={1.5} />
          </mesh>
        ))}

        {/* DANGER display backing */}
        <mesh position={[0.018, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.52, 0.17]} />
          <meshBasicMaterial color="#0B0B12" toneMapped={false} />
        </mesh>
        {/* DANGER scroll text */}
        <mesh
          position={[0.024, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          visible={isInDanger}
        >
          <planeGeometry args={[0.5, 0.15]} />
          <meshBasicMaterial
            ref={dangerMatRef}
            map={dangerTexture}
            color="#ffffff"
            transparent
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Console cup */}
      <mesh position={[-0.9, 0.55, 0.2]}>
        <cylinderGeometry args={[0.03, 0.025, 0.06, 8]} />
        <meshBasicMaterial color="#00D4FF" toneMapped={false} />
      </mesh>

      {/* Floor accent glow */}
      <pointLight
        position={[0, -0.1, 0]}
        intensity={0.3}
        color={isInDanger ? "#FF2D2D" : "#00D4FF"}
        distance={3}
      />
    </group>
  );
}
