import FloatingConversations from "@/components/auth/FloatingConversations";
import { RinglyMark } from "@/components/auth/RinglyMark";
import ShapeGrid from "@/components/ui/ShapeGrid";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#11131A] text-[#F2F3F5]">
      {/* Dynamic Background glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.2)_0%,transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.2)_0%,transparent_50%)]" />

      {/* Central glow for the form to make the background exciting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] sm:h-[600px] sm:w-[600px] bg-primary/20 sm:bg-primary/15 blur-[80px] sm:blur-[120px] rounded-full" />

      {/* ShapeGrid Animated Grid Background */}
      <div className="absolute inset-0 opacity-40 z-0">
        <ShapeGrid 
          speed={0.5} 
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(255,255,255,0.08)"
          hoverFillColor="rgba(255,255,255,0.05)"
          shape="square" 
          hoverTrailAmount={5} 
        />
      </div>

      {/* Floating Conversations in the background - hidden on mobile/tablet to prevent overlap */}
      <div className="hidden lg:block absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
        <FloatingConversations />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex w-full flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-10 lg:py-0">
        
        {/* Logo - Centered on mobile, absolute top-left on desktop */}
        <div className="lg:absolute lg:top-8 lg:left-10 mb-8 lg:mb-0">
          <RinglyMark />
        </div>

        <div className="w-full max-w-[440px]">
          {children}
        </div>

      </main>
    </div>
  );
}
