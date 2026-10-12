import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { parseSpiceNumber } from "@/lib/circuit/units";
import { useCircuit } from "@/lib/circuit/store";
import type { CompType } from "@/lib/circuit/types";
import { cn } from "@/lib/cn";

const NAMES: Record<CompType, string> = {
  R: "Resistor",
  C: "Capacitor",
  L: "Inductor",
  V: "Voltage source",
  I: "Current source",
  D: "Diode",
  QNPN: "NPN BJT",
  QPNP: "PNP BJT",
  MN: "NMOS",
  MP: "PMOS",
  GND: "Ground",
};

const SOURCE_FIELDS: Record<string, { key: string; label: string }[]> = {
  DC: [
    { key: "dc", label: "DC" },
    { key: "acmag", label: "AC mag" },
    { key: "acphase", label: "AC phase" },
  ],
  AC: [
    { key: "dc", label: "DC" },
    { key: "acmag", label: "AC mag" },
    { key: "acphase", label: "AC phase" },
  ],
  SIN: [
    { key: "vo", label: "Voff" },
    { key: "va", label: "Vamp" },
    { key: "freq", label: "Freq" },
    { key: "td", label: "Td" },
    { key: "theta", label: "Theta" },
    { key: "phase", label: "Phase" },
    { key: "acmag", label: "AC mag" },
    { key: "acphase", label: "AC phase" },
  ],
  PULSE: [
    { key: "v1", label: "V1" },
    { key: "v2", label: "V2" },
    { key: "ptd", label: "Td" },
    { key: "ptr", label: "Tr" },
    { key: "ptf", label: "Tf" },
    { key: "pw", label: "Ton" },
    { key: "per", label: "Period" },
  ],
};

