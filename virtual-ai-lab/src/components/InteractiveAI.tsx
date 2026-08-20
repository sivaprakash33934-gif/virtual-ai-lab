"use client";

import { useState, useEffect, useRef, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import FuturisticIcon, { IconName } from "./icons/FuturisticIcon";
import VoiceOrb from "@/components/lab/VoiceOrb";

const aiTools: {
  id: string;
  name: string;
  icon: IconName;
  color: string;
  description: string;
}[] = [
  {
    id: "cv",
    name: "Computer Vision",
    icon: "cv",
    color: "#00d4ff",
    description: "AI guide analyzes visual data",
  },
  {
    id: "nlp",
    name: "NLP",
    icon: "nlp",
    color: "#6fe7ff",
    description: "AI guide switches to communication mode",
  },
  {
    id: "gen",
    name: "Generative AI",
    icon: "genai",
    color: "#4dc9ff",
    description: "AI guide generates visual content",
  },
  {
    id: "robotics",
    name: "Robotics",
    icon: "robotics",
    color: "#00d4ff",
    description: "AI guide demonstrates movement",
  },
];

function TypewriterText({
  text,
  scrollRef,
}: {
  text: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
}) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: restart typewriter for each new message
    setShown(0);
    const id = window.setInterval(() => {
      setShown((s) => {
        if (s >= text.length) {
          window.clearInterval(id);
          return s;
        }
        return s + 1;
      });
    }, 24);
    return () => window.clearInterval(id);
  }, [text]);
  useEffect(() => {
    if (scrollRef?.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [shown, scrollRef]);
  return (
    <>
      {text.slice(0, shown)}
      {shown < text.length && <span className="type-cursor">▌</span>}
    </>
  );
}

export default function InteractiveAI() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI guide. Click on any technology to see me in action!",
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="section-tag-2 mb-6">Interactive Experience</span>
          <h2 className="title text-4xl md:text-[47px] mb-6">
            Meet Your AI Guide
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Interact with our AI guide and explore different technologies in
            real-time.
          </p>
        </AnimatedSection>

        {/* Interactive Container */}
        <AnimatedSection>
          <div className="card-edge p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Flat Avatar + AI Tools */}
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-dark-gray to-[#0a0a0f] border border-white/10 overflow-hidden relative">
                  {/* Grid Background */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(0, 212, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.08) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Voice orb */}
                  <div className="absolute inset-0">
                    <VoiceOrb />
                  </div>

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
                            opacity: activeTool === tool.id ? 1 : 0.6,
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
<FuturisticIcon
                              name={tool.icon}
                              className="w-6 h-6 text-white"
                            />
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
                    <FuturisticIcon name="robotics" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">AI Assistant</div>
                    <div className="text-brand-light text-xs flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                      Online
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div
                  ref={chatScrollRef}
                  className="flex-1 space-y-4 mb-6 max-h-[300px] overflow-y-auto"
                >
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
                              ? "bg-brand/20 text-orange-100"
                              : "glass text-gray-300"
                          }`}
                        >
                          {msg.role === "assistant" ? (
                            <TypewriterText text={msg.content} scrollRef={chatScrollRef} />
                          ) : (
                            msg.content
                          )}
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
                      <FuturisticIcon name={tool.icon} className="w-6 h-6 text-brand-light" />
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
