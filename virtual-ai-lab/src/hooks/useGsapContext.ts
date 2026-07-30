"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const useGsapContext = () => {
  const context = useRef<gsap.Context | null>(null);

  useEffect(() => {
    context.current = gsap.context(() => {});

    return () => {
      context.current?.revert();
    };
  }, []);

  return context.current;
};
