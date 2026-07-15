import Link from "next/link";
import { MessageSquareText } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#capabilities" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#solution" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Guides", href: "#" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-black/[0.08] bg-white" role="contentinfo">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 sm:gap-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-zinc-900 font-semibold text-xl mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg" aria-label="Ringly - Home">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 text-white" aria-hidden="true">
                <MessageSquareText className="h-5 w-5" />
              </div>
              Ringly
            </Link>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Turn your existing WhatsApp number into an autonomous AI agent. No new apps, no friction.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-zinc-900 font-semibold mb-4 text-sm">{category}</h3>
              <ul className="space-y-3 text-sm text-zinc-500" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-zinc-900 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-black/[0.08] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-400">&copy; {new Date().getFullYear()} Ringly. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span>Powered by Meta Cloud API</span>
            <span aria-hidden="true">&middot;</span>
            <span>Built with LangGraph</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
