import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CircuitBoard } from "lucide-react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email,
        });
        if (err) throw new Error(err.message ?? "Could not create the account");
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message ?? "Could not sign in");
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-bg p-6 text-fg">
      <div className="w-full max-w-sm border border-border bg-surface p-5">
        <div className="mb-5 flex items-center gap-2">
          <CircuitBoard className="size-4 text-accent" aria-hidden="true" />
          <span className="text-sm font-medium tracking-tight">VOLTA</span>
        </div>
        <h1 className="text-xl font-medium">Sign in</h1>
        <p className="mt-1 text-sm text-muted">Save a schematic to your account, or publish it for anyone to load.</p>

        {isPending ? <p className="mt-6 text-sm text-muted">Checking session…</p> : null}

        {!isPending && user ? (
          <div className="mt-6 space-y-4">
            <UserButton />
            <Link to="/" className="inline-flex h-10 items-center bg-accent px-3 text-sm font-medium text-bg">
              Back to the bench
            </Link>
          </div>
        ) : null}

        {!isPending && !user && authEnabled ? (
          <div className="mt-6 space-y-3">
            {GROK_PROVIDERS.filter((provider) => mode === "in" || provider.providerId !== "grok-x").map((provider) => (
              <button
                key={provider.providerId}
                type="button"
                className="h-11 w-full border border-border text-sm"
                onClick={() => {
                  void signIn(provider.providerId, { callbackURL: "/" }).catch((err: unknown) => {
                    setError(err instanceof Error ? err.message : "Sign-in failed");
                  });
                }}
              >
                Continue with {provider.label}
              </button>
            ))}
            <div className="flex items-center gap-3 py-1 text-xs text-muted">
              <span className="h-px flex-1 bg-border" />
              or email
              <span className="h-px flex-1 bg-border" />
            </div>
            <form className="space-y-3" onSubmit={onSubmit}>
              {mode === "up" ? (
                <label className="block text-xs text-muted">
                  Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 h-10 w-full border border-border bg-bg px-2 text-sm text-fg outline-none"
                    autoComplete="name"
                  />
                </label>
              ) : null}
              <label className="block text-xs text-muted">
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-10 w-full border border-border bg-bg px-2 text-sm text-fg outline-none"
                  autoComplete="email"
                />
              </label>
              <label className="block text-xs text-muted">
                Password
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 h-10 w-full border border-border bg-bg px-2 text-sm text-fg outline-none"
                  autoComplete={mode === "up" ? "new-password" : "current-password"}
                />
              </label>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <button type="submit" disabled={busy} className="h-11 w-full bg-accent text-sm font-medium text-bg disabled:opacity-50">
                {busy ? "Working…" : mode === "up" ? "Create account" : "Sign in"}
              </button>
            </form>
            <button
              type="button"
              className="text-sm text-muted"
              onClick={() => {
                setMode(mode === "in" ? "up" : "in");
                setError(null);
              }}
            >
              {mode === "in" ? "Need an account? Create one" : "Already have an account? Sign in"}
            </button>
          </div>
        ) : null}

        {!isPending && !user && !authEnabled ? <p className="mt-6 text-sm text-muted">Sign-in is turned off.</p> : null}
      </div>
    </main>
  );
}
