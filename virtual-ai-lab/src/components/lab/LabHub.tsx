"use client";

import { useRef } from "react";
import type { CSSProperties, JSX, MouseEvent } from "react";
import LabHubPlatform from "./LabHubPlatform";
import { useClock, useParallaxRef, useStarfield } from "./useLabAnimations";

// ─── Type Definitions ────────────────────────────────────────────

export interface LabHubTabConfig {
  label: string;
  glyph: string;
  accent: string;
  glow: string;
}

interface LabHubProps {
  /** Called with the selected slide index (0–4). */
  onSelect: (index: number) => void;
}

// ─── Constants ───────────────────────────────────────────────────

const TABS: LabHubTabConfig[] = [
  { label: "CIRCUIT", glyph: "⌁", accent: "#00ff9d", glow: "rgba(0,255,157,0.4)" },
  { label: "DEVOPS", glyph: "∞", accent: "#7dffc4", glow: "rgba(125,255,196,0.4)" },
  { label: "CYBER SECURITY", glyph: "◉", accent: "#b6ffe3", glow: "rgba(182,255,227,0.45)" },
  { label: "CLOUD NETWORK", glyph: "☁", accent: "#7dffc4", glow: "rgba(125,255,196,0.4)" },
  { label: "DEV TOOLS", glyph: "⚙", accent: "#00ff9d", glow: "rgba(0,255,157,0.4)" },
];

const BEAMS = Array.from({ length: 14 }, (_, i) => ({
  left: `${4 + i * 6.8}%`,
  height: `${16 + ((i * 37) % 38)}%`,
  delay: `${((i * 7) % 50) / 10}s`,
  duration: `${4 + (i % 4)}s`,
}));

// ─── Component ──────────────────────────────────────────────────

export default function LabHub({ onSelect }: LabHubProps): JSX.Element {
  const clock = useClock();
  const starCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const parallaxRef = useParallaxRef(14);

  useStarfield(starCanvasRef, 90);

  const handleTabClick = (
    event: MouseEvent<HTMLButtonElement>,
    index: number
  ): void => {
    event.preventDefault();
    onSelect(index);
  };

  return (
    <section className="lab-hub" aria-label="Lab module selector">
      <canvas ref={starCanvasRef} className="lab-hub-stars" aria-hidden="true" />
      <div className="lab-hub-gridfloor" aria-hidden="true" />
      <div className="lab-hub-beams" aria-hidden="true">
        {BEAMS.map((b, i) => (
          <span
            key={i}
            className="lab-hub-beam"
            style={{
              left: b.left,
              height: b.height,
              animationDelay: b.delay,
              animationDuration: b.duration,
            }}
          />
        ))}
      </div>
      <div className="lab-hub-haze" aria-hidden="true" />
      <div className="lab-hub-scanlines" aria-hidden="true" />
      <div className="lab-hub-vignette" aria-hidden="true" />

      <div className="lab-hub-topstrip" aria-hidden="true">
        U I / I U I I A P P / W E B
      </div>

      <div className="lab-hub-header" aria-hidden="true">
        <span>RESEARCH LAB // SELECT MODULE</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{clock}</span>
      </div>

      <div className="lab-hub-titlerow">
        <span className="lab-hub-titleline" aria-hidden="true" />
        <h1 className="lab-hub-title">VIRTUAL AI LAB</h1>
        <span className="lab-hub-titleline" aria-hidden="true" />
      </div>
      <p className="lab-hub-subtitle">CHOOSE A TECHNOLOGY MODULE</p>

      <div className="lab-hub-stage" ref={parallaxRef}>
        <div className="lab-hub-platform" aria-hidden="true">
          <LabHubPlatform className="lab-hub-platform-svg" />
        </div>
        <div className="lab-hub-ellipse-front" aria-hidden="true" />

        <div className="lab-hub-tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              className={`lab-hub-tab lab-hub-tab--${i + 1}`}
              style={
                {
                  "--hub-accent": tab.accent,
                  "--hub-glow": tab.glow,
                  "--d": `${0.9 + i * 0.18}s`,
                } as CSSProperties
              }
              onClick={(e) => handleTabClick(e, i)}
              aria-label={`Open ${tab.label} module`}
            >
              <span className="lab-hub-tab__pillar" aria-hidden="true" />
              <span className="lab-hub-tab__inner">
                <span className="lab-hub-tab__frame" aria-hidden="true" />
                <span className="lab-hub-tab__sweep" aria-hidden="true" />
                <span className="lab-hub-tab__icon" aria-hidden="true">
                  {tab.glyph}
                </span>
                <span className="lab-hub-tab__label">{tab.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="lab-hub-footer" aria-hidden="true">
        <span>2026-08</span>
        <span>HOLOGRAPHIC TECH VISUALIZATION // MULTI-DISPLAY SCENE</span>
        <span>VIRTUAL AI LAB</span>
      </div>
    </section>
  );
}
