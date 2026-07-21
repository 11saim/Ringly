"use client";

import { ChatSimulation } from "./ChatSimulation";

export function PhoneMockup() {

  return (
    <div className="relative w-full h-full">
        {/* Screen */}
        <div className="absolute left-[8px] top-[6px] w-full max-w-[300px] mx-auto bg-black rounded-[2.7rem] overflow-hidden h-[640px]">
          {/* Dynamic Island */}
          <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-30 ring-1 ring-white/15" aria-hidden="true">
            <div className="absolute top-[13px] right-[10px] w-[3px] h-[3px] rounded-full bg-[#FF3B30]" />
          </div>

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 h-[48px] flex items-end justify-between pl-[20px] pr-[15px] pb-[8px] z-20">
            <span className="text-white text-[15px] font-semibold">9:41</span>
            <div className="flex items-center gap-[3px]" aria-hidden="true">
              <svg width="18" height="12" viewBox="0 0 16 11" fill="white">
                <rect x="0" y="7" width="3" height="4" rx="0.5" />
                <rect x="4" y="5" width="3" height="6" rx="0.5" />
                <rect x="8" y="3" width="3" height="8" rx="0.5" />
                <rect x="12" y="0" width="3" height="11" rx="0.5" />
              </svg>
              <svg width="16" height="12" viewBox="0 0 14 11" fill="white">
                <path d="M7 10.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" />
                <path d="M3.5 7.5C4.5 6.3 5.7 5.5 7 5.5s2.5.8 3.5 2" stroke="white" strokeWidth="1.2" fill="none" />
                <path d="M1 4.5C2.7 2.6 4.8 1.5 7 1.5s4.3 1.1 6 3" stroke="white" strokeWidth="1.2" fill="none" />
              </svg>
              <svg width="28" height="12" viewBox="0 0 25 11" fill="none">
                <rect x="0" y="0" width="22" height="11" rx="2" stroke="white" strokeWidth="1" />
                <rect x="1.5" y="1.5" width="19" height="8" rx="1" fill="white" />
                <rect x="23" y="3" width="2" height="5" rx="1" fill="white" opacity="0.4" />
              </svg>
            </div>
          </div>

          {/* WhatsApp Header */}
          <div
            className="absolute top-[48px] left-0 right-0 px-[12px] py-[10px] flex items-center gap-[5px] z-10"
            style={{ background: "#0B1014" }}
          >
            {/* Back arrow */}
            <div className="text-white shrink-0" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </div>

            {/* Avatar */}
            <div className="w-[30px] h-[30px] rounded-full shrink-0 flex items-center justify-center" style={{ background: "#6D5844" }} aria-hidden="true">
              <span className="text-white text-[13px] font-medium">S</span>
            </div>

            {/* Contact name */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-[14px] leading-[1.2] truncate">Salon</p>
            </div>

            {/* Header icons */}
            <div className="flex items-center text-white shrink-0" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <svg width="12" height="12" className="relative left-[1px] top-[4.5px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.8" />
                <circle cx="12" cy="12" r="1.8" />
                <circle cx="12" cy="19" r="1.8" />
              </svg>
            </div>
          </div>

          {/* Chat background with image */}
          <div className="absolute top-[95px] bottom-[78px] left-0 right-0 overflow-hidden">
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src="WhatsApp-Background.jpeg"
              alt=""
              aria-hidden="true"
            />
            <div className="absolute inset-0 z-10">
              <ChatSimulation />
            </div>
          </div>

          {/* Input bar */}
          <div
            className="absolute bottom-0 left-0 right-0 px-[10px] pt-[10px] pb-[28px] flex items-center gap-[8px]"
            style={{ background: "#1E282A" }}
          >
            <div className="text-[#8696A0] shrink-0 p-[2px]" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <div className="flex-1 relative">
              <div className="absolute left-[7px] top-1/2 -translate-y-1/2 w-[2px] h-[18px] bg-[#00A884] rounded-full" />
              <div
                className="rounded-full pl-[10px] py-[10px] text-[13px] text-[#8696A0]"
                style={{ background: "#1F272A" }}
              >
                Message
              </div>
            </div>
            <div className="text-[#8696A0] shrink-0 p-[2px]" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </div>
            <div className="text-[#8696A0] shrink-0 p-[2px]" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <div
              className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#21C063" }}
              aria-hidden="true"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[120px] h-[4px] rounded-full bg-white/80 z-20" aria-hidden="true" />
        </div>
      <img src="phone-mockup.png" alt="phone-mockup" className="max-h-[650px] w-auto" />
    </div>
  );
}
