"use client";

import { useEffect, useState } from "react";

export default function DevOpsSlide() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detect-once on mount
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section className="lab-slide" aria-label="DevOps" style={{ background: "var(--lab-bg)" }}>
      <svg
        viewBox="0 0 800 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="devops-infinity-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="dOuterGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--lab-cyan)" stopOpacity="0.35">
              {!reducedMotion && (
                <animate attributeName="stop-color" values="var(--lab-cyan);#7c4dff;var(--lab-cyan)" dur="8s" repeatCount="indefinite" />
              )}
            </stop>
            <stop offset="50%" stopColor="#00a8ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.2">
              {!reducedMotion && (
                <animate attributeName="stop-color" values="#ff00ff;var(--lab-cyan);#ff00ff" dur="8s" repeatCount="indefinite" />
              )}
            </stop>
          </linearGradient>

          <linearGradient id="dTubeBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#001c33" />
            <stop offset="45%" stopColor="#013f66" />
            <stop offset="55%" stopColor="#012a4a" />
            <stop offset="100%" stopColor="#000d1a" />
          </linearGradient>

          <linearGradient id="dTubeHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#aef4ff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="dCore" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="var(--lab-cyan)" />
            <stop offset="50%" stopColor="#baffe0" />
            <stop offset="100%" stopColor="#00a8ff" />
            {!reducedMotion && (
              <animateTransform attributeName="gradientTransform" type="translate" values="-0.6 0;0.6 0;-0.6 0" dur="5s" repeatCount="indefinite" />
            )}
          </linearGradient>

          <linearGradient id="dFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--lab-cyan)" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--lab-cyan)" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="dCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--lab-cyan)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--lab-cyan)" stopOpacity="0" />
          </radialGradient>

          <filter id="dBigBlur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" />
          </filter>

          <filter id="dNeonGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="4" result="b1" />
            <feGaussianBlur stdDeviation="8" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="dPlasma" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.045" numOctaves="2" seed="7" result="noise">
              {!reducedMotion && (
                <animate attributeName="baseFrequency" values="0.015 0.045;0.03 0.07;0.015 0.045" dur="7s" repeatCount="indefinite" />
              )}
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Center glow */}
        <circle cx="400" cy="200" r="40" fill="url(#dCenterGlow)">
          {!reducedMotion && <animate attributeName="r" values="40;55;40" dur="3s" repeatCount="indefinite" />}
          {!reducedMotion && <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite" />}
        </circle>

        {/* Circuit lines */}
        <g className="devops-circuit-lines">
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

        {/* Circuit pulse dots */}
        {!reducedMotion && (
          <>
            <circle r="2.5" fill="var(--lab-cyan)" className="devops-circuit-pulse">
              <animateMotion dur="2.5s" repeatCount="indefinite" path="M 300 105 L 318 55" />
            </circle>
            <circle r="2.5" fill="var(--lab-cyan)" className="devops-circuit-pulse">
              <animateMotion dur="2.5s" begin="-0.25s" repeatCount="indefinite" path="M 500 105 L 550 60" />
            </circle>
            <circle r="2.5" fill="#39ff14" className="devops-circuit-pulse">
              <animateMotion dur="2.5s" begin="-0.5s" repeatCount="indefinite" path="M 630 130 L 710 140" />
            </circle>
            <circle r="2.5" fill="#39ff14" className="devops-circuit-pulse">
              <animateMotion dur="2.5s" begin="-0.75s" repeatCount="indefinite" path="M 675 220 L 740 225" />
            </circle>
            <circle r="2.5" fill="#ff00ff" className="devops-circuit-pulse">
              <animateMotion dur="2.5s" begin="-1.0s" repeatCount="indefinite" path="M 540 295 L 600 330" />
            </circle>
            <circle r="2.5" fill="var(--lab-cyan)" className="devops-circuit-pulse">
              <animateMotion dur="2.5s" begin="-1.25s" repeatCount="indefinite" path="M 440 245 L 450 345" />
            </circle>
            <circle r="2.5" fill="var(--lab-cyan)" className="devops-circuit-pulse">
              <animateMotion dur="2.5s" begin="-1.5s" repeatCount="indefinite" path="M 360 245 L 340 345" />
            </circle>
            <circle r="2.5" fill="#39ff14" className="devops-circuit-pulse">
              <animateMotion dur="2.5s" begin="-1.75s" repeatCount="indefinite" path="M 260 295 L 200 330" />
            </circle>
            <circle r="2.5" fill="#ff00ff" className="devops-circuit-pulse">
              <animateMotion dur="2.5s" begin="-2.0s" repeatCount="indefinite" path="M 125 220 L 60 220" />
            </circle>
            <circle r="2.5" fill="var(--lab-cyan)" className="devops-circuit-pulse">
              <animateMotion dur="2.5s" begin="-2.25s" repeatCount="indefinite" path="M 170 130 L 95 135" />
            </circle>
          </>
        )}

        {/* Infinity loop layers */}
        <path className="devops-inf-glow" d="M 400,200 C 280,70 120,70 120,200 C 120,330 280,330 400,200 C 520,70 680,70 680,200 C 680,330 520,330 400,200 Z" />
        <path className="devops-inf-shadow" d="M 400,200 C 280,70 120,70 120,200 C 120,330 280,330 400,200 C 520,70 680,70 680,200 C 680,330 520,330 400,200 Z" />
        <path className="devops-inf-body" d="M 400,200 C 280,70 120,70 120,200 C 120,330 280,330 400,200 C 520,70 680,70 680,200 C 680,330 520,330 400,200 Z" />
        <path className="devops-inf-highlight" d="M 400,200 C 280,70 120,70 120,200 C 120,330 280,330 400,200 C 520,70 680,70 680,200 C 680,330 520,330 400,200 Z" />
        <path className="devops-inf-plasma" d="M 400,200 C 280,70 120,70 120,200 C 120,330 280,330 400,200 C 520,70 680,70 680,200 C 680,330 520,330 400,200 Z" />
        <path id="devops-infinity-path" className="devops-inf-core" d="M 400,200 C 280,70 120,70 120,200 C 120,330 280,330 400,200 C 520,70 680,70 680,200 C 680,330 520,330 400,200 Z" />

        {/* Flow streaks */}
        {!reducedMotion && (
          <>
            <path className="devops-inf-flow" d="M 400,200 C 280,70 120,70 120,200 C 120,330 280,330 400,200 C 520,70 680,70 680,200 C 680,330 520,330 400,200 Z" />
            <path className="devops-inf-flow devops-inf-flow-rev" d="M 400,200 C 280,70 120,70 120,200 C 120,330 280,330 400,200 C 520,70 680,70 680,200 C 680,330 520,330 400,200 Z" />
          </>
        )}

        {/* Comet particles */}
        {!reducedMotion && (
          <>
            <circle r="4" fill="#ffffff" filter="url(#dNeonGlow)">
              <animateMotion dur="2.6s" repeatCount="indefinite"><mpath href="#devops-infinity-path" /></animateMotion>
            </circle>
            <circle r="3" fill="#bafcff" opacity="0.7" filter="url(#dNeonGlow)">
              <animateMotion dur="2.6s" begin="-0.05s" repeatCount="indefinite"><mpath href="#devops-infinity-path" /></animateMotion>
            </circle>
            <circle r="2.5" fill="#7fefff" opacity="0.4" filter="url(#dNeonGlow)">
              <animateMotion dur="2.6s" begin="-0.1s" repeatCount="indefinite"><mpath href="#devops-infinity-path" /></animateMotion>
            </circle>
            <circle r="3.5" fill="#39ff14" filter="url(#dNeonGlow)">
              <animateMotion dur="2.6s" begin="-1.3s" repeatCount="indefinite"><mpath href="#devops-infinity-path" /></animateMotion>
            </circle>
            <circle r="2.5" fill="#a8ff9e" opacity="0.5" filter="url(#dNeonGlow)">
              <animateMotion dur="2.6s" begin="-1.35s" repeatCount="indefinite"><mpath href="#devops-infinity-path" /></animateMotion>
            </circle>
            <circle r="3" fill="#ff00ff" filter="url(#dNeonGlow)">
              <animateMotion dur="2.6s" begin="-0.65s" repeatCount="indefinite"><mpath href="#devops-infinity-path" /></animateMotion>
            </circle>
            <circle r="2" fill="#ff9dff" opacity="0.4" filter="url(#dNeonGlow)">
              <animateMotion dur="2.6s" begin="-0.7s" repeatCount="indefinite"><mpath href="#devops-infinity-path" /></animateMotion>
            </circle>
          </>
        )}

        {/* Energy burst nodes */}
        <g filter="url(#dNeonGlow)">
          <circle cx="120" cy="200" r="5" fill="var(--lab-cyan)">
            {!reducedMotion && <animate attributeName="r" values="4;9;4" dur="2s" repeatCount="indefinite" />}
            {!reducedMotion && <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />}
          </circle>
          <circle cx="400" cy="200" r="6" fill="#ffffff">
            {!reducedMotion && <animate attributeName="r" values="5;11;5" dur="2s" begin="-0.5s" repeatCount="indefinite" />}
            {!reducedMotion && <animate attributeName="opacity" values="1;0.35;1" dur="2s" begin="-0.5s" repeatCount="indefinite" />}
          </circle>
          <circle cx="680" cy="200" r="5" fill="#ff00ff">
            {!reducedMotion && <animate attributeName="r" values="4;9;4" dur="2s" begin="-1s" repeatCount="indefinite" />}
            {!reducedMotion && <animate attributeName="opacity" values="1;0.4;1" dur="2s" begin="-1s" repeatCount="indefinite" />}
          </circle>
        </g>
      </svg>

      {/* Node badges */}
      <div className="devops-node devops-pos-docker">
        <svg className="devops-node-icon" viewBox="0 0 24 24"><path d="M22 12.5c0 3-2.5 5.5-6.5 5.5S8 15.5 8 12.5M4 10h3v3H4zM8 10h3v3H8zM12 10h3v3h-3zM8 6h3v3H8zM12 6h3v3h-3z" /></svg>
        <span>Docker</span>
      </div>
      <div className="devops-node devops-pos-k8s">
        <svg className="devops-node-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18M6 6l12 12M6 18L18 6" /></svg>
        <span>Kubernetes</span>
      </div>
      <div className="devops-node devops-pos-auto-r">
        <svg className="devops-node-icon" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="12" rx="2" /><path d="M12 16v4M8 20h8" /></svg>
        <span>Automation</span>
      </div>
      <div className="devops-node devops-pos-firm">
        <svg className="devops-node-icon" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
        <span>Firm</span>
      </div>
      <div className="devops-node devops-pos-collab">
        <svg className="devops-node-icon" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        <span>Collaboration</span>
      </div>
      <div className="devops-node devops-pos-monitor">
        <svg className="devops-node-icon" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
        <span>Monitoring</span>
      </div>
      <div className="devops-node devops-pos-surface">
        <svg className="devops-node-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
        <span>Surface</span>
      </div>
      <div className="devops-node devops-pos-auto-l">
        <svg className="devops-node-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
        <span>Automation</span>
      </div>
      <div className="devops-node devops-pos-design">
        <svg className="devops-node-icon" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></svg>
        <span>Design</span>
      </div>
      <div className="devops-node devops-pos-continuous">
        <svg className="devops-node-icon" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" /></svg>
        <span>Continuous</span>
      </div>

      {/* Footer quote */}
      <p className="devops-footer-quote">
        DevOps fosters innovation through integrated tools and automated pipelines that streamline development with agility.
      </p>
    </section>
  );
}
