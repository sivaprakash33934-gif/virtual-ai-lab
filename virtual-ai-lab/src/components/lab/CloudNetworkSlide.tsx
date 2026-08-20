"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import LabSlideModal from "./LabSlideModal";
import "../lab/labSlides.css";

const CABLE_IDS = [
  "lab-cloud-path-left-mobile",
  "lab-cloud-path-laptop",
  "lab-cloud-path-blade-left",
  "lab-cloud-path-datacenter",
  "lab-cloud-path-blade-right",
  "lab-cloud-path-monitor",
  "lab-cloud-path-right-mobile",
];

const DEVICE_IDS = [
  "lab-cloud-node-mobile-left",
  "lab-cloud-node-laptop",
  "lab-cloud-node-server-left",
  "lab-cloud-node-datacenter-main",
  "lab-cloud-node-server-right",
  "lab-cloud-node-monitor",
  "lab-cloud-node-mobile-right",
];

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 1.8 + 0.5,
      speedY: -(Math.random() * 0.7 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.4 ? "#00f3ff" : "#00ff88",
      opacity: Math.random() * 0.7 + 0.3,
    }));

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(0, 85, 136, 0.15)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    };

    const drawStatic = () => {
      drawGrid();
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawStatic();
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      drawGrid();
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="lab-cloud-bg-canvas" aria-hidden="true" />;
}

