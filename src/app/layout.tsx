import type { Metadata } from "next";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

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
    "Pakistan",
    "WhatsApp Business",
  ],
  openGraph: {
    title: "Ringly — AI agents that sell and book for your business",
    description:
      "AI agents on WhatsApp and voice that handle real conversations, take bookings, and grow your revenue. Live in minutes, no code.",
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
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Ringly",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description:
                "AI agents on WhatsApp and voice that handle real conversations, take bookings, and grow your revenue.",
              url: "https://ringly.ai",
              offers: {
                "@type": "AggregateOffer",
                lowPrice: "0",
                highPrice: "199",
                priceCurrency: "USD",
                offerCount: 3,
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "500",
              },
            }),
          }}
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
