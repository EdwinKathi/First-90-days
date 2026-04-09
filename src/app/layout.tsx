import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "First 90 Days — Your Relocation Playbook",
  description: "A personalized checklist for anyone starting over in a new place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#111110" />
      </head>
      <body>{children}</body>
    </html>
  );
}
