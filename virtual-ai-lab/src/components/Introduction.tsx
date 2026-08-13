"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import FuturisticIcon from "./icons/FuturisticIcon";
import { stats } from "@/lib/data";

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Introduction() {
  return (
    <section id="introduction" className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="section-tag-2 mb-6">About Us</span>
          <h2 className="title text-4xl md:text-[47px] mb-6">
            What is Virtual AI Lab?
          </h2>
          <p className="text-muted text-lg max-w-3xl mx-auto leading-relaxed">
            We are a cutting-edge AI research facility dedicated to pushing the
            boundaries of artificial intelligence. Our mission is to make
            advanced AI accessible to researchers, developers, and innovators
            worldwide.
          </p>
        </AnimatedSection>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <AnimatedSection variant="fadeInLeft">
            <div className="card-edge p-8 h-full hover:border-brand/30 transition-colors duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center mb-6">
                <FuturisticIcon name="lightning" className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-muted leading-relaxed">
                To accelerate AI innovation by providing a collaborative
                platform where researchers can experiment, learn, and build the
                next generation of intelligent systems.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection variant="fadeInRight">
            <div className="card-edge p-8 h-full hover:border-brand/30 transition-colors duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center mb-6">
                <FuturisticIcon name="eye" className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-muted leading-relaxed">
                A world where AI is not just a technology, but a collaborative
                partner in solving humanity&apos;s greatest challenges — from
                climate change to healthcare.
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* Stats */}
        <AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-edge p-6 text-center hover:border-brand/30 transition-colors duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-brand-light mb-2">
                  <CountUp
                    end={parseInt(stat.value.replace(/[^0-9]/g, ""))}
                    suffix={stat.value.replace(/[0-9]/g, "")}
                  />
                </div>
                <div className="text-muted text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
