"use client";

import React from "react";
import { motion } from "framer-motion";

interface TriangleMascotProps {
  expression: "processing" | "determined" | "confused" | "happy";
  size?: number;
  glowIntensity?: number;
  isFlickering?: boolean;
  isRunning?: boolean;
}

export default function TriangleMascot({
  expression,
  size = 120,
  glowIntensity = 1,
  isFlickering = false,
  isRunning = false,
}: TriangleMascotProps) {
  const vw = size;
  const vh = size * 0.866;
  const limbWidth = size * 0.025;
  const limbLength = size * 0.22;

  const faces: Record<string, React.ReactNode> = {
    processing: (
      <g>
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          fill="#ffffff"
          fontSize={size * 0.14}
          fontFamily="var(--font-mono), monospace"
          style={{ textShadow: "0 0 8px rgba(255,255,255,0.8)" }}
        >
          &gt;_
        </text>
        <rect
          x="57%"
          y="44%"
          width={size * 0.02}
          height={size * 0.09}
          fill="#ffffff"
          style={{ animation: "blink 1s step-end infinite" }}
        />
      </g>
    ),
    determined: (
      <g>
        <line
          x1={vw * 0.33}
          y1={vh * 0.42}
          x2={vw * 0.40}
          y2={vh * 0.48}
          stroke="#ffffff"
          strokeWidth={size * 0.025}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
        />
        <line
          x1={vw * 0.67}
          y1={vh * 0.42}
          x2={vw * 0.60}
          y2={vh * 0.48}
          stroke="#ffffff"
          strokeWidth={size * 0.025}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
        />
        <path
          d={`M ${vw * 0.38} ${vh * 0.62} Q ${vw * 0.5} ${vh * 0.68} ${vw * 0.62} ${vh * 0.62}`}
          stroke="#ffffff"
          strokeWidth={size * 0.02}
          fill="none"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
        />
      </g>
    ),
    confused: (
      <g>
        <line
          x1={vw * 0.32}
          y1={vh * 0.46}
          x2={vw * 0.42}
          y2={vh * 0.46}
          stroke="#ffffff"
          strokeWidth={size * 0.025}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
        />
        <line
          x1={vw * 0.58}
          y1={vh * 0.46}
          x2={vw * 0.68}
          y2={vh * 0.46}
          stroke="#ffffff"
          strokeWidth={size * 0.025}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
        />
        <path
          d={`M ${vw * 0.38} ${vh * 0.62} Q ${vw * 0.44} ${vh * 0.58} ${vw * 0.5} ${vh * 0.64} Q ${vw * 0.56} ${vh * 0.70} ${vw * 0.62} ${vh * 0.62}`}
          stroke="#ffffff"
          strokeWidth={size * 0.02}
          fill="none"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
        />
        <text
          x={vw * 0.78}
          y={vh * 0.38}
          fill="#ffffff"
          fontSize={size * 0.12}
          fontFamily="var(--font-mono), monospace"
          opacity={0.6}
          style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}
        >
          ?
        </text>
      </g>
    ),
    happy: (
      <g>
        <path
          d={`M ${vw * 0.32} ${vh * 0.48} Q ${vw * 0.37} ${vh * 0.40} ${vw * 0.42} ${vh * 0.48}`}
          stroke="#ffffff"
          strokeWidth={size * 0.025}
          fill="none"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
        />
        <path
          d={`M ${vw * 0.58} ${vh * 0.48} Q ${vw * 0.63} ${vh * 0.40} ${vw * 0.68} ${vh * 0.48}`}
          stroke="#ffffff"
          strokeWidth={size * 0.025}
          fill="none"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
        />
        <path
          d={`M ${vw * 0.38} ${vh * 0.60} Q ${vw * 0.5} ${vh * 0.72} ${vw * 0.62} ${vh * 0.60}`}
          stroke="#ffffff"
          strokeWidth={size * 0.02}
          fill="none"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
        />
      </g>
    ),
  };

  const legStyle = (side: "left" | "right") => ({
    position: "absolute" as const,
    bottom: size * 0.08,
    left: side === "left" ? vw * 0.35 : vw * 0.55,
    width: limbWidth,
    height: limbLength,
    background: "#F66F14",
    borderRadius: limbWidth,
    transformOrigin: "top center",
    animation: isRunning
      ? `leg-run-${side} 0.35s ease-in-out infinite`
      : "none",
    filter: `drop-shadow(0 0 4px rgba(0, 240, 160, 0.6))`,
  });

  const armStyle = (side: "left" | "right") => ({
    position: "absolute" as const,
    top: vh * 0.55,
    left: side === "left" ? vw * 0.08 : vw * 0.78,
    width: limbWidth * 0.8,
    height: limbLength * 0.8,
    background: "#F66F14",
    borderRadius: limbWidth,
    transformOrigin: "top center",
    animation: isRunning
      ? `arm-run-${side} 0.35s ease-in-out infinite`
      : "none",
    filter: `drop-shadow(0 0 4px rgba(0, 240, 160, 0.6))`,
  });

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Triangle body with face */}
    <motion.div
      className="relative inline-flex flex-col items-center"
      style={{
        animation: isRunning
          ? "run-bounce 0.35s ease-in-out infinite"
          : isFlickering
            ? "flicker 2s ease-in-out infinite"
            : "float 3s ease-in-out infinite",
        filter: `drop-shadow(0 0 ${20 * glowIntensity}px rgba(0, 240, 160, ${0.4 * glowIntensity})) drop-shadow(0 0 ${40 * glowIntensity}px rgba(0, 240, 160, ${0.2 * glowIntensity}))`,
      }}
    >
        {/* Arms */}
        <div style={armStyle("left")} />
        <div style={armStyle("right")} />

        {/* SVG triangle + face */}
        <svg
          width={vw}
          height={vh}
          viewBox={`0 0 ${vw} ${vh}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="triGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#F66F14" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#F66F14" stopOpacity={0.05} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer triangle - green stroke */}
          <polygon
            points={`${vw / 2},2 2,${vh - 2} ${vw - 2},${vh - 2}`}
            fill="url(#triGrad)"
            stroke="#F66F14"
            strokeWidth={size * 0.025}
            filter="url(#glow)"
          />

          {/* Inner triangle - black screen */}
          <polygon
            points={`${vw / 2},${vh * 0.18} ${vw * 0.18},${vh * 0.88} ${vw * 0.82},${vh * 0.88}`}
            fill="#111111"
            stroke="none"
          />

          {/* Yellow headband */}
          <rect
            x={vw * 0.38}
            y={vh * 0.08}
            width={vw * 0.24}
            height={size * 0.06}
            rx={size * 0.015}
            fill="#FF8C42"
            stroke="#FF8C42"
            strokeWidth={1}
          />

          {/* Face */}
          {faces[expression]}
        </svg>

        {/* Legs */}
        <div style={legStyle("left")} />
        <div style={legStyle("right")} />
      </motion.div>

      {/* Treadmill (only when running) */}
      {isRunning && (
        <div
          className="relative"
          style={{
            width: vw * 1.3,
            marginTop: -size * 0.04,
          }}
        >
          {/* Side rails */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 3,
              background: "linear-gradient(90deg, #3a3a3e, #555, #3a3a3e)",
              borderRadius: 2,
            }}
          />

          {/* Belt */}
          <div
            style={{
              width: "100%",
              height: size * 0.12,
              background: "#1a1a2e",
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
              border: "1px solid #3a3a3e",
            }}
          >
            {/* Moving belt lines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,240,255,0.12) 8px, rgba(0,240,255,0.12) 10px)",
                animation: "treadmill-belt 0.4s linear infinite",
              }}
            />

            {/* LED panel */}
            <div
              style={{
                position: "absolute",
                bottom: 2,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 2,
                alignItems: "flex-end",
              }}
            >
              {[0.4, 0.7, 1, 0.6, 0.8, 0.5, 0.9, 0.3].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: `${h * 10}px`,
                    background:
                      expression === "confused"
                        ? "#ff6b6b"
                        : "#F66F14",
                    borderRadius: 1,
                    animation: `led-pulse 0.6s ease-in-out ${i * 0.08}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Base */}
          <div
            style={{
              width: "100%",
              height: 4,
              background:
                "linear-gradient(180deg, #3a3a3e, #1a1a2e)",
              borderRadius: "0 0 4px 4px",
            }}
          />
        </div>
      )}
    </div>
  );
}
