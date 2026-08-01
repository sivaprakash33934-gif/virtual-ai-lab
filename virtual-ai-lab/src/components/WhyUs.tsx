"use client";

import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { whyUsFeatures } from "@/lib/data";

export default function WhyUs() {
  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="section-tag-2 mb-6">Why Us</span>
          <h2 className="title text-4xl md:text-[47px] mb-6">
            Why Virtual AI Lab?
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            We&apos;re not just building AI — we&apos;re building the future of
            innovation.
          </p>
        </AnimatedSection>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {whyUsFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <div className="card-edge p-8 h-full hover:border-brand/40 transition-all duration-300 relative overflow-hidden">
                {/* Icon */}
                <div className="text-5xl mb-6">{feature.icon}</div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Glow */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-brand/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <AnimatedSection className="mt-16">
          <div className="flex flex-wrap justify-center gap-8 text-muted">
            {[
              "Open Source",
              "99.9% Uptime",
              "24/7 Support",
              "Global Community",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-brand-light"
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
                <span>{item}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
