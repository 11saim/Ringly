import FloatingConversations from "@/components/auth/FloatingConversations";
import { AuthHeader } from "@/components/auth/AuthHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#0D0E11", color: "#F2F3F5" }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(79,70,229,0.14) 0%, transparent 72%)" }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 55%, rgba(13,14,17,0.88) 100%)" }} />

      <FloatingConversations />
      <AuthHeader />

      <main className="relative z-20 flex min-h-[calc(100vh-80px-52px)]">
        <div className="flex flex-1 items-center justify-center px-4 pb-12">
          {children}
        </div>
      </main>

    </div>
  );
}
