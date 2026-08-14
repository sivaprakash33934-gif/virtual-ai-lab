"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ScrambleTitle from "./ScrambleTitle";
import LabSlideModal from "./LabSlideModal";
import "../lab/labSlides.css";

const GLOBE_SIZE = 520;

function generateMatrixTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.fillStyle = "#020e06";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(0, 255, 102, 0.15)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const continents = [
    { x: 420, y: 350, rx: 160, ry: 130 },
    { x: 550, y: 650, rx: 110, ry: 160 },
    { x: 1050, y: 360, rx: 140, ry: 110 },
    { x: 1100, y: 550, rx: 170, ry: 180 },
    { x: 1450, y: 370, rx: 250, ry: 150 },
    { x: 1650, y: 720, rx: 120, ry: 90 },
  ];

  ctx.font = "bold 12px monospace";
  for (let y = 16; y < canvas.height; y += 18) {
    for (let x = 8; x < canvas.width; x += 14) {
      let isLand = false;
      continents.forEach((c) => {
        const dx = (x - c.x) / c.rx;
        const dy = (y - c.y) / c.ry;
        if (dx * dx + dy * dy <= 1.0 + (Math.random() * 0.2 - 0.1)) {
          isLand = true;
        }
      });

      const char = Math.random() > 0.5 ? "1" : "0";
      if (isLand) {
        ctx.fillStyle = Math.random() > 0.3 ? "#00ff66" : "#88ffbb";
        ctx.shadowColor = "#00ff66";
        ctx.shadowBlur = 4;
        ctx.fillText(char, x, y);
      } else if (Math.random() > 0.88) {
        ctx.fillStyle = "rgba(0, 255, 102, 0.18)";
        ctx.shadowBlur = 0;
        ctx.fillText(char, x, y);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function Globe({ texture, globeRef, reducedMotion }: { texture: THREE.Texture; globeRef: React.RefObject<THREE.Mesh | null>; reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current && !isDragging && !reducedMotion) {
      meshRef.current.rotation.y += 0.0035;
    }
  });

  return (
    <mesh ref={(r) => { meshRef.current = r; if (globeRef) globeRef.current = r; }} geometry={new THREE.SphereGeometry(1, 64, 64)}>
      <meshStandardMaterial
        map={texture}
        emissive={new THREE.Color(0x003311)}
        emissiveIntensity={0.6}
        roughness={0.4}
        metalness={0.1}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

function Atmosphere({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current && !isDragging && !reducedMotion) {
      meshRef.current.rotation.y -= 0.0015;
    }
  });

  return (
    <mesh ref={meshRef} geometry={new THREE.SphereGeometry(1.05, 32, 32)}>
      <meshBasicMaterial color={0x00ff66} wireframe transparent opacity={0.12} />
    </mesh>
  );
}

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

export default function CyberSecuritySlide({ isActive }: { isActive?: boolean }) {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const textureRef = useMemo(() => generateMatrixTexture(), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      if (globeRef.current) globeRef.current.rotation.y += deltaX * 0.005;
      if (atmosphereRef.current) atmosphereRef.current.rotation.y += deltaX * 0.005;
      if (globeRef.current) globeRef.current.rotation.x += deltaY * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };
    const onMouseLeave = () => { isDragging = false; };

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  useEffect(() => {
    return () => {
      textureRef.dispose();
    };
  }, [textureRef]);

  return (
    <section className="lab-slide" style={{ background: "#030d06" }}>
      <div className="lab-circuit-bg" aria-hidden="true">
        <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="rgba(0, 255, 102, 0.35)" strokeWidth="1.5" fill="none">
            <path d="M 50,100 L 200,100 L 260,160 L 260,300" />
            <circle cx="50" cy="100" r="3" fill="#00ff66" />
            <circle cx="260" cy="300" r="3" fill="#00ff66" />
            <path d="M 900,120 L 780,120 L 720,180 L 720,380" />
            <circle cx="900" cy="120" r="3" fill="#00ff66" />
            <path d="M 150,750 L 300,750 L 380,670 L 380,550" />
            <circle cx="150" cy="750" r="3" fill="#00ff66" />
            <path d="M 850,780 L 700,780 L 620,700 L 620,560" />
            <circle cx="850" cy="780" r="3" fill="#00ff66" />
          </g>
        </svg>
      </div>

      <div className="lab-globe-container" ref={canvasContainerRef} style={{ width: GLOBE_SIZE, height: GLOBE_SIZE }}>
        <div className="lab-hud-ring lab-hud-ring-outer" aria-hidden="true" />
        <div className="lab-hud-ring lab-hud-ring-segmented" aria-hidden="true" />
        <div className="lab-hud-ring lab-hud-ring-inner" aria-hidden="true" />
        <div className="lab-scanline" aria-hidden="true" />
        <Canvas
          camera={{ position: [0, 0, 2.8], fov: 45 }}
          dpr={Math.min(window.devicePixelRatio || 1, 2)}
          style={{ width: "100%", height: "100%", display: "block" }}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
        >
          <ambientLight color="#00ff66" intensity={1.2} />
          <pointLight color="#00ff88" intensity={2.5} position={[3, 2, 4]} />
          <Globe texture={textureRef} globeRef={globeRef} reducedMotion={reducedMotion} />
          <Atmosphere reducedMotion={reducedMotion} />
        </Canvas>
      </div>

      <div className="lab-tech-readout" aria-hidden="true">
        STATUS: SYSTEM SECURE // MATRIX 3D LINK ACTIVE<br />
        GEO_COORD: [48.8566° N, 2.3522° E] // PROTOCOL: v8.26
      </div>

      <div className="lab-slide-overlay">
        <ScrambleTitle text="CYBER SECURITY" />
        <p className="lab-slide-subtitle">Shield · Encrypt · Monitor</p>
      </div>
      {isActive && (
        <LabSlideModal topic="cyber-security" accentColor="#00ff66" />
      )}
    </section>
  );
}