import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeedbackWidget from "@/components/FeedbackWidget";
import { Analytics } from "@vercel/analytics/react";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Telangana Tracker — Telangana's government, tracked in public.",
  description: "A public accountability tracker for Telangana state — promises, budget, 33 districts, and tagged news. All data from public records, no political affiliation.",
  keywords: ["Telangana", "government", "tracker", "promises", "budget", "accountability", "elections", "civic"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} font-mono antialiased bg-bg-primary text-text-primary min-h-screen`}>
        <Header />
        <main className="max-w-[1400px] mx-auto px-4 py-6">
          {children}
        </main>
        <Footer />
        <FeedbackWidget />
        <Analytics />
      </body>
    </html>
  );
}
