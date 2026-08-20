"use client";

import { useEffect, useRef, useState } from "react";

type AudioRig = {
  ctx: AudioContext;
  stream: MediaStream;
  analyser: AnalyserNode;
};

export default function VoiceOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<AudioRig | null>(null);
  const levelRef = useRef(0);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      ctx.createMediaStreamSource(stream).connect(analyser);
      audioRef.current = { ctx, stream, analyser };
      setError(null);
      setListening(true);
    } catch {
      setError("Mic access denied — orb idle mode.");
    }
  };

  const stop = () => {
    const a = audioRef.current;
    if (a) {
      a.stream.getTracks().forEach((t) => t.stop());
      a.ctx.close();
      audioRef.current = null;
    }
    setListening(false);
  };

  useEffect(() => {
    return () => {
      const a = audioRef.current;
      if (a) {
        a.stream.getTracks().forEach((t) => t.stop());
        a.ctx.close();
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const data = new Uint8Array(128);
    let raf = 0;
    let t = 0;
    let ringAngle = 0;
    let lastRipple = 0;
    const ripples: { r: number; a: number }[] = [];
    const ORB_SPEED = [0.8, 1.0, 1.2, 0.9, 1.1];
    const ORB_OFFSET = [0, 1.257, 2.513, 3.77, 5.027];
    const waveArr = new Uint8Array(128);
    const specks: { x: number; y: number; r: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < 24; i++) {
      specks.push({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        r: 1 + Math.random(),
        vx: (Math.random() - 0.5) * 0.004,
        vy: (Math.random() - 0.5) * 0.004,
      });
    }

    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.016;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const audio = audioRef.current;
      if (audio) {
        audio.analyser.getByteFrequencyData(data);
        audio.analyser.getByteTimeDomainData(waveArr);
      } else {
        data.fill(0);
        waveArr.fill(128);
      }

      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      const target = sum / data.length / 255;
      levelRef.current += (target - levelRef.current) * 0.15;
      const level = levelRef.current;

      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w, h) * 0.24;
      const idle = reduced ? 0 : 0.05 * Math.sin(t * 2.2);

      // sonar ripples on loud peaks (600ms cooldown)
      if (!reduced && level > 0.45 && t - lastRipple > 0.6) {
        ripples.push({ r: base, a: 0.5 });
        lastRipple = t;
      }
      if (!reduced) {
        for (let i = ripples.length - 1; i >= 0; i--) {
          ripples[i].r += 2.2;
          ripples[i].a -= 0.012;
          if (ripples[i].a <= 0) {
            ripples.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(cx, cy, ripples[i].r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 212, 255, ${ripples[i].a})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // time-domain waveform ring
      ctx.beginPath();
      for (let j = 0; j <= 96; j++) {
        const a = (j / 96) * Math.PI * 2;
        const off = ((waveArr[j % 96] - 128) / 128) * base * 0.12;
        const rr = base * 1.15 + off;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(0, 212, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // rotating dashed energy ring
      if (!reduced) ringAngle += 0.005 + level * 0.05;
      ctx.beginPath();
      ctx.setLineDash([6, 10]);
      ctx.arc(cx, cy, base * 1.25, ringAngle, ringAngle + Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 212, 255, ${0.35 + level * 0.4})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);

      // radial frequency bars (48)
      if (!reduced) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(0, 212, 255, 0.5)";
        for (let i = 0; i < 48; i++) {
          const a = (i / 48) * Math.PI * 2;
          const bin = data[Math.floor((i / 48) * data.length * 0.7)] / 255;
          const r0 = base * 1.05;
          const r1 = r0 + bin * base * 0.35;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
          ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
          ctx.stroke();
        }
      }

      // orbiting particles (5)
      if (!reduced) {
        for (let i = 0; i < 5; i++) {
          const angle = t * (0.6 + level * 2) * ORB_SPEED[i] + ORB_OFFSET[i];
          const px = cx + Math.cos(angle) * base * 1.35;
          const py = cy + Math.sin(angle) * base * 1.35;
          ctx.beginPath();
          ctx.arc(px, py, 2 + level * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? "#00d4ff" : "#eaffff";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#00d4ff";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // lightning arcs on loud peaks
      if (!reduced && level > 0.5 && Math.random() < 0.2) {
        const arcs = 2 + Math.floor(Math.random() * 2);
        ctx.strokeStyle = "rgba(234, 255, 255, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00d4ff";
        for (let k = 0; k < arcs; k++) {
          const a0 = Math.random() * Math.PI * 2;
          ctx.beginPath();
          for (let s = 0; s <= 4; s++) {
            const f = s / 4;
            const ang = a0 + (Math.random() - 0.5) * 0.25;
            const rr = base * (0.9 + 0.35 * f);
            const x = cx + Math.cos(ang) * rr;
            const y = cy + Math.sin(ang) * rr;
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }

      // reactive deformed circle (smooth organic blob)
      ctx.beginPath();
      const POINTS = 96;
      const bins: number[] = [];
      const binAt = (i: number) =>
        data[4 + Math.floor((i / POINTS) * (data.length * 0.6))] / 255;
      for (let i = 0; i < POINTS; i++) {
        bins.push(binAt(i));
      }
      for (let pass = 0; pass < 2; pass++) {
        const next = bins.map(
          (_, i) =>
            (bins[(i - 1 + POINTS) % POINTS] + 2 * bins[i] + bins[(i + 1) % POINTS]) / 4
        );
        for (let i = 0; i < POINTS; i++) bins[i] = next[i];
      }
      for (let i = 0; i <= POINTS; i++) {
        const a = (i / POINTS) * Math.PI * 2;
        const idx = i % POINTS; // seam fix: closure point reuses bin 0
        const sm =
          (bins[(idx - 1 + POINTS) % POINTS] + 2 * bins[idx] + bins[(idx + 1) % POINTS]) / 4;
        const wobble = reduced ? 0 : 0.04 * Math.sin(a * 3 + t * 1.5) * (0.3 + level);
        const r = base * (1 + idle + level * 0.45 + sm * 0.3 + wobble);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      const gradStroke = ctx.createLinearGradient(cx - base, cy - base, cx + base, cy + base);
      gradStroke.addColorStop(0, "#00d4ff");
      gradStroke.addColorStop(1, level > 0.5 ? "#eaffff" : "#7c4dff");
      ctx.strokeStyle = gradStroke;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12 + level * 35;
      ctx.shadowColor = "#00d4ff";
      ctx.stroke();

      // double-pass bloom (same path)
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 4;
      ctx.shadowBlur = 40;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // inner core glow
      const coreR = base * (0.75 + level * 0.6);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      grad.addColorStop(0, `rgba(0, 212, 255, ${0.3 + level * 0.55})`);
      grad.addColorStop(1, "rgba(0, 212, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      // glass highlight (3D sphere feel)
      ctx.beginPath();
      ctx.arc(cx - base * 0.25, cy - base * 0.35, base * 0.55, -2.6, -1.2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.22 + level * 0.2})`;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#ffffff";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // inner floating particles (24 specks)
      for (let i = 0; i < specks.length; i++) {
        const s = specks[i];
        if (!reduced) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x * s.x + s.y * s.y > 1) {
            s.vx *= -1;
            s.vy *= -1;
          }
        }
        ctx.beginPath();
        ctx.arc(cx + s.x * base * 0.8, cy + s.y * base * 0.8, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${0.3 + level * 0.4})`;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="voice-orb">
      <div className="voice-orb-stage">
        <canvas ref={canvasRef} className="voice-orb-canvas" aria-label="AI voice orb" />
      </div>
      <button
        type="button"
        className="voice-orb-btn"
        onClick={listening ? stop : start}
        aria-pressed={listening}
      >
        {listening ? "● STOP" : "○ START VOICE"}
      </button>
      {error && <p className="voice-orb-error">{error}</p>}
    </div>
  );
}