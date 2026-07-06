import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/layout/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOVA-SYNC — AI Cloud Removal Engine",
  description:
    "Enterprise-grade AI pipeline for reconstructing cloud-occluded ISRO LISS-IV satellite imagery using SAR fusion, phenological priors, and latent diffusion.",
  keywords: [
    "ISRO",
    "NOVA-SYNC",
    "satellite imagery",
    "cloud removal",
    "LISS-IV",
    "SAR fusion",
    "AI",
    "remote sensing",
  ],
  authors: [{ name: "NOVA-SYNC Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
