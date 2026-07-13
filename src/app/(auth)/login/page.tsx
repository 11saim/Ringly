"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AmbientAuthBackdrop } from "@/components/marketing/AmbientAuthBackdrop";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

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
    <div className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden">
      <div className="absolute inset-0 -z-10"><AmbientAuthBackdrop /></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/95 dark:bg-black/70 backdrop-blur-xl shadow-2xl p-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-primary text-primary-foreground font-mono text-sm">⌘</span>
            Ringly
          </Link>
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back.</p>
          <Button variant="outline" className="mt-6 w-full h-11 gap-2">
            <GoogleG /> Continue with Google
          </Button>
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Email</Label>
              <Input type="email" required placeholder="you@business.com" />
            </div>
            <div>
              <Label className="mb-1.5 block">Password</Label>
              <div className="relative">
                <Input type={show ? "text" : "password"} required placeholder="••••••••" />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Link href="/login" className="mt-1.5 inline-block text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
            </Button>
          </form>
          <div className="mt-6 text-sm text-muted-foreground">
            No account? <Link href="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </div>
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
  );
}
