"use client";

import dynamic from "next/dynamic";
import LoadingFallback2D from "./loading/LoadingFallback2D";

const LoadingCanvas = dynamic(() => import("./loading/LoadingCanvas"), {
  ssr: false,
  loading: () => <LoadingFallback2D phase="processing" />,
});

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  return <LoadingCanvas onComplete={onComplete} />;
}
