"use client";

import { AppShell } from "@/components/app/AppShell";
import { TenantProvider } from "@/lib/tenant-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TenantProvider>
      <AppShell>{children}</AppShell>
    </TenantProvider>
  );
}
