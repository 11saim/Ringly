"use client";

import { AppShell } from "@/components/app/AppShell";
import { TenantProvider, useTenantContext } from "@/lib/tenant-context";

function TenantLoader({ children }: { children: React.ReactNode }) {
  const { loading } = useTenantContext();
  if (loading) return null;
  return <AppShell>{children}</AppShell>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TenantProvider>
      <TenantLoader>{children}</TenantLoader>
    </TenantProvider>
  );
}
