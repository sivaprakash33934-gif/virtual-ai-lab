"use client";

import { useEffect, useState } from "react";
import ScrambleTitle from "./ScrambleTitle";
import LabSlideModal from "./LabSlideModal";
import "../lab/labSlides.css";

const INFINITY_PATH =
  "M 400,200 C 280,70 120,70 120,200 C 120,330 280,330 400,200 C 520,70 680,70 680,200 C 680,330 520,330 400,200 Z";

const CIRCUIT_PULSES = [
  { path: "M 300 105 L 318 55", begin: 0 },
  { path: "M 500 105 L 550 60", begin: -0.25 },
  { path: "M 630 130 L 710 140", begin: -0.5 },
  { path: "M 675 220 L 740 225", begin: -0.75 },
  { path: "M 540 295 L 600 330", begin: -1.0 },
  { path: "M 440 245 L 450 345", begin: -1.25 },
  { path: "M 360 245 L 340 345", begin: -1.5 },
  { path: "M 260 295 L 200 330", begin: -1.75 },
  { path: "M 125 220 L 60 220", begin: -2.0 },
  { path: "M 170 130 L 95 135", begin: -2.25 },
];

const CIRCUIT_FILLS = ["#00f2ff", "#00f2ff", "#39ff14", "#39ff14", "#ff00ff", "#00f2ff", "#00f2ff", "#39ff14", "#ff00ff", "#00f2ff"];

const COMETS = [
  { r: 5.5, fill: "#ffffff", opacity: 1, begin: 0 },
  { r: 4, fill: "#bafcff", opacity: 0.8, begin: -0.05 },
  { r: 3, fill: "#7fefff", opacity: 0.5, begin: -0.1 },
  { r: 4.5, fill: "#39ff14", opacity: 1, begin: -1.3 },
  { r: 3.2, fill: "#a8ff9e", opacity: 0.7, begin: -1.35 },
  { r: 3.8, fill: "#ff00ff", opacity: 1, begin: -0.65 },
  { r: 2.6, fill: "#ff9dff", opacity: 0.6, begin: -0.7 },
];

