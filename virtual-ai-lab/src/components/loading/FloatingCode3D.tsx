"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/random";

interface FloatingCode3DProps {
  phase: string;
}

const CODE_SNIPPETS = [
  "try { runWithoutBugs(); }",
  "catch (NiceTryException e) {}",
  "finally { run(); }",
  "const ai = new Model();",
  "await train(data);",
  "export default Main;",
];

export default function FloatingCode3D({ phase }: FloatingCode3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const isFading = phase === "spin";

  const textures = useMemo(() => {
    return CODE_SNIPPETS.map((code) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = "rgba(201, 168, 255, 0.25)";
      ctx.font = "24px monospace";
      ctx.fillText(code, 10, 40);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    });
  }, []);

  // Positions for code planes
  const positions = useMemo(() => {
    const rand = mulberry32(20260731);
    return CODE_SNIPPETS.map((_, i) => ({
      x: -3 + (i % 3) * 2.5 + (rand() - 0.5) * 0.5,
      y: -0.5 + Math.floor(i / 3) * 1.5 + (rand() - 0.5) * 0.3,
      z: -2 - rand() * 2,
      speed: 0.1 + rand() * 0.1,
    }));
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;

      // Drift upward
      mesh.position.y += positions[i].speed * 0.005;

      // Reset when too high
      if (mesh.position.y > 3) {
        mesh.position.y = -2;
      }

      // Fade during chaos
      const targetOpacity = isFading ? 0 : 0.25;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.05);
    });
  });

  return (
    <group ref={groupRef}>
      {CODE_SNIPPETS.map((_, i) => (
        <mesh
          key={i}
          position={[positions[i].x, positions[i].y, positions[i].z]}
        >
          <planeGeometry args={[2, 0.25]} />
          <meshBasicMaterial
            map={textures[i]}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
