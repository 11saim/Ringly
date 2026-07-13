"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { AmbientAuthBackdrop } from "@/components/marketing/AmbientAuthBackdrop";

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 700);
  };

  return (
    <div className="relative min-h-screen flex">
      <div className="absolute inset-0 hidden lg:block">
        <AmbientAuthBackdrop />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 lg:ml-[420px] xl:ml-[480px]">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-tight">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-mono text-sm">R</span>
              <span className="text-xl">Ringly</span>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Sign in to your workspace</p>
          </div>

          <div className="rounded-xl border border-white/[0.08] lg:border-white/[0.12] bg-white/[0.03] lg:bg-white/[0.06] backdrop-blur-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] lg:shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            <Button variant="outline" className="w-full h-11 gap-2 text-sm font-medium bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] text-white/80">
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continue with Google
            </Button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-xs text-white/30">or</span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-white/60">Email</Label>
                <Input type="email" required placeholder="you@business.com" className="h-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20" />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-white/60">Password</Label>
                <div className="relative">
                  <Input type={show ? "text" : "password"} required placeholder="••••••••" className="h-10 pr-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20" />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <Link href="/login" className="mt-1.5 inline-block text-xs text-primary/80 hover:text-primary transition-colors">Forgot password?</Link>
              </div>
              <Button type="submit" className="w-full h-10 bg-primary hover:bg-primary/90 text-white" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:text-primary/80 transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
