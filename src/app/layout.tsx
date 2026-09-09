import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/lib/wallet";
import { WalletLayoutInner } from "@/components/WalletLayoutInner";

export const metadata: Metadata = {
  title: "Payflow — recurring payments on Stellar",
  description:
    "Pull-based recurring payments for Stellar. Subscribers authorize a bounded, revocable mandate once; anyone can settle it when it falls due.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <WalletLayoutInner>{children}</WalletLayoutInner>
        </WalletProvider>
      </body>
    </html>
  );
}
