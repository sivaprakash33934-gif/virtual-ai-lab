"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

interface GymSet3DProps {
  phase: string;
}

export default function GymSet3D({ phase }: GymSet3DProps) {
  const bottlesRef = useRef<THREE.Group>(null);
  const isInDanger = phase === "spin";

  useFrame(() => {
    if (bottlesRef.current) {
      bottlesRef.current.children.forEach((bottle, i) => {
        if (isInDanger) {
          bottle.position.y = THREE.MathUtils.lerp(
            bottle.position.y,
            1.5 + Math.sin(Date.now() * 0.005 + i) * 0.5,
            0.05
          );
          bottle.rotation.x += 0.1;
          bottle.rotation.z += 0.05;
        } else {
          bottle.position.y = THREE.MathUtils.lerp(bottle.position.y, -1.4, 0.05);
          bottle.rotation.x = THREE.MathUtils.lerp(bottle.rotation.x, 0, 0.05);
          bottle.rotation.z = THREE.MathUtils.lerp(bottle.rotation.z, 0, 0.05);
        }
      });
    }
  });

  // Cleanup: dispose all materials and geometries in the group
  useEffect(() => {
    const bottles = bottlesRef.current;
    return () => {
      if (bottles) {
        bottles.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  return (
    <group>
      {/* Cyan yoga ball */}
      <group position={[-2.5, -1.1, 0.5]}>
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial color="#00D4FF" toneMapped={false} />
          <Edges threshold={15} color="#6FE7FF" lineWidth={1} />
        </mesh>
      </group>

      {/* Kettlebell */}
      <group position={[2.5, -1.2, 0.3]}>
        <mesh>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshBasicMaterial color="#00D4FF" toneMapped={false} />
          <Edges threshold={15} color="#6FE7FF" lineWidth={1} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.08, 0.02, 8, 12, Math.PI]} />
          <meshBasicMaterial color="#00D4FF" toneMapped={false} />
          <Edges threshold={15} color="#6FE7FF" lineWidth={1} />
        </mesh>
      </group>

      {/* Weight plates */}
      <group position={[-2, -1.35, 1.5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
          <meshBasicMaterial color="#1a1a2e" toneMapped={false} />
          <Edges threshold={15} color="#3A3A5E" lineWidth={1} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <torusGeometry args={[0.2, 0.01, 8, 32]} />
          <meshBasicMaterial color="#00D4FF" toneMapped={false} />
        </mesh>
        <mesh position={[0.25, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
          <meshBasicMaterial color="#1a1a2e" toneMapped={false} />
          <Edges threshold={15} color="#3A3A5E" lineWidth={1} />
        </mesh>
      </group>

      {/* Jump rope (coiled) */}
      <mesh position={[0, -1.4, 2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.015, 8, 32]} />
        <meshBasicMaterial color="#666666" toneMapped={false} />
        <Edges threshold={15} color="#999999" lineWidth={1} />
      </mesh>

      {/* Flying water bottles */}
      <group ref={bottlesRef}>
        {[0, 1, 2].map((i) => (
          <group key={i} position={[-1.5 + i * 1.5, -1.4, -0.5 + i * 0.3]}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.035, 0.15, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.9} toneMapped={false} />
              <Edges threshold={15} color="#CCCCCC" lineWidth={1} />
            </mesh>
            <mesh position={[0, 0.09, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.03, 8]} />
              <meshBasicMaterial color="#6FE7FF" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
