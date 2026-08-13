"use client";

import { useEffect, useRef } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#";

export default function ScrambleTitle({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }
    let frame = 0, raf = 0;
    const queue = text.split("").map((ch, i) => ({
      ch,
      start: i * 3 + Math.floor(Math.random() * 8),
      end: i * 3 + 18 + Math.floor(Math.random() * 18),
    }));
    const update = () => {
      let out = "", done = 0;
      for (const q of queue) {
        if (frame >= q.end) { done++; out += q.ch; }
        else if (frame >= q.start) out += CHARS[Math.floor(Math.random() * CHARS.length)];
        else out += "\u00A0";
      }
      el.textContent = out;
      frame++;
      if (done < queue.length) raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return <span ref={ref} className="lab-scramble-title" aria-label={text}>{text}</span>;
}
