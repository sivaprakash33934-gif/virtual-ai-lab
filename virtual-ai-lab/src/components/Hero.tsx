"use client";

import { motion } from "framer-motion";
import { fadeInUp, fadeInLeft, staggerContainer } from "@/lib/animations";
import BlackHole from "@/components/BlackHole";
import FuturisticIcon from "@/components/icons/FuturisticIcon";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background: light beams */}
      <div className="absolute inset-0">
        <div className="light-beam left-[15%] hidden md:block" />
        <div className="light-beam left-1/2 -translate-x-1/2 h-3/4" />
        <div className="light-beam right-[15%] hidden md:block" />
      </div>

      {/* Black hole particle swarm focal point */}
      <BlackHole />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-8 flex justify-center">
            <span className="ease-badge">
              <span className="whats-new">Now</span>
              <span>Exploring AI Frontiers</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="title text-[52px] md:text-[65px] lg:text-[80px] mb-8 leading-[1.1]"
          >
            Virtual AI Lab
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted mb-12 max-w-xl mx-auto leading-relaxed"
          >
            Explore. Experiment. Innovate.
            <br />
            Enter the future of artificial intelligence research.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="/lab" className="button-glow text-lg px-8 py-4">
              Enter Lab
            </a>
            <a
              href="#introduction"
              className="button-simple text-lg px-8 py-4"
            >
              Read More
              <FuturisticIcon name="arrow-right" className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={fadeInLeft}
            className="mt-20 flex flex-col items-center gap-2 text-muted"
          >
            <span className="text-sm">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-brand/60 flex items-start justify-center p-1"
            >
              <div className="w-1.5 h-3 rounded-full bg-brand" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
