"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { leaderboardData } from "@/lib/data";

const tabs = ["Weekly", "Monthly", "All-Time"];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("All-Time");

  return (
    <section id="leaderboard" className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d1f1a] to-[#0a0a0f]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-green-500/5 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass text-green-400 text-sm font-medium mb-6">
            Leaderboard
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Compete & </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Earn XP
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Challenge yourself, complete projects, and climb the ranks.
          </p>
        </AnimatedSection>

        {/* Your Rank Card */}
        <AnimatedSection className="mb-12">
          <div className="relative glass rounded-2xl p-6 max-w-md mx-auto border-cyan-500/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">Your Rank</span>
              <span className="text-cyan-400 font-bold">#24</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              {/* FIX: Added relative positioning on the avatar circle
                  so it stays within its container during GSAP pin scroll */}
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                Y
              </div>
              <div>
                <div className="text-white font-semibold">You</div>
                <div className="text-cyan-400 font-bold">2,450 XP</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Next Rank: #23</span>
                <span>550 XP to go</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  style={{ width: "80%" }}
                />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 text-sm">
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <span className="text-orange-400">12 day streak</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎯</span>
                <span className="text-green-400">8 challenges</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Tabs */}
        <AnimatedSection className="mb-8">
          <div className="flex justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-green-500 to-cyan-500 text-black"
                    : "glass text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Leaderboard Table */}
        <AnimatedSection>
          {/* FIX: Added relative + z-10 on the table container to create a
              proper stacking context. This prevents rank number circles from
              escaping the table and appearing stuck at the viewport origin
              when GSAP's pin-spacer manipulates the page layout. */}
          <div className="relative z-10 glass rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-6 gap-4 p-4 border-b border-white/10 text-sm text-gray-400 font-medium">
              <div className="col-span-2">Rank</div>
              <div>XP</div>
              <div className="hidden sm:block">Challenges</div>
              <div className="hidden sm:block">Projects</div>
              <div className="hidden md:block">Streak</div>
            </div>

            {/* Rows */}
            <AnimatePresence>
              {leaderboardData.map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative grid grid-cols-6 gap-4 p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors duration-200 ${
                    user.rank <= 3 ? "bg-white/5" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-2 flex items-center gap-3">
                    {/* FIX: Added relative positioning on rank circles.
                        This ensures they are contained within their grid cell
                        and don't escape to the viewport origin during scroll. */}
                    <div
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        user.rank === 1
                          ? "bg-yellow-500/20 text-yellow-400"
                          : user.rank === 2
                          ? "bg-gray-300/20 text-gray-300"
                          : user.rank === 3
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {user.rank <= 3 ? user.avatar : user.rank}
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">
                        {user.badges} badges
                      </div>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-cyan-400 font-bold">
                    {user.xp.toLocaleString()}
                  </div>

                  {/* Challenges */}
                  <div className="hidden sm:block text-gray-300">
                    {user.challenges}
                  </div>

                  {/* Projects */}
                  <div className="hidden sm:block text-gray-300">
                    {user.projects}
                  </div>

                  {/* Streak */}
                  <div className="hidden md:block">
                    <span className="text-orange-400">🔥 {user.streak}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </AnimatedSection>

        {/* Gamification Stats */}
        <AnimatedSection className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🏆", label: "Total Prizes", value: "$10,000" },
              { icon: "🎯", label: "Challenges", value: "50+" },
              { icon: "📈", label: "Weekly Growth", value: "+15%" },
              { icon: "🏅", label: "Active Players", value: "1,200+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative glass rounded-xl p-4 text-center"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
