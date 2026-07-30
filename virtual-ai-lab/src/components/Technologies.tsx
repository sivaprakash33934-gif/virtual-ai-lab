"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { technologies } from "@/lib/data";

export default function Technologies() {
  return (
    <section id="technologies" className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full glass text-cyan-400 text-sm font-medium mb-6">
            Technologies
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Explore the </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Dive into our suite of advanced AI technologies powering the future of innovation.
          </p>
        </AnimatedSection>

        {/* Technology Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              <div className="glass rounded-2xl p-8 h-full hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden">
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 transition-all duration-500" />

                {/* Icon */}
                <div className="text-5xl mb-6 relative z-10">{tech.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">
                  {tech.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-6 relative z-10 leading-relaxed">
                  {tech.description}
                </p>

                {/* Stat */}
                <div className="flex items-center gap-3 relative z-10">
                  <div className="text-2xl font-bold text-cyan-400">{tech.stat}</div>
                  <div className="text-sm text-gray-500">{tech.statLabel}</div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
