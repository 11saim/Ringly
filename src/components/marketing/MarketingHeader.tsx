"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, AnimatePresence } from "framer-motion";
import { MessageSquareText, Menu, X } from "lucide-react";
import { useState, useCallback } from "react";

const navLinks = [
  { label: "How It Works", href: "#solution" },
  { label: "Features", href: "#capabilities" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const rawTop = useTransform(scrollY, [0, 100], [16, 0]);
  const rawPaddingX = useTransform(scrollY, [0, 100], [16, 0]);
  const rawBorderRadius = useTransform(scrollY, [0, 100], [9999, 20]);
  const rawBorderOpacity = useTransform(scrollY, [40, 100], [0, 1]);

  const springConfig = { stiffness: 120, damping: 25, mass: 0.8 };
  const top = useSpring(rawTop, springConfig);
  const paddingX = useSpring(rawPaddingX, springConfig);
  const borderRadius = useSpring(rawBorderRadius, springConfig);
  const borderOpacity = useSpring(rawBorderOpacity, { stiffness: 100, damping: 20 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 60);
  });

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          top,
          paddingLeft: paddingX,
          paddingRight: paddingX,
        }}
        className="fixed left-0 right-0 z-50"
        role="banner"
      >
        <motion.div
          style={{
            borderRadius,
          }}
          className="mx-auto max-w-6xl flex items-center justify-between p-3 pl-5 sm:pl-6 transition-colors duration-500"
        >
          {/* Background layer */}
          <motion.div
            className="absolute inset-0 rounded-[inherit] transition-all duration-500"
            style={{
              opacity: borderOpacity,
            }}
          >
            <div className={`w-full h-full rounded-[inherit] backdrop-blur-xl border border-black/[0.08] ${
              isScrolled
                ? "bg-white/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_8px_32px_-8px_rgba(0,0,0,0.04)]"
                : "bg-white/60 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]"
            }`} />
          </motion.div>

          {/* Content */}
          <div className="relative flex items-center justify-between w-full">
            <Link href="/" className="flex items-center gap-2.5 text-[#0F172A] font-semibold text-lg tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-full px-1" aria-label="Ringly - Home">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#0F172A] text-white" aria-hidden="true">
                <MessageSquareText className="h-[18px] w-[18px]" />
              </div>
              Ringly
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-[#0F172A] rounded-lg hover:bg-black/[0.03] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:block text-sm font-medium text-slate-500 hover:text-[#0F172A] px-4 py-2 rounded-lg hover:bg-black/[0.03] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Sign in
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="hidden sm:block">
                <Link
                  href="/signup"
                  className="text-sm font-semibold px-5 py-2.5 rounded-full bg-[#0F172A] text-white hover:bg-[#1E293B] transition-all duration-200 flex items-center gap-2 shadow-[0_2px_8px_rgb(0,0,0,0.12)] hover:shadow-[0_4px_16px_rgb(0,0,0,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Get Started
                </Link>
              </motion.div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-black/[0.03] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeMobile} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-black/[0.06] shadow-[0_20px_60px_rgb(0,0,0,0.12)] p-4"
            >
              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 pt-3 border-t border-black/[0.04] flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMobile}
                  className="px-4 py-3 rounded-full bg-[#0F172A] text-white text-sm font-semibold text-center hover:bg-[#1E293B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
