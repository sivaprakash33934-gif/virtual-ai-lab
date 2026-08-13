export const loadingConfig = {
  minDisplayMs: 2500,
  failureTimeoutMs: 2000,
  runBeatMs: 1000,
  recoveryMs: 900,
  exitDuration: 800,
  exitFadeMs: 600,
} as const;

export const mascot3DConfig = {
  launchDuration: 0.25,
  spinDuration: 1.5,
  hangDuration: 0.7,
  fallDuration: 0.35,
  bounceDecay: 0.88,
  bounceFreq: 18,
  faceLerp: 0.15,
} as const;

export const blackHoleConfig = {
  scale: 90,
  spin: 3,
  accretion: 1,
  warp: 1.2,
  fullCount: 8000,
  lightCount: 3000,
  goldenAngle: 2.399963229728653,
} as const;

export const particleConfig = {
  ambientCount: 300,
  sparkCount: 10,
  sparkCycle: 0.7,
} as const;

export const treadmillConfig = {
  ledCount: 8,
  dangerTextPeriod: 1 / 3,
} as const;

export const floatingCodeConfig = {
  snippets: [
    "try { runWithoutBugs(); }",
    "catch (NiceTryException e) {}",
    "finally { run(); }",
    "const ai = new Model();",
    "await train(data);",
    "export default Main;",
  ],
} as const;

export const gymSetConfig = {
  bottleCount: 3,
} as const;

export const qualityTiers = {
  low: { dpr: [1, 1], bloom: false, particles: false, spin: false },
  mobile: { dpr: [1, 1.5], bloom: true, particles: true, spin: true },
  desktop: { dpr: [1, 2], bloom: true, particles: true, spin: true },
} as const;

export const reducedMotionTier = {
  dpr: [1, 1],
  bloom: false,
  particles: false,
  spin: false,
} as const;

export type LoadingConfig = typeof loadingConfig;
export type Mascot3DConfig = typeof mascot3DConfig;
export type BlackHoleConfig = typeof blackHoleConfig;
export type ParticleConfig = typeof particleConfig;
export type TreadmillConfig = typeof treadmillConfig;
export type QualityTier = typeof qualityTiers.desktop;