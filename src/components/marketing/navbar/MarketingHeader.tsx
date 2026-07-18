"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";

const navLinks = [
  { label: "How It Works", href: "#solution" },
  { label: "Features", href: "#capabilities" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const rafRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen, closeMobile]);

  return (
    <>
      {/* Backdrop - rendered outside pill wrapper so it doesn't cover the navbar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[49] bg-white/40 backdrop-blur-md animate-backdrop-in md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Pill wrapper */}
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center pt-4 px-3 sm:px-4 pointer-events-none">
        <div
          className="relative flex items-center justify-between pointer-events-auto bg-white rounded-full border border-black/[0.06] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            maxWidth: scrolled ? "720px" : "980px",
            width: "100%",
            boxShadow: scrolled
              ? "0 4px 20px rgba(0,0,0,0.08)"
              : "0 2px 12px rgba(0,0,0,0.04)",
            paddingLeft: scrolled ? "6px" : "8px",
            paddingRight: scrolled ? "6px" : "8px",
            paddingTop: "6px",
            paddingBottom: "6px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 text-[#0F172A] font-semibold text-[15px] tracking-tight rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] shrink-0"
            aria-label="Ringly - Home"
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#c0f4de]"
              aria-hidden="true"
            >
              <MessageSquareText className="h-4 w-4 text-white" />
            </div>
            <span
              className="transition-all text-xl duration-300 overflow-hidden whitespace-nowrap"
              style={{
                maxWidth: scrolled ? "0px" : "80px",
                opacity: scrolled ? 0 : 1,
                marginRight: scrolled ? "0px" : "4px",
              }}
            >
              Ringly
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 min-w-0" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap px-3.5 py-2 text-[13px] font-medium text-[#475569] hover:text-[#0F172A] rounded-full hover:bg-slate-50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="moving-border-wrapper">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center w-[120px] px-5 py-3 bg-white text-[#0F172A] rounded-full font-semibold text-[13px] transition-all duration-300 hover:shadow-[0_4px_16px_rgba(34,197,94,0.12)]"
              >
                Sign in
              </Link>
            </div>
            <FlowButton text="Get Started" href="/signup" className="!w-[140px] !py-3 !px-5 !text-[13px]" />
          </div>

          {/* Mobile: Hamburger */}
          <div className="flex md:hidden items-center gap-1 shrink-0">
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span className="absolute h-[18px] w-[18px] flex flex-col justify-center gap-[5px]" aria-hidden="true">
                <span
                  className="block h-[1.5px] bg-[#0F172A] rounded-full origin-center transition-all duration-300"
                  style={{
                    transform: mobileOpen ? "rotate(45deg) scaleX(1) translatey(8.5px)" : "rotate(0) scaleX(1)",
                  }}
                />
                <span
                  className="block h-[1.5px] bg-[#0F172A] rounded-full transition-all duration-300"
                  style={{
                    opacity: mobileOpen ? 0 : 1,
                    transform: mobileOpen ? "translateX(6px) scaleX(0)" : "translateX(0) scaleX(1)",
                  }}
                />
                <span
                  className="block h-[1.5px] bg-[#0F172A] rounded-full origin-center transition-all duration-300"
                  style={{
                    transform: mobileOpen ? "translatex(-6px) translatey(-6px) rotate(-45deg) scaleX(1)" : "rotate(0) scaleX(1)",
                  }}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-x-0 top-[100px] z-50 px-4 pointer-events-auto">
            <div
              className="rounded-2xl bg-white border border-black/[0.06] shadow-[0_16px_48px_rgba(0,0,0,0.12)] overflow-hidden animate-dropdown-in"
            >
              <nav className="flex flex-col gap-1 p-3" aria-label="Mobile navigation">
                {navLinks.map((link, i) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className="px-4 py-3 rounded-xl text-[15px] font-medium text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] animate-dropdown-link"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="border-t border-black/[0.04] p-3 flex flex-col gap-2">
                <div className="moving-border-wrapper w-full">
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className="block w-full px-5 py-2.5 rounded-full bg-white text-[#0F172A] text-[13px] font-semibold text-center transition-all duration-300 hover:shadow-[0_4px_16px_rgba(34,197,94,0.12)] animate-dropdown-link"
                    style={{ animationDelay: `${navLinks.length * 40}ms` }}
                  >
                    Sign In
                  </Link>
                </div>
                <div className="moving-border-wrapper w-full">
                  <Link
                    href="/signup"
                    onClick={closeMobile}
                    className="block w-full px-5 py-2.5 rounded-full bg-[#111111] text-white text-[13px] font-semibold text-center hover:bg-[#1E293B] transition-colors animate-dropdown-link"
                    style={{ animationDelay: `${(navLinks.length + 1) * 40}ms` }}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
