"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import dynamic from "next/dynamic";

const InteractiveRobot = dynamic(() => import("./three/InteractiveRobot"), {
  ssr: false,
});

const aiTools = [
  {
    id: "cv",
    name: "Computer Vision",
    icon: "👁️",
    color: "#00f0ff",
    description: "Robot responds with vision analysis",
  },
  {
    id: "nlp",
    name: "NLP",
    icon: "💬",
    color: "#a855f7",
    description: "Robot changes to communication mode",
  },
  {
    id: "gen",
    name: "Generative AI",
    icon: "✨",
    color: "#00ff88",
    description: "Robot generates visual content",
  },
  {
    id: "robotics",
    name: "Robotics",
    icon: "🤖",
    color: "#ffd93d",
    description: "Robot demonstrates movement",
  },
];

export default function InteractiveAI() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([
    {
      role: "assistant",
      content: "Hello! I'm your AI guide. Click on any technology to see me in action!",
    },
  ]);

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId);

    const tool = aiTools.find((t) => t.id === toolId);
    if (tool) {
      setChatMessages((prev) => [
        ...prev,
        { role: "user", content: `Show me ${tool.name}` },
        { role: "assistant", content: tool.description },
      ]);
    }
  };

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass text-purple-400 text-sm font-medium mb-6">
            Interactive Experience
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Meet Your </span>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Guide
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Interact with our AI robot and explore different technologies in real-time.
          </p>
        </AnimatedSection>

        {/* Interactive Container */}
        <AnimatedSection>
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: 3D Robot + AI Tools */}
              <div className="relative">
                {/* 3D Canvas */}
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-dark-gray to-[#0a0a0f] border border-white/10 overflow-hidden relative">
                  <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight
                      position={[-10, -10, -10]}
                      intensity={0.5}
                      color="#a855f7"
                    />

                    {/* Purple Background Sphere */}
                    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
                      <Sphere args={[3, 64, 64]} position={[0, 0, -3]}>
                        <MeshDistortMaterial
                          color="#a855f7"
                          attach="material"
                          distort={0.2}
                          speed={1}
                          roughness={0.2}
                          metalness={0.8}
                          transparent
                          opacity={0.3}
                        />
                      </Sphere>
                    </Float>

                    {/* Interactive Robot */}
                    <InteractiveRobot activeTool={activeTool} />
                  </Canvas>

                  {/* AI Tool Indicators */}
                  <div className="absolute inset-0 pointer-events-none">
                    {aiTools.map((tool, index) => {
                      const positions = [
                        { top: "20%", left: "10%" },
                        { top: "20%", right: "10%" },
                        { bottom: "20%", left: "10%" },
                        { bottom: "20%", right: "10%" },
                      ];
                      return (
                        <motion.div
                          key={tool.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: activeTool === tool.id ? 1 : 0.5,
                            scale: activeTool === tool.id ? 1.2 : 1,
                          }}
                          className="absolute pointer-events-auto cursor-pointer"
                          style={positions[index]}
                          onClick={() => handleToolClick(tool.id)}
                        >
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300"
                            style={{
                              backgroundColor: `${tool.color}20`,
                              boxShadow:
                                activeTool === tool.id
                                  ? `0 0 30px ${tool.color}50`
                                  : "none",
                            }}
                          >
                            {tool.icon}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right: Chat Interface */}
              <div className="flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">AI Assistant</div>
                    <div className="text-green-400 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      Online
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                  <AnimatePresence>
                    {chatMessages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                            msg.role === "user"
                              ? "bg-cyan-500/20 text-cyan-100"
                              : "glass text-gray-300"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Tool Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {aiTools.map((tool) => (
                    <motion.button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                        activeTool === tool.id
                          ? "border-2"
                          : "glass hover:bg-white/10"
                      }`}
                      style={{
                        borderColor:
                          activeTool === tool.id ? tool.color : "transparent",
                        backgroundColor:
                          activeTool === tool.id ? `${tool.color}10` : undefined,
                      }}
                    >
                      <span className="text-xl">{tool.icon}</span>
                      <span className="text-sm font-medium text-white text-left">
                        {tool.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
