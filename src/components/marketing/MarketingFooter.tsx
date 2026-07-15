import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 md:gap-10 text-sm">
        <div className="col-span-2">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground font-mono text-sm">⌘</span>
            Ringly
          </div>
          <p className="mt-3 max-w-xs text-muted-foreground text-sm">AI agents that sell and book for small businesses. Live on WhatsApp and voice in minutes.</p>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</div>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-primary">Overview</Link></li>
            <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
            <li><Link href="/" className="hover:text-primary">Integrations</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resources</div>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-primary">Docs</Link></li>
            <li><Link href="/" className="hover:text-primary">Changelog</Link></li>
            <li><Link href="/" className="hover:text-primary">Guides</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</div>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-primary">About</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/" className="hover:text-primary">Careers</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
          <div>&copy; {new Date().getFullYear()} Ringly, Inc.</div>
          <div className="flex gap-5">
            <Link href="/">Privacy</Link>
            <Link href="/">Terms</Link>
            <Link href="/">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
