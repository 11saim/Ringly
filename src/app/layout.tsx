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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
