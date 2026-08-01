"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="cta" className="relative py-32 px-4 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="styled-box p-8 md:p-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid md:grid-cols-2 gap-10 items-center">
                {/* Heading */}
                <div>
                  <h2 className="title text-3xl md:text-[40px] mb-6 leading-[1.15]">
                    Transform Your Work with AI
                  </h2>
                  <p className="text-muted text-base md:text-lg leading-relaxed max-w-md">
                    Embark on a transformative journey of AI research and
                    innovation with Virtual AI Lab.
                  </p>
                </div>

                {/* Form */}
                <div>
                  {submitted ? (
                    <div className="card-edge p-8 text-center">
                      <div className="text-brand-light text-4xl mb-4">✓</div>
                      <p className="text-white text-lg font-medium">
                        Thank you!
                      </p>
                      <p className="text-muted mt-1">
                        Your submission has been received.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email here"
                        aria-label="Email address"
                        className="text-field pr-36"
                      />
                      <button
                        type="submit"
                        className="submit-button absolute right-1.5 top-1/2 -translate-y-1/2"
                      >
                        Get Started
                      </button>
                    </form>
                  )}

                  {/* Trust Badges */}
                  <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
                    <div className="flex items-center gap-2">
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
                      Free to start
                    </div>
                    <div className="flex items-center gap-2">
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
                      No credit card required
                    </div>
                    <div className="flex items-center gap-2">
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
                      Cancel anytime
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
