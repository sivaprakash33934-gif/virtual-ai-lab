"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const LabExperience = dynamic(
  () => import("@/components/lab/LabExperience"),
  { ssr: false }
);

export default function LabPage() {
  useEffect(() => {
    document.body.classList.add("lab-open");
    return () => {
      document.body.classList.remove("lab-open");
    };
  }, []);

  return <LabExperience />;
}