"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface FloatingCardProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  label: string;
  value: string;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export function FloatingCard({
  icon: Icon,
  iconColor = "text-emerald-600",
  iconBg = "bg-emerald-50",
  label,
  value,
  className = "",
  delay = 0,
  duration = 4,
  yOffset = 10,
}: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: [0, -yOffset, 0],
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: {
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
        scale: { duration: 0.5, delay },
      }}
      className={`absolute bg-white/80 backdrop-blur-md border border-black/[0.06] p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.1)] flex items-center gap-3 z-10 transition-shadow duration-300 ${className}`}
    >
      <div className={`p-2 rounded-xl ${iconBg}`} aria-hidden="true">
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-xs sm:text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </motion.div>
  );
}
