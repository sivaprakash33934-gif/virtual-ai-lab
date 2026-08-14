import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tool — Virtual AI Lab" };

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#060910",
        color: "#e0eaff",
        fontFamily: "var(--lab-mono)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: 24,
      }}
    >
      <p style={{ margin: 0, color: "#00c8ff", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase" }}>Tool</p>
      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, textAlign: "center" }}>Tool: {slug} — coming soon</h1>
      <Link
        href="/lab"
        style={{
          color: "#00c8ff",
          textDecoration: "none",
          border: "1px solid rgba(0, 200, 255, 0.35)",
          padding: "10px 24px",
          borderRadius: 8,
          fontSize: 14,
          letterSpacing: "0.1em",
        }}
      >
        ← Back to Lab
      </Link>
    </main>
  );
}