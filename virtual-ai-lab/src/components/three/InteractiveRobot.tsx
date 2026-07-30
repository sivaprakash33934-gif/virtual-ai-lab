"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface InteractiveRobotProps {
  activeTool: string | null;
}

export default function InteractiveRobot({ activeTool }: InteractiveRobotProps) {
  const robotRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (robotRef.current) {
      // Idle animation
      robotRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      robotRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;

      // Tool-specific animations
      if (activeTool === "robotics") {
        robotRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
        robotRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 3)) * 0.3;
      }
    }

    // Arm animations
    if (leftArmRef.current && rightArmRef.current) {
      if (activeTool === "nlp") {
        leftArmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.5 - 0.5;
        rightArmRef.current.rotation.z = -Math.sin(state.clock.elapsedTime * 4) * 0.5 + 0.5;
      } else if (activeTool === "cv") {
        leftArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.3;
        rightArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.3;
      } else {
        leftArmRef.current.rotation.z = -0.5;
        rightArmRef.current.rotation.z = 0.5;
      }
    }
  });

  const getEyeColor = () => {
    switch (activeTool) {
      case "cv":
        return "#00f0ff";
      case "nlp":
        return "#a855f7";
      case "gen":
        return "#00ff88";
      case "robotics":
        return "#ffd93d";
      default:
        return "#00f0ff";
    }
  };

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={robotRef} position={[0, 0, 0]}>
        {/* Head */}
        <RoundedBox args={[1.2, 1.2, 1.2]} radius={0.3} position={[0, 1.2, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Eyes */}
        <mesh position={[-0.25, 1.3, 0.6]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial
            color={getEyeColor()}
            emissive={getEyeColor()}
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[0.25, 1.3, 0.6]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial
            color={getEyeColor()}
            emissive={getEyeColor()}
            emissiveIntensity={2}
          />
        </mesh>

        {/* Eye glow */}
        <pointLight
          position={[-0.25, 1.3, 1]}
          color={getEyeColor()}
          intensity={0.8}
          distance={2}
        />
        <pointLight
          position={[0.25, 1.3, 1]}
          color={getEyeColor()}
          intensity={0.8}
          distance={2}
        />

        {/* Body */}
        <RoundedBox args={[1.4, 1.6, 1]} radius={0.2} position={[0, -0.3, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Chest Light */}
        <mesh position={[0, -0.1, 0.51]}>
          <circleGeometry args={[0.2, 32]} />
          <meshStandardMaterial
            color={getEyeColor()}
            emissive={getEyeColor()}
            emissiveIntensity={2}
            side={THREE.DoubleSide}
          />
        </mesh>
        <pointLight position={[0, -0.1, 1]} color={getEyeColor()} intensity={0.5} distance={2} />

        {/* Arms */}
        <RoundedBox
          ref={leftArmRef}
          args={[0.3, 1, 0.3]}
          radius={0.1}
          position={[-0.85, 0, 0]}
        >
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <RoundedBox
          ref={rightArmRef}
          args={[0.3, 1, 0.3]}
          radius={0.1}
          position={[0.85, 0, 0]}
        >
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
            color={getEyeColor()}
            emissive={getEyeColor()}
            emissiveIntensity={2}
          />
        </mesh>
        <pointLight position={[0, 2.5, 0]} color={getEyeColor()} intensity={0.5} distance={2} />
      </group>
    </Float>
  );
}
