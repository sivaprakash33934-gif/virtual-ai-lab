"use client";

import { useEffect, useRef } from "react";
import ScrambleTitle from "./ScrambleTitle";
import LabSlideModal from "./LabSlideModal";
import "../lab/labSlides.css";

interface DtParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
}

function initParticle(width: number, height: number): DtParticle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.5 + 0.5,
    speedY: Math.random() * 1 + 0.2,
    speedX: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.7 + 0.3,
  };
}

export default function DevToolsSlide({ isActive }: { isActive?: boolean }) {
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = particlesCanvasRef.current;
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

    const particlesArray: DtParticle[] = Array.from({ length: 75 }, () => initParticle(w, h));

    const drawParticle = (p: DtParticle) => {
      ctx.fillStyle = `rgba(0, 243, 255, ${p.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00f3ff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawStatic = () => {
      particlesArray.forEach(drawParticle);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawStatic();
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0;
    const animateParticles = () => {
      ctx.clearRect(0, 0, w, h);
      particlesArray.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < 0) Object.assign(p, initParticle(w, h), { y: h });
        drawParticle(p);
      });
      raf = requestAnimationFrame(animateParticles);
    };
    animateParticles();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 45;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
      scene.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="lab-slide" aria-label="Dev Tools" style={{ background: "#030a16", perspective: 1200 }}>
      <canvas ref={particlesCanvasRef} className="lab-dt-particles-canvas" aria-hidden="true" />
      <div className="lab-dt-grid-floor" aria-hidden="true" />

      <div className="lab-dt-scene" ref={sceneRef}>
        <div className="lab-dt-pedestal-light" aria-hidden="true" />

        <div className="lab-dt-glass-card lab-dt-left-screen">
          <div className="lab-dt-screen-header">
            <span>Task Manager</span>
            <span>• Active</span>
          </div>
          <div className="lab-dt-data-row"><span>Sync AI Engine</span><span>[98%]</span></div>
          <div className="lab-dt-progress-bar"><div className="lab-dt-progress-fill" style={{ width: "98%" }} /></div>
          <div className="lab-dt-data-row" style={{ marginTop: 15 }}><span>Memory Allocation</span><span>[64%]</span></div>
          <div className="lab-dt-progress-bar"><div className="lab-dt-progress-fill" style={{ width: "64%" }} /></div>
          <div className="lab-dt-data-row" style={{ marginTop: 15 }}><span>Network Buffer</span><span>[82%]</span></div>
          <div className="lab-dt-progress-bar"><div className="lab-dt-progress-fill" style={{ width: "82%" }} /></div>
        </div>

        <div className="lab-dt-glass-card lab-dt-central-screen">
          <div className="lab-dt-screen-header">
            <span>AI Productivity Momentum</span>
            <span>SYS_CORE // 01</span>
          </div>
          <div className="lab-dt-hud-circle" aria-hidden="true" />
          <div className="lab-dt-hud-label">DATA FLOW: OPTIMAL</div>
          <div className="lab-dt-data-row">
            <span>Task Queue Processing:</span>
            <span className="lab-dt-strong">4,281 req/s</span>
          </div>
          <div className="lab-dt-data-row">
            <span>Neural Synthesis:</span>
            <span className="lab-dt-strong">ONLINE</span>
          </div>
          <div className="lab-dt-progress-bar" style={{ marginTop: 10 }}>
            <div className="lab-dt-progress-fill" />
          </div>
        </div>

        <div className="lab-dt-glass-card lab-dt-right-screen">
          <div className="lab-dt-screen-header">
            <span>Security Matrix</span>
            <span>Secure</span>
          </div>
          <div className="lab-dt-data-row"><span>Protocol:</span><span>TLS 1.3 // AI</span></div>
          <div className="lab-dt-data-row"><span>Node ID:</span><span>0x8F9...B2</span></div>
          <div className="lab-dt-data-row"><span>Bandwidth:</span><span>10.4 GB/s</span></div>
          <div className="lab-dt-data-row"><span>Latency:</span><span>0.4ms</span></div>
        </div>
      </div>

      <div className="lab-slide-heading">
        <ScrambleTitle text="DEV TOOLS" />
      </div>
      {isActive && (
        <LabSlideModal topic="dev-tools" accentColor="#a78bfa" />
      )}
    </section>
  );
}