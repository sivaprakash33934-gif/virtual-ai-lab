"use client";

import React from "react";

interface LoadingFallback2DProps {
  phase?: "processing" | "complete";
}

export default function LoadingFallback2D({
  phase = "processing",
}: LoadingFallback2DProps) {
  const vw = 120;
  const vh = 104;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0f]">
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* 2D SVG Triangle Mascot */}
        <svg
          width={vw}
          height={vh}
          viewBox={`0 0 ${vw} ${vh}`}
          fill="none"
          style={{
            filter:
              "drop-shadow(0 0 20px rgba(0, 240, 160, 0.4)) drop-shadow(0 0 40px rgba(0, 240, 160, 0.2))",
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <defs>
            <linearGradient
              id="fbTriGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00F0A0" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#00F0A0" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {/* Outer triangle */}
          <polygon
            points={`${vw / 2},2 2,${vh - 2} ${vw - 2},${vh - 2}`}
            fill="url(#fbTriGrad)"
            stroke="#00F0A0"
            strokeWidth={3}
          />

          {/* Inner black screen */}
          <polygon
            points={`${vw / 2},${vh * 0.18} ${vw * 0.18},${vh * 0.88} ${vw * 0.82},${vh * 0.88}`}
            fill="#0B0B12"
          />

          {/* Yellow headband */}
          <rect
            x={vw * 0.35}
            y={vh * 0.06}
            width={vw * 0.3}
            height={7}
            rx={3}
            fill="#F2C14E"
          />

          {/* Face */}
          {phase === "processing" ? (
            <g>
              <line
                x1={vw * 0.33}
                y1={vh * 0.42}
                x2={vw * 0.40}
                y2={vh * 0.48}
                stroke="#ffffff"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <line
                x1={vw * 0.67}
                y1={vh * 0.42}
                x2={vw * 0.60}
                y2={vh * 0.48}
                stroke="#ffffff"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <path
                d={`M ${vw * 0.38} ${vh * 0.62} Q ${vw * 0.5} ${vh * 0.68} ${vw * 0.62} ${vh * 0.62}`}
                stroke="#ffffff"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <g>
              <path
                d={`M ${vw * 0.32} ${vh * 0.48} Q ${vw * 0.37} ${vh * 0.40} ${vw * 0.42} ${vh * 0.48}`}
                stroke="#ffffff"
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M ${vw * 0.58} ${vh * 0.48} Q ${vw * 0.63} ${vh * 0.40} ${vw * 0.68} ${vh * 0.48}`}
                stroke="#ffffff"
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M ${vw * 0.38} ${vh * 0.60} Q ${vw * 0.5} ${vh * 0.72} ${vw * 0.62} ${vh * 0.60}`}
                stroke="#ffffff"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Legs */}
          <line
            x1={vw * 0.4}
            y1={vh - 2}
            x2={vw * 0.35}
            y2={vh + 18}
            stroke="#00F0A0"
            strokeWidth={3}
            strokeLinecap="round"
            style={{ animation: "leg-run-left 0.35s ease-in-out infinite" }}
          />
          <line
            x1={vw * 0.6}
            y1={vh - 2}
            x2={vw * 0.65}
            y2={vh + 18}
            stroke="#00F0A0"
            strokeWidth={3}
            strokeLinecap="round"
            style={{ animation: "leg-run-right 0.35s ease-in-out infinite" }}
          />
        </svg>

        {/* Title */}
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-white">Virtual </span>
          <span className="text-cyan-400">AI</span>
          <span className="text-white"> Lab</span>
        </h1>

        {/* Progress dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#00F0A0]"
              style={{
                animation: `led-pulse 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
