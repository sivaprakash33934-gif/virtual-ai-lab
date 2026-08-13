"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedSection from "./AnimatedSection";
import FuturisticIcon, { IconName } from "./icons/FuturisticIcon";
import { projects } from "@/lib/data";

const techIconByName: Record<string, IconName> = {
  "Computer Vision": "cv",
  NLP: "nlp",
  "Generative AI": "genai",
  Robotics: "robotics",
  "Machine Learning": "ml",
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mobileOrbitRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  function setupDesktopOrbital() {
    const cards = gsap.utils.toArray<HTMLElement>(".project-card");
    const totalCards = projects.length;
    if (totalCards === 0) return;

    const RADIUS = 280;
    const ORBIT_RANGE = Math.PI * 1.5;
    const CARD_ARC = ORBIT_RANGE / totalCards;

    const activeCardRef = { current: 0 };

    function updateCards(progress: number) {
      let bestIndex = 0;
      let bestDist = Infinity;

      for (let i = 0; i < totalCards; i++) {
        const angle = progress * ORBIT_RANGE - i * CARD_ARC;
        let ry = -(angle * 180) / Math.PI;
        ry = ((ry % 360) + 540) % 360 - 180;
        const dist = Math.abs(ry) > 180 ? 360 - Math.abs(ry) : Math.abs(ry);

        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      }

      if (bestIndex !== activeCardRef.current) {
        activeCardRef.current = bestIndex;
        setActiveCard(bestIndex);
      }

      cards.forEach((card, i) => {
        const angle = progress * ORBIT_RANGE - i * CARD_ARC;

        const x = Math.sin(angle) * RADIUS;
        const z = Math.cos(angle) * RADIUS;

        let rotateY = -(angle * 180) / Math.PI;
        rotateY = ((rotateY % 360) + 540) % 360 - 180;

        let angularDist = Math.abs(rotateY);
        if (angularDist > 180) angularDist = 360 - angularDist;
        const distFromFront = angularDist / 180;

        const scale = 1.15 - distFromFront * 0.7;
        const opacity = distFromFront > 0.7 ? 0 : 1.0 - distFromFront * 1.4;
        const blur = distFromFront > 0.3 ? distFromFront * 6 : 0;
        const zIndex = Math.round((1 - distFromFront) * 100);

        gsap.set(card, {
          x: x,
          yPercent: -50,
          z: z,
          scale: scale,
          opacity: opacity,
          filter: `blur(${blur}px)`,
          rotateY: rotateY,
          zIndex: zIndex,
          force3D: true,
        });
      });
    }

    updateCards(0);

    const totalScroll = window.innerHeight * 2.5;
    const lastSnap = (totalCards - 1) / totalCards;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      scrub: 1,
      snap: {
        snapTo: Array.from({ length: totalCards }, (_, i) => i / totalCards),
        duration: { min: 0.2, max: 0.4 },
        delay: 0,
        ease: "power1.inOut",
      },
      end: () => `+=${totalScroll * (lastSnap + 1 / totalCards)}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        updateCards(self.progress);
      },
    });
  }

  function setupMobileScroll() {
    const container = mobileOrbitRef.current;
    if (!container) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    const totalCards = projects.length;

    const activeCardRef = { current: 0 };

    function updateMobileCards(progress: number) {
      let bestIndex = 0;
      let bestDist = Infinity;

      for (let i = 0; i < totalCards; i++) {
        const cardProgress = i / totalCards;
        const dist = Math.abs(progress - cardProgress);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      }

      if (bestIndex !== activeCardRef.current) {
        activeCardRef.current = bestIndex;
        setActiveCard(bestIndex);
      }

      const cards = container!.querySelectorAll<HTMLElement>(".project-card");
      cards.forEach((card, i) => {
        const cardProgress = i / totalCards;
        const dist = Math.abs(progress - cardProgress);
        const opacity = dist < 0.2 ? 1 : Math.max(0, 1 - dist * 2);
        gsap.set(card, { opacity });
      });
    }

    updateMobileCards(0);

    gsap.to(container, {
      x: -maxScroll,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: Array.from({ length: totalCards }, (_, i) => i / totalCards),
          duration: { min: 0.2, max: 0.4 },
          delay: 0,
          ease: "power1.inOut",
        },
        end: () => `+=${maxScroll}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          updateMobileCards(self.progress);
        },
      },
    });
  }

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        setupDesktopOrbital();
      });

      mm.add("(max-width: 1023px)", () => {
        setupMobileScroll();
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects">
      {/* Header — normal scroll */}
      <div className="py-16 px-4">
        <AnimatedSection className="text-center max-w-6xl mx-auto">
          <span className="section-tag-2 mb-6">Our Work</span>
          <h2 className="title text-4xl md:text-[47px] mb-6">
            Explore Our Projects
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Discover our AI experiments and innovations.
          </p>
        </AnimatedSection>
      </div>

      {/* ONLY the orbital stage is pinned */}
      <div ref={sectionRef} className="relative overflow-visible">
        {/* Desktop: 3D orbital carousel */}
        <div
          className="hidden lg:block relative w-full h-[80vh]"
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card absolute"
                style={{
                  width: "min(34vw, 400px)",
                  left: "50%",
                  marginLeft: "min(-17vw, -200px)",
                  top: "50%",
                  transformStyle: "preserve-3d",
                  willChange: "transform, filter",
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="card-edge p-6 h-full relative overflow-hidden group cursor-pointer"
                  style={{
                    borderLeft: "4px solid var(--color-brand)",
                    boxShadow: "0 20px 60px -15px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <div
                    className="aspect-video rounded-2xl mb-5 relative overflow-hidden"
                    style={{
                    background:
                      "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.03))",
                  }}
                >
                    <div className="absolute inset-0 grid-bg opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                        <FuturisticIcon
                          name={techIconByName[project.technology]}
                          className="w-16 h-16 text-brand-light"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                      style={{
                        backgroundColor: "rgba(0,212,255,0.12)",
                        color: "#6fe7ff",
                      }}
                    >
                      {project.technology}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: GSAP-driven horizontal scroll */}
        <div
          ref={mobileOrbitRef}
          className="lg:hidden flex gap-6 px-4 pb-8"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card flex-shrink-0 w-[85vw]"
            >
              <div
                className="card-edge p-6 h-full relative overflow-hidden"
                style={{
                  borderLeft: "4px solid var(--color-brand)",
                }}
              >
                <div
                  className="aspect-video rounded-2xl mb-5 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,212,255,0.03))",
                  }}
                >
                  <div className="absolute inset-0 grid-bg opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="opacity-50 text-brand-light">
                      <FuturisticIcon
                        name={techIconByName[project.technology]}
                        className="w-16 h-16"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                    style={{
                      backgroundColor: "rgba(0,212,255,0.12)",
                      color: "#6fe7ff",
                    }}
                  >
                    {project.technology}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress dots — normal scroll, NOT pinned */}
      <div className="hidden lg:flex justify-center gap-3 py-6">
        {projects.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeCard === i
                ? "bg-brand scale-125 shadow-[0_0_10px_rgba(0,212,255,0.25)]"
                : "bg-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Active card info — normal scroll, NOT pinned */}
      <div className="text-center pb-12 px-4">
        <h3 className="text-2xl font-bold text-white mb-1">
          {projects[activeCard].title}
        </h3>
        <p className="text-muted mb-4">
          {projects[activeCard].technology}
        </p>
        <a href="#cta" className="button-glow px-6 py-3">
          View Project ↗
        </a>
      </div>
    </section>
  );
}
