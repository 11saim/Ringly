"use client";

import { AppShell } from "@/components/layout/AppShell";
import { MessageSquare, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="flex flex-col items-center text-center max-w-[400px]">
          {/* Icon */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-card">
            <MessageSquare size={28} strokeWidth={1.5} className="text-muted-foreground/40" />
          </div>

          {/* Heading */}
          <h2 className="text-[18px] font-semibold text-foreground tracking-tight mb-2">
            Welcome to Ringly
          </h2>

          {/* Description */}
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-8">
            Your AI workspace is ready. Start by connecting your WhatsApp number or exploring the settings.
          </p>

          {/* Primary CTA */}
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-medium",
              "bg-accent text-white",
              "transition-all duration-150",
              "hover:bg-accent-hover active:bg-accent-active",
              "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
            )}
          >
            Get Started
            <ArrowRight size={14} strokeWidth={2} />
          </button>

          {/* Secondary link */}
          <button
            type="button"
            className={cn(
              "mt-4 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground/60",
              "transition-colors duration-150",
              "hover:text-foreground",
            )}
          >
            <BookOpen size={12} strokeWidth={1.8} />
            Read the documentation
          </button>
        </div>
      </div>
    </AppShell>
  );
}


