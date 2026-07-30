"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    // CRITICAL FIX: Connect Lenis scroll events to GSAP ScrollTrigger
    // Without this, Lenis and GSAP fight for scroll control, causing
    // elements to appear "stuck" during scroll
    lenis.on("scroll", ScrollTrigger.update);

    // CRITICAL FIX: Use GSAP's ticker to drive Lenis instead of
    // a separate requestAnimationFrame loop. This ensures both
    // systems are synchronized on the same animation frame.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's built-in lag smoothing to prevent jank
    // when combined with Lenis smooth scroll
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return <>{children}</>;
}
