import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { WalletProvider } from "@/lib/wallet";
import { WalletButton } from "@/components/WalletButton";

export const metadata: Metadata = {
  title: "Payflow — recurring payments on Stellar",
  description:
    "Pull-based recurring payments for Stellar. Subscribers authorize a bounded, revocable mandate once; anyone can settle it when it falls due.",
};

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/account", label: "My account" },
  { href: "/merchant", label: "Merchant" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-5">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-edge py-5">
              <div className="flex items-center gap-6">
                <Link href="/" className="text-lg font-semibold tracking-tight">
                  Pay<span className="text-accent">flow</span>
                </Link>
                <nav className="flex gap-4 text-sm text-muted">
                  {NAV.map((item) => (
                    <Link key={item.href} href={item.href} className="hover:text-slate-100">
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <WalletButton />
            </header>

            <main className="flex-1 py-8">{children}</main>

            <footer className="border-t border-edge py-6 text-xs text-muted">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>Stellar testnet · unaudited · do not use with real funds</span>
                <a
                  href="https://github.com/payflow-protocol"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-200"
                >
                  GitHub
                </a>
              </div>
            </footer>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
