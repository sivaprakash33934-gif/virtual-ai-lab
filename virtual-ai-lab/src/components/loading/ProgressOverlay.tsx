"use client";

import { useEffect, useState } from "react";
import { progressStore } from "@/lib/loadingProgress";

export default function ProgressOverlay() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setPct(Math.round(progressStore.value * 100));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-[3px] w-64 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#F66F14]"
          style={{
            width: `${pct}%`,
            boxShadow: "0 0 12px rgba(0,240,160,0.8)",
            transition: "width 0.1s linear",
          }}
        />
      </div>
      <div
        className="font-mono text-xs tracking-[0.35em] text-[#F66F14]"
        style={{ textShadow: "0 0 8px rgba(0,240,160,0.6)" }}
      >
        {pct}%
      </div>
    </div>
  );
}
