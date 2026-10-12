import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CircuitBoard } from "lucide-react";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { listMine, listPublicCircuits, type CircuitCard } from "@/lib/circuits.functions";

export const Route = createFileRoute("/explore")({ component: Explore });

function Explore() {
  const [publicRows, setPublicRows] = useState<CircuitCard[] | null>(null);
  const [mine, setMine] = useState<CircuitCard[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listPublicCircuits()
      .then((rows) => {
        if (!cancelled) setPublicRows(rows);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load public circuits.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-dvh bg-bg text-fg">
      <header className="flex h-14 items-center gap-3 border-b border-border px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium">
          <CircuitBoard className="size-4 text-accent" aria-hidden="true" />
          VOLTA
        </Link>
        <span className="text-sm text-muted">Explore</span>
        <Link to="/" className="ml-auto text-sm text-muted">
          Bench
        </Link>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-xl font-medium">Community circuits</h1>
        <p className="mt-1 text-sm text-muted">Public schematics. Load one onto the grid, probe it, and run it.</p>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
        <CardGrid rows={publicRows} mine={false} empty="Nothing public yet. Save a circuit and mark it public." />

        <SignedIn>
          <MineSection onRows={setMine} rows={mine} />
        </SignedIn>
        <SignedOut>
          <p className="mt-10 text-sm text-muted">
            <Link to="/login" className="text-accent">
              Sign in
            </Link>{" "}
            to see circuits saved on your account.
          </p>
        </SignedOut>
      </div>
    </main>
  );
}

function MineSection({ rows, onRows }: { rows: CircuitCard[] | null; onRows: (rows: CircuitCard[]) => void }) {
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    void listMine()
      .then((next) => {
        if (!cancelled) onRows(next);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load your circuits.");
      });
    return () => {
      cancelled = true;
    };
  }, [onRows]);

  return (
    <section className="mt-10">
      <h2 className="text-lg font-medium">Your circuits</h2>
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      <CardGrid rows={rows} mine empty="You have not saved a circuit yet." />
    </section>
  );
}

function CardGrid({ rows, empty, mine }: { rows: CircuitCard[] | null; empty: string; mine: boolean }) {
  if (!rows) return <p className="mt-4 text-sm text-muted">Loading…</p>;
  if (!rows.length) return <p className="mt-4 text-sm text-muted">{empty}</p>;
  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => (
        <li key={row.id} className="flex flex-col border border-border bg-surface p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium">{row.name}</h3>
            <span className="shrink-0 font-mono text-xs text-muted">{row.isPublic ? "public" : "private"}</span>
          </div>
          <p className="mt-2 font-mono text-xs text-muted">{row.createdAt.slice(0, 16)}</p>
          <Link
            to="/"
            search={mine ? { circuit: row.id, mine: "1" } : { circuit: row.id }}
            className="mt-4 inline-flex h-9 items-center self-start bg-accent px-3 text-sm font-medium text-bg"
          >
            Load into canvas
          </Link>
        </li>
      ))}
    </ul>
  );
}
