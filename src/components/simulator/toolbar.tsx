import { useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  CircuitBoard,
  Crosshair,
  Expand,
  FileText,
  Globe,
  Hand,
  Info,
  MousePointer2,
  PanelLeft,
  Play,
  RotateCw,
  Save,
  Spline,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { EXAMPLES } from "@/lib/circuit/examples";
import { viewRef } from "@/lib/circuit/geometry";
import { useCircuit, type Tool } from "@/lib/circuit/store";
import { saveCircuit, setCircuitPublic } from "@/lib/circuits.functions";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { cn } from "@/lib/cn";

const TOOLS: { id: Tool; label: string; key: string; icon: typeof MousePointer2 }[] = [
  { id: "select", label: "Select", key: "V", icon: MousePointer2 },
  { id: "wire", label: "Wire", key: "W", icon: Spline },
  { id: "probe", label: "Probe", key: "P", icon: Crosshair },
  { id: "pan", label: "Pan", key: "H", icon: Hand },
];

export function Toolbar() {
  const tool = useCircuit((s) => s.tool);
  const sim = useCircuit((s) => s.sim);
  const parts = useCircuit((s) => s.parts);
  const selected = useCircuit((s) => s.selected);
  const zoom = useCircuit((s) => s.zoom);
  const netlistOpen = useCircuit((s) => s.netlistOpen);
  const selectedPart = selected?.kind === "part" ? parts.find((p) => p.id === selected.id) : null;
  const exampleRef = useRef<HTMLSelectElement>(null);
  const sources = parts.filter((p) => p.type === "V" || p.type === "I");

  return (
    <header className="shrink-0 border-b border-border bg-surface">
      <div className="flex h-14 items-center gap-1 overflow-x-auto px-2">
        <button
          type="button"
          className="inline-flex size-11 shrink-0 items-center justify-center text-fg"
          aria-label="Toggle library"
          onClick={() => useCircuit.getState().toggleSidebar()}
        >
          <PanelLeft className="size-4" />
        </button>
        <div className="mr-2 flex shrink-0 items-center gap-2 pr-2">
          <CircuitBoard className="size-4 text-accent" aria-hidden="true" />
          <span className="text-sm font-medium tracking-tight">VOLTA</span>
        </div>
        <div className="flex shrink-0 items-center gap-1 border-l border-border pl-2">
          {TOOLS.map((item) => {
            const Icon = item.icon;
            const active = tool === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={`${item.label} (${item.key})`}
                aria-label={item.label}
                aria-pressed={active}
                onClick={() => useCircuit.getState().setTool(item.id)}
                className={cn(
                  "inline-flex size-11 items-center justify-center border border-transparent text-fg",
                  active && "border-border bg-elevated text-accent",
                )}
              >
                <Icon className="size-4" />
              </button>
            );
          })}
        </div>
        <div className="flex shrink-0 items-center gap-1 border-l border-border pl-2">
          <IconButton label="Rotate" disabled={!selectedPart} onClick={() => useCircuit.getState().rotateSelected()}>
            <RotateCw className="size-4" />
          </IconButton>
          <IconButton label="Delete" disabled={!selected} onClick={() => useCircuit.getState().deleteSelected()}>
            <Trash2 className="size-4" />
          </IconButton>
          {selectedPart ? (
            <button
              type="button"
              className="h-11 shrink-0 border border-border px-3 text-sm"
              onClick={() => useCircuit.getState().openEdit(selectedPart.id)}
            >
              Edit
            </button>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1 border-l border-border pl-2">
          <IconButton label="Zoom out" onClick={() => useCircuit.getState().zoomAt(viewRef.width / 2, viewRef.height / 2, 1 / 1.15)}>
            <ZoomOut className="size-4" />
          </IconButton>
          <span className="w-12 text-center font-mono text-xs text-muted">{Math.round(zoom * 100)}%</span>
          <IconButton label="Zoom in" onClick={() => useCircuit.getState().zoomAt(viewRef.width / 2, viewRef.height / 2, 1.15)}>
            <ZoomIn className="size-4" />
          </IconButton>
          <IconButton
            label="Fit"
            onClick={() => useCircuit.getState().fit(viewRef.width, viewRef.height)}
          >
            <Expand className="size-4" />
          </IconButton>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1 pl-2">
          <button
            type="button"
            aria-pressed={netlistOpen}
            onClick={() => useCircuit.getState().toggleNetlist()}
            className={cn(
              "inline-flex h-11 items-center gap-2 border border-transparent px-3 text-sm",
              netlistOpen && "border-border bg-elevated text-accent",
            )}
          >
            <FileText className="size-4" />
            Netlist
          </button>
          <button
            type="button"
            aria-label="Shortcuts"
            className="inline-flex size-11 items-center justify-center"
            onClick={() => useCircuit.getState().toggleHelp()}
          >
            <Info className="size-4" />
          </button>
          <SignedOut>
            <Link to="/login" className="inline-flex h-9 items-center border border-border px-3 text-sm">
              Sign in
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      <div className="flex h-12 items-center gap-2 overflow-x-auto border-t border-border px-2">
        <select
          ref={exampleRef}
          aria-label="Load example"
          defaultValue=""
          className="h-8 shrink-0 border border-border bg-bg px-2 text-sm text-fg"
          onChange={(e) => {
            const id = e.target.value;
            if (!id) return;
            if (EXAMPLES.some((ex) => ex.id === id)) {
              useCircuit.getState().loadExample(id as (typeof EXAMPLES)[number]["id"]);
            }
            e.target.value = "";
          }}
        >
          <option value="">Examples</option>
          {EXAMPLES.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
        <CloudControls />
        <select
          aria-label="Simulation type"
          value={sim.analysis}
          className="h-8 shrink-0 border border-border bg-bg px-2 text-sm text-fg"
          onChange={(e) => {
            const analysis = e.target.value;
            if (analysis === "tran" || analysis === "ac" || analysis === "dc") {
              useCircuit.getState().setSim({ analysis });
            }
          }}
        >
          <option value="tran">Transient (.tran)</option>
          <option value="ac">AC Analysis (.ac)</option>
          <option value="dc">DC Sweep (.dc)</option>
        </select>
        {sim.analysis === "tran" ? (
          <>
            <Field label="Tstep" value={sim.tstep} onChange={(tstep) => useCircuit.getState().setSim({ tstep })} />
            <Field label="Tstop" value={sim.tstop} onChange={(tstop) => useCircuit.getState().setSim({ tstop })} />
          </>
        ) : null}
        {sim.analysis === "ac" ? (
          <>
            <select
              aria-label="AC sweep"
              value={sim.acType}
              className="h-8 shrink-0 border border-border bg-bg px-2 text-sm text-fg"
              onChange={(e) => {
                const acType = e.target.value;
                if (acType === "dec" || acType === "oct" || acType === "lin") useCircuit.getState().setSim({ acType });
              }}
            >
              <option value="dec">DEC</option>
              <option value="oct">OCT</option>
              <option value="lin">LIN</option>
            </select>
            <Field label="Pts" value={sim.acPts} onChange={(acPts) => useCircuit.getState().setSim({ acPts })} />
            <Field label="Fstart" value={sim.fstart} onChange={(fstart) => useCircuit.getState().setSim({ fstart })} />
            <Field label="Fstop" value={sim.fstop} onChange={(fstop) => useCircuit.getState().setSim({ fstop })} />
          </>
        ) : null}
        {sim.analysis === "dc" ? (
          <>
            <label className="flex shrink-0 items-center gap-2 text-xs text-muted">
              Source
              <select
                aria-label="Sweep source"
                value={sources.some((s) => s.id === sim.dcSource) ? sim.dcSource : (sources[0]?.id ?? "")}
                className="h-8 border border-border bg-bg px-2 font-mono text-xs text-fg"
                onChange={(e) => useCircuit.getState().setSim({ dcSource: e.target.value })}
              >
                {sources.length === 0 ? <option value="">None</option> : null}
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}
                  </option>
                ))}
              </select>
            </label>
            <Field label="Start" value={sim.dcStart} onChange={(dcStart) => useCircuit.getState().setSim({ dcStart })} />
            <Field label="Stop" value={sim.dcStop} onChange={(dcStop) => useCircuit.getState().setSim({ dcStop })} />
            <Field label="Step" value={sim.dcStep} onChange={(dcStep) => useCircuit.getState().setSim({ dcStep })} />
          </>
        ) : null}
        <button
          type="button"
          onClick={() => useCircuit.getState().run()}
          className="ml-auto inline-flex h-9 shrink-0 items-center gap-2 bg-accent px-3 text-sm font-medium text-bg"
        >
          <Play className="size-4" />
          Run
        </button>
      </div>
    </header>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center text-fg disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex shrink-0 items-center gap-2 text-xs text-muted">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-20 border border-border bg-bg px-2 font-mono text-xs text-fg outline-none"
        aria-label={label}
      />
    </label>
  );
}

