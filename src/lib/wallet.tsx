"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import { config } from "./config";
import type { SignXdr } from "./payflow";

const STORAGE_KEY = "payflow.wallet";

interface WalletState {
  address: string | null;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signXdr: SignXdr;
}

const WalletContext = createContext<WalletState | null>(null);

/**
 * The kit registers browser custom elements on construction, so it is imported
 * dynamically and only ever instantiated client-side. Building it at module
 * scope breaks the Next.js server render.
 */
let kitPromise: Promise<StellarWalletsKit> | null = null;

async function getKit(): Promise<StellarWalletsKit> {
  if (!kitPromise) {
    kitPromise = (async () => {
      const mod = await import("@creit.tech/stellar-wallets-kit");
      return new mod.StellarWalletsKit({
        network: config.networkPassphrase as unknown as (typeof mod.WalletNetwork)[keyof typeof mod.WalletNetwork],
        modules: mod.allowAllModules(),
      });
    })();
  }
  return kitPromise;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore the previous session without prompting the user again.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const { walletId, address: saved } = JSON.parse(stored) as {
        walletId: string;
        address: string;
      };
      void getKit().then((kit) => {
        kit.setWallet(walletId);
        setAddress(saved);
      });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const kit = await getKit();
      await kit.openModal({
        onWalletSelected: async (option) => {
          try {
            kit.setWallet(option.id);
            const { address: selected } = await kit.getAddress();
            setAddress(selected);
            window.localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({ walletId: option.id, address: selected }),
            );
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not read address");
          } finally {
            setConnecting(false);
          }
        },
        onClosed: () => setConnecting(false),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open wallet");
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const kit = await getKit();
    try {
      await kit.disconnect();
    } catch {
      // Some wallets have no disconnect concept; clearing local state is enough.
    }
    window.localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
  }, []);

  const signXdr = useCallback<SignXdr>(
    async (xdrString) => {
      if (!address) throw new Error("Connect a wallet first.");
      const kit = await getKit();
      const { signedTxXdr } = await kit.signTransaction(xdrString, {
        networkPassphrase: config.networkPassphrase,
        address,
      });
      return signedTxXdr;
    },
    [address],
  );

  const value = useMemo<WalletState>(
    () => ({ address, connecting, error, connect, disconnect, signXdr }),
    [address, connecting, error, connect, disconnect, signXdr],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside a WalletProvider");
  return ctx;
}
