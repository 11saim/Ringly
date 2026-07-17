"use client";

import { HeroSection } from "@/components/marketing/hero/HeroSection";
import { TrustedBy } from "@/components/marketing/sections/TrustedBy";
import { ProblemSection } from "@/components/marketing/sections/ProblemSection";
import { SolutionSection } from "@/components/marketing/sections/SolutionSection";
import { ProductShowcase } from "@/components/marketing/sections/ProductShowcase";
import { AICapabilities } from "@/components/marketing/sections/AICapabilities";
import { HumanHandoff } from "@/components/marketing/sections/HumanHandoff";
import { AnalyticsPreview } from "@/components/marketing/sections/AnalyticsPreview";
import { Transformations } from "@/components/marketing/sections/Transformations";
import { Testimonials } from "@/components/marketing/sections/Testimonials";
import { Pricing } from "@/components/marketing/sections/Pricing";
import { FAQ } from "@/components/marketing/sections/FAQ";
import { FinalCTA } from "@/components/marketing/sections/FinalCTA";


export default function Home() {
  return (
    <div className="relative bg-[#FAFAFA] text-slate-900 overflow-hidden">
      <HeroSection />
      <TrustedBy />
      <ProblemSection />
      <SolutionSection />
      <ProductShowcase />
      <AICapabilities />
      <HumanHandoff />
      <AnalyticsPreview />
      <Transformations />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </div>
  );
}
