"use client";

import { useRef, useState, useEffect } from "react";
import {
  useParticleAnimation,
  useHexValues,
  useElapsedTime,
  useTerminalLines,
} from "./useLabAnimations";
import ScrambleTitle from "./ScrambleTitle";
import "../lab/labSlides.css";

const SLIDE_LINES = [
  "Circuit core......... ONLINE",
  "Waveform monitor..... ACTIVE",
  "Signal integrity..... 99.97%",
  "Node topology........ MESH-4x4",
  "Power delivery....... 350W TDP",
  "Thermal state........ NOMINAL",
  "Data bus............. 400 GB/s",
  "Quantum coherence.... STABLE",
];

const HEX_VALS = ["0x1F3C", "0x8B02", "0xC7D1", "0x44E9", "0x9A6F"];

const RAIN_COLS = Array.from({ length: 10 }, (_, i) => ({
  left: `${(i / 10) * 100 + Math.random() * 5}%`,
  chars: Array.from({ length: 16 }, () => "01".charAt(Math.floor(Math.random() * 2))).join(" "),
  duration: `${6 + Math.random() * 4}s`,
  delay: `${Math.random() * 3}s`,
}));

export default function CircuitSlide() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [entered, setEntered] = useState(false);

  const termLines = useTerminalLines(SLIDE_LINES, 400);
  const hexVals = useHexValues(HEX_VALS, 2000);
  const elapsed = useElapsedTime();

  useParticleAnimation(canvasRef, 60, {
    speed: 0.2,
    connectionDistance: 120,
    baseColor: "rgba(0,200,255",
    pointer: { x: 0, y: 0 },
  });

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    const t2 = setTimeout(() => setShowBtn(true), 3000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const rainCols = RAIN_COLS;

  return (
    <section className="lab-slide" style={{ background: "#050610" }}>
      <canvas ref={canvasRef} className="lab-particle-canvas" aria-hidden="true" />

      <div className="lab-data-rain" aria-hidden="true" style={{ opacity: 0.6 }}>
        {rainCols.map((col, i) => (
          <span key={i} className="lab-rain-col" style={{ left: col.left, animationDuration: col.duration, animationDelay: col.delay, color: "var(--lab-cyan)", opacity: 0.04 }}>
            {col.chars}
          </span>
        ))}
      </div>

      <div className="lab-god-rays" aria-hidden="true" />
      <div className="lab-vignette" aria-hidden="true" />
      <div className="lab-scanlines" aria-hidden="true" style={{ opacity: 0.3 }} />

      <svg
        viewBox="0 0 800 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Circuit animation"
        style={{
          position: "relative", zIndex: 10,
          width: "90vw", height: "80vh",
          maxWidth: 800, maxHeight: 700,
          opacity: entered ? 1 : 0,
          transform: entered ? "scale(1)" : "scale(0.92)",
          transition: "opacity 1s ease, transform 1.4s cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        <defs>
          <filter id="sg" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="hg" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <radialGradient id="cg"><stop offset="0%" stopColor="#E8FFFF" /><stop offset="18%" stopColor="#22F4FF" stopOpacity=".95" /><stop offset="55%" stopColor="#0AA7C6" stopOpacity=".25" /><stop offset="100%" stopColor="#001115" stopOpacity="0" /></radialGradient>
          <linearGradient id="ms" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F3FFFF" stopOpacity=".92" /><stop offset="32%" stopColor="#69DCE7" stopOpacity=".64" /><stop offset="70%" stopColor="#14626D" stopOpacity=".5" /><stop offset="100%" stopColor="#D9FEFF" stopOpacity=".78" /></linearGradient>
          <linearGradient id="cb" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#00F5FF" stopOpacity="0" /><stop offset="50%" stopColor="#00F5FF" /><stop offset="100%" stopColor="#00F5FF" stopOpacity="0" /></linearGradient>
          <pattern id="mg" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" stroke="#51EFFF" strokeOpacity=".07" /></pattern>
          <mask id="bm"><rect width="800" height="900" fill="url(#cb)" /></mask>
        </defs>

        <rect width="800" height="900" fill="url(#mg)" opacity=".85" />
        <rect x="24" y="24" width="752" height="852" rx="22" stroke="#63E9F4" strokeOpacity=".16" />
        <rect x="42" y="42" width="716" height="816" rx="18" stroke="#63E9F4" strokeOpacity=".06" />

        <g className="lab-calibration"><path d="M54 90V54H90M710 54H746V90M54 810V846H90M710 846H746V810" stroke="#63E9F4" strokeWidth="1.2" strokeLinecap="round" opacity=".25" /><path d="M72 108V72H108M692 72H728V108M72 792V828H108M692 828H728V792" stroke="#63E9F4" strokeWidth="1.2" strokeLinecap="round" opacity=".1" /></g>

        <g className="lab-particles" filter="url(#hg)"><circle cx="102" cy="178" r="2.2" fill="#58F3FF" opacity=".5" /><circle cx="687" cy="154" r="1.7" fill="#58F3FF" opacity=".4" /><circle cx="716" cy="590" r="2" fill="#58F3FF" opacity=".5" /><circle cx="120" cy="704" r="1.8" fill="#58F3FF" opacity=".4" /><circle cx="614" cy="736" r="2.3" fill="#58F3FF" opacity=".5" /></g>

        <ellipse cx="400" cy="454" rx="190" ry="190" fill="url(#cg)" opacity=".5" className="lab-breathe" />
        <ellipse cx="400" cy="454" rx="112" ry="34" fill="#00EAF7" opacity=".08" filter="url(#sg)" />

        <g className="lab-traces" strokeLinecap="round" strokeLinejoin="round">
          <path pathLength={1} d="M400 382V304L346 250V190" />
          <path pathLength={1} d="M400 526V608L352 656V716" />
          <path pathLength={1} d="M328 454H242L196 408H116" />
          <path pathLength={1} d="M472 454H558L608 404H684" />
          <path pathLength={1} d="M350 404L286 340V294H224" />
          <path pathLength={1} d="M450 504L520 574V620H584" />
          <path pathLength={1} d="M350 504L286 568V614H218" />
          <path pathLength={1} d="M450 404L522 332V284H592" />
        </g>

        <g className="lab-node" filter="url(#hg)"><circle cx="346" cy="190" r="5" fill="#00F5FF" opacity=".8" /><circle cx="352" cy="716" r="5" fill="#00F5FF" opacity=".8" /><circle cx="116" cy="408" r="5" fill="#00F5FF" opacity=".8" /><circle cx="684" cy="404" r="5" fill="#00F5FF" opacity=".8" /><circle cx="224" cy="294" r="4" fill="#00F5FF" opacity=".7" /><circle cx="584" cy="620" r="4" fill="#00F5FF" opacity=".7" /><circle cx="218" cy="614" r="4" fill="#00F5FF" opacity=".7" /><circle cx="592" cy="284" r="4" fill="#00F5FF" opacity=".7" /></g>

        <g filter="url(#hg)">
          <rect x="308" y="362" width="184" height="184" rx="44" stroke="url(#ms)" strokeWidth="1.5" />
          <rect x="320" y="374" width="160" height="160" rx="36" stroke="#B4FEFF" strokeOpacity=".22" />
          <rect x="332" y="386" width="136" height="136" rx="28" fill="#021417" fillOpacity=".68" stroke="#4AE6F0" strokeOpacity=".22" />
        </g>

        <g className="lab-spin" style={{ "--spin-duration": "18s" } as React.CSSProperties} transform="rotate(-10 400 454)">
          <circle cx="400" cy="454" r="106" stroke="#76F6FF" strokeOpacity=".58" strokeWidth="1.4" strokeDasharray="80 16 6 28" />
          <circle cx="400" cy="454" r="126" stroke="#2BCBDA" strokeOpacity=".30" strokeWidth="1" strokeDasharray="6 22 112 30" />
          <path d="M400 320A134 134 0 0 1 518 388" stroke="#B9FFFF" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" />
          <path d="M282 520A134 134 0 0 1 400 588" stroke="#00EAF7" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g className="lab-spin lab-spin--reverse" style={{ "--spin-duration": "24s" } as React.CSSProperties}>
          <circle cx="400" cy="454" r="148" stroke="#2AA7B2" strokeOpacity=".2" strokeWidth="1" strokeDasharray="24 46" />
          <circle cx="400" cy="454" r="160" stroke="#8DFFFF" strokeOpacity=".10" strokeWidth="1" strokeDasharray="4 26" />
        </g>

        <g className="lab-chip" filter="url(#hg)">
          <rect x="355" y="409" width="90" height="90" rx="8" fill="#041A1E" stroke="#9FFFFF" strokeOpacity=".82" />
          <rect x="365" y="419" width="70" height="70" rx="5" fill="#0A262B" stroke="#36E7F1" strokeOpacity=".5" />
          <path d="M378 441L390 430L404 445L416 432L426 441M378 469H426" stroke="#D5FFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="390" cy="458" r="3" fill="#00F5FF" /><circle cx="406" cy="458" r="3" fill="#B8FFFF" /><circle cx="422" cy="458" r="3" fill="#00F5FF" />
          <path d="M366 409V397M382 409V397M398 409V397M414 409V397M430 409V397M366 499V511M382 499V511M398 499V511M414 499V511M430 499V511" />
          <path d="M355 421H343M355 437H343M355 453H343M355 469H343M355 485H343M445 421H457M445 437H457M445 453H457M445 469H457M445 485H457" />
        </g>

        <rect x="80" y="450" width="640" height="2" fill="url(#cb)" mask="url(#bm)" className="lab-sweep" />

        <g className="lab-panel--left" filter="url(#hg)">
          <rect x="76" y="238" width="132" height="166" rx="16" fill="#041417" fillOpacity=".76" stroke="#63E9F4" strokeOpacity=".28" />
          <rect x="92" y="256" width="100" height="58" rx="10" fill="#071D22" stroke="#67F7FF" strokeOpacity=".18" />
          <path d="M104 296C112 290 118 304 126 293C134 282 142 301 152 286C161 272 172 294 180 279" stroke="#B9FFFF" strokeOpacity=".82" strokeWidth="2" />
          <circle cx="104" cy="342" r="5" fill="#00F5FF" /><circle cx="122" cy="342" r="5" fill="#0F6973" /><circle cx="140" cy="342" r="5" fill="#00F5FF" />
          <rect x="158" y="334" width="28" height="16" rx="8" fill="#0B2930" stroke="#4FEAF3" strokeOpacity=".22" />
          <path d="M96 374H187M96 388H168" stroke="#57DCE5" strokeOpacity=".2" />
          <text x="84" y="220" fill="rgba(200,220,255,0.55)" fontFamily="monospace" fontSize="10" letterSpacing="0.1em">SYS / CORE-07</text>
        </g>

        <g className="lab-panel--right" filter="url(#hg)">
          <rect x="596" y="214" width="128" height="178" rx="16" fill="#041417" fillOpacity=".76" stroke="#63E9F4" strokeOpacity=".28" />
          <rect x="612" y="232" width="96" height="92" rx="10" fill="#071D22" stroke="#67F7FF" strokeOpacity=".18" />
          <path d="M624 252H690M624 266H678M624 280H696M624 294H664M624 308H688" stroke="#74F3FB" strokeOpacity=".45" />
          <rect x="612" y="336" width="30" height="38" rx="7" fill="#0C2B31" />
          <rect x="649" y="336" width="59" height="12" rx="6" fill="#0C2B31" />
          <rect x="649" y="353" width="40" height="10" rx="5" fill="#0C2B31" />
          <text x="612" y="194" fill="rgba(200,220,255,0.55)" fontFamily="monospace" fontSize="10" letterSpacing="0.1em">LIVE TELEMETRY</text>
        </g>

        <g className="lab-bottom-ui">
          <rect x="236" y="680" width="328" height="94" rx="18" fill="#031114" fillOpacity=".7" stroke="#63E9F4" strokeOpacity=".16" />
          <rect x="254" y="698" width="112" height="8" rx="4" fill="#0B2A30" />
          <rect x="254" y="715" width="78" height="8" rx="4" fill="#0B2A30" />
          <path d="M392 734L410 716L426 740L445 704L462 730L480 714L500 735" stroke="#44EEF6" strokeOpacity=".65" strokeWidth="2" />
          <circle cx="516" cy="721" r="12" stroke="#55F0F7" strokeOpacity=".25" />
          <path d="M516 714V729M509 721H524" stroke="#BDFEFF" strokeOpacity=".72" />
        </g>

        <g className="lab-microtext"><text x="250" y="662" fill="rgba(200,220,255,0.55)" fontFamily="monospace" fontSize="10" letterSpacing="0.1em">LAB NODE // ONLINE</text><text x="616" y="414" fill="rgba(200,220,255,0.55)" fontFamily="monospace" fontSize="10" letterSpacing="0.1em">SIGNAL 98.7%</text></g>
      </svg>

      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        fontFamily: "monospace", fontSize: "0.56em", letterSpacing: "0.12em",
        color: "var(--lab-text-dim)", display: "flex", gap: "1.8em",
        opacity: entered ? 0.55 : 0, transition: "opacity 0.8s ease 3s",
      }}>
        {hexVals.map((v, i) => <span key={i} style={{ fontVariantNumeric: "tabular-nums" }}>{v}</span>)}
      </div>

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 55,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.3em 1.8em", opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(-8px)",
        transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
      }}>
        <span style={{ fontFamily: "monospace", fontSize: "0.72em", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--lab-text-dim)" }}>VIRTUAL AI LAB</span>
        <span style={{ fontFamily: "monospace", fontSize: "0.62em", letterSpacing: "0.14em", color: "var(--lab-text-dim)" }}>ACTIVE SESSION</span>
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 55,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.3em 1.8em", opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
      }}>
        <span style={{ fontFamily: "monospace", fontSize: "0.62em", letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "var(--lab-text-dim)" }}>CIRCUIT CORE ACTIVE</span>
        <span style={{ fontFamily: "monospace", fontSize: "0.62em", letterSpacing: "0.14em", color: "var(--lab-text-dim)", fontVariantNumeric: "tabular-nums" }}>{elapsed}s</span>
      </div>

      <div style={{
        position: "absolute", bottom: 100, left: "50%",
        zIndex: 55, width: "min(420px, 80vw)", padding: "1em 1.4em",
        background: "var(--lab-panel-bg)", border: "1px solid var(--lab-border)", borderRadius: 6,
        fontFamily: "monospace", fontSize: "0.62em", color: "var(--lab-text-dim)",
        letterSpacing: "0.04em", lineHeight: 1.65,
        opacity: entered ? 1 : 0, transform: entered ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(8px)",
        transition: "opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s",
      }}>
        {termLines.map((line, i) => (
          <div key={i} style={{ whiteSpace: "nowrap" }}>
            <span style={{ color: "var(--lab-teal)" }}>{line}</span>
          </div>
        ))}
      </div>

      {showBtn && (
        <div style={{ position: "absolute", bottom: "8vh", left: "50%", transform: "translateX(-50%)", zIndex: 56 }}>
          <button type="button" className="lab-enter-btn" onClick={() => window.location.reload()} aria-label="Enter the laboratory">
            <span className="lab-enter-btn__line" />
            <span className="lab-enter-btn__label">ENTER LAB</span>
            <span className="lab-enter-btn__icon">↗</span>
          </button>
        </div>
      )}

      <div className="lab-slide-overlay">
        <ScrambleTitle text="AI" />
        <p className="lab-slide-subtitle">MiMo V2.5 · DeepSeek · OpenCode</p>
      </div>
    </section>
  );
}