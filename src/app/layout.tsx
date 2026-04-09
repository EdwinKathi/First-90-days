import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "First 90 Days — Your Relocation Playbook",
  description: "A personalized checklist for anyone starting over in a new place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
