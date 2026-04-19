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
  title: "What is Congress Doing in Telangana?",
  description: "An accountability tracker monitoring the Congress government's promises, budget, and performance in Telangana, India. All data sourced from public records.",
  keywords: ["Telangana", "Congress", "government", "tracker", "promises", "budget", "accountability"],
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
