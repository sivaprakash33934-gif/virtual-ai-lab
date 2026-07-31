"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import LoadingScene from "./LoadingScene";
import LoadingFallback2D from "./LoadingFallback2D";
import ProgressOverlay from "./ProgressOverlay";
import { progressStore } from "@/lib/loadingProgress";
import { detectWebGL, getQualityTier } from "./webgl";
import { MIN_DISPLAY_MS } from "./LoadingScene";

const EXIT_FADE_MS = 600;

interface LoadingCanvasProps {
  onComplete: () => void;
}

export default function LoadingCanvas({ onComplete }: LoadingCanvasProps) {
  const [hasWebGL] = useState(() => detectWebGL());
  const [sceneReady, setSceneReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [tier] = useState(() => getQualityTier());
  const completedRef = useRef(false);

  useEffect(() => {
    const markReady = () => {
      progressStore.ready = true;
    };
    if (document.readyState === "complete") {
      markReady();
    } else {
      window.addEventListener("load", markReady);
      return () => window.removeEventListener("load", markReady);
    }
  }, []);

  useEffect(() => {
    let raf = 0;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const raw = Math.min(elapsed / MIN_DISPLAY_MS, 1);
      const eased = 1 - Math.pow(1 - raw, 2.2);
      progressStore.value = progressStore.ready ? 1 : Math.min(eased, 0.9);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handlePhaseComplete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    progressStore.value = 1;
    setExiting(true);
    window.setTimeout(onComplete, EXIT_FADE_MS);
  };

  if (!hasWebGL) {
    return <LoadingFallback2D phase="processing" />;
  }

  return (
    <div
      className="fixed inset-0 z-[9999]"
      style={{ opacity: exiting ? 0 : 1, transition: "opacity 0.6s ease" }}
    >
      {/* 2D instant placeholder */}
      <div
        className="absolute inset-0"
        style={{
          opacity: sceneReady ? 0 : 1,
          transition: "opacity 0.5s ease",
          pointerEvents: sceneReady ? "none" : "auto",
        }}
      >
        <LoadingFallback2D phase="processing" />
      </div>

      {/* 3D Canvas — flat cel-shaded neon cartoon */}
      <div
        className="absolute inset-0"
        style={{
          opacity: sceneReady ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        <Canvas
          dpr={tier.dpr}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            toneMapping: THREE.NoToneMapping,
          }}
          camera={{ position: [-1.3, 0.35, 5.0], fov: 45 }}
          onCreated={() => {
            setTimeout(() => setSceneReady(true), 100);
          }}
        >
          <Suspense fallback={null}>
            <LoadingScene tier={tier} onPhaseComplete={handlePhaseComplete} />
          </Suspense>
        </Canvas>
      </div>

      {/* Progress overlay */}
      <ProgressOverlay />

      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        Loading Virtual AI Lab...
      </div>
    </div>
  );
}
