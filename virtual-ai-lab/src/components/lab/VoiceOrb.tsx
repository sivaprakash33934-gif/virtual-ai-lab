"use client";

import { useEffect, useRef, useState } from "react";
import type { JSX, MouseEvent } from "react";

// ─── Type Definitions ────────────────────────────────────────────

export interface VoiceOrbProps {
  /** External volume override (0–100). Drives visuals directly. */
  volume?: number;
  /** External Web Audio AnalyserNode for live frequency data. */
  analyserNode?: AnalyserNode;
  /** External MediaStream (mic / audio element). Component wraps it in its own AnalyserNode. */
  mediaStream?: MediaStream;
}

interface AudioRig {
  ctx: AudioContext;
  stream: MediaStream;
  analyser: AnalyserNode;
}

type RingColorToken = "brand" | "brandLight" | "labTeal" | "white";

interface OrbitalRingConfig {
  radiusMultiplier: number;
  tilt: number;
  baseSpeed: number;
  direction: 1 | -1;
  dashPattern: number[];
  lineWidth: number;
  colorToken: RingColorToken;
  alpha: number;
  dotOffset: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  hue: number;
  active: boolean;
}

interface Ripple {
  radius: number;
  alpha: number;
}

interface Shockwave {
  radius: number;
  alpha: number;
  width: number;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

// ─── Constants ───────────────────────────────────────────────────

const FFT_SIZE = 256;
const HALF_FFT = FFT_SIZE / 2;
const BLOB_POINTS = 96;
const PARTICLE_POOL_SIZE = 30;
const RIPPLE_COOLDOWN_S = 0.6;
const RIPPLE_LEVEL_TRIGGER = 0.45;
const BURST_LEVEL_TRIGGER = 0.5;
const BURST_COOLDOWN_S = 0.2;
const IDLE_SPAWN_INTERVAL_S = 0.8;
const LEVEL_SMOOTHING = 0.15;
const NOISE_FLOOR = 10;

/** Ultra Mode: rings spin dramatically faster on loud audio. */
const RING_SPEED_BOOST = 52;
/** Angular velocity scale for satellite dots. */
const DOT_SPEED_SCALE = 6;
/** Hard cap (rad/frame) to keep dots stable at extreme volume. */
const DOT_OMEGA_CAP = 0.5;
const TRAIL_SEGMENTS = 16;
const TRAIL_STEP = 0.05;

const SHOCK_TRIGGER = 0.6;
const SHOCK_COOLDOWN_S = 0.35;
const PEAK_SHIFT_START = 0.55;
const PEAK_SHIFT_END = 0.85;

const FALLBACK_BRAND_RGB: RGBColor = { r: 0, g: 212, b: 255 };
const FALLBACK_BRAND_LIGHT_RGB: RGBColor = { r: 111, g: 231, b: 255 };
const FALLBACK_LAB_TEAL_RGB: RGBColor = { r: 0, g: 229, b: 199 };
const FALLBACK_LAB_PINK_RGB: RGBColor = { r: 255, g: 0, b: 212 };
const WHITE_GLOW_RGB: RGBColor = { r: 234, g: 255, b: 255 };

const ORBITAL_RINGS: OrbitalRingConfig[] = [
  {
    radiusMultiplier: 1.45,
    tilt: (70 * Math.PI) / 180,
    baseSpeed: 0.014,
    direction: 1,
    dashPattern: [6, 10],
    lineWidth: 1.5,
    colorToken: "brand",
    alpha: 0.55,
    dotOffset: 0,
  },
  {
    radiusMultiplier: 1.3,
    tilt: (45 * Math.PI) / 180,
    baseSpeed: 0.02,
    direction: -1,
    dashPattern: [],
    lineWidth: 1,
    colorToken: "labTeal",
    alpha: 0.45,
    dotOffset: 2.1,
  },
  {
    radiusMultiplier: 1.15,
    tilt: (25 * Math.PI) / 180,
    baseSpeed: 0.011,
    direction: 1,
    dashPattern: [2, 8],
    lineWidth: 1,
    colorToken: "brandLight",
    alpha: 0.4,
    dotOffset: 4.2,
  },
  {
    radiusMultiplier: 1.05,
    tilt: (60 * Math.PI) / 180,
    baseSpeed: 0.026,
    direction: -1,
    dashPattern: [],
    lineWidth: 0.8,
    colorToken: "white",
    alpha: 0.3,
    dotOffset: 1.0,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────

function createParticlePool(): Particle[] {
  const pool: Particle[] = [];
  for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
    pool.push({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      radius: 2,
      hue: 185,
      active: false,
    });
  }
  return pool;
}

function spawnParticle(
  pool: Particle[],
  cx: number,
  cy: number,
  surfaceRadius: number,
  speed: number
): void {
  const slot = pool.find((p) => !p.active);
  if (!slot) return;

  const angle = Math.random() * Math.PI * 2;
  const velocity = (1.5 + Math.random() * 3) * speed;

  slot.x = cx + Math.cos(angle) * surfaceRadius;
  slot.y = cy + Math.sin(angle) * surfaceRadius;
  slot.vx = Math.cos(angle) * velocity;
  slot.vy = Math.sin(angle) * velocity;
  slot.life = 1;
  slot.maxLife = 0.6 + Math.random() * 0.6;
  slot.radius = 1.5 + Math.random() * 2.5;
  slot.hue = 175 + Math.random() * 20;
  slot.active = true;
}

function findDominantFrequency(data: Uint8Array, sampleRate: number): number {
  let maxBin = 0;
  let maxVal = 0;

  for (let i = 1; i < data.length; i++) {
    if (data[i] > maxVal) {
      maxVal = data[i];
      maxBin = i;
    }
  }

  if (maxVal < NOISE_FLOOR) return 0;
  return Math.round(maxBin * (sampleRate / FFT_SIZE));
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerpRgb(a: RGBColor, b: RGBColor, t: number): RGBColor {
  const k = clamp01(t);
  return {
    r: Math.round(a.r + (b.r - a.r) * k),
    g: Math.round(a.g + (b.g - a.g) * k),
    b: Math.round(a.b + (b.b - a.b) * k),
  };
}

function normalizeHexValue(value: string): string {
  const trimmed = value.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(trimmed)) {
    return trimmed
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  return trimmed;
}

function parseHexColor(value: string, fallback: RGBColor): RGBColor {
  const normalized = normalizeHexValue(value);
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return fallback;

  const parsed = Number.parseInt(normalized, 16);
  if (Number.isNaN(parsed)) return fallback;

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function rgbaFromRgb(color: RGBColor, alpha: number): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${clamp01(alpha).toFixed(3)})`;
}

function readCssVar(name: string, fallback: string): string {
  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
}

// ─── Component ─────────────────────────────────────────────────

export default function VoiceOrb({
  volume,
  analyserNode,
  mediaStream,
}: VoiceOrbProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [listening, setListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<AudioRig | null>(null);
  const levelRef = useRef<number>(0);
  const externalAnalyserRef = useRef<AnalyserNode | null>(null);
  const volumeRef = useRef<number | undefined>(undefined);

  const hasExternalSource =
    volume !== undefined ||
    analyserNode !== undefined ||
    mediaStream !== undefined;

  /**
   * Canvas loop reads activation state via ref (no re-render cost).
   * Before START click → main circle stays perfectly constant.
   * After START click → orb reacts to live audio.
   */
  const activeRef = useRef<boolean>(listening || hasExternalSource);

  // Keep volume ref in sync with prop.
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Keep active ref in sync with listening / external source state.
  useEffect(() => {
    activeRef.current = listening || hasExternalSource;
  }, [listening, hasExternalSource]);

  // ── External MediaStream → wrap in AnalyserNode ─────────────
  useEffect(() => {
    if (!mediaStream) return;

    let audioCtx: AudioContext | null = null;
    let createdAnalyser: AnalyserNode | null = null;
    let sourceNode: MediaStreamAudioSourceNode | null = null;

    try {
      audioCtx = new AudioContext();
      createdAnalyser = audioCtx.createAnalyser();
      createdAnalyser.fftSize = FFT_SIZE;
      createdAnalyser.smoothingTimeConstant = 0.75;

      sourceNode = audioCtx.createMediaStreamSource(mediaStream);
      sourceNode.connect(createdAnalyser);

      externalAnalyserRef.current = createdAnalyser;
    } catch {
      setError("Failed to initialise audio from stream.");
      return;
    }

    return () => {
      if (sourceNode) {
        sourceNode.disconnect();
      }

      if (audioCtx) {
        try {
          audioCtx.close();
        } catch {
          /* already closed */
        }
      }

      if (externalAnalyserRef.current === createdAnalyser) {
        externalAnalyserRef.current = null;
      }
    };
  }, [mediaStream]);

  // ── External AnalyserNode ───────────────────────────────────
  useEffect(() => {
    if (analyserNode) {
      externalAnalyserRef.current = analyserNode;
    }

    return () => {
      if (externalAnalyserRef.current === analyserNode) {
        externalAnalyserRef.current = null;
      }
    };
  }, [analyserNode]);

  // ── Internal mic start ──────────────────────────────────────
  const start = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();

      await audioCtx.resume();

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.75;

      audioCtx.createMediaStreamSource(stream).connect(analyser);

      audioRef.current = { ctx: audioCtx, stream, analyser };

      setError(null);
      setListening(true);
    } catch {
      setError("Mic access denied — orb idle mode.");
    }
  };

  // ── Internal mic stop ───────────────────────────────────────
  const stop = (): void => {
    const rig = audioRef.current;
    if (!rig) return;

    rig.stream.getTracks().forEach((track) => track.stop());

    try {
      rig.ctx.close();
    } catch {
      /* already closed */
    }

    audioRef.current = null;
    setListening(false);
  };

  const handleToggle = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    if (listening) {
      stop();
      return;
    }

    void start();
  };

  // ── Cleanup internal audio on unmount ───────────────────────
  useEffect(() => {
    return () => {
      const rig = audioRef.current;
      if (!rig) return;

      rig.stream.getTracks().forEach((track) => track.stop());

      try {
        rig.ctx.close();
      } catch {
        /* already closed */
      }
    };
  }, []);

  // ────────────────────────────────────────────────────────────
  // Canvas animation loop — Ultra Mode
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const g = canvas.getContext("2d");
    if (!g) return;

    /* DPR & resize */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = (): void => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Theme colors from design tokens */
    const brandRgb = parseHexColor(
      readCssVar("--color-brand", "#00d4ff"),
      FALLBACK_BRAND_RGB
    );
    const brandLightRgb = parseHexColor(
      readCssVar("--color-brand-light", "#6fe7ff"),
      FALLBACK_BRAND_LIGHT_RGB
    );
    const labTealRgb = parseHexColor(
      readCssVar("--lab-teal", "#00e5c7"),
      FALLBACK_LAB_TEAL_RGB
    );
    const labPinkRgb = parseHexColor(
      readCssVar("--lab-pink", "#ff00d4"),
      FALLBACK_LAB_PINK_RGB
    );
    const whiteRgb = WHITE_GLOW_RGB;

    const getRgbForToken = (token: RingColorToken): RGBColor => {
      switch (token) {
        case "brand":
          return brandRgb;
        case "brandLight":
          return brandLightRgb;
        case "labTeal":
          return labTealRgb;
        case "white":
          return whiteRgb;
        default:
          return brandRgb;
      }
    };

    const ringBaseRgb: RGBColor[] = ORBITAL_RINGS.map((ring) =>
      getRgbForToken(ring.colorToken)
    );

    /* Buffers */
    const freqData = new Uint8Array(HALF_FFT);

    /* Mutable animation state */
    let raf = 0;
    let time = 0;
    let prev = performance.now();

    const dotAngles: number[] = ORBITAL_RINGS.map(() => 0);
    const dashOffsets: number[] = ORBITAL_RINGS.map(() => 0);
    const precessions: number[] = ORBITAL_RINGS.map(() => 0);

    let lastRipple = 0;
    let lastBurst = 0;
    let lastShock = 0;
    let lastIdleSpawn = 0;

    const ripples: Ripple[] = [];
    const shockwaves: Shockwave[] = [];
    const particles = createParticlePool();

    let rawHz = 0;
    let smoothHz = 0;

    // ── Per-frame draw ──────────────────────────────────────
    const draw = (now: number): void => {
      raf = requestAnimationFrame(draw);

      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      time += dt;

      const dtScale = dt * 60;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      g.clearRect(0, 0, w, h);

      const active = activeRef.current;

      // ── Audio data ingestion ────────────────────────────
      const activeAnalyser =
        audioRef.current?.analyser ?? externalAnalyserRef.current;

      let sampleRate = 44100;
      const vol = volumeRef.current;

      if (vol !== undefined) {
        const target = Math.max(0, Math.min(1, vol / 100));
        levelRef.current += (target - levelRef.current) * LEVEL_SMOOTHING;
        freqData.fill(Math.floor(target * 255));
        rawHz = 0;
      } else if (activeAnalyser) {
        activeAnalyser.getByteFrequencyData(freqData);
        sampleRate = activeAnalyser.context.sampleRate;

        let sum = 0;
        for (let i = 0; i < freqData.length; i++) {
          sum += freqData[i];
        }

        const target = sum / freqData.length / 255;
        levelRef.current += (target - levelRef.current) * LEVEL_SMOOTHING;
        rawHz = findDominantFrequency(freqData, sampleRate);
      } else {
        freqData.fill(0);
        levelRef.current *= 0.92;
        rawHz = 0;
      }

      smoothHz += (rawHz - smoothHz) * 0.1;

      /**
       * motionLevel is the only value allowed to move/scale the orb.
       * Before START / external source it is forced to zero,
       * keeping the main circle perfectly constant.
       */
      const motionLevel = active ? levelRef.current : 0;

      /** Ultra Mode color shift: cyan → lab pink on loud peaks. */
      const peakMix = smoothstep(PEAK_SHIFT_START, PEAK_SHIFT_END, motionLevel);
      const accentRgb = lerpRgb(brandRgb, labPinkRgb, peakMix);
      const accentSolid = rgbaFromRgb(accentRgb, 1);

      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w, h) * 0.24;

      // ─────────────────────────────────────────────────────
      // Layer 1 — Ambient halo
      // ─────────────────────────────────────────────────────
      const haloR = base * (1.8 + motionLevel * 1.2);
      const halo = g.createRadialGradient(cx, cy, 0, cx, cy, haloR);

      halo.addColorStop(0, rgbaFromRgb(accentRgb, 0.08 + motionLevel * 0.12));
      halo.addColorStop(0.5, rgbaFromRgb(accentRgb, 0.03 + motionLevel * 0.05));
      halo.addColorStop(1, rgbaFromRgb(accentRgb, 0));

      g.fillStyle = halo;
      g.beginPath();
      g.arc(cx, cy, haloR, 0, Math.PI * 2);
      g.fill();

      // ─────────────────────────────────────────────────────
      // Layer 2 — Sonar ripples
      // ─────────────────────────────────────────────────────
      if (
        active &&
        !reduced &&
        motionLevel > RIPPLE_LEVEL_TRIGGER &&
        time - lastRipple > RIPPLE_COOLDOWN_S
      ) {
        ripples.push({ radius: base, alpha: 0.5 });
        lastRipple = time;
      }

      if (!reduced) {
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rp = ripples[i];

          rp.radius += 2.2 * dtScale;
          rp.alpha -= 0.012 * dtScale;

          if (rp.alpha <= 0) {
            ripples.splice(i, 1);
            continue;
          }

          g.beginPath();
          g.arc(cx, cy, rp.radius, 0, Math.PI * 2);
          g.strokeStyle = rgbaFromRgb(accentRgb, rp.alpha);
          g.lineWidth = 1.5;
          g.stroke();
        }
      }

      // ─────────────────────────────────────────────────────
      // Layer 3 — Bass shockwaves (Ultra Mode)
      // ─────────────────────────────────────────────────────
      if (
        active &&
        !reduced &&
        motionLevel > SHOCK_TRIGGER &&
        time - lastShock > SHOCK_COOLDOWN_S
      ) {
        shockwaves.push({
          radius: base * 0.9,
          alpha: 0.8,
          width: 3 + motionLevel * 3,
        });
        lastShock = time;
      }

      if (!reduced) {
        for (let i = shockwaves.length - 1; i >= 0; i--) {
          const sw = shockwaves[i];

          sw.radius += 5 * dtScale;
          sw.alpha -= 0.03 * dtScale;

          if (sw.alpha <= 0) {
            shockwaves.splice(i, 1);
            continue;
          }

          g.beginPath();
          g.arc(cx, cy, sw.radius, 0, Math.PI * 2);
          g.strokeStyle = rgbaFromRgb(accentRgb, sw.alpha);
          g.lineWidth = sw.width;
          g.shadowBlur = 12;
          g.shadowColor = accentSolid;
          g.stroke();
          g.shadowBlur = 0;
        }
      }

      // ─────────────────────────────────────────────────────
      // Layers 4–7 — Orbital rings + satellite dots
      // Ultra Mode: dashes flow, dots race with comet trails,
      // rings precess and tilt dynamically with volume.
      // ─────────────────────────────────────────────────────
      for (let i = 0; i < ORBITAL_RINGS.length; i++) {
        const ring = ORBITAL_RINGS[i];

        const omega =
          Math.min(
            ring.baseSpeed * DOT_SPEED_SCALE * (1 + motionLevel * RING_SPEED_BOOST),
            DOT_OMEGA_CAP
          ) * ring.direction;

        if (!reduced) {
          dotAngles[i] += omega * dtScale;
          dashOffsets[i] += omega * dtScale * base * ring.radiusMultiplier;
          precessions[i] += omega * 0.06 * dtScale;
        }

        /* Dynamic 3D tilt — gyroscope feel on loud audio */
        const tiltDyn =
          ring.tilt +
          (reduced ? 0 : motionLevel * 0.22 * Math.sin(time * 0.7 + i * 1.9));

        const rx = base * ring.radiusMultiplier;
        const ry = Math.max(rx * 0.18, rx * Math.cos(tiltDyn));
        const rot = ring.tilt * 0.4 + precessions[i];

        const ringColor = lerpRgb(ringBaseRgb[i], labPinkRgb, peakMix * 0.5);

        g.beginPath();

        if (ring.dashPattern.length > 0) {
          g.setLineDash(ring.dashPattern);
          g.lineDashOffset = -dashOffsets[i];
        }

        g.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
        g.strokeStyle = rgbaFromRgb(ringColor, ring.alpha);
        g.lineWidth = ring.lineWidth;
        g.shadowBlur = 4 + motionLevel * 10;
        g.shadowColor = rgbaFromRgb(accentRgb, 0.4);
        g.stroke();
        g.shadowBlur = 0;

        if (ring.dashPattern.length > 0) {
          g.setLineDash([]);
          g.lineDashOffset = 0;
        }

        /* Satellite dot + comet trail (speed made visible) */
        if (!reduced) {
          const cosR = Math.cos(rot);
          const sinR = Math.sin(rot);

          for (let k = TRAIL_SEGMENTS; k >= 0; k--) {
            const theta =
              dotAngles[i] + ring.dotOffset - k * TRAIL_STEP * ring.direction;
            const px = Math.cos(theta) * rx;
            const py = Math.sin(theta) * ry;
            const X = cx + px * cosR - py * sinR;
            const Y = cy + px * sinR + py * cosR;

            const fade = 1 - k / (TRAIL_SEGMENTS + 1);

            if (k === 0) {
              /* Head dot */
              g.beginPath();
              g.arc(X, Y, 2.6 + motionLevel * 1.6, 0, Math.PI * 2);
              g.fillStyle = rgbaFromRgb(ringColor, 0.9);
              g.shadowBlur = 10 + motionLevel * 10;
              g.shadowColor = rgbaFromRgb(ringColor, 1);
              g.fill();
              g.shadowBlur = 0;
            } else {
              g.beginPath();
              g.arc(X, Y, Math.max(0.4, 2.2 * fade), 0, Math.PI * 2);
              g.fillStyle = rgbaFromRgb(ringColor, fade * 0.45);
              g.fill();
            }
          }
        }
      }

      // ─────────────────────────────────────────────────────
      // Layer 8 — Particle sparks
      // ─────────────────────────────────────────────────────
      if (active && !reduced) {
        /* Burst on volume peaks */
        if (
          motionLevel > BURST_LEVEL_TRIGGER &&
          time - lastBurst > BURST_COOLDOWN_S
        ) {
          const count = 4 + Math.floor(Math.random() * 5);
          for (let j = 0; j < count; j++) {
            spawnParticle(particles, cx, cy, base * 0.95, 1 + motionLevel * 2);
          }
          lastBurst = time;
        }

        /* Ambient drift only after activation */
        if (time - lastIdleSpawn > IDLE_SPAWN_INTERVAL_S) {
          spawnParticle(particles, cx, cy, base * 0.95, 0.3);
          lastIdleSpawn = time;
        }

        /* Update & draw */
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!p.active) continue;

          p.x += p.vx * dtScale;
          p.y += p.vy * dtScale;
          p.vx *= Math.pow(0.98, dtScale);
          p.vy *= Math.pow(0.98, dtScale);
          p.life -= dt / p.maxLife;

          if (p.life <= 0) {
            p.active = false;
            continue;
          }

          const alpha = p.life * 0.8;
          const pr = Math.max(0.5, p.radius * p.life);

          g.beginPath();
          g.arc(p.x, p.y, pr, 0, Math.PI * 2);
          g.fillStyle = `hsla(${Math.round(p.hue)}, 100%, 70%, ${alpha})`;
          g.shadowBlur = 6;
          g.shadowColor = `hsla(${Math.round(p.hue)}, 100%, 60%, 0.6)`;
          g.fill();
          g.shadowBlur = 0;
        }
      }

      // ─────────────────────────────────────────────────────
      // Layer 9 — Reactive blob shell
      // Before activation: perfectly constant circle.
      // ─────────────────────────────────────────────────────
      g.beginPath();

      const bins: number[] = [];

      for (let i = 0; i < BLOB_POINTS; i++) {
        const idx = 4 + Math.floor((i / BLOB_POINTS) * freqData.length * 0.6);
        bins.push(active ? freqData[idx] / 255 : 0);
      }

      /* 2-pass smoothing filter */
      for (let pass = 0; pass < 2; pass++) {
        const next = bins.map(
          (value: number, i: number) =>
            (bins[(i - 1 + BLOB_POINTS) % BLOB_POINTS] +
              2 * value +
              bins[(i + 1) % BLOB_POINTS]) /
            4
        );

        for (let i = 0; i < BLOB_POINTS; i++) {
          bins[i] = next[i];
        }
      }

      const wobbleStrength =
        active && !reduced ? 0.04 * Math.min(1, motionLevel * 1.75) : 0;

      for (let i = 0; i <= BLOB_POINTS; i++) {
        const angle = (i / BLOB_POINTS) * Math.PI * 2;
        const idx = i % BLOB_POINTS;

        const sm =
          (bins[(idx - 1 + BLOB_POINTS) % BLOB_POINTS] +
            2 * bins[idx] +
            bins[(idx + 1) % BLOB_POINTS]) /
          4;

        const wobble =
          active && !reduced
            ? wobbleStrength * Math.sin(angle * 3 + time * 1.5)
            : 0;

        const r = base * (1 + motionLevel * 0.45 + sm * 0.3 + wobble);

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) {
          g.moveTo(x, y);
        } else {
          g.lineTo(x, y);
        }
      }

      g.closePath();

      const blobGrad = g.createLinearGradient(
        cx - base,
        cy - base,
        cx + base,
        cy + base
      );

      blobGrad.addColorStop(0, accentSolid);
      blobGrad.addColorStop(
        1,
        motionLevel > 0.5 ? rgbaFromRgb(whiteRgb, 1) : rgbaFromRgb(labTealRgb, 1)
      );

      g.strokeStyle = blobGrad;
      g.lineWidth = 2;
      g.shadowBlur = 12 + motionLevel * 35;
      g.shadowColor = accentSolid;
      g.stroke();

      /* Bloom pass */
      g.globalAlpha = 0.15;
      g.lineWidth = 4;
      g.shadowBlur = 40;
      g.stroke();
      g.shadowBlur = 0;
      g.globalAlpha = 1;

      // ─────────────────────────────────────────────────────
      // Layer 10 — Inner core glow
      // ─────────────────────────────────────────────────────
      const coreR = base * (0.75 + motionLevel * 0.6);
      const coreGrad = g.createRadialGradient(cx, cy, 0, cx, cy, coreR);

      coreGrad.addColorStop(0, rgbaFromRgb(accentRgb, 0.35 + motionLevel * 0.55));
      coreGrad.addColorStop(0.4, rgbaFromRgb(labTealRgb, 0.15 + motionLevel * 0.3));
      coreGrad.addColorStop(1, rgbaFromRgb(accentRgb, 0));

      g.fillStyle = coreGrad;
      g.beginPath();
      g.arc(cx, cy, coreR, 0, Math.PI * 2);
      g.fill();

      // ─────────────────────────────────────────────────────
      // Layer 11 — Glass highlight arc
      // ─────────────────────────────────────────────────────
      g.beginPath();
      g.arc(cx - base * 0.25, cy - base * 0.35, base * 0.55, -2.6, -1.2);
      g.strokeStyle = rgbaFromRgb(whiteRgb, 0.22 + motionLevel * 0.2);
      g.lineWidth = 3;
      g.shadowBlur = 6;
      g.shadowColor = rgbaFromRgb(whiteRgb, 1);
      g.stroke();
      g.shadowBlur = 0;

      // ─────────────────────────────────────────────────────
      // Layer 12 — Center frequency display (glow pulse)
      // ─────────────────────────────────────────────────────
      const hasAnalyser =
        audioRef.current?.analyser !== undefined ||
        externalAnalyserRef.current !== null;

      let freqText: string;

      if (active && hasAnalyser && smoothHz > 10) {
        freqText = `${Math.round(smoothHz)} Hz`;
      } else if (active && vol !== undefined && vol > 1) {
        freqText = "● ACTIVE";
      } else if (active) {
        freqText = "LISTENING";
      } else {
        freqText = "IDLE";
      }

      const fontSize = Math.max(10, base * 0.16 * (1 + motionLevel * 0.12));

      g.font = `600 ${fontSize}px "Geist Mono", "Courier New", monospace`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.shadowBlur = 8 + motionLevel * 22;
      g.shadowColor = accentSolid;
      g.fillStyle = rgbaFromRgb(accentRgb, 0.6 + motionLevel * 0.4);
      g.fillText(freqText, cx, cy);

      /* Glow pass */
      g.shadowBlur = 16 + motionLevel * 20;
      g.globalAlpha = 0.3;
      g.fillText(freqText, cx, cy);
      g.globalAlpha = 1;
      g.shadowBlur = 0;
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- All changing values are accessed via stable refs.
  }, []);

  // ── JSX ─────────────────────────────────────────────────────
  return (
    <div
      className="voice-orb glass p-6 rounded-2xl flex flex-col items-center"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "450px",
        margin: "0 auto",
      }}
    >
      <div
        className="voice-orb-stage w-full aspect-square max-w-[400px] relative"
        style={{
          width: "100%",
          maxWidth: "400px",
          aspectRatio: "1 / 1",
          position: "relative",
          margin: "0 auto",
        }}
      >
        <canvas
          ref={canvasRef}
          className="voice-orb-canvas w-full h-full"
          aria-label="AI voice orb visualizer"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>

      {!hasExternalSource && (
        <button
          type="button"
          className="button-glow mt-6 px-8 py-3 rounded-lg border border-[rgba(0,212,255,0.4)] bg-[var(--lab-panel-bg)] text-[var(--color-brand)] font-medium tracking-[0.2em] text-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:border-[rgba(0,212,255,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]"
          onClick={handleToggle}
          aria-pressed={listening}
          style={{
            position: "static",
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            transform: "none",
            marginTop: "1.5rem",
            display: "inline-block",
          }}
        >
          {listening ? "● STOP" : "○ START VOICE"}
        </button>
      )}

      {error && (
        <p
          className="voice-orb-error mt-4 text-sm font-medium"
          style={{ color: "var(--color-danger)", marginTop: "1rem" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
