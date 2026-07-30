"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedSection from "./AnimatedSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    number: "01",
    title: "Idea",
    description: "Every breakthrough starts with a spark. Define your AI challenge.",
    icon: "💡",
    color: "#00f0ff",
  },
  {
    number: "02",
    title: "Research",
    description: "Dive deep into literature, datasets, and existing methodologies.",
    icon: "📚",
    color: "#a855f7",
  },
  {
    number: "03",
    title: "Experiment",
    description: "Test hypotheses, train models, and iterate on your approach.",
    icon: "🧪",
    color: "#00ff88",
  },
  {
    number: "04",
    title: "Build",
    description: "Transform your research into robust, production-ready solutions.",
    icon: "🔧",
    color: "#ffd93d",
  },
  {
    number: "05",
    title: "Deploy",
    description: "Launch your AI innovation to the world and make an impact.",
    icon: "🚀",
    color: "#ff6b6b",
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full glass text-cyan-400 text-sm font-medium mb-6">
            Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">From Idea to </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Innovation
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our streamlined process takes you from concept to deployment.
          </p>
        </AnimatedSection>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              ref={progressRef}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500"
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
              className={`flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Number */}
              <div className="flex-shrink-0">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold"
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
                className={`glass rounded-2xl p-8 flex-1 ${
                  index % 2 === 1 ? "md:text-right" : ""
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{step.icon}</span>
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">
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
