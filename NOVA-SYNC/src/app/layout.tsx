import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/effects/CursorGlow";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NOVA-SYNC — Earth Observation Platform | ISRO LISS-IV Cloud Removal",
  description:
    "AI-powered satellite image cloud removal engine built for ISRO LISS-IV data. Leverages diffusion models, SAR fusion, and physics-based validation for enterprise-grade Earth observation.",
  keywords: [
    "ISRO",
    "LISS-IV",
    "satellite imagery",
    "cloud removal",
    "AI",
    "Earth observation",
    "diffusion model",
    "SAR fusion",
    "NOVA-SYNC",
  ],
  authors: [{ name: "NOVA-SYNC Team" }],
  openGraph: {
    title: "NOVA-SYNC — Earth Observation Platform",
    description:
      "Next-generation AI cloud removal engine for ISRO LISS-IV satellite imagery",
    type: "website",
    locale: "en_US",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#04070C" />
      </head>
      <body className="font-body antialiased">
        <CursorGlow />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
