import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual AI Lab — Interactive Laboratory",
  description: "Enter the Virtual AI Lab — an immersive interactive experience for AI research and experimentation.",
  keywords: ["AI Lab", "Artificial Intelligence", "Research", "Interactive", "Experiment"],
  openGraph: {
    title: "Virtual AI Lab — Interactive Laboratory",
    description: "Enter the Virtual AI Lab — an immersive interactive experience for AI research and experimentation.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual AI Lab",
    description: "Enter the Virtual AI Lab — an immersive interactive experience.",
  },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}