function CloudControls() {
  const sheet = useCircuit((s) => s.sheet);
  const cloudId = useCircuit((s) => s.cloudId);
  const cloudPublic = useCircuit((s) => s.cloudPublic);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(sheet);
  const [isPublic, setIsPublic] = useState(cloudPublic);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    const state = useCircuit.getState();
    setBusy(true);
    setError(null);
    try {
      const saved = await saveCircuit({
        data: {
          id: state.cloudId ?? undefined,
          name,
          parts: state.parts,
          wires: state.wires,
          sim: state.sim,
          isPublic,
        },
      });
      useCircuit.getState().setCloud(saved.id, saved.name, saved.isPublic);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublic() {
    const state = useCircuit.getState();
    if (!state.cloudId) {
      setName(state.sheet);
      setIsPublic(true);
      setOpen(true);
      return;
    }
    setBusy(true);
    try {
      const next = !state.cloudPublic;
      const saved = await setCircuitPublic({ data: { id: state.cloudId, isPublic: next } });
      useCircuit.getState().setCloud(saved.id, state.sheet, saved.isPublic);
    } catch (err) {
      useCircuit.getState().setNotice(err instanceof Error ? err.message : "Could not update sharing");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Link to="/explore" className="inline-flex h-8 shrink-0 items-center gap-1 border border-border px-2 text-sm">
        <Globe className="size-3.5" />
        Explore
      </Link>
      <SignedIn>
        <button
          type="button"
          className="inline-flex h-8 shrink-0 items-center gap-1 border border-border px-2 text-sm"
          onClick={() => {
            const state = useCircuit.getState();
            setName(state.sheet);
            setIsPublic(state.cloudPublic);
            setError(null);
            setOpen(true);
          }}
        >
          <Save className="size-3.5" />
          {cloudId ? "Update" : "Save"}
        </button>
        <button
          type="button"
          disabled={busy}
          className="inline-flex h-8 shrink-0 items-center border border-border px-2 text-sm disabled:opacity-50"
          onClick={() => void togglePublic()}
        >
          {cloudPublic ? "Make private" : "Make public"}
        </button>
      </SignedIn>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <form
            className="w-full max-w-sm border border-border bg-surface p-4"
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
            <h2 className="text-sm font-medium">Save to your account</h2>
            <label className="mt-3 block text-xs text-muted">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 h-10 w-full border border-border bg-bg px-2 text-sm text-fg outline-none"
                aria-label="Circuit name"
              />
            </label>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              Public — anyone can load it from Explore
            </label>
            {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="h-10 border border-border px-3 text-sm" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="submit" disabled={busy} className="h-10 bg-accent px-3 text-sm font-medium text-bg disabled:opacity-50">
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
