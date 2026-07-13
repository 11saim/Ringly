import type { Metadata } from "next";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ringly — AI agents that sell and book for your business",
  description: "AI agents on WhatsApp and voice that handle real conversations, take bookings, and grow your revenue. Live in minutes, no code.",
  authors: [{ name: "Ringly" }],
  openGraph: {
    title: "Ringly — AI agents that sell and book for your business",
    description: "AI agents on WhatsApp and voice that handle real conversations, take bookings, and grow your revenue.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Ringly",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
