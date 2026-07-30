"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import AnimatedSection from "./AnimatedSection";

export default function CTA() {
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!portalRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(portalRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    }, portalRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="cta" className="relative py-32 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="relative">
            {/* Portal Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                ref={portalRef}
                className="w-[500px] h-[500px] rounded-full border-2 border-cyan-500/30 opacity-50"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent, #00f0ff, transparent, #a855f7, transparent)",
                }}
              />
              <div className="absolute w-[400px] h-[400px] rounded-full border border-purple-500/20" />
              <div className="absolute w-[300px] h-[300px] rounded-full border border-cyan-500/20" />
            </div>

            {/* Content */}
            <div className="relative glass rounded-3xl p-12 md:p-16 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-6xl mb-8">🚀</div>

                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="text-white">Build the Future with </span>
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 bg-clip-text text-transparent">
                    AI
                  </span>
                </h2>

                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                  Join thousands of researchers, developers, and innovators shaping
                  the next generation of artificial intelligence.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold rounded-full hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all duration-300 text-lg"
                  >
                    Join Now
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 glass text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 text-lg"
                  >
                    Explore Lab
                  </motion.a>
                </div>

                {/* Trust Badges */}
                <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Free to start
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Cancel anytime
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
