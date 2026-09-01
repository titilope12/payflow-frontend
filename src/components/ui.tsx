import type { ReactNode } from "react";
import { explorerBase } from "@/lib/config";
import { shortAddress } from "@/lib/format";

export function Panel({
  title,
  subtitle,
  children,
  actions,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="panel">
      {(title || actions) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="panel">
      <div className="label">{label}</div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  );
}

const BADGE_TONES: Record<string, string> = {
  Active: "bg-accent/15 text-accent",
  Paused: "bg-amber-400/15 text-amber-300",
  Cancelled: "bg-rose-400/15 text-rose-300",
  Completed: "bg-sky-400/15 text-sky-300",
};

export function Badge({ status }: { status: string }) {
  const tone = BADGE_TONES[status] ?? "bg-white/10 text-slate-300";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>{status}</span>
  );
}

export function AddressLink({ value, kind = "account" }: { value: string; kind?: "account" | "contract" }) {
  return (
    <a
      href={`${explorerBase}/${kind}/${value}`}
      target="_blank"
      rel="noreferrer"
      className="mono text-muted underline-offset-2 hover:text-accent hover:underline"
      title={value}
    >
      {shortAddress(value, 6)}
    </a>
  );
}

export function TxLink({ hash }: { hash: string }) {
  return (
    <a
      href={`${explorerBase}/tx/${hash}`}
      target="_blank"
      rel="noreferrer"
      className="mono text-muted underline-offset-2 hover:text-accent hover:underline"
    >
      {shortAddress(hash, 6)}
    </a>
  );
}

export function Notice({ tone, children }: { tone: "error" | "ok" | "info"; children: ReactNode }) {
  const tones = {
    error: "border-rose-500/40 bg-rose-500/10 text-rose-200",
    ok: "border-accent/40 bg-accent/10 text-accent",
    info: "border-edge bg-white/5 text-muted",
  } as const;
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm ${tones[tone]}`}>{children}</div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-8 text-center text-sm text-muted">{children}</p>;
}
