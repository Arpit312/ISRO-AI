"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import CursorGlow from "@/components/effects/CursorGlow";
import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Pipeline from "@/components/pipeline/Pipeline";
import Dashboard from "@/components/dashboard/Dashboard";
import Upload from "@/components/upload/Upload";
import Footer from "@/components/footer/Footer";

export default function Home() {
  useSmoothScroll();

  return (
    <>
      <CursorGlow />
      <Navbar />
      <main>
        <Hero />
        <Pipeline />
        <Dashboard />
        <Upload />
      </main>
      <Footer />
    </>
  );
}
