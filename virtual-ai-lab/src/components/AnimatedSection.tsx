"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn, staggerContainer } from "@/lib/animations";

type AnimationVariant = "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleIn" | "stagger";

interface AnimatedSectionProps {
  children: ReactNode;
  variant?: AnimationVariant;
  className?: string;
  delay?: number;
  threshold?: number;
}

const variantMap = {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  stagger: staggerContainer,
};

export default function AnimatedSection({
  children,
  variant = "fadeInUp",
  className = "",
  delay = 0,
  threshold = 0.1,
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const selectedVariant = variantMap[variant];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={selectedVariant}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
