import { create } from "zustand";
import { defaultParams, idPrefix } from "./catalog.ts";
import { getExample, type ExampleId } from "./examples.ts";
import { frameCamera, nextRot, viewRef } from "./geometry.ts";
import { extractNets } from "./nets.ts";
import { simulate } from "./solver.ts";
import type { CompType, Part, Rotation, SimConfig, SimOutput, Snap, Wire, WirePoint } from "./types.ts";

export const STORAGE_KEY = "volta.sheet.v1";

export type Tool = "select" | "wire" | "pan" | "probe";

export type Selection = { kind: "part" | "wire"; id: string } | null;

export type PersistShape = {
  v: 1;
  parts: Part[];
  wires: Wire[];
  sim: SimConfig;
  panX: number;
  panY: number;
  zoom: number;
  sheet: string;
  cloudId?: string | null;
  cloudPublic?: boolean;
};

type Draft = { points: WirePoint[]; cursor: { x: number; y: number } | null };

type Placing = { type: CompType; x: number; y: number; rot: Rotation };

type CircuitState = {
  parts: Part[];
  wires: Wire[];
  selected: Selection;
  tool: Tool;
  sim: SimConfig;
  result: SimOutput | null;
  revision: number;
  resultRev: number;
  showResults: boolean;
  netlistOpen: boolean;
  sidebarOpen: boolean;
  helpOpen: boolean;
  editingId: string | null;
  placing: Placing | null;
  wireDraft: Draft | null;
  cursor: { x: number; y: number } | null;
  panX: number;
  panY: number;
  zoom: number;
  sheet: string;
  cloudId: string | null;
  cloudPublic: boolean;
  notice: string | null;
  probes: string[];
  past: Snap[];
  future: Snap[];
  setTool: (tool: Tool) => void;
  setSidebar: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleNetlist: () => void;
  toggleHelp: () => void;
  toggleResults: () => void;
  setCursor: (cursor: { x: number; y: number } | null) => void;
  setPlacing: (placing: Placing | null) => void;
  rotatePlacing: () => void;
  panBy: (dx: number, dy: number) => void;
  zoomAt: (sx: number, sy: number, factor: number) => void;
  fit: (width: number, height: number) => void;
  select: (selected: Selection) => void;
  openEdit: (id: string) => void;
  closeEdit: () => void;
  place: (type: CompType, x: number, y: number, rot: Rotation) => void;
  movePart: (id: string, x: number, y: number) => void;
  remember: (snap: Snap) => void;
  rotateSelected: () => void;
  deleteSelected: () => void;
  duplicate: () => void;
  setPartParams: (id: string, params: Record<string, string>) => void;
  startDraft: (point: WirePoint) => void;
  addDraftPoint: (point: WirePoint) => void;
  setDraftCursor: (x: number, y: number) => void;
  popDraft: () => void;
  cancelDraft: () => void;
  commitWire: (points: WirePoint[]) => void;
  setSim: (patch: Partial<SimConfig>) => void;
  loadExample: (id: ExampleId) => void;
  applyRemote: (row: {
    id: string;
    name: string;
    isPublic: boolean;
    parts: Part[];
    wires: Wire[];
    sim: SimConfig;
  }) => void;
  setCloud: (id: string | null, name: string, isPublic: boolean) => void;
  setNotice: (notice: string | null) => void;
  run: () => void;
  toggleProbe: (netId: string) => void;
  clearProbes: () => void;
  undo: () => void;
  redo: () => void;
  hydrate: (data: PersistShape) => void;
};

function nextId(parts: Part[], type: CompType): string {
  const prefix = idPrefix(type);
  const re = new RegExp(`^${prefix}(\\d+)$`);
  let n = 0;
  for (const part of parts) {
    const match = part.id.match(re);
    if (match) n = Math.max(n, Number(match[1]));
  }
  return `${prefix}${n + 1}`;
}

function nextWireId(wires: Wire[]): string {
  let n = 0;
  for (const wire of wires) {
    const match = wire.id.match(/^W(\d+)$/);
    if (match) n = Math.max(n, Number(match[1]));
  }
  return `W${n + 1}`;
}

function snapOf(parts: Part[], wires: Wire[]): Snap {
  return { parts: structuredClone(parts), wires: structuredClone(wires) };
}

function seededProbes(parts: Part[], wires: Wire[]): string[] {
  const nets = extractNets(parts, wires).nets.filter((net) => !net.ground);
  const last = nets[nets.length - 1];
  return last ? [last.id] : [];
}

const demo = getExample("rc");
const demoResult = simulate(demo.parts, demo.wires, demo.sim);
if (!demoResult.error) demoResult.elapsedMs = 0;

