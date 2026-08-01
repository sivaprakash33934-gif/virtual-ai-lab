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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="section-tag-2 mb-6">Research</span>
          <h2 className="title text-4xl md:text-[47px] mb-6">
            Discover What&apos;s Next
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Our research roadmap spans from current innovations to the future
            of artificial intelligence.
          </p>
        </AnimatedSection>

        {/* Timeline */}
        <AnimatedSection>
          {/* FIX: Added explicit position: relative on the timeline wrapper
              so that the absolute-positioned line and the year badge buttons
              are properly contained within this element. Without this, when
              GSAP's pin-spacer manipulates the page layout, these elements
              can escape their container and appear stuck at the viewport origin. */}
          <div className="relative z-10">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-brand-dark via-brand to-brand-light rounded-full -translate-y-1/2 hidden md:block" />

            {/* Timeline Items */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 relative z-10">
              {researchAreas.map((area, index) => (
                <motion.button
                  key={area.year}
                  onClick={() => setSelectedYear(area.year)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className={`relative z-20 flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                    selectedYear === area.year
                      ? "glass border-brand/50"
                      : "hover:bg-white/5"
                  }`}
                >
                  {/* Year Badge */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      selectedYear === area.year
                        ? "bg-gradient-to-br from-brand to-brand-dark text-white shadow-[0_0_30px_rgba(246,111,20,0.5)]"
                        : area.year === "2030+"
                        ? "bg-gradient-to-br from-brand-light to-brand text-white"
                        : "glass text-gray-300"
                    }`}
                  >
                    {area.year === "2030+" ? "🚀" : area.year.slice(-2)}
                  </div>

                  {/* Year Label */}
                  <span
                    className={`font-semibold transition-colors duration-300 ${
                      selectedYear === area.year
                        ? "text-brand-light"
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
        <div className="relative z-10 mt-16">
          <AnimatePresence mode="wait">
            {selectedResearch && (
              <motion.div
                key={selectedResearch.year}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="card-edge p-8 md:p-12 max-w-3xl mx-auto"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">
                      {selectedResearch.year === "2030+" ? "🚀" : "🔬"}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-brand-light font-medium mb-2">
                      {selectedResearch.year}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {selectedResearch.title}
                    </h3>
                    <p className="text-muted text-lg leading-relaxed">
                      {selectedResearch.description}
                    </p>

                    {selectedResearch.year === "2030+" && (
                      <div className="mt-6 p-4 bg-brand/10 border border-brand/20">
                        <p className="text-brand-light font-medium">
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
