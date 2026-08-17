"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignupValues) {
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // If a session was created immediately (email confirmation disabled),
      // go through the callback route which handles tenant creation.
      // Otherwise show a "check your email" message — the confirmation
      // link will hit /auth/callback and handle everything.
      if (authData.session) {
        router.push("/auth/callback");
      } else {
        setConfirmationSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setError(null);
    setGoogleLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
        setGoogleLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full rounded-2xl border border-[var(--slate)] bg-white p-6 sm:p-8 shadow-[var(--shadow-elevated)]">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-dm-sans)] mb-1">
          Create your account
        </h1>
        <p className="text-sm text-[var(--ash)]">
          Get started with Ringly in minutes.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-[var(--ember)]/8 border border-[var(--ember)]/20 py-2.5 px-4 text-center text-xs font-medium text-[var(--ember)]">
          {error}
        </div>
      )}

      {confirmationSent && (
        <div className="mb-4 rounded-lg bg-[var(--cedar)]/8 border border-[var(--cedar)]/20 py-2.5 px-4 text-center text-xs font-medium text-[var(--cedar)]">
          Check your email for a confirmation link to complete your signup.
        </div>
      )}

      {/* Google sign-in */}
      <button
        type="button"
        onClick={() => void signInWithGoogle()}
        disabled={googleLoading}
        className="inline-flex w-full items-center justify-center gap-2.5 rounded-md border border-[var(--slate)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--linen)] focus:outline-none focus:ring-2 focus:ring-[var(--cedar)]/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <span className="h-4 w-4 rounded-full border-2 border-[var(--ash)]/30 border-t-[var(--ink)] animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--slate)]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-[var(--ash)]">or</span>
        </div>
      </div>

      {/* Email / password form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="text-sm font-medium text-[var(--ink)]">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder="you@company.com"
            className="flex h-9 w-full rounded-md border border-[var(--slate)] bg-white px-3 py-1.5 text-sm text-[var(--ink)] placeholder:text-[var(--ash)]/50 transition-colors focus:border-[var(--cedar)] focus:outline-none focus:ring-2 focus:ring-[var(--cedar)]/20"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs font-medium text-[var(--ember)]">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-password" className="text-sm font-medium text-[var(--ink)]">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            placeholder="Min. 8 characters"
            className="flex h-9 w-full rounded-md border border-[var(--slate)] bg-white px-3 py-1.5 text-sm text-[var(--ink)] placeholder:text-[var(--ash)]/50 transition-colors focus:border-[var(--cedar)] focus:outline-none focus:ring-2 focus:ring-[var(--cedar)]/20"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs font-medium text-[var(--ember)]">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-confirm" className="text-sm font-medium text-[var(--ink)]">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type="password"
            placeholder="Re-enter your password"
            className="flex h-9 w-full rounded-md border border-[var(--slate)] bg-white px-3 py-1.5 text-sm text-[var(--ink)] placeholder:text-[var(--ash)]/50 transition-colors focus:border-[var(--cedar)] focus:outline-none focus:ring-2 focus:ring-[var(--cedar)]/20"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-xs font-medium text-[var(--ember)]">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--cedar)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--cedar)]/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--ash)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[var(--cedar)] hover:text-[var(--forest)] transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
