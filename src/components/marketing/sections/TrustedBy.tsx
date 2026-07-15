"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,
  Scissors,
  UtensilsCrossed,
  ShoppingBag,
  Wrench,
  Briefcase,
  Store,
} from "lucide-react";

const categories = [
  { icon: Stethoscope, label: "Clinics", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Scissors, label: "Salons", color: "text-pink-600", bg: "bg-pink-50" },
  { icon: UtensilsCrossed, label: "Restaurants", color: "text-orange-600", bg: "bg-orange-50" },
  { icon: ShoppingBag, label: "Retail Stores", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Wrench, label: "Repair Shops", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: Briefcase, label: "Consultants", color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: Store, label: "E-commerce", color: "text-violet-600", bg: "bg-violet-50" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function TrustedBy() {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden" aria-labelledby="trusted-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12"
        >
          <p id="trusted-heading" className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">
            Trusted by modern businesses
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
            From salons to clinics, Ringly handles it all
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="flex flex-wrap justify-center gap-3 sm:gap-4"
          role="list"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.label}
              variants={itemVariants}
              whileHover={{ scale: 1.04, y: -2 }}
              className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-black/[0.06] bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-default"
              role="listitem"
            >
              <div className={`p-1.5 sm:p-2 rounded-xl ${cat.bg}`} aria-hidden="true">
                <cat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${cat.color}`} />
              </div>
              <span className="text-sm font-semibold text-slate-700">{cat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
