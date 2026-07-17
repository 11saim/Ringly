"use client";

import { useRef } from "react";
import {
  ArrowRight,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { BackgroundEffects } from "./BackgroundEffects";
import { PhoneMockup } from "./PhoneMockup";
import { MagneticButton } from "../MagneticButton";


export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <BackgroundEffects />

      <div className="relative w-full mx-auto max-w-7xl px-5 sm:px-6 pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-25 lg:pb-28">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-12 items-center">
          {/* Left */}
          <div
            className="flex flex-col gap-6 sm:gap-7 max-w-2xl"
          >

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-[2.5rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold tracking-[-0.03em] leading-[1.08] text-[#0F172A]"
            >
              Your WhatsApp.
              <br />
              Now it never
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">misses a message</span>
                <span
                  className="absolute bottom-1 left-0 right-0 h-3 sm:h-3.5 bg-gradient-to-r from-emerald-200/60 to-emerald-300/40 -z-0 origin-left rounded-sm"
                />
              </span>
              .
            </h1>

            {/* Sub-copy */}
            <p
              className="text-base sm:text-lg lg:text-xl text-slate-500 max-w-lg leading-relaxed"
            >
              Ringly puts an AI agent on your existing WhatsApp number. It
              answers questions, books appointments, takes orders, and hands off
              to your team when needed.
              <span className="text-slate-700 font-medium">
                {" "}Your customers don&apos;t change anything.
              </span>
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 mt-1"
            >
              <MagneticButton
                href="/signup"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#0F172A] text-white rounded-full font-semibold text-[15px] hover:bg-[#1E293B] transition-all duration-200 shadow-[0_4px_12px_rgb(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.2)]"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </MagneticButton>

              <MagneticButton
                href="#demo"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white border border-black/[0.08] text-[#0F172A] rounded-full font-semibold text-[15px] hover:bg-slate-50 hover:border-black/[0.12] transition-all duration-200 shadow-[0_2px_6px_rgb(0,0,0,0.04)]"
              >
                <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500/20" />
                Book a Demo
              </MagneticButton>
            </div>

            {/* Trust signals */}
            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400"
            >
              {["No new number needed", "Non-technical setup", "Free to start"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right */}
          <div>
            {/* Phone mockup */}
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
} 
