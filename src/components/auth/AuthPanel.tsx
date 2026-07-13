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
    <div
      style={{
        width: "100%",
        maxWidth: 400,
        background: "rgba(255,255,255,0.032)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "40px 36px 36px",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 0 0 1px rgba(79,70,229,0.08) inset, 0 32px 80px rgba(0,0,0,0.5)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <div style={{ position: "relative", width: 44, height: 44 }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="21" stroke="rgba(79,70,229,0.3)" strokeWidth="1" />
            <circle cx="22" cy="22" r="14" stroke="rgba(79,70,229,0.5)" strokeWidth="1" strokeDasharray="3 4" />
            <circle cx="22" cy="22" r="5" fill="#4f46e5" />
            <circle cx="22" cy="22" r="5" fill="#4f46e5" style={{ filter: "blur(4px)", opacity: 0.6 }} />
          </svg>
        </div>
      </div>

      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: "-0.04em", color: "#F2F3F5", lineHeight: 1.15, margin: 0 }}>
          {isSignup ? "Deploy your first agent" : "Back in control"}
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(242,243,245,0.42)", marginTop: 8, lineHeight: 1.5 }}>
          {isSignup ? "WhatsApp, voice & web — one platform." : "Your agents are live and waiting."}
        </p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 0, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 3, marginBottom: 28 }}>
        {(["signup", "login"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setSubmitted(false); }}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 6, border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, transition: "all 0.18s",
              background: mode === m ? "rgba(79,70,229,0.85)" : "transparent",
              color: mode === m ? "#fff" : "rgba(242,243,245,0.35)", letterSpacing: "0.01em",
            }}
          >
            {m === "signup" ? "Create account" : "Sign in"}
          </button>
        ))}
      </div>

      {/* Google */}
      <button
        onClick={() => setSubmitted(true)}
        style={{
          width: "100%", padding: "11px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.04)", color: "rgba(242,243,245,0.75)",
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          transition: "border-color 0.2s, background 0.2s", marginBottom: 22,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.3a3.67 3.67 0 01-1.6 2.41v2h2.6c1.52-1.4 2.4-3.46 2.4-5.87z" fill="#4285F4" />
          <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.77 4.77 0 01-2.7.75 4.76 4.76 0 01-4.47-3.29H.87v2.07A8 8 0 008 16z" fill="#34A853" />
          <path d="M3.53 9.52A4.8 4.8 0 013.28 8c0-.53.09-1.04.25-1.52V4.4H.87A8 8 0 000 8c0 1.29.31 2.51.87 3.6l2.66-2.07z" fill="#FBBC05" />
          <path d="M8 3.18a4.32 4.32 0 013.06 1.2l2.3-2.3A7.7 7.7 0 008 0 8 8 0 00.87 4.4l2.66 2.08A4.76 4.76 0 018 3.18z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.14em", color: "rgba(242,243,245,0.25)" }}>OR</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
      </div>

      {/* Form */}
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {isSignup && <UnderlineField label="FULL NAME" type="text" placeholder="Alex Rivera" required />}
        <UnderlineField label="EMAIL" type="email" placeholder="you@company.com" required />
        <div>
          <UnderlineField
            label="PASSWORD"
            type={showPass ? "text" : "password"}
            placeholder={isSignup ? "min. 8 characters" : "your password"}
            required
            suffix={
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.14em", color: "rgba(242,243,245,0.3)", background: "none", border: "none", cursor: "pointer", paddingBottom: 2 }}>
                {showPass ? "HIDE" : "SHOW"}
              </button>
            }
          />
          {!isSignup && (
            <button type="button" style={{ marginTop: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#4f46e5", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              Forgot password?
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 4, width: "100%", padding: "13px 0", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)", color: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer",
            letterSpacing: "-0.01em", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, transition: "opacity 0.2s, transform 0.15s", boxShadow: "0 4px 24px rgba(79,70,229,0.35)",
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = "1"; }}
        >
          {loading ? (
            <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
          ) : (
            <>
              {isSignup ? "Create workspace" : "Sign in to Ringly"}
              <span style={{ marginLeft: 2 }}>→</span>
            </>
          )}
        </button>

        {submitted && (
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.25)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#4ade80", textAlign: "center" }}>
            {isSignup ? "Workspace ready to connect." : "Authentication flow ready."}
          </div>
        )}
      </form>

      {/* Footer switch */}
      <p style={{ marginTop: 22, textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(242,243,245,0.33)" }}>
        {isSignup ? "Already have an account?" : "New to Ringly?"}{" "}
        <button onClick={() => { setMode(isSignup ? "login" : "signup"); setSubmitted(false); }} style={{ fontWeight: 700, color: "#4f46e5", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
          {isSignup ? "Sign in" : "Create account"}
        </button>
      </p>
    </div>
  );
}

function UnderlineField({ label, type, placeholder, required, suffix }: { label: string; type: string; placeholder: string; required?: boolean; suffix?: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.17em", color: "rgba(242,243,245,0.35)", display: "block", marginBottom: 8, fontWeight: 700 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#F2F3F5", paddingBottom: 8 }}
          onFocus={(e) => { e.currentTarget.parentElement!.style.borderBottomColor = "#4f46e5"; }}
          onBlur={(e) => { e.currentTarget.parentElement!.style.borderBottomColor = "rgba(255,255,255,0.12)"; }}
        />
        {suffix}
      </div>
    </label>
  );
}
