"use client";

import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { motion } from "framer-motion";
import { fadeInUp, fadeInLeft, staggerContainer } from "@/lib/animations";
import dynamic from "next/dynamic";

const Robot = dynamic(() => import("./three/Robot"), { ssr: false });

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Purple Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-600/30 to-purple-900/20 blur-[120px] animate-pulse" />

        {/* Cyan Glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px]" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

          {/* Purple Orb Sphere */}
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere args={[2.5, 64, 64]} position={[0, -0.5, -3]}>
              <MeshDistortMaterial
                color="#a855f7"
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0.2}
                metalness={0.8}
              />
            </Sphere>
          </Float>

          {/* Robot */}
          <Robot />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-cyan-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Now Exploring AI Frontiers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">Virtual</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 bg-clip-text text-transparent">
              AI Lab
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Explore. Experiment. Innovate.
            <br />
            Enter the future of artificial intelligence research.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#technologies"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold rounded-full hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300 text-lg"
            >
              Enter Lab
            </a>
            <a
              href="#projects"
              className="px-8 py-4 glass text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 text-lg"
            >
              Explore Technologies
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-sm">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-1"
            >
              <div className="w-1.5 h-3 rounded-full bg-cyan-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
