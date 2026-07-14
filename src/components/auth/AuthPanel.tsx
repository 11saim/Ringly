"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Mode = "signup" | "login";

interface Props {
  initialMode?: Mode;
}

export default function AuthPanel({ initialMode = "signup" }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    setSubmitted(false);
    window.history.replaceState(null, '', `/${newMode}`);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setTimeout(() => router.push(isSignup ? "/onboarding" : "/dashboard"), 1200);
    }, 800);
  };

  return (
    <div className="relative w-full rounded-[24px] sm:rounded-[32px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl border border-white/[0.12]">
      {/* Subtle top glow on the card */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="mb-5 sm:mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          {isSignup ? "Deploy your first agent" : "Back in control"}
        </h1>
        <p className="text-sm text-white/50">
          {isSignup ? "WhatsApp, voice & web — one platform." : "Your agents are live and waiting."}
        </p>
      </div>

      <div className="flex rounded-xl sm:rounded-2xl bg-white/[0.04] p-1.5 mb-4 sm:mb-5 border border-white/[0.05]">
        {(["signup", "login"] as const).map((m) => (
          <button
            key={m}
            onClick={() => handleModeSwitch(m)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 ${mode === m
              ? "bg-primary text-white shadow-md scale-[1.02]"
              : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
          >
            {m === "signup" ? "Create account" : "Sign in"}
          </button>
        ))}
      </div>

      <button
        onClick={() => setSubmitted(true)}
        className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 mb-4 sm:mb-5 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/30 hover:scale-[1.01]"
      >
        <svg width="18" height="18" viewBox="0 0 16 16">
          <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.3a3.67 3.67 0 01-1.6 2.41v2h2.6c1.52-1.4 2.4-3.46 2.4-5.87z" fill="#4285F4" />
          <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.77 4.77 0 01-2.7.75 4.76 4.76 0 01-4.47-3.29H.87v2.07A8 8 0 008 16z" fill="#34A853" />
          <path d="M3.53 9.52A4.8 4.8 0 013.28 8c0-.53.09-1.04.25-1.52V4.4H.87A8 8 0 000 8c0 1.29.31 2.51.87 3.6l2.66-2.07z" fill="#FBBC05" />
          <path d="M8 3.18a4.32 4.32 0 013.06 1.2l2.3-2.3A7.7 7.7 0 008 0 8 8 0 00.87 4.4l2.66 2.08A4.76 4.76 0 018 3.18z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-4 mb-4 sm:mb-5">
        <div className="h-px flex-1 bg-white/[0.08]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">OR</span>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <form onSubmit={submit} className="flex flex-col">
        {/* Fixed height container prevents height flickering and prevents fields from overlapping the submit button */}
        <div className="flex flex-col gap-3 sm:gap-4 h-[250px] sm:h-[270px]">
          {isSignup && <InputField label="Full Name" type="text" placeholder="Alex Rivera" required />}
          <InputField label="Email Address" type="email" placeholder="you@company.com" required />
          <div className="relative">
            <InputField
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder={isSignup ? "Min. 8 characters" : "Your password"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-[50px] cursor-pointer text-xs font-medium text-white/50 hover:text-white transition-colors leading-0"
            >
              {showPass ? "Hide" : "Show"}
            </button>
            {!isSignup && (
              <div className="mt-3 text-right">
                <button type="button" className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                  Forgot password?
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-primary py-3 sm:py-3.5 text-sm font-bold text-white transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? (
            <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              {isSignup ? "Create workspace" : "Sign in to Ringly"}
              <span className="transition-transform group-hover:translate-x-1 leading-0">→</span>
            </>
          )}
        </button>

        {submitted && (
          <div className="rounded-2xl bg-green-500/10 border border-green-500/20 py-2.5 px-4 text-center text-xs font-semibold text-green-400 mt-2">
            {isSignup ? "Workspace ready to connect." : "Authentication flow ready."}
          </div>
        )}
      </form>

      <p className="mt-5 sm:mt-6 text-center text-xs text-white/50">
        {isSignup ? "Already have an account?" : "New to Ringly?"}{" "}
        <button
          onClick={() => handleModeSwitch(isSignup ? "login" : "signup")}
          className="font-bold text-white hover:text-primary transition-colors ml-1 cursor-pointer"
        >
          {isSignup ? "Sign in" : "Create account"}
        </button>
      </p>
    </div>
  );
}

function InputField({ label, type, placeholder, required }: { label: string; type: string; placeholder: string; required?: boolean }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-white/70 ml-1">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.04] px-4 sm:px-5 py-3 sm:py-3.5 text-sm text-white placeholder-white/20 transition-all duration-300 focus:border-primary/60 focus:bg-white/[0.06] focus:outline-none hover:border-white/20"
      />
    </label>
  );
}
