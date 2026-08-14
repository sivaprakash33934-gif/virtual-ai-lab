"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import "../lab/labSlides.css";

interface LabSlideModalProps {
  topic: string;
  accentColor?: string;
}

function GraduationCapIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export default function LabSlideModal({ topic, accentColor }: LabSlideModalProps) {
  const [open, setOpen] = useState(false);
  const accent = accentColor || "var(--lab-cyan)";
  const style = { "--lab-modal-accent": accent } as CSSProperties;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="lab-slide-modal-btn"
        style={style}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        ENTER LAB
      </button>

      {open &&
        createPortal(
          <div
            className="lab-slide-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Enter the lab"
            onClick={() => setOpen(false)}
          >
            <div className="lab-slide-modal-container" style={style} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="lab-slide-modal-close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
              <Link href={`/courses/${topic}`} className="lab-slide-modal-box" onClick={() => setOpen(false)}>
                <GraduationCapIcon />
                <span>COURSES</span>
              </Link>
              <Link href={`/tools/${topic}`} className="lab-slide-modal-box" onClick={() => setOpen(false)}>
                <WrenchIcon />
                <span>TOOLS</span>
              </Link>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}