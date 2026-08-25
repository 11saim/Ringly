'use client';
import { ArrowRight } from 'lucide-react';

export function FlowButton({ text = "Modern Button", href, className = "" }: { text?: string; href?: string; className?: string }) {
  const Tag = href ? 'a' : 'button';
  const props = href ? { href } : {};

  return (
    <Tag
      {...props}
      className={`group relative inline-flex items-center justify-center gap-1 overflow-hidden rounded-full border-[1.5px] border-[#333333]/40 bg-[#111111] px-8 py-3.5 text-[15px] font-semibold text-white cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:text-[#111111] active:scale-[0.95] ${className}`}
    >
      {/* Left arrow */}
      <ArrowRight
        className="absolute w-4 h-4 left-[-25%] stroke-[#111111] fill-none z-[9] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] delay-[200ms] group-hover:left-4 group-hover:stroke-[#111111]"
      />

      {/* Text */}
      <span className="relative z-[1] -translate-x-3 transition-all duration-[800ms] ease-out delay-[100ms] group-hover:translate-x-3">
        {text}
      </span>

      {/* Circle */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] delay-[100ms] group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100" />

      {/* Right arrow */}
      <ArrowRight
        className="absolute w-4 h-4 right-4 stroke-white fill-none z-[9] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] delay-[200ms] group-hover:right-[-25%] group-hover:stroke-white"
      />
    </Tag>
  );
}
