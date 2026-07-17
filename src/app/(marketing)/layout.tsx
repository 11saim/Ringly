import { MarketingHeader } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main-content" className="skip-nav">
        Skip to content
      </a>
      <MarketingHeader />
      <main id="main-content">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