export const useCircuit = create<CircuitState>((set, get) => ({
  parts: demo.parts,
  wires: demo.wires,
  selected: null,
  tool: "select",
  sim: demo.sim,
  result: demoResult.error ? null : demoResult,
  revision: 1,
  resultRev: 1,
  showResults: !demoResult.error,
  netlistOpen: false,
  sidebarOpen: true,
  helpOpen: false,
  editingId: null,
  placing: null,
  wireDraft: null,
  cursor: null,
  panX: -111,
  panY: -70,
  zoom: 1.53,
  sheet: demo.name,
  cloudId: null,
  cloudPublic: false,
  notice: null,
  probes: seededProbes(demo.parts, demo.wires),
  past: [],
  future: [],

  setTool: (tool) => set({ tool, wireDraft: tool === "wire" ? get().wireDraft : null }),
  setSidebar: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
  toggleNetlist: () => set({ netlistOpen: !get().netlistOpen }),
  toggleHelp: () => set({ helpOpen: !get().helpOpen }),
  toggleResults: () => set({ showResults: !get().showResults }),
  setCursor: (cursor) => {
    const cur = get().cursor;
    if (cur?.x === cursor?.x && cur?.y === cursor?.y) return;
    set({ cursor });
  },
  setPlacing: (placing) => set({ placing }),
  rotatePlacing: () => {
    const placing = get().placing;
    if (!placing) return;
    set({ placing: { ...placing, rot: nextRot(placing.rot) } });
  },
  panBy: (dx, dy) => set({ panX: get().panX + dx, panY: get().panY + dy }),
  zoomAt: (sx, sy, factor) => {
    const { zoom, panX, panY } = get();
    const next = Math.min(6, Math.max(0.25, zoom * factor));
    const wx = (sx - panX) / zoom;
    const wy = (sy - panY) / zoom;
    set({ zoom: next, panX: sx - wx * next, panY: sy - wy * next });
  },
  fit: (width, height) => {
    set(frameCamera(get().parts, width, height));
  },
  select: (selected) => set({ selected }),
  openEdit: (id) => set({ editingId: id, selected: { kind: "part", id } }),
  closeEdit: () => set({ editingId: null }),
  place: (type, x, y, rot) => {
    const { parts, wires, past, revision } = get();
    const id = nextId(parts, type);
    const part: Part = { id, type, x, y, rot, params: defaultParams(type) };
    set({
      parts: [...parts, part],
      selected: { kind: "part", id },
      past: [...past, snapOf(parts, wires)].slice(-80),
      future: [],
      revision: revision + 1,
      wireDraft: null,
      sheet: get().sheet,
    });
  },
  movePart: (id, x, y) => {
    const part = get().parts.find((p) => p.id === id);
    if (!part || (part.x === x && part.y === y)) return;
    set({
      parts: get().parts.map((p) => (p.id === id ? { ...p, x, y } : p)),
      revision: get().revision + 1,
    });
  },
  remember: (snap) => {
    const { parts, wires, past } = get();
    if (JSON.stringify(snap.parts) === JSON.stringify(parts) && JSON.stringify(snap.wires) === JSON.stringify(wires)) {
      return;
    }
    set({ past: [...past, snap].slice(-80), future: [] });
  },
  rotateSelected: () => {
    const { selected, parts, wires, past, revision } = get();
    if (selected?.kind !== "part") return;
    set({
      parts: parts.map((p) => (p.id === selected.id ? { ...p, rot: nextRot(p.rot) } : p)),
      past: [...past, snapOf(parts, wires)].slice(-80),
      future: [],
      revision: revision + 1,
    });
  },
  deleteSelected: () => {
    const { selected, parts, wires, past, revision, editingId } = get();
    if (!selected) return;
    if (selected.kind === "wire") {
      set({
        wires: wires.filter((w) => w.id !== selected.id),
        selected: null,
        past: [...past, snapOf(parts, wires)].slice(-80),
        future: [],
        revision: revision + 1,
      });
      return;
    }
    set({
      parts: parts.filter((p) => p.id !== selected.id),
      wires: wires.filter((w) => !w.points.some((pt) => pt.kind === "pin" && pt.partId === selected.id)),
      selected: null,
      editingId: editingId === selected.id ? null : editingId,
      past: [...past, snapOf(parts, wires)].slice(-80),
      future: [],
      revision: revision + 1,
    });
  },
  duplicate: () => {
    const { selected, parts, wires, past, revision } = get();
    if (selected?.kind !== "part") return;
    const src = parts.find((p) => p.id === selected.id);
    if (!src) return;
    const id = nextId(parts, src.type);
    const copy: Part = { ...structuredClone(src), id, x: src.x + 2, y: src.y + 2 };
    set({
      parts: [...parts, copy],
      selected: { kind: "part", id },
      past: [...past, snapOf(parts, wires)].slice(-80),
      future: [],
      revision: revision + 1,
    });
  },
  setPartParams: (id, params) => {
    const { parts, wires, past, revision } = get();
    set({
      parts: parts.map((p) => (p.id === id ? { ...p, params: { ...params } } : p)),
      past: [...past, snapOf(parts, wires)].slice(-80),
      future: [],
      revision: revision + 1,
      editingId: null,
    });
  },
  startDraft: (point) => set({ wireDraft: { points: [point], cursor: null }, tool: "wire" }),
  addDraftPoint: (point) => {
    const draft = get().wireDraft;
    if (!draft) return;
    const last = draft.points[draft.points.length - 1];
    if (last && last.kind === "xy" && point.kind === "xy" && last.x === point.x && last.y === point.y) return;
    set({ wireDraft: { ...draft, points: [...draft.points, point] } });
  },
  setDraftCursor: (x, y) => {
    const draft = get().wireDraft;
    if (!draft || (draft.cursor?.x === x && draft.cursor?.y === y)) return;
    set({ wireDraft: { ...draft, cursor: { x, y } } });
  },
  popDraft: () => {
    const draft = get().wireDraft;
    if (!draft) return;
    if (draft.points.length <= 1) set({ wireDraft: null });
    else set({ wireDraft: { ...draft, points: draft.points.slice(0, -1) } });
  },
  cancelDraft: () => set({ wireDraft: null }),
  commitWire: (points) => {
    const { parts, wires, past, revision } = get();
    if (points.length < 2) {
      set({ wireDraft: null });
      return;
    }
    const id = nextWireId(wires);
    set({
      wires: [...wires, { id, points }],
      selected: { kind: "wire", id },
      wireDraft: null,
      past: [...past, snapOf(parts, wires)].slice(-80),
      future: [],
      revision: revision + 1,
    });
  },
  setSim: (patch) => set({ sim: { ...get().sim, ...patch }, revision: get().revision + 1 }),
  loadExample: (id) => {
    const ex = getExample(id);
    const { parts, wires, past, revision } = get();
    const result = ex.parts.length ? simulate(ex.parts, ex.wires, ex.sim) : null;
    set({
      parts: ex.parts,
      wires: ex.wires,
      sim: ex.sim,
      sheet: ex.name,
      result: result && !result.error ? result : result,
      resultRev: revision + 1,
      showResults: Boolean(result && ex.parts.length),
      selected: null,
      wireDraft: null,
      editingId: null,
      placing: null,
      probes: seededProbes(ex.parts, ex.wires),
      cloudId: null,
      cloudPublic: false,
      notice: null,
      past: [...past, snapOf(parts, wires)].slice(-80),
      future: [],
      revision: revision + 1,
    });
    if (viewRef.width > 0) get().fit(viewRef.width, viewRef.height);
  },
  applyRemote: (row) => {
    const { parts, wires, past, revision } = get();
    const result = row.parts.length ? simulate(row.parts, row.wires, row.sim) : null;
    if (result && !result.error) result.elapsedMs = 0;
    set({
      parts: row.parts,
      wires: row.wires,
      sim: row.sim,
      sheet: row.name,
      cloudId: row.id,
      cloudPublic: row.isPublic,
      notice: null,
      result,
      resultRev: revision + 1,
      showResults: Boolean(result && row.parts.length),
      selected: null,
      wireDraft: null,
      editingId: null,
      placing: null,
      probes: seededProbes(row.parts, row.wires),
      past: [...past, snapOf(parts, wires)].slice(-80),
      future: [],
      revision: revision + 1,
    });
    if (viewRef.width > 0) get().fit(viewRef.width, viewRef.height);
  },
  setCloud: (id, name, isPublic) =>
    set({ cloudId: id, sheet: name, cloudPublic: isPublic, notice: id ? "Saved to your account." : null }),
  setNotice: (notice) => set({ notice }),
  run: () => {
    const { parts, wires, sim, revision } = get();
    const result = simulate(parts, wires, sim);
    set({ result, resultRev: revision, showResults: true });
  },
  toggleProbe: (netId) => {
    if (!netId || netId === "0") return;
    const probes = get().probes;
    set({ probes: probes.includes(netId) ? probes.filter((id) => id !== netId) : [...probes, netId] });
  },
  clearProbes: () => set({ probes: [] }),
  undo: () => {
    const { past, future, parts, wires, revision } = get();
    const prev = past[past.length - 1];
    if (!prev) return;
    set({
      past: past.slice(0, -1),
      future: [...future, snapOf(parts, wires)],
      parts: prev.parts,
      wires: prev.wires,
      selected: null,
      wireDraft: null,
      editingId: null,
      revision: revision + 1,
    });
  },
  redo: () => {
    const { past, future, parts, wires, revision } = get();
    const next = future[future.length - 1];
    if (!next) return;
    set({
      future: future.slice(0, -1),
      past: [...past, snapOf(parts, wires)],
      parts: next.parts,
      wires: next.wires,
      selected: null,
      wireDraft: null,
      editingId: null,
      revision: revision + 1,
    });
  },
  hydrate: (data) => {
    const result = data.parts.length ? simulate(data.parts, data.wires, data.sim) : null;
    set({
      parts: data.parts,
      wires: data.wires,
      sim: data.sim,
      panX: data.panX,
      panY: data.panY,
      zoom: data.zoom,
      sheet: data.sheet || "Untitled",
      cloudId: data.cloudId ?? null,
      cloudPublic: Boolean(data.cloudPublic),
      notice: null,
      result,
      resultRev: 1,
      revision: 1,
      showResults: Boolean(result),
      past: [],
      future: [],
      selected: null,
      wireDraft: null,
      editingId: null,
      probes: seededProbes(data.parts, data.wires),
    });
  },
}));
