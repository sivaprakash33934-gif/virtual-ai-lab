"use client";

export interface ProgressHandle {
  value: number;
  // Real readiness signal: page resources have finished loading
  // (window "load" fired). Drives the spin→run recovery and exit.
  ready: boolean;
}

// Shared, stable progress store (0 → 1) driving the loader scene without
// re-rendering the 3D tree on every frame.
export const progressStore: ProgressHandle = { value: 0, ready: false };
