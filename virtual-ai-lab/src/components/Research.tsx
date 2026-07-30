"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { researchAreas } from "@/lib/data";

export default function Research() {
  const [selectedYear, setSelectedYear] = useState(researchAreas[0].year);

  const selectedResearch = researchAreas.find(
    (area) => area.year === selectedYear
  );

  return (
    <section id="research" className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full glass text-purple-400 text-sm font-medium mb-6">
            Research
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Discover </span>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              What&apos;s Next
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our research roadmap spans from current innovations to the future of artificial intelligence.
          </p>
        </AnimatedSection>

        {/* Timeline */}
        <AnimatedSection>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-green-500 rounded-full -translate-y-1/2 hidden md:block" />

            {/* Timeline Items */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 relative">
              {researchAreas.map((area, index) => (
                <motion.button
                  key={area.year}
                  onClick={() => setSelectedYear(area.year)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className={`relative z-10 flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                    selectedYear === area.year
                      ? "glass border-cyan-500/50"
                      : "hover:bg-white/5"
                  }`}
                >
                  {/* Year Badge */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      selectedYear === area.year
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_30px_rgba(0,240,255,0.5)]"
                        : area.year === "2030+"
                        ? "bg-gradient-to-r from-green-500 to-cyan-500 text-white"
                        : "glass text-gray-300"
                    }`}
                  >
                    {area.year === "2030+" ? "🚀" : area.year.slice(-2)}
                  </div>

                  {/* Year Label */}
                  <span
                    className={`font-semibold transition-colors duration-300 ${
                      selectedYear === area.year
                        ? "text-cyan-400"
                        : "text-gray-400"
                    }`}
                  >
                    {area.year}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Content Panel */}
        <div className="mt-16">
          <AnimatePresence mode="wait">
            {selectedResearch && (
              <motion.div
                key={selectedResearch.year}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="glass rounded-3xl p-8 md:p-12 max-w-3xl mx-auto"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">
                      {selectedResearch.year === "2030+" ? "🚀" : "🔬"}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-cyan-400 font-medium mb-2">
                      {selectedResearch.year}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {selectedResearch.title}
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      {selectedResearch.description}
                    </p>

                    {selectedResearch.year === "2030+" && (
                      <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <p className="text-green-400 font-medium">
                          ✨ Join us in shaping the future of AI. The possibilities are limitless.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
