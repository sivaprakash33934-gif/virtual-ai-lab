"use client";

import { useCallback, useEffect, useState } from "react";
import type { ComponentType, JSX } from "react";
import LabIntro from "./LabIntro";
import LabHub from "./LabHub";
import CircuitSlide from "./CircuitSlide";
import DevOpsSlide from "./DevOpsSlide";
import CyberSecuritySlide from "./CyberSecuritySlide";
import CloudNetworkSlide from "./CloudNetworkSlide";
import DevToolsSlide from "./DevToolsSlide";
import "./labSlides.css";

// ─── Type Definitions ────────────────────────────────────────────

type ExperiencePhase = "intro" | "hub" | "slide";

interface LabSlideProps {
  isActive?: boolean;
}

type LabSlideComponent = ComponentType<LabSlideProps>;

// ─── Constants ───────────────────────────────────────────────────

const SLIDES: readonly LabSlideComponent[] = [
  CircuitSlide,
  DevOpsSlide,
  CyberSecuritySlide,
  CloudNetworkSlide,
  DevToolsSlide,
];

// ─── Component ───────────────────────────────────────────────────

export default function LabExperience(): JSX.Element {
  /**
   * Default "hub": page opens straight into the 5-tab selector.
   * When your new intro is ready, change "hub" → "intro".
   */
  const [phase, setPhase] = useState<ExperiencePhase>("hub");
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const handleSelect = useCallback((index: number): void => {
    setActiveIdx(index);
    setPhase("slide");
  }, []);

  const handleBack = useCallback((): void => {
    setPhase("hub");
  }, []);

  /* Esc key returns to the hub while a slide is open */
  useEffect(() => {
    if (phase !== "slide") return;

    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") handleBack();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, handleBack]);

  if (phase === "intro") {
    return <LabIntro onComplete={() => setPhase("hub")} />;
  }

  if (phase === "hub") {
    return <LabHub onSelect={handleSelect} />;
  }

  const ActiveSlide = SLIDES[activeIdx];

  return (
    <div className="lab-slide-full">
      <ActiveSlide isActive />
      <button
        type="button"
        className="lab-back-btn"
        onClick={handleBack}
        aria-label="Back to hub"
      >
        ⌂ HUB
      </button>
    </div>
  );
}
