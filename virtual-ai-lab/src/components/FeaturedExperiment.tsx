"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

export default function FeaturedExperiment() {
  const [isActive, setIsActive] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleTryExperiment = () => {
    setIsActive(true);
    setProcessing(true);
    setTimeout(() => setProcessing(false), 3000);
  };

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass text-green-400 text-sm font-medium mb-6">
            Featured Experiment
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Try </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              AI in Action
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See how computer vision understands the world. Upload an image and watch AI process it in real-time.
          </p>
        </AnimatedSection>

        {/* Experiment Card */}
        <AnimatedSection>
          <div className="glass rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Description */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI Vision Experiment
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Our computer vision system can identify objects, faces, text, and more
                  in real-time. Watch as AI analyzes visual data and extracts meaningful
                  information.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Real-time object detection",
                    "Face recognition analysis",
                    "Text extraction (OCR)",
                    "Scene understanding",
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-400"
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
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={handleTryExperiment}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-full hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] transition-all duration-300"
                >
                  Try Experiment →
                </motion.button>
              </div>

              {/* Right: Visualization */}
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-dark-gray to-[#0a0a0f] border border-white/10 overflow-hidden relative">
                  {/* Grid Background */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Processing Animation */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        {processing ? (
                          <div className="text-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full mx-auto mb-4"
                            />
                            <p className="text-cyan-400 font-medium">
                              Processing...
                            </p>
                          </div>
                        ) : (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-center p-6"
                          >
                            {/* Detection Boxes */}
                            <div className="relative w-full h-full min-h-[200px]">
                              {[
                                {
                                  label: "Person",
                                  confidence: "98%",
                                  top: "20%",
                                  left: "15%",
                                  w: "30%",
                                  h: "60%",
                                },
                                {
                                  label: "Laptop",
                                  confidence: "95%",
                                  top: "40%",
                                  left: "55%",
                                  w: "35%",
                                  h: "30%",
                                },
                                {
                                  label: "Coffee",
                                  confidence: "92%",
                                  top: "15%",
                                  left: "70%",
                                  w: "20%",
                                  h: "25%",
                                },
                              ].map((item, i) => (
                                <motion.div
                                  key={item.label}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.3 }}
                                  className="absolute border-2 border-green-400 rounded-lg"
                                  style={{
                                    top: item.top,
                                    left: item.left,
                                    width: item.w,
                                    height: item.h,
                                  }}
                                >
                                  <div className="absolute -top-6 left-0 bg-green-400 text-black text-xs px-2 py-0.5 rounded font-medium">
                                    {item.label} {item.confidence}
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1 }}
                              className="mt-4 text-green-400 font-bold"
                            >
                              Analysis Complete!
                            </motion.div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Idle State */}
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-12 h-12 text-cyan-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-400">Click &quot;Try Experiment&quot; to start</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
