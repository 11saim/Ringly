"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { BackgroundEffects } from "./BackgroundEffects";
import { PhoneMockup } from "./PhoneMockup";
import { FlowButton } from "@/components/ui/flow-button";
import Link from "next/link";

const features = [
  { icon: "💬", label: "No new number needed" },
  { icon: "⚡", label: "Set up in minutes" },
  { icon: "🚀", label: "Free to start" },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <BackgroundEffects />

      <div className="relative w-full mx-auto max-w-7xl px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-14 lg:pb-20">
        <div className="flex flex-col hero-row justify-between gap-8 items-center min-h-auto">
          {/* Left */}
          <div className="flex flex-col gap-6 sm:gap-8 self-start hero-center w-full max-w-2xl">
            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-[2.1rem] min-[380px]:text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4.25rem] font-bold tracking-[-0.04em] leading-[1.08] sm:leading-[1.05] text-[#1a1a1a]"
            >
              Your{" "}
              <span className="relative inline-block">
                <span className="relative z-10">WhatsApp</span>
                <span className="absolute bottom-[0.08em] left-0 right-0 h-[0.35em] bg-[#d4f5e0] -z-0" />
              </span>
              .
              <br />
              <div className="text-[1.35rem] min-[380px]:text-[1.5rem] sm:text-[2.25rem] lg:text-[2.75rem] xl:text-[3.25rem]">
                Now it never{" "}
                <span className="relative">
                  <span className="relative z-10">misses a message</span>
                  <span className="absolute bottom-[0.08em] left-0 right-0 h-[0.35em] bg-[#d4f5e0] -z-0" />
                </span>
                .
              </div>
            </h1>

            {/* Sub-copy */}
            <p className="text-sm sm:text-lg lg:text-xl text-[#555] max-w-2xl leading-relaxed">
              Ringly puts an AI agent on your existing WhatsApp number. It
              answers questions, books appointments, takes orders, and hands off
              to your team when needed.
            </p>

            {/* CTA */}
            <div className="mt-1">
              <FlowButton text="Get Started Free" href="/signup" />
            </div>
          </div>

          {/* Right */}
          <div className="shrink-0 w-full sm:w-auto flex justify-center max-w-full overflow-visible">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
