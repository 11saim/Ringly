"use client";

export function AuthHeader() {
  return (
    <header className="relative z-20 flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-3">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <circle cx="13" cy="13" r="12" stroke="#4f46e5" strokeWidth="1.5" />
          <circle cx="13" cy="13" r="3.5" fill="#4f46e5" />
          <circle cx="13" cy="13" r="7.5" stroke="#4f46e5" strokeWidth="1" strokeDasharray="2 2.8" opacity="0.45" />
        </svg>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.24em", color: "rgba(242,243,245,0.4)", fontWeight: 700 }}>RINGLY</span>
      </div>
    </header>
  );
}
