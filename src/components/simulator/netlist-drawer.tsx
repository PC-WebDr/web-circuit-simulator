import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { spiceNetlist } from "@/lib/circuit/netlist";
import { useCircuit } from "@/lib/circuit/store";

export function NetlistDrawer() {
  const open = useCircuit((s) => s.netlistOpen);
  const parts = useCircuit((s) => s.parts);
  const wires = useCircuit((s) => s.wires);
  const sim = useCircuit((s) => s.sim);
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => spiceNetlist(parts, wires, sim), [parts, wires, sim]);

  if (!open) return null;

  return (
    <aside className="absolute inset-y-0 right-0 z-20 flex w-80 max-w-full flex-col border-l border-border bg-surface max-lg:w-full">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-border px-3">
        <h2 className="text-sm">Netlist</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-8 px-2 text-xs text-muted"
            onClick={() => {
              void navigator.clipboard?.writeText(text).then(() => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1200);
              });
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" aria-label="Close netlist" className="inline-flex size-8 items-center justify-center" onClick={() => useCircuit.getState().toggleNetlist()}>
            <X className="size-4" />
          </button>
        </div>
      </header>
      <pre className="min-h-0 flex-1 overflow-auto p-3 font-mono text-xs leading-5 text-fg">{text}</pre>
    </aside>
  );
}
