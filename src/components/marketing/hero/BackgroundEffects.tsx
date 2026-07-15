"use client";

import { motion } from "framer-motion";

export function BackgroundEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />

      {/* Primary aurora orb — emerald */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[8%] left-[8%] w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      {/* Secondary aurora orb — indigo */}
      <motion.div
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 30, -40, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[5%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      {/* Tertiary orb — amber (subtle warmth) */}
      <motion.div
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] left-[20%] w-[300px] sm:w-[350px] h-[300px] sm:h-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  );
}
