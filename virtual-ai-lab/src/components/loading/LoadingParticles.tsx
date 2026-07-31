"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { progressStore } from "@/lib/loadingProgress";
import { mulberry32 } from "@/lib/random";

interface LoadingParticlesProps {
  phase: string;
}

const PARTICLE_COUNT = 800;
const SPARK_COUNT = 26;
const SPARK_CYCLE = 0.7;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  attribute float aSeed;
  attribute float aSize;
  attribute float aColor;
  varying float vAlpha;
  varying float vColorMix;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * uSpeed * (0.5 + aSeed), 6.0) - 2.0;
    p.x += sin(uTime * 0.5 + aSeed * 12.0) * 0.15;
    p.z += cos(uTime * 0.4 + aSeed * 15.0) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (260.0 / -mv.z);
    vAlpha = 0.3 + 0.35 * sin(uTime * (0.8 + aSeed * 2.0) + aSeed * 40.0);
    vColorMix = aColor;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vColorMix;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
    vec3 color = mix(uColorA, uColorB, vColorMix);
    gl_FragColor = vec4(color, alpha);
  }
`;

const PARTICLE_UNIFORMS = {
  uTime: { value: 0 },
  uSpeed: { value: 1 },
  uColorA: { value: new THREE.Color("#33E1FF") },
  uColorB: { value: new THREE.Color("#a855f7") },
};

// Cyan zigzag spark burst from the console (danger only)
const sparkVertex = /* glsl */ `
  uniform float uTime;
  attribute vec3 aVelocity;
  attribute float aSeed;
  varying float vLife;
  void main() {
    float burst = uTime;
    vec3 p = position + aVelocity * burst * 2.5;
    p.x += sin(burst * 30.0 + aSeed * 6.283) * 0.05;
    p.y += sin(burst * 22.0 + aSeed * 12.0) * 0.05;
    float life = smoothstep(0.0, 0.12, burst) * (1.0 - burst / 0.55);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (0.07 * life + 0.008) * (260.0 / -mv.z);
    vLife = life;
    gl_Position = projectionMatrix * mv;
  }
`;

const sparkFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vLife;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d) * vLife;
    gl_FragColor = vec4(uColor, a);
  }
`;

const SPARK_UNIFORMS = {
  uTime: { value: 0 },
  uColor: { value: new THREE.Color("#33E1FF") },
};

export default function LoadingParticles({ phase }: LoadingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const sparksRef = useRef<THREE.Points>(null);
  const wasInDanger = useRef(false);
  const burstStart = useRef(0);
  const isInDanger = phase === "spin";

  const attributes = useMemo(() => {
    const rand = mulberry32(20260731);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const colorMix = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (rand() - 0.5) * 12;
      positions[i * 3 + 1] = rand() * 6 - 2;
      positions[i * 3 + 2] = (rand() - 0.5) * 8;
      seeds[i] = rand();
      sizes[i] = 0.02 + rand() * 0.05;
      colorMix[i] = rand();
    }

    return { positions, seeds, sizes, colorMix };
  }, []);

  const sparkData = useMemo(() => {
    const rand = mulberry32(987654321);
    const positions = new Float32Array(SPARK_COUNT * 3);
    const velocities = new Float32Array(SPARK_COUNT * 3);
    const seeds = new Float32Array(SPARK_COUNT);

    for (let i = 0; i < SPARK_COUNT; i++) {
      positions[i * 3] = -1.05 + (rand() - 0.5) * 0.3;
      positions[i * 3 + 1] = 0.3 + rand() * 0.15;
      positions[i * 3 + 2] = (rand() - 0.5) * 0.5;
      const theta = rand() * Math.PI * 2;
      const phi = rand() * Math.PI * 0.8;
      const speed = 0.5 + rand() * 1.2;
      velocities[i * 3] = Math.cos(theta) * Math.sin(phi) * speed;
      velocities[i * 3 + 1] = Math.cos(phi) * speed + 0.3;
      velocities[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * speed;
      seeds[i] = rand();
    }

    return { positions, velocities, seeds };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Ambient particle field — energy scales with progress
    const mat = pointsRef.current?.material as THREE.ShaderMaterial | undefined;
    if (mat) {
      mat.uniforms.uTime.value = t;
      mat.uniforms.uSpeed.value = isInDanger ? 2.2 : 0.6 + progressStore.value;
      (mat.uniforms.uColorA.value as THREE.Color).set(
        isInDanger ? "#FF6B4A" : "#33E1FF"
      );
      (mat.uniforms.uColorB.value as THREE.Color).set(
        isInDanger ? "#FF2D2D" : "#a855f7"
      );
    }

    // Cyan spark bursts from the console while danger is active
    const sparksMat = sparksRef.current?.material as
      | THREE.ShaderMaterial
      | undefined;
    if (sparksRef.current) sparksRef.current.visible = isInDanger;
    if (isInDanger) {
      if (!wasInDanger.current) burstStart.current = t;
      const local = t - burstStart.current;
      if (sparksMat) {
        sparksMat.uniforms.uTime.value = local % SPARK_CYCLE;
      }
    }
    wasInDanger.current = isInDanger;
  });

  return (
    <>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[attributes.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aSeed"
            args={[attributes.seeds, 1]}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[attributes.sizes, 1]}
          />
          <bufferAttribute
            attach="attributes-aColor"
            args={[attributes.colorMix, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          uniforms={PARTICLE_UNIFORMS}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Danger spark bursts */}
      <points ref={sparksRef} frustumCulled={false} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparkData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aVelocity"
            args={[sparkData.velocities, 3]}
          />
          <bufferAttribute
            attach="attributes-aSeed"
            args={[sparkData.seeds, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          uniforms={SPARK_UNIFORMS}
          vertexShader={sparkVertex}
          fragmentShader={sparkFragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
