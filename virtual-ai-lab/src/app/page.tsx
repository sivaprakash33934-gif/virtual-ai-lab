"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import NoInternetScreen from "@/components/NoInternetScreen";
import Navbar from "@/components/Navbar";
import Introduction from "@/components/Introduction";
import Technologies from "@/components/Technologies";
import FeaturedExperiment from "@/components/FeaturedExperiment";
import Research from "@/components/Research";
import HowItWorks from "@/components/HowItWorks";
import Leaderboard from "@/components/Leaderboard";
import WhyUs from "@/components/WhyUs";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

const Hero = dynamic(() => import("@/components/Hero").then((m) => m.default), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center" aria-hidden="true" />,
});

const Projects = dynamic(() => import("@/components/Projects").then((m) => m.default), {
  ssr: false,
  loading: () => <div className="py-32" aria-hidden="true" />,
});

const InteractiveAI = dynamic(() => import("@/components/InteractiveAI").then((m) => m.default), {
  ssr: false,
  loading: () => <div className="py-32" aria-hidden="true" />,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(
    () => typeof navigator !== "undefined" && !navigator.onLine
  );
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
        <ErrorBoundary fallback={<div className="min-h-screen flex items-center justify-center" aria-hidden="true" />}>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center" aria-hidden="true" />}>
            <Hero />
          </Suspense>
        </ErrorBoundary>
        <Introduction />
        <Technologies />
        <FeaturedExperiment />
        <ErrorBoundary fallback={<div className="py-32" aria-hidden="true" />}>
          <Suspense fallback={<div className="py-32" aria-hidden="true" />}>
            <Projects />
          </Suspense>
        </ErrorBoundary>
        <Research />
        <HowItWorks />
        <Leaderboard />
        <WhyUs />
        <ErrorBoundary fallback={<div className="py-32" aria-hidden="true" />}>
          <Suspense fallback={<div className="py-32" aria-hidden="true" />}>
            <InteractiveAI />
          </Suspense>
        </ErrorBoundary>
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