export default function DevOpsSlide({ isActive }: { isActive?: boolean }) {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section
      className="lab-slide"
      aria-label="DevOps"
      style={{ background: "radial-gradient(circle at center, #0a172e 0%, #030814 100%)" }}
    >
      <div className="lab-devops-diagram">
        <svg
          className="lab-devops-infinity-svg"
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="DevOps interactive pipeline"
        >
          <defs>
            <linearGradient id="lab-dops-outer-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.35">
                {!reducedMotion && (
                  <animate attributeName="stop-color" values="#00f2ff;#7c4dff;#00f2ff" dur="8s" repeatCount="indefinite" />
                )}
              </stop>
              <stop offset="50%" stopColor="#00a8ff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.3">
                {!reducedMotion && (
                  <animate attributeName="stop-color" values="#ff00ff;#00f2ff;#ff00ff" dur="8s" repeatCount="indefinite" />
                )}
              </stop>
            </linearGradient>

            <linearGradient id="lab-dops-tube-body" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#001c33" />
              <stop offset="45%" stopColor="#013f66" />
              <stop offset="55%" stopColor="#012a4a" />
              <stop offset="100%" stopColor="#000d1a" />
            </linearGradient>

            <linearGradient id="lab-dops-tube-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#aef4ff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="lab-dops-core" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#00f2ff" />
              <stop offset="50%" stopColor="#baffe0" />
              <stop offset="100%" stopColor="#00a8ff" />
              {!reducedMotion && (
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  values="-0.6 0; 0.6 0; -0.6 0"
                  dur="5s"
                  repeatCount="indefinite"
                />
              )}
            </linearGradient>

            <linearGradient id="lab-dops-flow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2ff" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
            </linearGradient>

            <radialGradient id="lab-dops-center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
            </radialGradient>

            <filter id="lab-dops-big-blur" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="14" />
            </filter>

            <filter id="lab-dops-neon-glow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="7" result="b1" />
              <feGaussianBlur stdDeviation="14" result="b2" />
              <feMerge>
                <feMergeNode in="b2" />
                <feMergeNode in="b1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="lab-dops-plasma" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.015 0.045" numOctaves="2" seed="7" result="noise">
                {!reducedMotion && (
                  <animate attributeName="baseFrequency" values="0.015 0.045;0.03 0.07;0.015 0.045" dur="7s" repeatCount="indefinite" />
                )}
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          <circle cx="400" cy="200" r="40" fill="url(#lab-dops-center-glow)">
            {!reducedMotion && <animate attributeName="r" values="40;55;40" dur="3s" repeatCount="indefinite" />}
            {!reducedMotion && <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite" />}
          </circle>

          <g className="lab-devops-circuit-lines">
            <line x1="300" y1="105" x2="318" y2="55" />
            <line x1="500" y1="105" x2="550" y2="60" />
            <line x1="630" y1="130" x2="710" y2="140" />
            <line x1="675" y1="220" x2="740" y2="225" />
            <line x1="540" y1="295" x2="600" y2="330" />
            <line x1="440" y1="245" x2="450" y2="345" />
            <line x1="360" y1="245" x2="340" y2="345" />
            <line x1="260" y1="295" x2="200" y2="330" />
            <line x1="125" y1="220" x2="60" y2="220" />
            <line x1="170" y1="130" x2="95" y2="135" />
          </g>

          {!reducedMotion && (
            <>
              {CIRCUIT_PULSES.map((cp, i) => (
                <circle key={i} r="2.5" fill={CIRCUIT_FILLS[i]} className="lab-devops-circuit-pulse">
                  <animateMotion dur="2.5s" begin={`${cp.begin}s`} repeatCount="indefinite" path={cp.path} />
                </circle>
              ))}
            </>
          )}

          <path className="lab-devops-inf-glow" d={INFINITY_PATH} />
          <path className="lab-devops-inf-shadow" d={INFINITY_PATH} />
          <path className="lab-devops-inf-body" d={INFINITY_PATH} />
          <path className="lab-devops-inf-highlight" d={INFINITY_PATH} />
          <path className="lab-devops-inf-plasma" d={INFINITY_PATH} />
          <path id="lab-devops-infinity-path" className="lab-devops-inf-core" d={INFINITY_PATH} />

          {!reducedMotion && (
            <>
              <path className="lab-devops-inf-flow" d={INFINITY_PATH} />
              <path className="lab-devops-inf-flow lab-devops-inf-flow-rev" d={INFINITY_PATH} />
            </>
          )}

          {!reducedMotion && (
            <>
              {COMETS.map((c, i) => (
                <circle key={i} r={c.r} fill={c.fill} opacity={c.opacity} filter="url(#lab-dops-neon-glow)">
                  <animateMotion dur="2.6s" begin={`${c.begin}s`} repeatCount="indefinite">
                    <mpath href="#lab-devops-infinity-path" />
                  </animateMotion>
                </circle>
              ))}
            </>
          )}

          <g className="lab-devops-cross-burst" filter="url(#lab-dops-neon-glow)">
            <circle cx="120" cy="200" r="6" fill="#00f2ff">
              {!reducedMotion && <animate attributeName="r" values="4;11;4" dur="2s" repeatCount="indefinite" />}
              {!reducedMotion && <animate attributeName="opacity" values="1;0.35;1" dur="2s" repeatCount="indefinite" />}
            </circle>
            <circle cx="400" cy="200" r="7" fill="#ffffff">
              {!reducedMotion && <animate attributeName="r" values="5;13;5" dur="2s" begin="-0.5s" repeatCount="indefinite" />}
              {!reducedMotion && <animate attributeName="opacity" values="1;0.3;1" dur="2s" begin="-0.5s" repeatCount="indefinite" />}
            </circle>
            <circle cx="680" cy="200" r="6" fill="#ff00ff">
              {!reducedMotion && <animate attributeName="r" values="4;11;4" dur="2s" begin="-1s" repeatCount="indefinite" />}
              {!reducedMotion && <animate attributeName="opacity" values="1;0.35;1" dur="2s" begin="-1s" repeatCount="indefinite" />}
            </circle>
          </g>
        </svg>

      <div className="lab-devops-node lab-devops-pos-docker">
        <svg className="lab-devops-node-icon" width="30" height="30" viewBox="0 0 24 24"><path d="M22 12.5c0 3-2.5 5.5-6.5 5.5S8 15.5 8 12.5M4 10h3v3H4zM8 10h3v3H8zM12 10h3v3h-3zM8 6h3v3H8zM12 6h3v3h-3z" /></svg>
        <span>Docker</span>
      </div>
      <div className="lab-devops-node lab-devops-pos-k8s">
        <svg className="lab-devops-node-icon" width="30" height="30" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18M6 6l12 12M6 18L18 6" /></svg>
        <span>Kubernetes</span>
      </div>
      <div className="lab-devops-node lab-devops-pos-auto-r">
        <svg className="lab-devops-node-icon" width="30" height="30" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="12" rx="2" /><path d="M12 16v4M8 20h8" /></svg>
        <span>Automation</span>
      </div>
      <div className="lab-devops-node lab-devops-pos-firm">
        <svg className="lab-devops-node-icon" width="30" height="30" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
        <span>Firm</span>
      </div>
      <div className="lab-devops-node lab-devops-pos-collab">
        <svg className="lab-devops-node-icon" width="30" height="30" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        <span>Collaboration</span>
      </div>
      <div className="lab-devops-node lab-devops-pos-monitor">
        <svg className="lab-devops-node-icon" width="30" height="30" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
        <span>Monitoring</span>
      </div>
      <div className="lab-devops-node lab-devops-pos-surface">
        <svg className="lab-devops-node-icon" width="30" height="30" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
        <span>Surface</span>
      </div>
      <div className="lab-devops-node lab-devops-pos-auto-l">
        <svg className="lab-devops-node-icon" width="30" height="30" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        <span>Automation</span>
      </div>
      <div className="lab-devops-node lab-devops-pos-design">
        <svg className="lab-devops-node-icon" width="30" height="30" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></svg>
        <span>Design</span>
      </div>
      <div className="lab-devops-node lab-devops-pos-continuous">
        <svg className="lab-devops-node-icon" width="30" height="30" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" /></svg>
        <span>Continuous</span>
      </div>
      </div>

      <p className="lab-devops-footer-quote">
        DevOps fosters innovation through integrated tools and automated pipelines that streamline development with agility.
      </p>

      <div className="lab-slide-overlay">
        <ScrambleTitle text="DEVOPS" />
        <p className="lab-slide-subtitle">CI/CD · Containers · Cloud</p>
      </div>
      {isActive && (
        <LabSlideModal topic="devops" accentColor="#00f2ff" />
      )}
    </section>
  );
}