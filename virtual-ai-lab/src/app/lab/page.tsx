"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const LabExperience = dynamic(
  () => import("@/components/lab/LabExperience"),
  { ssr: false }
);

export default function LabPage() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return <LabExperience />;
}