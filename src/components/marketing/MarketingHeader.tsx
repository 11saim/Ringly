"use client";

import Link from "next/link";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { MessageSquareText, Menu, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const navLinks = [
  { label: "How It Works", href: "#solution" },
  { label: "Features", href: "#capabilities" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function MarketingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 left-0 right-0 z-50 px-4"
        role="banner"
      >
        <div
          className={`mx-auto max-w-6xl flex items-center justify-between rounded-full border border-black/[0.06] p-3 pl-5 sm:pl-6 transition-all duration-300 ${
            isScrolled
              ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
              : "bg-white/50 backdrop-blur-sm shadow-none"
          }`}
        >
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
                className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-[#0F172A] rounded-lg hover:bg-slate-50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-slate-500 hover:text-[#0F172A] px-4 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-4 right-4 bg-white rounded-2xl border border-black/[0.06] shadow-[0_20px_60px_rgb(0,0,0,0.12)] p-4"
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
