"use client";

import { useMemo } from "react";
import * as THREE from "three";

export default function LoadingFloor() {
  const gridTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0B0B12";
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = "rgba(122, 59, 214, 0.3)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y < 512; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }, []);

  return (
    <group position={[0, -1.5, 0]}>
      {/* Flat grid floor — no reflective overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial map={gridTexture} toneMapped={false} />
      </mesh>
    </group>
  );
}
