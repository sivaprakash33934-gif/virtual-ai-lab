"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import NoInternetScreen from "@/components/NoInternetScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import Technologies from "@/components/Technologies";
import FeaturedExperiment from "@/components/FeaturedExperiment";
import Projects from "@/components/Projects";
import Research from "@/components/Research";
import HowItWorks from "@/components/HowItWorks";
import Leaderboard from "@/components/Leaderboard";
import WhyUs from "@/components/WhyUs";
import InteractiveAI from "@/components/InteractiveAI";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Offline detection
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsReconnecting(true);
      setTimeout(() => {
        setIsReconnecting(false);
        setIsOffline(false);
      }, 1500);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Check initial state
    if (!navigator.onLine) setIsOffline(true);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* 3D Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen key="loader" onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {/* No internet error screen */}
      <AnimatePresence>
        {isOffline && (
          <NoInternetScreen key="offline" isReconnecting={isReconnecting} />
        )}
      </AnimatePresence>

      {/* Main content — coordinated fade */}
      <div
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.6s ease",
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        <Navbar />
        <Hero />
        <Introduction />
        <Technologies />
        <FeaturedExperiment />
        <Projects />
        <Research />
        <HowItWorks />
        <Leaderboard />
        <WhyUs />
        <InteractiveAI />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
