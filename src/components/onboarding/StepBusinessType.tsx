"use client";

import { Scissors, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BusinessType } from "./types";

export function StepBusinessType({
  value,
  onChange,
}: {
  value: BusinessType | null;
  onChange: (v: BusinessType) => void;
}) {
  const options: { type: BusinessType; icon: React.ElementType; label: string; desc: string }[] = [
    { type: "service", icon: Scissors, label: "Service business", desc: "Appointments, consultations, bookings" },
    { type: "product", icon: Package, label: "Product business", desc: "Physical goods, inventory, orders" },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--ink)] font-[family-name:var(--font-dm-sans)] mb-1">
        What type of business do you run?
      </h2>
      <p className="text-sm text-[var(--ash)] mb-6">
        This determines which features are shown throughout the dashboard.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(({ type, icon: Icon, label, desc }) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all",
              value === type
                ? "border-[var(--cedar)] bg-[var(--mist)]"
                : "border-[var(--slate)] bg-white hover:border-[var(--cedar)]/40 hover:bg-[var(--mist)]/50"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                value === type
                  ? "bg-[var(--cedar)] text-white"
                  : "bg-[var(--linen)] text-[var(--ash)]"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">{label}</p>
              <p className="text-xs text-[var(--ash)] mt-0.5">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
