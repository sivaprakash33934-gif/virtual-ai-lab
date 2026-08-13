"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedSection from "./AnimatedSection";
import FuturisticIcon, { IconName } from "./icons/FuturisticIcon";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps: {
  number: string;
  title: string;
  description: string;
  icon: IconName;
  color: string;
}[] = [
  {
    number: "01",
    title: "Idea",
    description: "Every breakthrough starts with a spark. Define your AI challenge.",
    icon: "innovation",
    color: "#00d4ff",
  },
  {
    number: "02",
    title: "Research",
    description: "Dive deep into literature, datasets, and existing methodologies.",
    icon: "research",
    color: "#6fe7ff",
  },
  {
    number: "03",
    title: "Experiment",
    description: "Test hypotheses, train models, and iterate on your approach.",
    icon: "experiment",
    color: "#00d4ff",
  },
  {
    number: "04",
    title: "Build",
    description: "Transform your research into robust, production-ready solutions.",
    icon: "build",
    color: "#4dc9ff",
  },
  {
    number: "05",
    title: "Deploy",
    description: "Launch your AI innovation to the world and make an impact.",
    icon: "future",
    color: "#6fe7ff",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !progressRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(progressRef.current, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="section-tag-2 mb-6">Process</span>
          <h2 className="title text-4xl md:text-[47px] mb-6">
            From Idea to Innovation
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Our streamlined process takes you from concept to deployment.
          </p>
        </AnimatedSection>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              ref={progressRef}
              className="h-full rounded-full bg-gradient-to-r from-brand via-brand-light to-brand-dark"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Number */}
              <div className="relative flex-shrink-0">
                {/* FIX: Added relative positioning on the step number container
                    so the numbered circle stays within its flex item during scroll.
                    Without this, the circle can escape to the viewport origin
                    when GSAP's pin-spacer manipulates page layout. */}
                <div
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold"
                  style={{
                    background: `${step.color}20`,
                    color: step.color,
                    boxShadow: `0 0 30px ${step.color}30`,
                  }}
                >
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <div
                className={`card-edge p-8 flex-1 ${
                  index % 2 === 1 ? "md:text-right" : ""
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <FuturisticIcon
                    name={step.icon}
                    className="w-8 h-8 text-brand-light"
                  />
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-muted text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector (hidden on last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
