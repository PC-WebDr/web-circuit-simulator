import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { extractNets } from "@/lib/circuit/nets";
import { viewRef } from "@/lib/circuit/geometry";
import { STORAGE_KEY, useCircuit, type PersistShape } from "@/lib/circuit/store";
import { loadMine, loadPublic } from "@/lib/circuits.functions";
import { CanvasView } from "./canvas-view";
import { NetlistDrawer } from "./netlist-drawer";
import { PropertiesDialog } from "./properties-dialog";
import { ResultsPanel } from "./results-panel";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

const SHORTCUTS: Array<[string, string]> = [
  ["V", "Select"],
  ["W", "Wire"],
  ["P", "Probe"],
  ["H", "Pan"],
  ["R", "Rotate"],
  ["F", "Fit sheet"],
  ["Del", "Delete"],
  ["Esc", "Cancel wire"],
  ["Ctrl Z", "Undo"],
  ["Ctrl D", "Duplicate"],
  ["Right click", "Edit part"],
  ["Scroll", "Zoom"],
  ["Space", "Pan while held"],
];

function typing(target: EventTarget | null): boolean {
  const tag = target instanceof HTMLElement ? target.tagName : "";
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export function VoltaApp({ circuitId, mine }: { circuitId?: string; mine?: boolean }) {
  useEffect(() => {
    let cancelled = false;
    const persist = () => {
      let last = "";
      return useCircuit.subscribe((state) => {
        const payload: PersistShape = {
          v: 1,
          parts: state.parts,
          wires: state.wires,
          sim: state.sim,
          panX: state.panX,
          panY: state.panY,
          zoom: state.zoom,
          sheet: state.sheet,
          cloudId: state.cloudId,
          cloudPublic: state.cloudPublic,
        };
        const text = JSON.stringify(payload);
        if (text === last) return;
        last = text;
        localStorage.setItem(STORAGE_KEY, text);
      });
    };

    if (circuitId) {
      const load = mine ? loadMine({ data: { id: circuitId } }) : loadPublic({ data: { id: circuitId } });
      void load
        .then((row) => {
          if (cancelled) return;
          useCircuit.getState().applyRemote(row);
          const canvas = document.querySelector("[data-canvas]");
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            useCircuit.getState().fit(rect.width, rect.height);
          }
        })
        .catch(() => {
          if (!cancelled) useCircuit.getState().setNotice("That circuit is not public, or it is gone.");
        });
      const unsub = persist();
      return () => {
        cancelled = true;
        unsub();
      };
    }

    let saved = false;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as PersistShape;
        if (data?.v === 1 && Array.isArray(data.parts) && Array.isArray(data.wires) && data.sim) {
          useCircuit.getState().hydrate(data);
          saved = true;
        }
      }
    } catch {
      saved = false;
    }
    const canvas = document.querySelector("[data-canvas]");
    if (!saved && canvas) {
      const rect = canvas.getBoundingClientRect();
      useCircuit.getState().fit(rect.width, rect.height);
    }
    if (window.matchMedia("(max-width: 1023px)").matches) {
      useCircuit.getState().setSidebar(false);
    }
    const unsub = persist();
    return () => {
      cancelled = true;
      unsub();
    };
  }, [circuitId, mine]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (typing(e.target)) return;
      const state = useCircuit.getState();
      const meta = e.ctrlKey || e.metaKey;
      if (e.key === "Escape") {
        if (state.wireDraft) state.cancelDraft();
        else if (state.editingId) state.closeEdit();
        else if (state.helpOpen) state.toggleHelp();
        else if (state.netlistOpen) state.toggleNetlist();
        else state.select(null);
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        if (state.wireDraft) state.popDraft();
        else state.deleteSelected();
        return;
      }
      if (meta && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) state.redo();
        else state.undo();
        return;
      }
      if (meta && e.key.toLowerCase() === "y") {
        e.preventDefault();
        state.redo();
        return;
      }
      if (meta && e.key.toLowerCase() === "d") {
        e.preventDefault();
        state.duplicate();
        return;
      }
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        state.toggleHelp();
        return;
      }
      if (meta) return;
      const key = e.key.toLowerCase();
      if (key === "v") state.setTool("select");
      else if (key === "w") state.setTool("wire");
      else if (key === "p") state.setTool("probe");
      else if (key === "h") state.setTool("pan");
      else if (key === "r") {
        if (state.placing) state.rotatePlacing();
        else state.rotateSelected();
      } else if (key === "f") {
        e.preventDefault();
        state.fit(viewRef.width, viewRef.height);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg">
      <Toolbar />
      <div className="relative flex min-h-0 flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <CanvasView />
          <ResultsPanel />
        </div>
        <NetlistDrawer />
      </div>
      <StatusBar />
      <PropertiesDialog />
      <HelpDialog />
    </div>
  );
}

function StatusBar() {
  const cursor = useCircuit((s) => s.cursor);
  const zoom = useCircuit((s) => s.zoom);
  const tool = useCircuit((s) => s.tool);
  const sheet = useCircuit((s) => s.sheet);
  const parts = useCircuit((s) => s.parts);
  const wires = useCircuit((s) => s.wires);
  const notice = useCircuit((s) => s.notice);
  const cloudId = useCircuit((s) => s.cloudId);
  const cloudPublic = useCircuit((s) => s.cloudPublic);
  const nets = extractNets(parts, wires).nets.length;
  const hint =
    tool === "wire"
      ? "Click a pin, then another. Click the grid to drop a corner."
      : tool === "probe"
        ? "Click a pin or wire to plot its voltage. Click again to remove it."
        : tool === "pan"
          ? "Drag to pan. Scroll to zoom."
          : "Drag a part. Right-click it to edit the SPICE value.";

  return (
    <footer className="flex h-8 shrink-0 items-center gap-4 overflow-x-auto border-t border-border bg-bg px-3 font-mono text-xs text-muted">
      <span className="shrink-0 text-fg">{sheet}</span>
      {cloudId ? <span className="shrink-0 text-accent">{cloudPublic ? "public" : "private"}</span> : null}
      <span className="shrink-0">
        X {cursor ? cursor.x : "–"}&nbsp;&nbsp;Y {cursor ? cursor.y : "–"}
      </span>
      <span className="shrink-0">{Math.round(zoom * 100)}%</span>
      <span className="shrink-0">
        {parts.length} {parts.length === 1 ? "part" : "parts"} · {wires.length}{" "}
        {wires.length === 1 ? "wire" : "wires"} · {nets} {nets === 1 ? "net" : "nets"}
      </span>
      <span className="shrink-0 text-subtle">{notice ?? hint}</span>
    </footer>
  );
}

function HelpDialog() {
  const open = useCircuit((s) => s.helpOpen);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && useCircuit.getState().helpOpen) useCircuit.getState().toggleHelp();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="volta-overlay fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content className="volta-pop fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-border bg-surface p-4 outline-none">
          <div className="flex items-start justify-between">
            <Dialog.Title className="text-sm font-medium">Shortcuts</Dialog.Title>
            <Dialog.Close className="inline-flex size-9 items-center justify-center text-muted" aria-label="Close shortcuts">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Keyboard shortcuts for the schematic editor.</Dialog.Description>
          <dl className="mt-4 grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
            {SHORTCUTS.map(([key, label]) => (
              <div key={key} className="contents">
                <dt className="font-mono text-xs text-accent">{key}</dt>
                <dd className="text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
