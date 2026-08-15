"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { RinglyMark } from "@/components/auth/RinglyMark";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordValues) {
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      await supabase.auth.signOut();
      router.push("/login?message=Password updated — please log in.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[var(--parchment)]">
      <main className="relative z-10 flex w-full flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-10 lg:py-0">
        <div className="mb-8">
          <RinglyMark />
        </div>

        <div className="w-full max-w-[440px]">
          <div className="w-full rounded-2xl border border-[var(--slate)] bg-white p-6 sm:p-8 shadow-[var(--shadow-elevated)]">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-[family-name:var(--font-dm-sans)] mb-1">
                Set new password
              </h1>
              <p className="text-sm text-[var(--ash)]">
                Choose a strong password for your account.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-[var(--ember)]/8 border border-[var(--ember)]/20 py-2.5 px-4 text-center text-xs font-medium text-[var(--ember)]">
                {error}
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label htmlFor="reset-password" className="text-sm font-medium text-[var(--ink)]">
                  New password
                </label>
                <input
                  id="reset-password"
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
                <label htmlFor="reset-confirm" className="text-sm font-medium text-[var(--ink)]">
                  Confirm password
                </label>
                <input
                  id="reset-confirm"
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
                  "Update password"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--ash)]">
              <Link
                href="/login"
                className="font-semibold text-[var(--cedar)] hover:text-[var(--forest)] transition-colors"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
