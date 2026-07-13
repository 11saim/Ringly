"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AmbientAuthBackdrop } from "@/components/marketing/AmbientAuthBackdrop";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

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
    <div className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden">
      <div className="absolute inset-0 -z-10"><AmbientAuthBackdrop businessName={name} /></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/95 dark:bg-black/70 backdrop-blur-xl shadow-2xl p-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-primary text-primary-foreground font-mono text-sm">⌘</span>
            Ringly
          </Link>
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight">Create your agent</h1>
          <p className="mt-1 text-sm text-muted-foreground">Free forever. No card required.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label className="mb-1.5 block">Business name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Bloom Studio" />
              <div className="mt-1 text-[11px] text-muted-foreground">{name ? `${name}&apos;s agent is warming up…` : "This is what your agent will call itself."}</div>
            </div>
            <div>
              <Label className="mb-1.5 block">Work email</Label>
              <Input type="email" required placeholder="you@bloom.com" />
            </div>
            <div>
              <Label className="mb-1.5 block">Phone (with country code)</Label>
              <div className="flex gap-2">
                <select className="rounded-md border border-input bg-background px-2 text-sm">
                  <option>+34</option><option>+1</option><option>+44</option><option>+52</option>
                </select>
                <Input required placeholder="611 22 33 44" />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">Password</Label>
              <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required placeholder="8+ chars, 1 number" />
              <div className="mt-1.5 flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded ${i < score ? (score >= 3 ? "bg-success" : score === 2 ? "bg-warning" : "bg-destructive") : "bg-border"}`} />
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">Confirm password</Label>
              <Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} required />
              {mismatch && <div className="mt-1 text-xs text-destructive">Passwords don&apos;t match.</div>}
            </div>
            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90" disabled={loading || mismatch}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
            </Button>
            <div className="text-[11px] text-muted-foreground text-center">By continuing you agree to our Terms &amp; Privacy.</div>
          </form>
          <div className="mt-6 text-sm text-muted-foreground">
            Have an account? <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
          </div>
      </div>
    </div>
  );
}
