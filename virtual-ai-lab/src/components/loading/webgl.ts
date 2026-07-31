export interface QualityTier {
  dpr: [number, number];
  bloom: boolean;
  particles: boolean;
  spin: boolean;
}

export function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return !!gl;
  } catch {
    return false;
  }
}

export function getQualityTier(): QualityTier {
  if (typeof window === "undefined") {
    return { dpr: [1, 2], bloom: true, particles: true, spin: true };
  }

  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isLowEnd =
    navigator.hardwareConcurrency <= 2 ||
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 2;

  if (prefersReducedMotion || isLowEnd) {
    return { dpr: [1, 1], bloom: false, particles: false, spin: false };
  }

  if (isMobile) {
    return { dpr: [1, 1.5], bloom: true, particles: true, spin: true };
  }

  return { dpr: [1, 2], bloom: true, particles: true, spin: true };
}
