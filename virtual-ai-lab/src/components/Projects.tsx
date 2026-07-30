"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedSection from "./AnimatedSection";
import { projects } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !scrollRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>(".project-card");

    const scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => `+=${scrollRef.current!.offsetWidth}`,
      },
    });

    return () => {
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, []);

  return (
    <section id="projects" className="relative overflow-hidden">
      {/* Section Header */}
      <div className="py-16 px-4">
        <AnimatedSection className="text-center max-w-6xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full glass text-cyan-400 text-sm font-medium mb-6">
            Our Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Explore </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Our Projects
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Scroll horizontally to discover our groundbreaking AI research and applications.
          </p>
        </AnimatedSection>
      </div>

      {/* Horizontal Scroll Container */}
      <div ref={sectionRef} className="relative">
        <div
          ref={scrollRef}
          className="flex gap-8 px-4 pb-16"
          style={{ width: `${projects.length * 100}vw` }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card w-[85vw] md:w-[60vw] lg:w-[45vw] flex-shrink-0"
            >
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="glass rounded-3xl p-8 h-full relative overflow-hidden group cursor-pointer"
                style={{
                  borderLeft: `4px solid ${project.color}`,
                }}
              >
                {/* Project Image Placeholder */}
                <div
                  className="aspect-video rounded-2xl mb-6 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${project.color}20, ${project.color}05)`,
                  }}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 grid-bg opacity-50" />

                  {/* Project Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="text-6xl opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: project.color }}
                    >
                      {project.technology === "Computer Vision" && "👁️"}
                      {project.technology === "NLP" && "💬"}
                      {project.technology === "Generative AI" && "✨"}
                      {project.technology === "Robotics" && "🤖"}
                      {project.technology === "Machine Learning" && "📊"}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <button
                      className="px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300"
                      style={{
                        backgroundColor: project.color,
                        color: "#000",
                      }}
                    >
                      View Project →
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
                    style={{
                      backgroundColor: `${project.color}20`,
                      color: project.color,
                    }}
                  >
                    {project.technology}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Corner Glow */}
                <div
                  className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                  style={{ backgroundColor: project.color }}
                />
              </motion.div>
            </div>
          ))}

          {/* Final CTA Card */}
          <div className="project-card w-[85vw] md:w-[60vw] lg:w-[45vw] flex-shrink-0">
            <div className="glass rounded-3xl p-8 h-full flex items-center justify-center min-h-[500px] border-dashed border-2 border-white/20 hover:border-cyan-500/50 transition-colors duration-300">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Have an AI idea?
                </h3>
                <p className="text-gray-400 mb-6">
                  Start building the future with us.
                </p>
                <a
                  href="#cta"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold rounded-full hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300"
                >
                  Start Your Project →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
