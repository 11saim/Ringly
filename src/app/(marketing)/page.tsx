"use client";

import { HeroSection } from "@/components/marketing/hero/HeroSection";
import { TrustedBy } from "@/components/marketing/sections/TrustedBy";
import { ProblemSection } from "@/components/marketing/sections/ProblemSection";
import { SolutionSection } from "@/components/marketing/sections/SolutionSection";
import { AICapabilities } from "@/components/marketing/sections/AICapabilities";
import { AnalyticsPreview } from "@/components/marketing/sections/AnalyticsPreview";
import { FAQ } from "@/components/marketing/sections/FAQ";
import { FinalCTA } from "@/components/marketing/sections/FinalCTA";


export default function Home() {
  return (
    <div className="relative bg-[#FAFAFA] text-slate-900 overflow-hidden">
      <HeroSection />
      <TrustedBy />
      <ProblemSection />
      <SolutionSection />
      <AICapabilities />
      <AnalyticsPreview />
      <FAQ />
      <FinalCTA />
    </div>
  );
}
