import type { Metadata } from "next";
import { DM_Sans, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ringly — AI agents that sell and book for your business",
    template: "%s | Ringly",
  },
  description:
    "AI agents on WhatsApp and voice that handle real conversations, take bookings, and grow your revenue. Live in minutes, no code.",
  authors: [{ name: "Ringly" }],
  keywords: [
    "WhatsApp AI",
    "AI agent",
    "WhatsApp automation",
    "business booking",
    "customer service AI",
    "WhatsApp Business",
  ],
  openGraph: {
    title: "Ringly — AI agents that sell and book for your business",
    description:
      "AI agents on WhatsApp and voice that handle real conversations, take bookings, and grow your revenue.",
    type: "website",
    siteName: "Ringly",
    locale: "en_US",
    url: "https://ringly.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ringly — AI agents that sell and book for your business",
    description:
      "AI agents on WhatsApp and voice that handle real conversations, take bookings, and grow your revenue.",
    site: "@Ringly",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://ringly.ai"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
