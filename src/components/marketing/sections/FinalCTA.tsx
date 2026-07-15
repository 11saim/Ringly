"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MagneticButton } from "../MagneticButton";

export function FinalCTA() {
  return (
    <section className="relative py-20 sm:py-24 sm:py-28 px-5 sm:px-6 overflow-hidden" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-[#0F172A]" aria-hidden="true" />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background: "radial-gradient(ellipse at 30% 20%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(99,102,241,0.12) 0%, transparent 50%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            aria-hidden="true"
            style={{
              backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-6 py-16 sm:px-8 sm:py-20 md:px-16 md:py-24 text-center">
            <motion.h2
              id="cta-heading"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight mb-5 sm:mb-6 leading-[1.1]"
            >
              Your AI agent is
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                3 minutes away
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed"
            >
              Join 500+ businesses that never miss a WhatsApp message. Start free today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10"
            >
              <MagneticButton
                href="/signup"
                className="group inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 bg-white text-[#0F172A] rounded-full font-bold text-sm sm:text-base shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.25)] transition-shadow duration-300"
              >
                Deploy Your Agent Today
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </MagneticButton>

              <MagneticButton
                href="#demo"
                className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/10 text-white rounded-full font-semibold text-sm sm:text-base hover:bg-white/15 transition-all duration-200"
              >
                Book a Demo
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-6 gap-y-2 text-sm text-slate-500"
            >
              {["Free forever plan", "No credit card required", "Setup in minutes"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
