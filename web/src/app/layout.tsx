import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Self-Calling Agent",
  description: "Autonomous recursive planner that decomposes goals and synthesizes insights.",
  openGraph: {
    title: "Self-Calling Agent",
    description:
      "Autonomous recursive planner that decomposes goals, reasons about subtasks, and synthesizes actionable outcomes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Self-Calling Agent",
    description:
      "Launch an autonomous reasoning loop that recursively solves complex objectives.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 antialiased`}>
        {children}
      </body>
    </html>
  );
}
