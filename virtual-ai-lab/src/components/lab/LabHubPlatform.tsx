"use client";

import type { JSX } from "react";

interface LabHubPlatformProps {
  className?: string;
}

export default function LabHubPlatform({ className }: LabHubPlatformProps): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 600 600" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hubPlatGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ff9d" stopOpacity="0.4" />
          <stop offset="55%" stopColor="#00ff9d" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#00ff9d" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="300" cy="300" r="295" fill="url(#hubPlatGlow)" />

      <g className="hub-ring hub-ring--a">
        <circle cx="300" cy="300" r="278" stroke="#00ff9d" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="10 14" />
      </g>

      <g className="hub-ring hub-ring--b">
        <circle cx="300" cy="300" r="252" stroke="#35e0ff" strokeOpacity="0.8" strokeWidth="2" strokeDasharray="160 1425" strokeLinecap="round" />
        <circle cx="300" cy="300" r="252" stroke="#ff5edb" strokeOpacity="0.8" strokeWidth="2" strokeDasharray="120 1465" strokeDashoffset="-500" strokeLinecap="round" />
        <circle cx="300" cy="300" r="252" stroke="#ffe066" strokeOpacity="0.8" strokeWidth="2" strokeDasharray="90 1495" strokeDashoffset="-950" strokeLinecap="round" />
      </g>

      <g className="hub-ring hub-ring--c">
        <circle cx="300" cy="300" r="224" stroke="#00ff9d" strokeOpacity="0.35" strokeWidth="6" strokeDasharray="2 12" />
      </g>

      <g className="hub-ring hub-ring--d">
        <circle cx="300" cy="300" r="192" stroke="#7dffc4" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="492" cy="300" r="4" fill="#00ff9d" />
        <circle cx="108" cy="300" r="4" fill="#35e0ff" />
      </g>

      <g className="hub-ring hub-ring--e">
        <circle cx="300" cy="300" r="158" stroke="#00ff9d" strokeOpacity="0.45" strokeWidth="1.2" strokeDasharray="40 24" />
      </g>

      <g className="hub-plat-center">
        <path d="M268 294l-8 6 8 6M332 294l8 6-8 6" stroke="#b6ffe3" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="286" y="296" width="8" height="8" fill="#00ff9d" />
        <rect x="298" y="296" width="8" height="8" fill="#ffe066" />
        <rect x="310" y="296" width="8" height="8" fill="#35e0ff" />
      </g>
    </svg>
  );
}
