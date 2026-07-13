"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AmbientAuthBackdrop } from "@/components/marketing/AmbientAuthBackdrop";

function scorePw(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const score = useMemo(() => scorePw(pw), [pw]);
  const mismatch = pw2.length > 0 && pw !== pw2;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/onboarding"), 700);
  };

  return (
    <div className="relative min-h-screen flex">
      <div className="absolute inset-0 hidden lg:block">
        <AmbientAuthBackdrop businessName={name || undefined} />
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
            <h1 className="text-2xl font-semibold tracking-tight">Create your agent</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Free forever. No card required.</p>
          </div>

          <div className="rounded-xl border border-white/[0.08] lg:border-white/[0.12] bg-white/[0.03] lg:bg-white/[0.06] backdrop-blur-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] lg:shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-white/60">Business name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Bloom Studio" className="h-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20" />
                {name && <p className="mt-1 text-xs text-white/30">{name}&apos;s agent is warming up…</p>}
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-white/60">Work email</Label>
                <Input type="email" required placeholder="you@bloom.com" className="h-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20" />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-white/60">Phone (with country code)</Label>
                <div className="flex gap-2">
                  <select className="h-10 rounded-md border border-white/[0.08] bg-white/[0.04] px-2 text-sm text-white">
                    <option>+34</option><option>+1</option><option>+44</option><option>+52</option>
                  </select>
                  <Input required placeholder="611 22 33 44" className="h-10 flex-1 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20" />
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-white/60">Password</Label>
                <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required placeholder="8+ chars, 1 number" className="h-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20" />
                <div className="mt-1.5 flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded transition-colors ${i < score ? (score >= 3 ? "bg-emerald-400" : score === 2 ? "bg-amber-400" : "bg-red-400") : "bg-white/[0.08]"}`} />
                  ))}
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium text-white/60">Confirm password</Label>
                <Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} required className="h-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20" />
                {mismatch && <p className="mt-1 text-xs text-red-400">Passwords don&apos;t match.</p>}
              </div>
              <Button type="submit" className="w-full h-10 bg-primary hover:bg-primary/90 text-white" disabled={loading || mismatch}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
              </Button>
              <p className="text-[11px] text-white/25 text-center">By continuing you agree to our Terms &amp; Privacy.</p>
            </form>
          </div>

          <p className="text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
