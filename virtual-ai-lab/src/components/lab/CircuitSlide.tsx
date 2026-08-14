"use client";

import { useEffect, useRef } from "react";
import ScrambleTitle from "./ScrambleTitle";
import LabSlideModal from "./LabSlideModal";
import "../lab/labSlides.css";

interface Pt {
  x: number;
  y: number;
}

interface Seg {
  p1: Pt;
  p2: Pt;
  dist: number;
}

interface Chip {
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  label: string;
}

interface SmdCap {
  x: number;
  y: number;
  angle: number;
}

export default function CircuitSlide({ isActive }: { isActive?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasEl = canvas;
    const canvasCtx = canvasEl.getContext("2d");
    if (!canvasCtx) return;
    const ctx = canvasCtx;

    let width: number;
    let height: number;
    let cx: number;
    let cy: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -1000, y: -1000 };

    class Trace {
      points: Pt[];
      type: string;
      length: number;
      segments: Seg[];

      constructor(points: Pt[], type: string = "normal") {
        this.points = points;
        this.type = type;
        this.length = 0;
        this.segments = [];
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          this.segments.push({ p1, p2, dist });
          this.length += dist;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }

        if (this.type === "bus") {
          ctx.strokeStyle = "rgba(0, 180, 255, 0.18)";
          ctx.lineWidth = 1.5;
        } else if (this.type === "power") {
          ctx.strokeStyle = "rgba(255, 170, 0, 0.2)";
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = "rgba(0, 240, 255, 0.1)";
          ctx.lineWidth = 1;
        }
        ctx.stroke();

        this.drawVia(this.points[0].x, this.points[0].y);
        this.drawVia(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
      }

      drawVia(x: number, y: number) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#020b16";
        ctx.strokeStyle = "#00f0ff";
        ctx.lineWidth = 0.8;
        ctx.fill();
        ctx.stroke();
      }

      getPoint(t: number): Pt {
        const targetDist = t * this.length;
        let accumulated = 0;
        for (const seg of this.segments) {
          if (accumulated + seg.dist >= targetDist) {
            const segT = (targetDist - accumulated) / seg.dist;
            return {
              x: seg.p1.x + (seg.p2.x - seg.p1.x) * segT,
              y: seg.p1.y + (seg.p2.y - seg.p1.y) * segT,
            };
          }
          accumulated += seg.dist;
        }
        return this.points[this.points.length - 1];
      }
    }

    class Pulse {
      trace: Trace;
      speed: number;
      color: string;
      progress: number;
      length: number;

      constructor(trace: Trace, speed: number, color: string) {
        this.trace = trace;
        this.speed = speed;
        this.color = color;
        this.progress = 0;
        this.length = 0.08 + Math.random() * 0.05;
      }

      update() {
        this.progress += this.speed / this.trace.length;
        return this.progress - this.length <= 1;
      }

      draw() {
        const headT = Math.min(1, this.progress);
        const tailT = Math.max(0, this.progress - this.length);
        const head = this.trace.getPoint(headT);
        const tail = this.trace.getPoint(tailT);

        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(head.x, head.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
    }

    let traces: Trace[] = [];
    let pulses: Pulse[] = [];
    let chips: Chip[] = [];
    let smdComponents: SmdCap[] = [];
    let tick = 0;

    function initMotherboard() {
      traces = [];
      pulses = [];
      chips = [];
      smdComponents = [];

      const cpu = { x: cx, y: cy - 20, w: 130, h: 130, type: "CPU", label: "CORE I9-X" };
      chips.push(cpu);

      chips.push({ x: cx - 220, y: cy - 20, w: 22, h: 260, type: "RAM", label: "DIMM_1" });
      chips.push({ x: cx - 255, y: cy - 20, w: 22, h: 260, type: "RAM", label: "DIMM_2" });
      chips.push({ x: cx - 420, y: cy - 140, w: 90, h: 60, type: "IC", label: "VRM-DIGI+" });
      chips.push({ x: cx - 440, y: cy + 80, w: 100, h: 70, type: "IC", label: "AUDIO_DAC" });

      chips.push({ x: cx + 240, y: cy + 70, w: 100, h: 90, type: "PCH", label: "Z790_CHIPSET" });
      chips.push({ x: cx + 380, y: cy - 120, w: 130, h: 35, type: "M2", label: "NVMe_GEN5" });
      chips.push({ x: cx + 400, y: cy + 130, w: 110, h: 45, type: "IC", label: "10G_LAN" });

      chips.push({ x: cx, y: cy + 220, w: 420, h: 20, type: "PCIE", label: "PCIe 5.0 x16 GRAPHICS" });

      for (let i = -100; i <= 100; i += 12) {
        const startX = cpu.x - cpu.w / 2;
        const startY = cpu.y + i * 0.5;
        const endX = cx - 210;
        const endY = cy + i;
        const midX = startX - 30;

        traces.push(
          new Trace([
            { x: startX, y: startY },
            { x: midX, y: startY },
            { x: midX - 25, y: endY },
            { x: endX, y: endY },
          ], "bus")
        );
      }

      for (let i = -40; i <= 40; i += 10) {
        const startX = cpu.x + cpu.w / 2;
        const startY = cpu.y + i;
        const endX = cx + 240 - 50;
        const endY = cy + 70 + i * 0.8;
        const midX = startX + 40;

        traces.push(
          new Trace([
            { x: startX, y: startY },
            { x: midX, y: startY },
            { x: midX + 30, y: endY },
            { x: endX, y: endY },
          ], "bus")
        );
      }

      for (let i = -160; i <= 160; i += 18) {
        const startX = cx + i * 0.3;
        const startY = cpu.y + cpu.h / 2;
        const endX = cx + i;
        const endY = cy + 210;
        const midY = startY + 40 + Math.abs(i) * 0.2;

        traces.push(
          new Trace([
            { x: startX, y: startY },
            { x: startX, y: midY },
            { x: endX, y: midY + Math.abs(endX - startX) },
            { x: endX, y: endY },
          ], "normal")
        );
      }

      for (let i = 0; i < 28; i++) {
        const isLeft = i % 2 === 0;
        const startX = isLeft ? cx - 420 : cx + 450;
        const startY = cy - 250 + i * 22;
        const endX = isLeft ? 40 : width - 40;
        const endY = startY + (isLeft ? 40 : -40);

        traces.push(
          new Trace([
            { x: startX, y: startY },
            { x: startX + (isLeft ? -50 : 50), y: startY },
            { x: startX + (isLeft ? -90 : 90), y: endY },
            { x: endX, y: endY },
          ], i % 4 === 0 ? "power" : "normal")
        );
      }

      for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
        const dist = 85 + Math.sin(a * 4) * 8;
        smdComponents.push({
          x: cpu.x + Math.cos(a) * dist,
          y: cpu.y + Math.sin(a) * dist,
          angle: a,
        });
      }
    }

    function drawPCBGrid() {
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.03)";
      const step = 20;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    function drawSMDCapacitors() {
      ctx.fillStyle = "#b38c4d";
      smdComponents.forEach((c) => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.angle);
        ctx.fillRect(-3, -2, 6, 4);
        ctx.fillStyle = "#00f0ff";
        ctx.fillRect(-4, -2, 1.5, 4);
        ctx.fillRect(2.5, -2, 1.5, 4);
        ctx.restore();
      });
    }

    function drawChips() {
      chips.forEach((c) => {
        ctx.save();
        ctx.translate(c.x, c.y);

        ctx.fillStyle = "#040914";
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);

        ctx.strokeStyle = c.type === "CPU" || c.type === "PCH" ? "#00f0ff" : "rgba(0, 240, 255, 0.4)";
        ctx.lineWidth = c.type === "CPU" ? 2 : 1;
        ctx.strokeRect(-c.w / 2, -c.h / 2, c.w, c.h);

        ctx.fillStyle = "#00f0ff";
        if (c.h > c.w) {
          for (let y = -c.h / 2 + 6; y <= c.h / 2 - 6; y += 8) {
            ctx.fillRect(-c.w / 2 - 3, y, 3, 2);
            ctx.fillRect(c.w / 2, y, 3, 2);
          }
        } else {
          for (let x = -c.w / 2 + 6; x <= c.w / 2 - 6; x += 8) {
            ctx.fillRect(x, -c.h / 2 - 3, 2, 3);
            ctx.fillRect(x, c.h / 2, 2, 3);
          }
        }

        if (c.type === "CPU") {
          ctx.fillStyle = "rgba(0, 240, 255, 0.05)";
          ctx.fillRect(-c.w / 3, -c.h / 3, (c.w / 3) * 2, (c.h / 3) * 2);

          ctx.beginPath();
          ctx.arc(0, 0, c.w * 0.65, tick * 0.015, tick * 0.015 + Math.PI * 1.4);
          ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, c.w * 0.75, -tick * 0.02, -tick * 0.02 + Math.PI * 0.9);
          ctx.strokeStyle = "rgba(255, 170, 0, 0.5)";
          ctx.setLineDash([4, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        if (c.type === "RAM") {
          ctx.fillStyle = "#08162b";
          for (let r = -c.h / 2 + 20; r < c.h / 2 - 20; r += 32) {
            ctx.fillRect(-c.w / 4, r, c.w / 2, 22);
            ctx.strokeStyle = "rgba(0, 240, 255, 0.3)";
            ctx.strokeRect(-c.w / 4, r, c.w / 2, 22);
          }
        }

        ctx.fillStyle = "#00f0ff";
        ctx.font = "9px Consolas";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(c.label, 0, 0);

        ctx.restore();
      });
    }

    function drawOscilloscope() {
      const ox = cx - 480;
      const oy = cy + 240;
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (let x = 0; x < 120; x++) {
        const y = Math.sin(x * 0.1 + tick * 0.08) * Math.cos(tick * 0.03) * 18;
        if (x === 0) ctx.moveTo(ox + x, oy + y);
        else ctx.lineTo(ox + x, oy + y);
      }
      ctx.stroke();

      ctx.font = "8px Consolas";
      ctx.fillStyle = "rgba(0, 240, 255, 0.6)";
      ctx.fillText("BUS CLK WAVEFORM", ox, oy - 25);
    }

    function drawFrame(withTrail: boolean) {
      if (withTrail) {
        ctx.fillStyle = "rgba(1, 4, 8, 0.22)";
        ctx.fillRect(0, 0, width, height);
      }

      drawPCBGrid();
      drawSMDCapacitors();
      traces.forEach((t) => t.draw());
      drawChips();
      drawOscilloscope();
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvasEl.width = width * dpr;
      canvasEl.height = height * dpr;
      ctx.scale(dpr, dpr);
      cx = width / 2;
      cy = height / 2;
      initMotherboard();
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    resize();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawFrame(false);
      return;
    }

    window.addEventListener("mousemove", onMouseMove);

    let raf = 0;
    const render = () => {
      tick++;

      ctx.fillStyle = "rgba(1, 4, 8, 0.22)";
      ctx.fillRect(0, 0, width, height);

      drawPCBGrid();
      drawSMDCapacitors();
      traces.forEach((t) => t.draw());

      if (pulses.length < 90 && Math.random() < 0.6) {
        const randomTrace = traces[Math.floor(Math.random() * traces.length)];
        const isAmber = Math.random() > 0.8;
        const pulseColor = isAmber ? "#ffaa00" : "#00ffff";
        const speed = isAmber ? 4 : 3 + Math.random() * 3;
        pulses.push(new Pulse(randomTrace, speed, pulseColor));
      }

      if (mouse.x > 0 && Math.random() < 0.3) {
        const nearest = traces[Math.floor(Math.random() * traces.length)];
        pulses.push(new Pulse(nearest, 6, "#ffffff"));
      }

      pulses = pulses.filter((p) => {
        const active = p.update();
        if (active) p.draw();
        return active;
      });

      drawChips();
      drawOscilloscope();

      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      resize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <section className="lab-slide" aria-label="AI Circuit" style={{ background: "#010408" }}>
      <canvas ref={canvasRef} className="lab-circuit-canvas" aria-hidden="true" />

      <div className="lab-circuit-hud" aria-hidden="true">
        <div className="lab-circuit-hud-panel">
          SYS::ARCH // QUANTUM DESKTOP SOC<br />
          BUS FREQ: 5.80 GHz [ACTIVE]<br />
          CHANNELS: QUAD DDR5 LOCKED
        </div>
        <div className="lab-circuit-hud-panel lab-circuit-hud-right">
          THERMAL: OPTIMAL 32°C<br />
          PCIe 5.0 x16: STREAMING<br />
          CORE INTEGRITY: 99.98%
        </div>
      </div>

      <div className="lab-slide-overlay">
        <ScrambleTitle text="AI" />
        <p className="lab-slide-subtitle">MiMo V2.5 · DeepSeek · OpenCode</p>
      </div>
      {isActive && (
        <LabSlideModal topic="ai" accentColor="#00c8ff" />
      )}
    </section>
  );
}