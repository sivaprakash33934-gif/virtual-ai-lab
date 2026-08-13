"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LabIntro from "./LabIntro";
import CircuitSlide from "./CircuitSlide";
import DevOpsSlide from "./DevOpsSlide";
import "./labSlides.css";

const LAST = 1;

export default function LabExperience() {
  const [phase, setPhase] = useState<"intro" | "slides">("intro");
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const busyRef = useRef(false);

  const go = useCallback((n: number) => {
    if (busyRef.current || n < 0 || n > LAST || n === idxRef.current) return;
    busyRef.current = true;
    idxRef.current = n;
    setIdx(n);
    window.setTimeout(() => { busyRef.current = false; }, 950);
  }, []);

  useEffect(() => {
    if (phase !== "slides") return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 8) return;
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
      if (Math.abs(dy) > 40) go(idxRef.current + (dy > 0 ? 1 : -1));
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
      <div className="lab-slides-wrap" style={{ transform: `translateY(-${idx * 50}%)` }}>
        <CircuitSlide />
        <DevOpsSlide />
      </div>
      <div className="lab-dots" role="tablist" aria-label="Slide navigation">
        {[0, 1].map((i) => (
          <button key={i} role="tab" aria-selected={idx === i}
            aria-label={`Go to slide ${i + 1}`}
            className={`lab-dot ${idx === i ? "on" : ""}`}
            onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}
