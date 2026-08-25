"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setError(null);
    setLoading(true);

    try {
      const checkRes = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      if (!checkRes.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      const { exists } = await checkRes.json();

      if (!exists) {
        setError("No account found with that email.");
        return;
      }

      const supabase = createClient();
      const { error: authError } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (authError) {
        setError(authError.message);
        return;
      }

      setConfirmationSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full rounded-2xl border border-[var(--slate)] bg-white p-6 sm:p-8 shadow-[var(--shadow-elevated)]">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-dm-sans)] mb-1">
          Reset your password
        </h1>
        <p className="text-sm text-[var(--ash)]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-[var(--ember)]/8 border border-[var(--ember)]/20 py-2.5 px-4 text-center text-xs font-medium text-[var(--ember)]">
          {error}
        </div>
      )}

      {confirmationSent && (
        <div className="mb-4 rounded-lg bg-[var(--cedar)]/8 border border-[var(--cedar)]/20 py-2.5 px-4 text-center text-xs font-medium text-[var(--cedar)]">
          Check your email for a reset link.
        </div>
      )}

      {!confirmationSent && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label htmlFor="forgot-email" className="text-sm font-medium text-[var(--ink)]">
              Email
            </label>
            <input
              id="forgot-email"
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

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--cedar)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--cedar)]/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-[var(--ash)]">
        Remember your password?{" "}
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
