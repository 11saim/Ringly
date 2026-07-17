"use client";

import { useState } from "react";
import { useRef } from "react";
import type { ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  className = "",
  href,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const moveX = x * 30; // map -0.5..0.5 to -15..15
  const moveY = y * 16; // map -0.5..0.5 to -8..8

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setX((e.clientX - rect.left) / rect.width - 0.5);
    setY((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setX(0);
    setY(0);
  };

  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      ref={ref as never}
      {...wrapperProps}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `translate(${moveX}px, ${moveY}px)` }}
      className={className}
    >
      {children}
    </Wrapper>
  );
}
