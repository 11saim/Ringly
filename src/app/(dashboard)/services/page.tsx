"use client";

import { AppShell } from "@/components/app/AppShell";
import { motion } from "framer-motion";
import { Scissors, Plus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const CARD = "rounded-[16px] border border-border/30 bg-card shadow-[var(--shadow-card)]";

const services = [
  { name: "Balayage", duration: "3h", price: "$420", category: "Color" },
  { name: "Men's Haircut", duration: "45m", price: "$80", category: "Cut" },
  { name: "Hair Coloring", duration: "2.5h", price: "$380", category: "Color" },
  { name: "Blow Dry & Style", duration: "1h", price: "$120", category: "Styling" },
  { name: "Beard Trim", duration: "30m", price: "$35", category: "Grooming" },
  { name: "Deep Conditioning", duration: "45m", price: "$60", category: "Treatment" },
];

export default function ServicesPage() {
  return (
    <AppShell
      title="Services"
      actions={
        <button className={cn("inline-flex items-center gap-2 rounded-[10px] px-3.5 py-2 text-[13px] font-semibold bg-accent text-white hover:bg-accent-hover transition-all duration-150")}>
          <Plus size={14} strokeWidth={2} />
          Add Service
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <motion.div
            key={s.name}
            variants={fadeUp}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className={cn(CARD, "p-5 cursor-pointer transition-all duration-150 hover:shadow-[var(--shadow-card-hover)] hover:border-border/50")}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent/8">
                <Scissors size={18} strokeWidth={1.5} className="text-accent" />
              </div>
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground/60">{s.category}</span>
            </div>
            <h3 className="text-[14px] font-semibold text-foreground mb-1">{s.name}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-muted-foreground/45">
                <Clock size={11} strokeWidth={1.5} />
                <span className="text-[12px]">{s.duration}</span>
              </div>
              <span className="text-[16px] font-bold text-foreground tabular-nums">{s.price}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </AppShell>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};
