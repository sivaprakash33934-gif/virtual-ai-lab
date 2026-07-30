"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export default function Robot() {
  const robotRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (robotRef.current) {
      robotRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={robotRef} position={[0, 0.5, 1]}>
        {/* Head */}
        <RoundedBox args={[1.2, 1.2, 1.2]} radius={0.3} position={[0, 1.2, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Eyes */}
        <mesh position={[-0.25, 1.3, 0.6]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.25, 1.3, 0.6]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
        </mesh>

        {/* Eye glow */}
        <pointLight position={[-0.25, 1.3, 1]} color="#00f0ff" intensity={0.5} distance={2} />
        <pointLight position={[0.25, 1.3, 1]} color="#00f0ff" intensity={0.5} distance={2} />

        {/* Body */}
        <RoundedBox args={[1.4, 1.6, 1]} radius={0.2} position={[0, -0.3, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Chest Light */}
        <mesh position={[0, -0.1, 0.51]}>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={2}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight position={[0, -0.1, 1]} color="#a855f7" intensity={0.5} distance={2} />

        {/* Arms */}
        <RoundedBox args={[0.3, 1, 0.3]} radius={0.1} position={[-0.85, 0, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <RoundedBox args={[0.3, 1, 0.3]} radius={0.1} position={[0.85, 0, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Legs */}
        <RoundedBox args={[0.35, 0.8, 0.35]} radius={0.1} position={[-0.35, -1.5, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <RoundedBox args={[0.35, 0.8, 0.35]} radius={0.1} position={[0.35, -1.5, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Antenna */}
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 2.3, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={2}
          />
        </mesh>
        <pointLight position={[0, 2.5, 0]} color="#00ff88" intensity={0.3} distance={2} />
      </group>
    </Float>
  );
}
