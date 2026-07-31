"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      const { data: tenant } = await supabase
        .from("tenants")
        .select("business_type")
        .single();

      if (tenant?.business_type) {
        router.push("/overview");
      } else {
        router.push("/onboarding");
      }
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
          Welcome back
        </h1>
        <p className="text-sm text-[var(--ash)]">
          Sign in to your Ringly dashboard.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-lg bg-[var(--ember)]/8 border border-[var(--ember)]/20 py-2.5 px-4 text-center text-xs font-medium text-[var(--ember)]">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-sm font-medium text-[var(--ink)]">
            Email
          </label>
          <input
            id="login-email"
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
          <label htmlFor="login-password" className="text-sm font-medium text-[var(--ink)]">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="Your password"
            className="flex h-9 w-full rounded-md border border-[var(--slate)] bg-white px-3 py-1.5 text-sm text-[var(--ink)] placeholder:text-[var(--ash)]/50 transition-colors focus:border-[var(--cedar)] focus:outline-none focus:ring-2 focus:ring-[var(--cedar)]/20"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs font-medium text-[var(--ember)]">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="text-right">
          <button
            type="button"
            className="text-xs font-medium text-[var(--cedar)] hover:text-[var(--forest)] transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--cedar)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--cedar)]/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            "Log in"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--ash)]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[var(--cedar)] hover:text-[var(--forest)] transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