export default function CloudNetworkSlide({ isActive }: { isActive?: boolean }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.to("#lab-cloud-cyber-cloud", {
        y: "-=18",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".lab-cloud-ring-slow", { rotation: 360, transformOrigin: "center center", duration: 40, repeat: -1, ease: "none" });
      gsap.to(".lab-cloud-ring-rev", { rotation: -360, transformOrigin: "center center", duration: 25, repeat: -1, ease: "none" });
      gsap.to(".lab-cloud-ring-pulse", { scale: 1.06, opacity: 0.7, transformOrigin: "center center", duration: 2, repeat: -1, yoyo: true, ease: "power1.inOut" });

      gsap.to("#lab-cloud-badge-shield, #lab-cloud-badge-shield-rt", {
        y: "-=12",
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      });

      gsap.to(".lab-led-blink-1", { opacity: 0.15, duration: 0.4, repeat: -1, yoyo: true, ease: "rough", stagger: 0.15 });
      gsap.to(".lab-led-blink-2", { opacity: 0.2, duration: 0.6, repeat: -1, yoyo: true, ease: "rough", stagger: 0.2 });
      gsap.to(".lab-led-blink-3", { opacity: 0.1, duration: 0.3, repeat: -1, yoyo: true, ease: "rough", stagger: 0.1 });

      DEVICE_IDS.forEach((id, i) => {
        gsap.to(`#${id}`, {
          y: "-=7",
          duration: 2.5 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.15,
        });
      });

      const photons = scope.querySelectorAll(".lab-cloud-photon");
      CABLE_IDS.forEach((pathId, idx) => {
        const pathElem = scope.querySelector(`#${pathId}`);
        if (!(pathElem instanceof SVGPathElement)) return;
        const length = pathElem.getTotalLength();

        for (let p = 0; p < 2; p++) {
          const photon = photons[idx * 2 + p];
          const obj = { distance: 0 };
          gsap.to(obj, {
            distance: length,
            duration: 1.6 + idx * 0.15,
            repeat: -1,
            ease: "none",
            delay: p * 0.9 + idx * 0.1,
            onUpdate: () => {
              const pt = pathElem.getPointAtLength(obj.distance);
              photon?.setAttribute("cx", String(pt.x));
              photon?.setAttribute("cy", String(pt.y));
            },
          });
        }
      });
    }, scope);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="lab-slide" aria-label="Cloud and Network" style={{ background: "#02050c" }}>
      <ParticleField />

      <div className="lab-cloud-hud-overlay" aria-hidden="true">
        <h1>QUANTUM CLOUD ARCHITECTURE</h1>
        <p>STATUS: ONLINE • DATA SYNCHRONIZATION ACTIVE</p>
      </div>

      <div className="lab-cloud-stage" ref={scopeRef}>
        <svg
          className="lab-cloud-stage-svg"
          viewBox="0 0 1200 900"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Cyber cloud network animation"
        >
          <defs>
            <filter id="lab-cloud-super-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="lab-cloud-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="lab-cloud-cyan-laser" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f3ff" stopOpacity="1" />
              <stop offset="50%" stopColor="#0099ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00f3ff" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="lab-cloud-green-laser" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="1" />
              <stop offset="100%" stopColor="#00b359" stopOpacity="0.8" />
            </linearGradient>

            <radialGradient id="lab-cloud-core-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#051c38" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#020813" stopOpacity="0.9" />
            </radialGradient>

            <radialGradient id="lab-cloud-pedestal-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f3ff" stopOpacity="0" />
            </radialGradient>

            <pattern id="lab-cloud-matrix" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#00f3ff" strokeWidth="0.5" strokeOpacity="0.25" />
              <circle cx="15" cy="15" r="1.5" fill="#00ff88" opacity="0.4" />
            </pattern>
          </defs>

          <g transform="translate(600, 240)">
            <circle className="lab-cloud-ring-slow" r="230" fill="none" stroke="#005588" strokeWidth="1.5" strokeDasharray="10 15" opacity="0.4" />
            <circle className="lab-cloud-ring-rev" r="200" fill="none" stroke="#00f3ff" strokeWidth="2" strokeDasharray="40 80 120 40" opacity="0.5" />
            <circle className="lab-cloud-ring-pulse" r="170" fill="none" stroke="#00ff88" strokeWidth="1" strokeDasharray="4 8" opacity="0.3" />
          </g>

          <g>
            <path id="lab-cloud-path-left-mobile" d="M 520,330 C 520,480 200,500 160,700" fill="none" stroke="url(#lab-cloud-cyan-laser)" strokeWidth="2.5" opacity="0.8" />
            <path id="lab-cloud-path-laptop" d="M 550,340 C 550,510 320,530 310,700" fill="none" stroke="url(#lab-cloud-cyan-laser)" strokeWidth="2.5" opacity="0.8" />
            <path id="lab-cloud-path-blade-left" d="M 580,345 C 580,480 480,550 470,680" fill="none" stroke="url(#lab-cloud-green-laser)" strokeWidth="3" opacity="0.9" />
            <path id="lab-cloud-path-datacenter" d="M 600,350 L 600,670" fill="none" stroke="url(#lab-cloud-green-laser)" strokeWidth="4" opacity="1" />
            <path id="lab-cloud-path-blade-right" d="M 620,345 C 620,480 720,550 730,680" fill="none" stroke="url(#lab-cloud-green-laser)" strokeWidth="3" opacity="0.9" />
            <path id="lab-cloud-path-monitor" d="M 650,340 C 650,510 880,530 890,700" fill="none" stroke="url(#lab-cloud-cyan-laser)" strokeWidth="2.5" opacity="0.8" />
            <path id="lab-cloud-path-right-mobile" d="M 680,330 C 680,480 1000,500 1040,700" fill="none" stroke="url(#lab-cloud-cyan-laser)" strokeWidth="2.5" opacity="0.8" />
          </g>

          <g id="lab-cloud-pulse-particles" filter="url(#lab-cloud-super-glow)">
            {CABLE_IDS.map((id, idx) => {
              const isGreen = idx === 2 || idx === 3 || idx === 4;
              return [0, 1].map((p) => (
                <circle
                  key={`${id}-${p}`}
                  className="lab-cloud-photon"
                  cx="0"
                  cy="0"
                  r={isGreen ? 4.5 : 3.5}
                  fill={isGreen ? "#00ff88" : "#00f3ff"}
                />
              ));
            })}
          </g>

          <g id="lab-cloud-cyber-cloud" className="lab-interactive-node" transform="translate(600, 240)">
            <path
              d="M -160,20 C -190,20 -210,-10 -200,-40 C -220,-70 -200,-110 -160,-120 C -140,-160 -80,-180 -30,-160 C 0,-190 60,-190 90,-160 C 140,-170 190,-140 190,-100 C 220,-80 230,-40 210,-10 C 220,20 190,40 160,40 L -140,40 C -150,40 -160,30 -160,20 Z"
              fill="url(#lab-cloud-core-grad)"
              stroke="#00f3ff"
              strokeWidth="2.5"
              filter="url(#lab-cloud-super-glow)"
            />
            <path
              d="M -160,20 C -190,20 -210,-10 -200,-40 C -220,-70 -200,-110 -160,-120 C -140,-160 -80,-180 -30,-160 C 0,-190 60,-190 90,-160 C 140,-170 190,-140 190,-100 C 220,-80 230,-40 210,-10 C 220,20 190,40 160,40 L -140,40 Z"
              fill="url(#lab-cloud-matrix)"
            />
            <text x="-90" y="-60" fill="#00ff88" fontFamily="monospace" fontSize="14" opacity="0.85" letterSpacing="3">10110 01001</text>
            <text x="-40" y="-30" fill="#00f3ff" fontFamily="monospace" fontSize="16" fontWeight="900" opacity="0.95" letterSpacing="4">SECURE CLOUD</text>
            <text x="-70" y="0" fill="#00ff88" fontFamily="monospace" fontSize="13" opacity="0.8" letterSpacing="2">0110101 11010</text>
          </g>

          <g id="lab-cloud-badge-shield" className="lab-interactive-node" transform="translate(420, 520)" filter="url(#lab-cloud-soft-glow)">
            <circle cx="0" cy="0" r="26" fill="#06192e" stroke="#00f3ff" strokeWidth="2" />
            <path d="M -10,-10 L 10,-10 L 10,2 C 10,8 0,14 0,14 C 0,14 -10,8 -10,2 Z" fill="none" stroke="#00ff88" strokeWidth="2.5" />
          </g>
          <g id="lab-cloud-badge-shield-rt" className="lab-interactive-node" transform="translate(780, 520)" filter="url(#lab-cloud-soft-glow)">
            <circle cx="0" cy="0" r="26" fill="#06192e" stroke="#00ff88" strokeWidth="2" />
            <path d="M -10,-10 L 10,-10 L 10,2 C 10,8 0,14 0,14 C 0,14 -10,8 -10,2 Z" fill="none" stroke="#00f3ff" strokeWidth="2.5" />
          </g>
          <g className="lab-interactive-node" transform="translate(130, 480)" filter="url(#lab-cloud-soft-glow)">
            <circle cx="0" cy="0" r="20" fill="#06192e" stroke="#00f3ff" strokeWidth="1.5" />
            <path d="M -4,6 L -4,-6 L 6,-3 L 6,4 M -4,3 A 3,2 0 1,1 -7,5 A 3,2 0 1,1 -4,3 M 6,1 A 3,2 0 1,1 3,3 A 3,2 0 1,1 6,1" fill="none" stroke="#00f3ff" strokeWidth="1.5" />
          </g>
          <g className="lab-interactive-node" transform="translate(1070, 480)" filter="url(#lab-cloud-soft-glow)">
            <circle cx="0" cy="0" r="20" fill="#06192e" stroke="#00ff88" strokeWidth="1.5" />
            <path d="M -6,-5 L 2,-5 L 2,5 L -6,5 Z M 2,-2 L 7,-5 L 7,5 L 2,2 Z" fill="none" stroke="#00ff88" strokeWidth="1.5" />
          </g>

          <g id="lab-cloud-node-mobile-left" className="lab-interactive-node" transform="translate(160, 710)">
            <ellipse cx="0" cy="55" rx="45" ry="14" fill="url(#lab-cloud-pedestal-glow)" />
            <ellipse cx="0" cy="55" rx="40" ry="10" fill="none" stroke="#00f3ff" strokeWidth="1.5" strokeDasharray="6 4" />
            <rect x="-22" y="-40" width="44" height="85" rx="7" fill="#07152b" stroke="#00f3ff" strokeWidth="2" />
            <rect x="-18" y="-33" width="36" height="70" rx="3" fill="#020a17" stroke="#005577" strokeWidth="1" />
            <line x1="-12" y1="-20" x2="12" y2="-20" stroke="#00ff88" strokeWidth="1.5" />
            <line x1="-12" y1="-12" x2="4" y2="-12" stroke="#00f3ff" strokeWidth="1" />
            <line x1="-12" y1="-5" x2="8" y2="-5" stroke="#00f3ff" strokeWidth="1" />
            <circle cx="0" cy="30" r="3" fill="#00ff88" />
          </g>

          <g id="lab-cloud-node-laptop" className="lab-interactive-node" transform="translate(310, 715)">
            <ellipse cx="0" cy="45" rx="60" ry="16" fill="url(#lab-cloud-pedestal-glow)" />
            <ellipse cx="0" cy="45" rx="55" ry="12" fill="none" stroke="#00f3ff" strokeWidth="1.5" />
            <rect x="-42" y="-40" width="84" height="55" rx="4" fill="#07152b" stroke="#00f3ff" strokeWidth="2" />
            <rect x="-37" y="-35" width="74" height="44" fill="#020a17" stroke="#004466" strokeWidth="1" />
            <polyline points="-30, -5 -15, -20 0, -10 15, -25 30, -15" fill="none" stroke="#00ff88" strokeWidth="2" />
            <polygon points="-52,25 52,25 44,15 -44,15" fill="#0a1d38" stroke="#00f3ff" strokeWidth="1.5" />
          </g>

          <g id="lab-cloud-node-server-left" className="lab-interactive-node" transform="translate(470, 690)">
            <ellipse cx="0" cy="75" rx="50" ry="16" fill="url(#lab-cloud-pedestal-glow)" />
            <ellipse cx="0" cy="75" rx="45" ry="12" fill="none" stroke="#00ff88" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="-32" y="-55" width="64" height="120" rx="5" fill="#07152b" stroke="#00ff88" strokeWidth="2" />
            <g fill="#0c2340" stroke="#00ff88" strokeWidth="0.8">
              <rect x="-27" y="-47" width="54" height="18" rx="2" />
              <rect x="-27" y="-23" width="54" height="18" rx="2" />
              <rect x="-27" y="1" width="54" height="18" rx="2" />
              <rect x="-27" y="25" width="54" height="18" rx="2" />
              <rect x="-27" y="49" width="54" height="12" rx="2" />
            </g>
            <circle className="lab-led-blink-1" cx="20" cy="-38" r="2.5" fill="#00ff88" />
            <circle className="lab-led-blink-2" cx="20" cy="-14" r="2.5" fill="#00f3ff" />
            <circle className="lab-led-blink-3" cx="20" cy="10" r="2.5" fill="#00ff88" />
            <circle className="lab-led-blink-1" cx="20" cy="34" r="2.5" fill="#00f3ff" />
          </g>

          <g id="lab-cloud-node-datacenter-main" className="lab-interactive-node" transform="translate(600, 675)" filter="url(#lab-cloud-super-glow)">
            <ellipse cx="0" cy="95" rx="75" ry="24" fill="url(#lab-cloud-pedestal-glow)" />
            <ellipse cx="0" cy="95" rx="70" ry="20" fill="none" stroke="#00f3ff" strokeWidth="2.5" />
            <ellipse cx="0" cy="95" rx="55" ry="14" fill="none" stroke="#00ff88" strokeWidth="1.5" strokeDasharray="8 6" />
            <rect x="-42" y="-75" width="84" height="155" rx="6" fill="#051329" stroke="#00f3ff" strokeWidth="2.5" />
            <g fill="#0b2447" stroke="#00f3ff" strokeWidth="1">
              <rect x="-35" y="-65" width="70" height="22" rx="3" />
              <rect x="-35" y="-36" width="70" height="22" rx="3" />
              <rect x="-35" y="-7" width="70" height="22" rx="3" />
              <rect x="-35" y="22" width="70" height="22" rx="3" />
              <rect x="-35" y="51" width="70" height="22" rx="3" />
            </g>
            <line x1="-28" y1="-54" x2="0" y2="-54" stroke="#00ff88" strokeWidth="3" />
            <line x1="-28" y1="-25" x2="10" y2="-25" stroke="#00f3ff" strokeWidth="3" />
            <line x1="-28" y1="4" x2="-5" y2="4" stroke="#00ff88" strokeWidth="3" />
            <line x1="-28" y1="33" x2="15" y2="33" stroke="#00f3ff" strokeWidth="3" />
            <line x1="-28" y1="62" x2="5" y2="62" stroke="#00ff88" strokeWidth="3" />
            <circle className="lab-led-blink-1" cx="24" cy="-54" r="3" fill="#00ff88" />
            <circle className="lab-led-blink-2" cx="24" cy="-25" r="3" fill="#00f3ff" />
            <circle className="lab-led-blink-3" cx="24" cy="4" r="3" fill="#00ff88" />
            <circle className="lab-led-blink-1" cx="24" cy="33" r="3" fill="#00f3ff" />
            <circle className="lab-led-blink-2" cx="24" cy="62" r="3" fill="#00ff88" />
          </g>

          <g id="lab-cloud-node-server-right" className="lab-interactive-node" transform="translate(730, 690)">
            <ellipse cx="0" cy="75" rx="50" ry="16" fill="url(#lab-cloud-pedestal-glow)" />
            <ellipse cx="0" cy="75" rx="45" ry="12" fill="none" stroke="#00ff88" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="-32" y="-55" width="64" height="120" rx="5" fill="#07152b" stroke="#00ff88" strokeWidth="2" />
            <g fill="#0c2340" stroke="#00ff88" strokeWidth="0.8">
              <rect x="-27" y="-47" width="54" height="18" rx="2" />
              <rect x="-27" y="-23" width="54" height="18" rx="2" />
              <rect x="-27" y="1" width="54" height="18" rx="2" />
              <rect x="-27" y="25" width="54" height="18" rx="2" />
              <rect x="-27" y="49" width="54" height="12" rx="2" />
            </g>
            <circle className="lab-led-blink-3" cx="20" cy="-38" r="2.5" fill="#00f3ff" />
            <circle className="lab-led-blink-1" cx="20" cy="-14" r="2.5" fill="#00ff88" />
            <circle className="lab-led-blink-2" cx="20" cy="10" r="2.5" fill="#00f3ff" />
            <circle className="lab-led-blink-3" cx="20" cy="34" r="2.5" fill="#00ff88" />
          </g>

          <g id="lab-cloud-node-monitor" className="lab-interactive-node" transform="translate(890, 715)">
            <ellipse cx="0" cy="45" rx="60" ry="16" fill="url(#lab-cloud-pedestal-glow)" />
            <ellipse cx="0" cy="45" rx="55" ry="12" fill="none" stroke="#00f3ff" strokeWidth="1.5" />
            <path d="M -50,-35 Q 0,-42 50,-35 L 50,15 Q 0,8 -50,15 Z" fill="#07152b" stroke="#00f3ff" strokeWidth="2" />
            <path d="M -44,-29 Q 0,-35 44,-29 L 44,9 Q 0,3 -44,9 Z" fill="#020a17" stroke="#004466" strokeWidth="1" />
            <line x1="-35" y1="-18" x2="-10" y2="-18" stroke="#00f3ff" strokeWidth="2" />
            <line x1="-35" y1="-10" x2="15" y2="-10" stroke="#00ff88" strokeWidth="1.5" />
            <line x1="-35" y1="-2" x2="0" y2="-2" stroke="#00f3ff" strokeWidth="1.5" />
            <polygon points="-8,14 8,14 12,38 -12,38" fill="#0a1d38" stroke="#00f3ff" strokeWidth="1.5" />
            <ellipse cx="0" cy="38" rx="22" ry="5" fill="#07152b" stroke="#00f3ff" strokeWidth="1.5" />
          </g>

          <g id="lab-cloud-node-mobile-right" className="lab-interactive-node" transform="translate(1040, 710)">
            <ellipse cx="0" cy="55" rx="45" ry="14" fill="url(#lab-cloud-pedestal-glow)" />
            <ellipse cx="0" cy="55" rx="40" ry="10" fill="none" stroke="#00ff88" strokeWidth="1.5" strokeDasharray="6 4" />
            <rect x="-24" y="-45" width="48" height="92" rx="7" fill="#07152b" stroke="#00ff88" strokeWidth="2" />
            <rect x="-20" y="-38" width="40" height="76" rx="3" fill="#020a17" stroke="#004466" strokeWidth="1" />
            <rect x="-14" y="-28" width="28" height="28" fill="#061b36" stroke="#00ff88" strokeWidth="1" />
            <circle cx="0" cy="-14" r="7" fill="none" stroke="#00f3ff" strokeWidth="1.5" />
            <line x1="-12" y1="12" x2="12" y2="12" stroke="#00ff88" strokeWidth="1.5" />
            <line x1="-12" y1="20" x2="4" y2="20" stroke="#00f3ff" strokeWidth="1" />
            <circle cx="0" cy="32" r="3" fill="#00f3ff" />
          </g>
        </svg>
      </div>

      {isActive && (
        <LabSlideModal topic="cloud-network" accentColor="#00ff88" />
      )}
    </section>
  );
}