export function PropertiesDialog() {
  const editingId = useCircuit((s) => s.editingId);
  const parts = useCircuit((s) => s.parts);
  const part = parts.find((p) => p.id === editingId) ?? null;
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (part) {
      setDraft({ ...part.params });
      setError("");
    }
  }, [part]);

  return (
    <Dialog.Root open={Boolean(part)} onOpenChange={(open) => { if (!open) useCircuit.getState().closeEdit(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="volta-overlay fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content className="volta-pop fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-border bg-surface p-4 outline-none">
          {part ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const next = { ...draft };
                if ((part.type === "V" || part.type === "I") && next.src === "SIN" && (next.acmag === "0" || !next.acmag)) {
                  next.acmag = next.va || "0";
                }
                const message = validate(part.type, next);
                if (message) {
                  setError(message);
                  return;
                }
                useCircuit.getState().setPartParams(part.id, next);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Dialog.Title className="font-mono text-sm text-accent">{part.id}</Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-fg">{NAMES[part.type]}</Dialog.Description>
                </div>
                <Dialog.Close type="button" className="inline-flex size-9 items-center justify-center text-muted" aria-label="Close">
                  <X className="size-4" />
                </Dialog.Close>
              </div>

              {part.type === "GND" ? (
                <p className="mt-4 text-sm text-muted">Ground is node 0. It has no parameters.</p>
              ) : null}

              {part.type === "R" || part.type === "C" || part.type === "L" ? (
                <div className="mt-4">
                  <Param
                    label={part.type === "R" ? "Resistance" : part.type === "C" ? "Capacitance" : "Inductance"}
                    value={draft.value ?? ""}
                    onChange={(value) => setDraft((d) => ({ ...d, value }))}
                  />
                </div>
              ) : null}

              {part.type === "V" || part.type === "I" ? (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-1">
                    {["DC", "SIN", "PULSE", "AC"].map((src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, src }))}
                        className={cn(
                          "h-8 border border-border px-3 font-mono text-xs",
                          (draft.src ?? "DC") === src ? "border-accent text-accent" : "text-muted",
                        )}
                      >
                        {src}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {(SOURCE_FIELDS[draft.src ?? "DC"] ?? SOURCE_FIELDS.DC).map((field) => (
                      <Param
                        key={field.key}
                        label={field.label}
                        value={draft[field.key] ?? ""}
                        onChange={(value) => setDraft((d) => ({ ...d, [field.key]: value }))}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {part.type === "D" ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Param label="Is" value={draft.is ?? ""} onChange={(is) => setDraft((d) => ({ ...d, is }))} />
                  <Param label="N" value={draft.n ?? ""} onChange={(n) => setDraft((d) => ({ ...d, n }))} />
                </div>
              ) : null}

              {part.type === "QNPN" || part.type === "QPNP" ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Param label="Bf" value={draft.bf ?? ""} onChange={(bf) => setDraft((d) => ({ ...d, bf }))} />
                  <Param label="Is" value={draft.is ?? ""} onChange={(is) => setDraft((d) => ({ ...d, is }))} />
                  <Param label="Vaf" value={draft.vaf ?? ""} onChange={(vaf) => setDraft((d) => ({ ...d, vaf }))} />
                </div>
              ) : null}

              {part.type === "MN" || part.type === "MP" ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Param label="Vto" value={draft.vto ?? ""} onChange={(vto) => setDraft((d) => ({ ...d, vto }))} />
                  <Param label="Kp" value={draft.kp ?? ""} onChange={(kp) => setDraft((d) => ({ ...d, kp }))} />
                  <Param label="W" value={draft.w ?? ""} onChange={(w) => setDraft((d) => ({ ...d, w }))} />
                  <Param label="L" value={draft.l ?? ""} onChange={(l) => setDraft((d) => ({ ...d, l }))} />
                </div>
              ) : null}

              {part.type === "QNPN" || part.type === "QPNP" ? (
                <p className="mt-3 text-xs text-muted">
                  Written into the SPICE netlist. The numeric engine leaves BJTs open.
                </p>
              ) : null}
              {part.type === "MN" || part.type === "MP" ? (
                <p className="mt-3 text-xs text-muted">
                  Switch-level model. Drain to source conducts once Vgs crosses Vto.
                </p>
              ) : null}
              {part.type === "D" ? (
                <p className="mt-3 text-xs text-muted">Shockley diode, solved with Newton-Raphson.</p>
              ) : null}
              {part.type !== "GND" ? (
                <p className="mt-3 text-xs text-muted">Suffixes: k, Meg, m, u, n, p.</p>
              ) : null}
              {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="h-10 px-3 text-sm text-danger"
                  onClick={() => useCircuit.getState().deleteSelected()}
                >
                  Delete
                </button>
                <div className="flex gap-2">
                  <Dialog.Close type="button" className="h-10 border border-border px-3 text-sm">
                    Cancel
                  </Dialog.Close>
                  {part.type === "GND" ? null : (
                    <button type="submit" className="h-10 bg-accent px-3 text-sm font-medium text-bg">
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </form>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Param({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full border border-border bg-bg px-2 font-mono text-sm text-fg outline-none"
        autoComplete="off"
      />
    </label>
  );
}

function validate(type: CompType, params: Record<string, string>): string {
  const keys =
    type === "R" || type === "C" || type === "L"
      ? ["value"]
      : type === "D"
        ? ["is", "n"]
        : type === "QNPN" || type === "QPNP"
          ? ["bf", "is", "vaf"]
          : type === "MN" || type === "MP"
            ? ["vto", "kp", "w", "l"]
            : type === "V" || type === "I"
              ? (SOURCE_FIELDS[params.src ?? "DC"] ?? []).map((f) => f.key)
              : [];
  for (const key of keys) {
    try {
      const n = parseSpiceNumber(params[key] ?? "");
      if ((type === "R" || type === "C" || type === "L" || key === "is" || key === "n") && !(n > 0)) {
        return `${key} must be positive`;
      }
    } catch (err) {
      return err instanceof Error ? err.message : "Bad value";
    }
  }
  return "";
}
