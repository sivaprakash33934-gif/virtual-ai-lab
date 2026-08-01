"use client";

import { motion, AnimatePresence } from "framer-motion";
import TriangleMascot from "./TriangleMascot";

interface NoInternetScreenProps {
  isReconnecting: boolean;
}

export default function NoInternetScreen({
  isReconnecting,
}: NoInternetScreenProps) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0f]/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Triangle mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -5 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: [0, -4, 4, -4, 0],
          }}
          transition={{
            duration: 0.5,
            x: {
              duration: 0.4,
              delay: 0.3,
              ease: "easeInOut",
            },
          }}
        >
          <TriangleMascot
            expression={
              isReconnecting ? "determined" : "confused"
            }
            size={100}
            glowIntensity={isReconnecting ? 1.2 : 0.5}
            isFlickering={!isReconnecting}
          />
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-2xl font-bold text-white text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {isReconnecting ? "Reconnecting..." : "Connection Lost"}
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-gray-400 text-center max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          {isReconnecting
            ? "Attempting to restore connection"
            : "Check your internet connection and try again"}
        </motion.p>

        {/* Reconnecting dots */}
        <AnimatePresence>
          {isReconnecting && (
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-brand-light"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Retry button */}
        <AnimatePresence>
          {!isReconnecting && (
            <motion.button
              onClick={handleRetry}
              className="button-glow mt-2 px-8 py-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: "0 0 20px rgba(246, 111, 20, 0.3)",
              }}
            >
              Retry
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
