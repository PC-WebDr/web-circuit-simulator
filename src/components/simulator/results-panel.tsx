import { useState } from "react";
import { X } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TRACE_COLORS } from "@/lib/circuit/catalog";
import { useCircuit } from "@/lib/circuit/store";
import { formatTick } from "@/lib/circuit/units";
import { cn } from "@/lib/cn";

const KIND: Record<string, string> = {
  tran: "Transient",
  ac: "AC analysis",
  dc: "DC sweep",
};

export function ResultsPanel() {
  const result = useCircuit((s) => s.result);
  const show = useCircuit((s) => s.showResults);
  const revision = useCircuit((s) => s.revision);
  const resultRev = useCircuit((s) => s.resultRev);
  const probes = useCircuit((s) => s.probes);
  const [mode, setMode] = useState<"mag" | "phase">("mag");

  if (!show || !result) return null;
  const stale = resultRev !== revision;
  const rows = mode === "phase" && result.phaseRows ? result.phaseRows : result.rows;
  const yLabel = mode === "phase" ? "Phase (deg)" : result.yLabel;
  const shown = probes.flatMap((id, i) => {
    const series = result.series.find((item) => item.key === id);
    if (!series) return [];
    return [{ ...series, label: `V(${series.key})`, color: TRACE_COLORS[i % TRACE_COLORS.length]! }];
  });
  const chips = result.op.filter((row) => probes.includes(row.name) || row.name.startsWith("I("));

  return (
    <section className={cn("flex shrink-0 flex-col border-t border-border bg-surface", result.error ? "min-h-24" : "h-56 max-lg:h-44")}>
      <header className="flex h-9 shrink-0 items-center gap-3 px-3">
        <h2 className="text-sm">{KIND[result.kind] ?? "Result"}</h2>
        <span className="font-mono text-xs text-muted">
          {result.error
            ? "failed"
            : shown.length
              ? `${yLabel} · ${shown.length} ${shown.length === 1 ? "trace" : "traces"} · ${result.rows.length} pts${result.elapsedMs > 0 ? ` · ${Math.round(result.elapsedMs)} ms` : ""}`
              : "no probes"}
        </span>
        {stale ? <span className="text-xs text-muted">out of date</span> : null}
        <div className="ml-auto flex items-center gap-2">
          {probes.length ? (
            <button type="button" className="h-7 px-2 text-xs text-muted" onClick={() => useCircuit.getState().clearProbes()}>
              Clear traces
            </button>
          ) : null}
          {result.phaseRows && !result.error ? (
            <div className="flex border border-border">
              <button
                type="button"
                className={cn("h-7 px-2 text-xs", mode === "mag" ? "bg-elevated text-fg" : "text-muted")}
                onClick={() => setMode("mag")}
              >
                Magnitude
              </button>
              <button
                type="button"
                className={cn("h-7 px-2 text-xs", mode === "phase" ? "bg-elevated text-fg" : "text-muted")}
                onClick={() => setMode("phase")}
              >
                Phase
              </button>
            </div>
          ) : null}
          <button type="button" aria-label="Hide plot" className="inline-flex size-8 items-center justify-center text-muted" onClick={() => useCircuit.getState().toggleResults()}>
            <X className="size-4" />
          </button>
        </div>
      </header>
      {result.error ? (
        <p className="px-3 pb-3 text-sm text-danger">{result.error}</p>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto px-3 pb-2">
            {chips.map((row) => (
              <div key={row.name} title={row.detail} className="shrink-0 border border-border px-2 py-1 font-mono text-xs">
                <span className="text-muted">{row.name.startsWith("I(") ? row.name : `V(${row.name})`}</span> <span className="text-fg">{row.value}</span>
              </div>
            ))}
          </div>
          {result.notes.map((note) => (
            <p key={note} className="px-3 pb-1 text-xs text-muted">
              {note}
            </p>
          ))}
          <div className="min-h-0 flex-1 px-2 pb-2">
            {shown.length === 0 ? (
              <div className="grid h-full place-items-center text-center">
                <p className="text-sm text-muted">Probe a pin or wire to plot its voltage.</p>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="0" />
                <XAxis
                  dataKey="x"
                  type="number"
                  scale={result.kind === "ac" ? "log" : "linear"}
                  domain={["dataMin", "dataMax"]}
                  tickCount={6}
                  tickFormatter={formatTick}
                  stroke="var(--color-muted)"
                  tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "JetBrains Mono, ui-monospace, monospace" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={formatTick}
                  stroke="var(--color-muted)"
                  tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "JetBrains Mono, ui-monospace, monospace" }}
                  tickLine={false}
                  axisLine={false}
                  width={52}
                />
                <Tooltip content={<ScopeTip />} />
                <Legend
                  wrapperStyle={{ fontFamily: "JetBrains Mono, ui-monospace, monospace", fontSize: 11 }}
                  onClick={(entry) => {
                    const key = String(entry.dataKey ?? "");
                    if (key) useCircuit.getState().toggleProbe(key);
                  }}
                />
                {shown.map((series) => (
                  <Line
                    key={series.key}
                    type="linear"
                    dataKey={series.key}
                    name={series.label}
                    stroke={series.color}
                    strokeWidth={1.75}
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function ScopeTip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string | number; value?: number | string; color?: string }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-border bg-bg px-2 py-1">
      <div className="font-mono text-xs text-muted">{formatTick(Number(label))}</div>
      {payload.map((item) => (
        <div key={String(item.dataKey)} className="font-mono text-xs" style={{ color: item.color }}>
          {String(item.dataKey)} {formatTick(Number(item.value))}
        </div>
      ))}
    </div>
  );
}
