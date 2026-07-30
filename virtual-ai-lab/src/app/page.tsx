"use client";

import dynamic from "next/dynamic";
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
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
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
    </main>
  );
}
