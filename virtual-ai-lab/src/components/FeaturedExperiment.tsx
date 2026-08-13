"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import FuturisticIcon from "./icons/FuturisticIcon";

export default function FeaturedExperiment() {
  const [isActive, setIsActive] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleTryExperiment = () => {
    setIsActive(true);
    setProcessing(true);
    setTimeout(() => setProcessing(false), 3000);
  };

  return (
    <section className="relative z-0 py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="section-tag-2 mb-6">Featured Experiment</span>
          <h2 className="title text-4xl md:text-[47px] mb-6">
            Try AI in Action
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            See how computer vision understands the world. Upload an image and
            watch AI process it in real-time.
          </p>
        </AnimatedSection>

        {/* Experiment Card */}
        <AnimatedSection>
          <div className="card-edge p-8 md:p-12 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Description */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI Vision Experiment
                </h3>
                <p className="text-muted mb-6 leading-relaxed">
                  Our computer vision system can identify objects, faces, text,
                  and more in real-time. Watch as AI analyzes visual data and
                  extracts meaningful information.
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
                      <div className="check-icon-holder">
                          <FuturisticIcon name="check" className="w-4 h-4 text-white" />
                        </div>
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={handleTryExperiment}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  className="button-glow px-8 py-4"
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
                        "linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)",
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
                              className="w-20 h-20 border-4 border-brand/20 border-t-brand rounded-full mx-auto mb-4"
                            />
                            <p className="text-brand-light font-medium">
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
                                  className="absolute border-2 border-brand-light rounded-lg"
                                  style={{
                                    top: item.top,
                                    left: item.left,
                                    width: item.w,
                                    height: item.h,
                                  }}
                                >
                                  <div className="absolute -top-6 left-0 bg-brand-light text-black text-xs px-2 py-0.5 font-medium">
                                    {item.label} {item.confidence}
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1 }}
                              className="mt-4 text-brand-light font-bold"
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
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand/20 to-brand-dark/20 flex items-center justify-center mx-auto mb-4">
                          <FuturisticIcon
                            name="eye"
                            className="w-12 h-12 text-brand-light"
                          />
                        </div>
                        <p className="text-muted">
                          Click &quot;Try Experiment&quot; to start
                        </p>
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
