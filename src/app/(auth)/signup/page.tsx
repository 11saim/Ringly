"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    businessName: z.string().min(1, "Business name is required"),
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

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", businessName: "" },
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

      if (authData.user) {
        const { error: tenantError } = await supabase.from("tenants").insert({
          id: authData.user.id,
          business_name: values.businessName,
        });

        if (tenantError) {
          setError("Failed to create workspace. Please try again.");
          return;
        }
      }

      router.push("/onboarding");
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
          Create your account
        </h1>
        <p className="text-sm text-[var(--ash)]">
          Get started with Ringly in minutes.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-lg bg-[var(--ember)]/8 border border-[var(--ember)]/20 py-2.5 px-4 text-center text-xs font-medium text-[var(--ember)]">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="signup-business" className="text-sm font-medium text-[var(--ink)]">
            Business name
          </label>
          <input
            id="signup-business"
            type="text"
            placeholder="Bloom Studio"
            className="flex h-9 w-full rounded-md border border-[var(--slate)] bg-white px-3 py-1.5 text-sm text-[var(--ink)] placeholder:text-[var(--ash)]/50 transition-colors focus:border-[var(--cedar)] focus:outline-none focus:ring-2 focus:ring-[var(--cedar)]/20"
            {...form.register("businessName")}
          />
          {form.formState.errors.businessName && (
            <p className="text-xs font-medium text-[var(--ember)]">
              {form.formState.errors.businessName.message}
            </p>
          )}
        </div>

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
