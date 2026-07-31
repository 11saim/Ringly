import { RinglyMark } from "@/components/auth/RinglyMark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[var(--parchment)]">
      <main className="relative z-10 flex w-full flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-10 lg:py-0">

        {/* Logo */}
        <div className="mb-8">
          <RinglyMark />
        </div>

        <div className="w-full max-w-[440px]">
          {children}
        </div>

      </main>
    </div>
  );
}
