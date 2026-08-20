"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { detectWebGL, getQualityTier } from "@/components/loading/webgl";
import { blackHoleConfig } from "@/lib/animationConfig";

const { scale: SCALE, spin: SPIN, accretion: ACCRETION, warp: WARP, fullCount: FULL_COUNT, lightCount: LIGHT_COUNT, goldenAngle: GOLDEN_ANGLE } = blackHoleConfig;

const CAM_DIST = 150;
const CAM_FOV = 60;
const FIT_RATIO = 0.42;
const MAX_RADIUS_FACTOR = 1.98;

function ParticleSwarm({ count, scale }: { count: number; scale: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const color = useMemo(() => new THREE.Color(), []);

  const positionsRef = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    const pos: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        )
      );
    }
    positionsRef.current = pos;
  }, [count]);

  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: 0xffffff }),
    []
  );
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.25), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const positions = positionsRef.current;
    if (positions.length === 0) return;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const u = (i + 0.5) / count;
      const a = i * GOLDEN_ANGLE;

      const t = time * 0.35;
      const band = u * 24.0 - 12.0;

      const disk = 1.0 - Math.abs(Math.sin(band * 0.5));
      const radius = scale * (0.08 + 1.9 * u * u);

      // Spiral rotation — inner particles orbit faster than outer
      const swirl =
        a + SPIN * Math.log(radius + 1.0) - t * (2.0 + 3.0 * (1.0 - u));

      const grav = 1.0 / (1.0 + radius * 0.015);
      const bend = WARP * grav * grav;

      const x0 = radius * Math.cos(swirl);
      const z0 = radius * Math.sin(swirl);

      const x = x0 + bend * z0;
      const z = z0 - bend * x0;

      // Vertical wave — particles bob up/down for subtle 3D depth
      const y =
        scale * 0.22 * disk * Math.sin(a * 0.17 + t * 4.0) * ACCRETION;

      target.set(x, y, z);

      // Cyan/white heat falloff: white-hot core -> #00d4ff -> deep blue rim
      const heat = 1.0 - Math.min(1.0, radius / (scale * 2.0));
      const hue = 0.52 + 0.16 * (1.0 - heat);
      const sat = 0.75 + 0.2 * heat;
      const light = 0.3 + 0.6 * Math.pow(heat, 1.5);

      color.setHSL(hue, sat, light);

      positions[i].lerp(target, 0.1);
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  // Cleanup: dispose geometry and material
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: dispose once on unmount
  }, []);

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}

export default function BlackHole() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(false);
  const [tier, setTier] = useState<ReturnType<typeof getQualityTier>>({
    dpr: [1, 1],
    bloom: false,
    particles: false,
    spin: false,
  });
  const [count, setCount] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!mounted || !hasWebGL) return;
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setView({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mounted, hasWebGL]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: SSR-safe detect-once (must not probe WebGL during render)
    setMounted(true);
    const webgl = detectWebGL();
    const quality = getQualityTier();
    setHasWebGL(webgl);
    setTier(quality);
    setCount(quality.particles ? FULL_COUNT : LIGHT_COUNT);
  }, []);

  const fitScale = useMemo(() => {
    if (view.w === 0 || view.h === 0) return 0;
    const aspect = view.w / view.h;
    const halfH = CAM_DIST * Math.tan((CAM_FOV * Math.PI) / 360);
    const halfW = halfH * aspect;
    const fitRadius = Math.min(halfW, halfH) * 2 * FIT_RATIO;
    return Math.min(1, fitRadius / (SCALE * MAX_RADIUS_FACTOR));
  }, [view]);

  if (!mounted || !hasWebGL) return null;

  return (
    <div ref={wrapperRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {fitScale > 0 && (
        <Canvas
          dpr={tier.dpr}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, CAM_DIST, 0], up: [0, 0, -1], fov: CAM_FOV }}
        >
          <fog attach="fog" args={["#000000", 0.01, 1000]} />
          <ParticleSwarm count={count} scale={SCALE * fitScale} />
          {tier.bloom && (
            <EffectComposer>
              <Bloom
                mipmapBlur
                luminanceThreshold={0}
                intensity={1.8}
                radius={0.4}
              />
            </EffectComposer>
          )}
        </Canvas>
      )}
    </div>
  );
}