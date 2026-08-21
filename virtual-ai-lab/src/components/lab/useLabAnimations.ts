"use client";

import { useEffect, useRef, useState } from "react";

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  depth: number;
}

export interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export function useParticleAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  particleCount: number = 60,
  options: {
    speed?: number;
    connectionDistance?: number;
    baseColor?: string;
    pointer?: { x: number; y: number };
  } = {}
) {
  const {
    speed = 0.2,
    connectionDistance = 120,
    baseColor = "rgba(0,200,255",
    pointer = { x: 0, y: 0 },
  } = options;

  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: Math.random() * 1.5 + 0.5,
      depth: Math.random(),
    }));

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = pointer.x * canvas.width + canvas.width / 2;
      const my = pointer.y * canvas.height + canvas.height / 2;

      for (const p of particlesRef.current) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += dx * 0.00003;
          p.vy += dy * 0.00003;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor},${0.1 + p.depth * 0.25})`;
        ctx.fill();
      }

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.strokeStyle = `${baseColor},${0.03 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, particleCount, speed, connectionDistance, baseColor, pointer.x, pointer.y]);
}

export function useSparkAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  options: {
    spawnRate?: number;
    baseSpeed?: number;
    color?: string;
  } = {}
) {
  const { spawnRate = 0.15, baseSpeed = 2, color = "rgba(0,245,255" } = options;
  const animFrameRef = useRef<number>(0);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < spawnRate) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + baseSpeed;
        sparksRef.current.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 100,
          y: canvas.height / 2 + (Math.random() - 0.5) * 100,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 20 + Math.random() * 30,
        });
      }

      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.life++;
        const alpha = 1 - s.life / s.maxLife;
        if (alpha <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `${color},${alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
        ctx.strokeStyle = `${color},${alpha * 0.4})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, spawnRate, baseSpeed, color]);
}

export function useHexValues(initialValues: string[], intervalMs: number = 1800) {
  const [hexVals, setHexVals] = useState(initialValues);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHexVals(
        Array.from({ length: initialValues.length }, () =>
          "0x" + Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0")
        )
      );
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [initialValues.length, intervalMs]);

  return hexVals;
}

export function useElapsedTime() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return elapsed;
}

export function useTerminalLines(lines: string[], intervalMs: number = 400) {
  const [termLines, setTermLines] = useState<string[]>([]);

  useEffect(() => {
    let idx = 0;
    const id = window.setInterval(() => {
      if (idx < lines.length) {
        setTermLines((prev) => [...prev, lines[idx]]);
        idx++;
      } else {
        clearInterval(id);
      }
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [lines, intervalMs]);

  return termLines;
}

export function useClock() {
  const [clock, setClock] = useState("");

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

  return clock;
}

export function usePhaseTransitions(
  phases: { phase: string; delay: number }[],
  onComplete?: () => void
) {
  const [currentPhase, setCurrentPhase] = useState(phases[0]?.phase || "");

  useEffect(() => {
    const timeouts = phases.map((p, i) =>
      setTimeout(() => {
        setCurrentPhase(p.phase);
        if (i === phases.length - 1 && onComplete) {
          onComplete();
        }
      }, p.delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [phases, onComplete]);

  return currentPhase;
}
// ─── Hub Starfield (twinkling background stars) ─────────────────

export function useStarfield(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  count: number = 90
): void {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = (): void => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      r: Math.random() * 1.4 + 0.4,
      tw: Math.random() * Math.PI * 2,
      sp: 0.4 + Math.random() * 1.2,
    }));

    const drawStatic = (): void => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(160, 255, 210, 0.5)";
        ctx.fill();
      }
    };

    let raf = 0;
    let time = 0;
    let prev = performance.now();

    const draw = (now: number): void => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      time += dt;

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      for (const s of stars) {
        const alpha = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(time * s.sp + s.tw));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 255, 210, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    if (reduced) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, count]);
}

// ─── Mouse Parallax (ref-based, no re-renders) ──────────────────

export function useParallaxRef(
  strength: number = 14
): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = (): void => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;

      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (event: MouseEvent): void => {
      tx = (event.clientX / window.innerWidth - 0.5) * strength;
      ty = (event.clientY / window.innerHeight - 0.5) * strength;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}
