"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnimationEvent as RAnimationEvent,
  type CSSProperties,
  type PointerEvent as RPointerEvent,
} from "react";
import "./realistic-lab-intro.css";

interface LabIntroProps {
  onComplete: () => void;
}

type MotionStyle = CSSProperties & {
  "--d"?: string;
  "--spin-duration"?: string;
  "--mx"?: string;
  "--my"?: string;
};

type Phase = "dark" | "power-on" | "boot" | "scanning" | "ready";

const spin = (duration: string): MotionStyle => ({
  "--spin-duration": duration,
});

const BOOT_LINES = [
  "BIOS POST................ OK",
  "Memory check.............. 64 GB ECC",
  "Neural engine............. 12 TFLOPS",
  "GPU cluster............... 4x H100 ONLINE",
  "Network fabric............ MESH READY",
  "Crypto module............. AES-512 ARMED",
  "Sensor array.............. 256 NODES",
  "Quantum link.............. CALIBRATING",
  "Core temp................. 42.3 C",
  "System ready.............. >>>",
];

const HEX_VALS_INIT = ["0xA7F2", "0x3B1C", "0xE904", "0x7D68", "0x1FAB"];
const RAIN_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const PARTICLE_COUNT = 80;

const RAIN_COLS = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i / 12) * 100 + Math.random() * 5}%`,
  chars: Array.from({ length: 20 }, () => RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)]).join(""),
  duration: `${8 + Math.random() * 6}s`,
  delay: `${Math.random() * 5}s`,
}));

export default function LabIntro({ onComplete }: LabIntroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const sparksCanvasRef = useRef<HTMLCanvasElement>(null);
  const [cycle, setCycle] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState<Phase>("dark");
  const [progress, setProgress] = useState(0);
  const [bootCount, setBootCount] = useState(0);
  const bootStartedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [hexVals, setHexVals] = useState(HEX_VALS_INIT);
  const [soundOn, setSoundOn] = useState(false);
  const [clock, setClock] = useState("");
  const [isCollapsing, setIsCollapsing] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setPhase("power-on"), 400));
    t.push(setTimeout(() => setPhase("boot"), 2200));
    t.push(setTimeout(() => setPhase("scanning"), 6000));
    t.push(setTimeout(() => setPhase("ready"), 9000));
    return () => t.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setCycle((v) => v + 1), 18000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("en-US", { hour12: false }) +
          "." + String(now.getMilliseconds()).padStart(3, "0").slice(0, 2)
      );
    };
    update();
    const id = window.setInterval(update, 100);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

/* start once when phase hits "boot" */
  useEffect(() => {
    if (phase !== "boot" || bootStartedRef.current) return;
    bootStartedRef.current = true;
    let idx = 0;
    intervalRef.current = window.setInterval(() => {
      idx++;
      setBootCount(idx);
      if (idx >= BOOT_LINES.length && intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 320);
  }, [phase]);

  /* unmount-only cleanup; resets refs for StrictMode remount */
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      bootStartedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (phase === "dark") return;
    let raf: number;
    const start = Date.now();
    const duration = 8500;
    const stutters = [0.23, 0.47, 0.68, 0.84, 0.91];
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      let p = t;
      for (const sp of stutters) {
        if (t > sp && t < sp + 0.04) { p = sp; break; }
      }
      setProgress(p);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHexVals(
        Array.from({ length: 5 }, () =>
          "0x" + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0")
        )
      );
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    interface P { x: number; y: number; vx: number; vy: number; r: number; depth: number; }
    const particles: P[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5, depth: Math.random(),
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = pointer.x * canvas.width + canvas.width / 2;
      const my = pointer.y * canvas.height + canvas.height / 2;
      for (const p of particles) {
        const dx = mx - p.x, dy = my - p.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) { p.vx += dx * 0.00003; p.vy += dy * 0.00003; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,200,255,${0.15 + p.depth * 0.35})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,200,255,${0.04 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animFrameRef.current); window.removeEventListener("resize", resize); };
  }, [pointer.x, pointer.y]);

  useEffect(() => {
    const canvas = sparksCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    interface S { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; }
    const sparks: S[] = [];
    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.15) {
        const angle = Math.random() * Math.PI * 2, speed = Math.random() * 4 + 2;
        sparks.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 100,
          y: canvas.height / 2 + (Math.random() - 0.5) * 100,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 0, maxLife: 20 + Math.random() * 30,
        });
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vx *= 0.96; s.vy *= 0.96; s.life++;
        const alpha = 1 - s.life / s.maxLife;
        if (alpha <= 0) { sparks.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,245,255,${alpha})`; ctx.fill();
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
        ctx.strokeStyle = `rgba(0,200,255,${alpha * 0.4})`; ctx.lineWidth = 0.8; ctx.stroke();
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const toggleSound = useCallback(() => {
    if (soundOn) {
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      setSoundOn(false);
      return;
    }
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      [55, 82.5, 110, 165, 220].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.value = 0.015;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
      });
      setSoundOn(true);
    } catch { setSoundOn(false); }
  }, [soundOn]);

  const handlePointerMove = useCallback((event: RPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setPointer({ x: Math.max(-0.5, Math.min(0.5, x)), y: Math.max(-0.5, Math.min(0.5, y)) });
  }, []);

  const handlePointerLeave = useCallback(() => setPointer({ x: 0, y: 0 }), []);

  const handleEnter = useCallback(() => {
    setIsCollapsing(true);
    ref.current?.classList.add("collapsing");
    setTimeout(() => ref.current?.classList.add("exited"), 900);
  }, []);

  const handleAnimEnd = useCallback((event: RAnimationEvent<HTMLDivElement>) => {
    if (event.target === ref.current && event.animationName === "lab-exit") {
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      onComplete();
    }
  }, [onComplete]);

  const sceneStyle = useMemo<MotionStyle>(() => ({
    "--mx": `${pointer.x * 18}px`, "--my": `${pointer.y * 18}px`,
  }), [pointer.x, pointer.y]);

  const rainCols = RAIN_COLS;

  return (
    <section
      ref={ref}
      className={`lab-intro ${phase !== "dark" ? "is-ready" : ""} ${isCollapsing ? "collapsing" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onAnimationEnd={handleAnimEnd}
      role="dialog"
      aria-label="Laboratory intro"
    >
      <canvas ref={particleCanvasRef} className="lab-particle-canvas" aria-hidden="true" />
      <canvas ref={sparksCanvasRef} className="lab-sparks-canvas" aria-hidden="true" />
      <div className="lab-god-rays" aria-hidden="true" />
      <div className="lab-haze" aria-hidden="true" />
      <div className="lab-noise" aria-hidden="true" />
      <div className="lab-vignette" aria-hidden="true" />
      <div className="lab-scanlines" aria-hidden="true" />
      <div className="lab-chromatic" aria-hidden="true" />
      <div className="lab-crt-sweep" aria-hidden="true" />
      <div className="lab-lightning" aria-hidden="true" />
      <div className="lab-scan-beam" aria-hidden="true" />

      <div className="lab-data-rain" aria-hidden="true">
        {rainCols.map((col, i) => (
          <span key={i} className="lab-rain-col" style={{ left: col.left, animationDuration: col.duration, animationDelay: col.delay }}>{col.chars}</span>
        ))}
      </div>

      <div className="lab-header" aria-hidden="true">
        <span>RESEARCH LAB</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{clock}</span>
        <button type="button" style={{
          position: "static", transform: "none", padding: "0.3em 0.8em", fontSize: "0.9em",
          opacity: 1, transition: "border-color 0.3s, color 0.3s", cursor: "pointer",
          border: `1px solid ${soundOn ? "var(--lab-teal)" : "var(--lab-border)"}`,
          color: soundOn ? "var(--lab-teal)" : "var(--lab-text-dim)",
          background: "transparent", fontFamily: "var(--lab-mono)", letterSpacing: "0.1em",
        }} onClick={(e) => { e.stopPropagation(); toggleSound(); }}
          aria-label={soundOn ? "Mute audio" : "Enable audio"}>
          {soundOn ? "SOUND ON" : "SOUND OFF"}
        </button>
      </div>

      <div className="lab-scene" style={sceneStyle}>
        <div className="lab-ambient lab-ambient--1" />
        <div className="lab-ambient lab-ambient--2" />
        <svg key={cycle} className="lab-svg" viewBox="0 0 800 900" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <radialGradient id="coreGlow"><stop offset="0%" stopColor="#E8FFFF" stopOpacity="1" /><stop offset="18%" stopColor="#22F4FF" stopOpacity=".95" /><stop offset="55%" stopColor="#0AA7C6" stopOpacity=".25" /><stop offset="100%" stopColor="#001115" stopOpacity="0" /></radialGradient>
            <linearGradient id="metalStroke" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F3FFFF" stopOpacity=".92" /><stop offset="32%" stopColor="#69DCE7" stopOpacity=".64" /><stop offset="70%" stopColor="#14626D" stopOpacity=".5" /><stop offset="100%" stopColor="#D9FEFF" stopOpacity=".78" /></linearGradient>
            <linearGradient id="cyanBeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#00F5FF" stopOpacity="0" /><stop offset="50%" stopColor="#00F5FF" stopOpacity="1" /><stop offset="100%" stopColor="#00F5FF" stopOpacity="0" /></linearGradient>
            <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="hardGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="1.4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <pattern id="microGrid" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" stroke="#51EFFF" strokeOpacity=".07" /></pattern>
            <mask id="beamMask"><rect width="800" height="900" fill="url(#cyanBeam)" /></mask>
          </defs>
          <rect width="800" height="900" fill="url(#microGrid)" opacity=".85" />
          <rect x="24" y="24" width="752" height="852" rx="22" stroke="#63E9F4" strokeOpacity=".16" />
          <rect x="42" y="42" width="716" height="816" rx="18" stroke="#63E9F4" strokeOpacity=".06" />
          <g className="lab-calibration"><path d="M54 90V54H90M710 54H746V90M54 810V846H90M710 846H746V810" /><path d="M72 108V72H108M692 72H728V108M72 792V828H108M692 828H728V792" opacity=".45" /></g>
          <g className="lab-particles" filter="url(#hardGlow)"><circle cx="102" cy="178" r="2.2" /><circle cx="687" cy="154" r="1.7" /><circle cx="716" cy="590" r="2" /><circle cx="120" cy="704" r="1.8" /><circle cx="614" cy="736" r="2.3" /><circle cx="152" cy="344" r="1.5" /><circle cx="648" cy="350" r="1.6" /></g>
          <ellipse cx="400" cy="454" rx="190" ry="190" fill="url(#coreGlow)" opacity=".5" className="lab-breathe" />
          <ellipse cx="400" cy="454" rx="112" ry="34" fill="#00EAF7" opacity=".08" filter="url(#softGlow)" />
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
          <g className="lab-node" filter="url(#hardGlow)"><circle cx="346" cy="190" r="5" /><circle cx="352" cy="716" r="5" /><circle cx="116" cy="408" r="5" /><circle cx="684" cy="404" r="5" /><circle cx="224" cy="294" r="4" /><circle cx="584" cy="620" r="4" /><circle cx="218" cy="614" r="4" /><circle cx="592" cy="284" r="4" /></g>
          <g className="lab-core-frame" filter="url(#hardGlow)">
            <rect x="308" y="362" width="184" height="184" rx="44" stroke="url(#metalStroke)" strokeWidth="1.5" />
            <rect x="320" y="374" width="160" height="160" rx="36" stroke="#B4FEFF" strokeOpacity=".22" />
            <rect x="332" y="386" width="136" height="136" rx="28" fill="#021417" fillOpacity=".68" stroke="#4AE6F0" strokeOpacity=".22" />
          </g>
          <g className="lab-spin" style={spin("18s")} transform="rotate(-10 400 454)">
            <circle cx="400" cy="454" r="106" stroke="#76F6FF" strokeOpacity=".58" strokeWidth="1.4" strokeDasharray="80 16 6 28" />
            <circle cx="400" cy="454" r="126" stroke="#2BCBDA" strokeOpacity=".30" strokeWidth="1" strokeDasharray="6 22 112 30" />
            <path d="M400 320A134 134 0 0 1 518 388" stroke="#B9FFFF" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" />
            <path d="M282 520A134 134 0 0 1 400 588" stroke="#00EAF7" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="lab-spin lab-spin--reverse" style={spin("24s")}>
            <circle cx="400" cy="454" r="148" stroke="#2AA7B2" strokeOpacity=".2" strokeWidth="1" strokeDasharray="24 46" />
            <circle cx="400" cy="454" r="160" stroke="#8DFFFF" strokeOpacity=".10" strokeWidth="1" strokeDasharray="4 26" />
          </g>
          <g className="lab-chip" filter="url(#hardGlow)">
            <rect x="355" y="409" width="90" height="90" rx="8" fill="#041A1E" stroke="#9FFFFF" strokeOpacity=".82" />
            <rect x="365" y="419" width="70" height="70" rx="5" fill="#0A262B" stroke="#36E7F1" strokeOpacity=".5" />
            <path d="M378 441L390 430L404 445L416 432L426 441M378 469H426" stroke="#D5FFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="390" cy="458" r="3" fill="#00F5FF" /><circle cx="406" cy="458" r="3" fill="#B8FFFF" /><circle cx="422" cy="458" r="3" fill="#00F5FF" />
            <path d="M366 409V397M382 409V397M398 409V397M414 409V397M430 409V397M366 499V511M382 499V511M398 499V511M414 499V511M430 499V511" />
            <path d="M355 421H343M355 437H343M355 453H343M355 469H343M355 485H343M445 421H457M445 437H457M445 453H457M445 469H457M445 485H457" />
          </g>
          <rect x="80" y="450" width="640" height="2" fill="url(#cyanBeam)" mask="url(#beamMask)" className="lab-sweep" />
          <g className="lab-panel--left" filter="url(#hardGlow)">
            <rect x="76" y="238" width="132" height="166" rx="16" fill="#041417" fillOpacity=".76" stroke="#63E9F4" strokeOpacity=".28" />
            <rect x="92" y="256" width="100" height="58" rx="10" fill="#071D22" stroke="#67F7FF" strokeOpacity=".18" />
            <path d="M104 296C112 290 118 304 126 293C134 282 142 301 152 286C161 272 172 294 180 279" stroke="#B9FFFF" strokeOpacity=".82" strokeWidth="2" />
            <circle cx="104" cy="342" r="5" fill="#00F5FF" /><circle cx="122" cy="342" r="5" fill="#0F6973" /><circle cx="140" cy="342" r="5" fill="#00F5FF" />
            <rect x="158" y="334" width="28" height="16" rx="8" fill="#0B2930" stroke="#4FEAF3" strokeOpacity=".22" />
            <path d="M96 374H187M96 388H168" stroke="#57DCE5" strokeOpacity=".2" />
          </g>
          <g className="lab-panel--right" filter="url(#hardGlow)">
            <rect x="596" y="214" width="128" height="178" rx="16" fill="#041417" fillOpacity=".76" stroke="#63E9F4" strokeOpacity=".28" />
            <rect x="612" y="232" width="96" height="92" rx="10" fill="#071D22" stroke="#67F7FF" strokeOpacity=".18" />
            <path d="M624 252H690M624 266H678M624 280H696M624 294H664M624 308H688" stroke="#74F3FB" strokeOpacity=".45" />
            <rect x="612" y="336" width="30" height="38" rx="7" fill="#0C2B31" />
            <rect x="649" y="336" width="59" height="12" rx="6" fill="#0C2B31" />
            <rect x="649" y="353" width="40" height="10" rx="5" fill="#0C2B31" />
          </g>
          <g className="lab-bottom-ui">
            <rect x="236" y="680" width="328" height="94" rx="18" fill="#031114" fillOpacity=".7" stroke="#63E9F4" strokeOpacity=".16" />
            <rect x="254" y="698" width="112" height="8" rx="4" fill="#0B2A30" />
            <rect x="254" y="715" width="78" height="8" rx="4" fill="#0B2A30" />
            <path d="M392 734L410 716L426 740L445 704L462 730L480 714L500 735" stroke="#44EEF6" strokeOpacity=".65" strokeWidth="2" />
            <circle cx="516" cy="721" r="12" stroke="#55F0F7" strokeOpacity=".25" />
            <path d="M516 714V729M509 721H524" stroke="#BDFEFF" strokeOpacity=".72" />
          </g>
          <g className="lab-microtext">
            <text x="84" y="220">SYS / CORE-07</text>
            <text x="592" y="194">LIVE TELEMETRY</text>
            <text x="250" y="662">LAB NODE // ONLINE</text>
            <text x="616" y="414">SIGNAL 98.7%</text>
          </g>
        </svg>
      </div>

      <div className="lab-footer" aria-hidden="true">
        <span>INITIALIZING SYSTEMS</span>
        <span>v3.8.14 // {elapsed}s</span>
      </div>

      <div className="lab-boot-terminal" aria-hidden="true">
        {BOOT_LINES.slice(0, bootCount).map((line, i) => (
          <div key={i} className="lab-boot-line">
            <span className={line.includes(">>>") ? "ok" : line.includes("CALIBRATING") ? "warn" : "val"}>
              {line}
            </span>
          </div>
        ))}
      </div>

      <div className="lab-progress-wrap">
        <div className="lab-progress-track">
          <div className="lab-progress-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>
        <div className="lab-progress-label">{Math.floor(progress * 100)}% SYSTEMS INIT</div>
      </div>

      <div className="lab-hex" aria-hidden="true">
        {hexVals.map((v, i) => <span key={i} className="lab-hex-val">{v}</span>)}
      </div>

      <div style={{ position: "absolute", bottom: "8vh", left: "50%", transform: "translateX(-50%)", zIndex: 56 }}>
        <button type="button" className="lab-enter-btn" onClick={handleEnter} aria-label="Enter the laboratory">
          <span className="lab-enter-btn__line" />
          <span className="lab-enter-btn__label">ENTER LAB</span>
          <span className="lab-enter-btn__icon">↗</span>
        </button>
      </div>
    </section>
  );
}
