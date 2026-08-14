"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LabIntro from "./LabIntro";
import CircuitSlide from "./CircuitSlide";
import DevOpsSlide from "./DevOpsSlide";
import CyberSecuritySlide from "./CyberSecuritySlide";
import CloudNetworkSlide from "./CloudNetworkSlide";
import DevToolsSlide from "./DevToolsSlide";
import "./labSlides.css";

// Magic number constants for slide navigation
const NAV_LOCK_MS = 950;
const SWIPE_THRESHOLD_PX = 40;
const WHEEL_DEADZONE_PX = 8;

const slides = [
  CircuitSlide,
  DevOpsSlide,
  CyberSecuritySlide,
  CloudNetworkSlide,
  DevToolsSlide,
] as const;

const LAST = slides.length - 1;

export default function LabExperience() {
  const [phase, setPhase] = useState<"intro" | "slides">("slides");
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const busyRef = useRef(false);

  const go = useCallback((n: number) => {
    if (busyRef.current || n < 0 || n > LAST || n === idxRef.current) return;
    busyRef.current = true;
    idxRef.current = n;
    setIdx(n);
    window.setTimeout(() => { busyRef.current = false; }, NAV_LOCK_MS);
  }, []);

  useEffect(() => {
    if (phase !== "slides") return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_DEADZONE_PX) return;
      go(idxRef.current + (e.deltaY > 0 ? 1 : -1));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") go(idxRef.current + 1);
      if (e.key === "ArrowUp" || e.key === "PageUp") go(idxRef.current - 1);
    };
    let ty: number | null = null;
    const onTS = (e: TouchEvent) => { ty = e.touches[0].clientY; };
    const onTE = (e: TouchEvent) => {
      if (ty === null) return;
      const dy = ty - e.changedTouches[0].clientY;
      if (Math.abs(dy) > SWIPE_THRESHOLD_PX) go(idxRef.current + (dy > 0 ? 1 : -1));
      ty = null;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTS, { passive: true });
    window.addEventListener("touchend", onTE, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchend", onTE);
    };
  }, [phase, go]);

  if (phase === "intro") return <LabIntro onComplete={() => setPhase("slides")} />;

  return (
    <div className="lab-slides">
      <div className="lab-slides-wrap" style={{ transform: `translateY(-${idx * 100}%)` }}>
        {slides.map((Slide, i) => (
          <Slide key={i} isActive={i === idx} />
        ))}
      </div>
      <div className="lab-dots" role="tablist" aria-label="Slide navigation">
        {slides.map((_, i) => (
          <button key={i} role="tab" aria-selected={idx === i}
            aria-label={`Go to slide ${i + 1}`}
            className={`lab-dot ${idx === i ? "on" : ""}`}
            onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}