"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const navLinks = [
    { href: "/", label: "Product" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "Customers" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/85 backdrop-blur transition-colors ${
        scrolled ? "border-b border-border" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-primary text-primary-foreground font-mono text-sm">
            ⌘
          </span>
          <span className="text-lg">Ringly</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-primary hover:bg-primary/90">Build your agent free</Button>
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs px-3">Log in</Button>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
                  <Link href="/" className="flex items-center gap-2 font-bold tracking-tight" onClick={() => setOpen(false)}>
                    <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-primary text-primary-foreground font-mono text-sm">⌘</span>
                    <span className="text-lg">Ringly</span>
                  </Link>
                </div>
                <nav className="flex flex-col px-4 py-4 gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-[color:var(--surface-2)] hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto px-4 pb-6 space-y-2">
                  <Link href="/signup" className="block" onClick={() => setOpen(false)}>
                    <Button className="w-full h-11 bg-primary hover:bg-primary/90">Build your agent free</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
