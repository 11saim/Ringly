"use client";

import { createContext, useContext } from "react";

export type BusinessType = "Service" | "Product";

export interface Tenant {
  id: string;
  name: string;
  handle: string;
  businessType: BusinessType;
  plan: string;
  avatarInitials: string;
}

const mockTenant: Tenant = {
  id: "bloom-001",
  name: "Bloom Studio",
  handle: "bloom",
  businessType: "Service",
  plan: "Growth",
  avatarInitials: "BS",
};

const TenantContext = createContext<Tenant>(mockTenant);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  return (
    <TenantContext.Provider value={mockTenant}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
