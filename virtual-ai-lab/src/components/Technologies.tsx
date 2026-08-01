"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { technologies } from "@/lib/data";

export default function Technologies() {
  return (
    <section id="technologies" className="relative py-32 px-4 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="section-tag-2 mb-6">Technologies</span>
          <h2 className="title text-4xl md:text-[47px] mb-6">
            Explore the Intelligence
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Dive into our suite of advanced AI technologies powering the future
            of innovation.
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
              <div className="card-edge p-8 h-full hover:border-brand/40 transition-all duration-300 relative overflow-hidden">
                {/* Icon */}
                <div className="text-5xl mb-6 relative z-10">{tech.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">
                  {tech.title}
                </h3>

                {/* Description */}
                <p className="text-muted mb-6 relative z-10 leading-relaxed">
                  {tech.description}
                </p>

                {/* Stat */}
                <div className="flex items-center gap-3 relative z-10">
                  <div className="text-2xl font-bold text-brand-light">
                    {tech.stat}
                  </div>
                  <div className="text-sm text-muted">{tech.statLabel}</div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
