import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { partValueLabel, TRACE_COLORS } from "@/lib/circuit/catalog";
import {
  GRID,
  elbow,
  hitPart,
  hitPin,
  hitWire,
  sheetFrame,
  snapSegmentPoint,
  toPx,
  viewRef,
  wirePolyline,
  worldPins,
  type XY,
} from "@/lib/circuit/geometry";
import { extractNets, netAt, pointKey } from "@/lib/circuit/nets";
import { STORAGE_KEY, useCircuit } from "@/lib/circuit/store";
import type { Part, Wire, WirePoint } from "@/lib/circuit/types";
import { cn } from "@/lib/cn";
import { SymbolShape } from "./symbols";

function isTyping(target: EventTarget | null): boolean {
  const tag = target instanceof HTMLElement ? target.tagName : "";
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function draftPath(points: WirePoint[], cursor: XY | null, parts: Part[]): XY[] {
  const base = wirePolyline({ id: "draft", points }, parts);
  if (!cursor || !base.length) return base;
  const last = base[base.length - 1]!;
  if (last.x === cursor.x && last.y === cursor.y) return base;
  const horiz = Math.abs(cursor.x - last.x) >= Math.abs(cursor.y - last.y);
  return [...base, ...elbow(last, cursor, horiz).slice(1)];
}

export function CanvasView() {
  const ref = useRef<SVGSVGElement>(null);
  const space = useRef(false);
  const drag = useRef<
    | null
    | { kind: "pan"; sx: number; sy: number; panX: number; panY: number }
    | { kind: "move"; id: string; ox: number; oy: number; gx: number; gy: number; beforeParts: Part[]; beforeWires: Wire[] }
  >(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [hover, setHover] = useState<string | null>(null);

  const parts = useCircuit((s) => s.parts);
  const wires = useCircuit((s) => s.wires);
  const tool = useCircuit((s) => s.tool);
  const selected = useCircuit((s) => s.selected);
  const placing = useCircuit((s) => s.placing);
  const draft = useCircuit((s) => s.wireDraft);
  const probes = useCircuit((s) => s.probes);
  const panX = useCircuit((s) => s.panX);
  const panY = useCircuit((s) => s.panY);
  const zoom = useCircuit((s) => s.zoom);

  viewRef.panX = panX;
  viewRef.panY = panY;
  viewRef.zoom = zoom;

  const fitted = useRef(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      viewRef.left = rect.left;
      viewRef.top = rect.top;
      viewRef.width = rect.width;
      viewRef.height = rect.height;
      setSize({ w: rect.width, h: rect.height });
      if (!fitted.current && rect.width > 40 && rect.height > 40 && !localStorage.getItem(STORAGE_KEY)) {
        fitted.current = true;
        useCircuit.getState().fit(rect.width, rect.height);
      }
    };
    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      useCircuit.getState().zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0011));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isTyping(e.target)) {
        e.preventDefault();
        space.current = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") space.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  function worldOf(clientX: number, clientY: number): XY {
    const rect = ref.current?.getBoundingClientRect();
    const { panX: px, panY: py, zoom: z } = useCircuit.getState();
    return {
      x: (clientX - (rect?.left ?? 0) - px) / z,
      y: (clientY - (rect?.top ?? 0) - py) / z,
    };
  }

  function gridOf(clientX: number, clientY: number): XY {
    const w = worldOf(clientX, clientY);
    return { x: Math.round(w.x / GRID), y: Math.round(w.y / GRID) };
  }

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (e.button === 2) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const state = useCircuit.getState();
    const world = worldOf(e.clientX, e.clientY);
    const grid = gridOf(e.clientX, e.clientY);
    state.setCursor(grid);

    if (e.button === 1 || state.tool === "pan" || space.current) {
      drag.current = { kind: "pan", sx: e.clientX, sy: e.clientY, panX: state.panX, panY: state.panY };
      return;
    }

    if (state.tool === "probe") {
      const netId = netAt(state.parts, state.wires, world.x, world.y, state.zoom);
      if (netId) state.toggleProbe(netId);
      return;
    }

    if (state.tool === "wire") {
      const pin = hitPin(state.parts, world.x, world.y, state.zoom);
      const onSeg = snapSegmentPoint(state.wires, state.parts, grid);
      if (!state.wireDraft) {
        if (pin) state.startDraft({ kind: "pin", partId: pin.partId, pin: pin.pin });
        else if (onSeg) state.startDraft({ kind: "xy", x: onSeg.x, y: onSeg.y });
        return;
      }
      if (pin) {
        state.commitWire([...state.wireDraft.points, { kind: "pin", partId: pin.partId, pin: pin.pin }]);
        return;
      }
      if (onSeg) {
        state.commitWire([...state.wireDraft.points, { kind: "xy", x: onSeg.x, y: onSeg.y }]);
        return;
      }
      state.addDraftPoint({ kind: "xy", x: grid.x, y: grid.y });
      return;
    }

    const part = hitPart(state.parts, world.x, world.y, state.zoom);
    if (part) {
      state.select({ kind: "part", id: part.id });
      drag.current = {
        kind: "move",
        id: part.id,
        ox: part.x,
        oy: part.y,
        gx: grid.x,
        gy: grid.y,
        beforeParts: structuredClone(state.parts),
        beforeWires: structuredClone(state.wires),
      };
      return;
    }
    const wire = hitWire(state.wires, state.parts, world.x, world.y, state.zoom);
    if (wire) {
      state.select({ kind: "wire", id: wire.id });
      return;
    }
    state.select(null);
    drag.current = { kind: "pan", sx: e.clientX, sy: e.clientY, panX: state.panX, panY: state.panY };
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const state = useCircuit.getState();
    const world = worldOf(e.clientX, e.clientY);
    const grid = gridOf(e.clientX, e.clientY);
    state.setCursor(grid);
    const current = drag.current;
    if (current?.kind === "pan") {
      state.panBy(e.clientX - current.sx - (state.panX - current.panX), e.clientY - current.sy - (state.panY - current.panY));
      return;
    }
    if (current?.kind === "move") {
      const nx = current.ox + (grid.x - current.gx);
      const ny = current.oy + (grid.y - current.gy);
      state.movePart(current.id, nx, ny);
      return;
    }
    if (state.wireDraft) state.setDraftCursor(grid.x, grid.y);
    const part = state.tool === "select" ? hitPart(state.parts, world.x, world.y, state.zoom) : null;
    setHover(part?.id ?? null);
  }

  function onPointerUp() {
    const current = drag.current;
    drag.current = null;
    if (current?.kind === "move") {
      useCircuit.getState().remember({ parts: current.beforeParts, wires: current.beforeWires });
    }
  }

  function onDoubleClick(e: React.MouseEvent<SVGSVGElement>) {
    const state = useCircuit.getState();
    const world = worldOf(e.clientX, e.clientY);
    const part = hitPart(state.parts, world.x, world.y, state.zoom);
    if (part && part.type !== "GND") state.openEdit(part.id);
    else if (part) state.openEdit(part.id);
  }

  function onContextMenu(e: React.MouseEvent<SVGSVGElement>) {
    e.preventDefault();
    const state = useCircuit.getState();
    const world = worldOf(e.clientX, e.clientY);
    const part = hitPart(state.parts, world.x, world.y, state.zoom);
    if (!part) return;
    state.openEdit(part.id);
  }

  const x0 = -panX / zoom - GRID;
  const y0 = -panY / zoom - GRID;
  const x1 = (size.w - panX) / zoom + GRID;
  const y1 = (size.h - panY) / zoom + GRID;
  const graph = extractNets(parts, wires);
  const junctions = graph.junctions;
  const probeColor = new Map(probes.map((id, i) => [id, TRACE_COLORS[i % TRACE_COLORS.length]!] as const));
  const showMinor = zoom >= 0.55 && (x1 - x0) / GRID < 220;
  const gridLines: { x1: number; y1: number; x2: number; y2: number; major: boolean }[] = [];
  const startX = Math.floor(x0 / GRID) * GRID;
  const startY = Math.floor(y0 / GRID) * GRID;
  for (let x = startX; x <= x1; x += GRID) {
    const major = Math.round(x / GRID) % 5 === 0;
    if (!major && !showMinor) continue;
    gridLines.push({ x1: x, y1: y0, x2: x, y2: y1, major });
  }
  for (let y = startY; y <= y1; y += GRID) {
    const major = Math.round(y / GRID) % 5 === 0;
    if (!major && !showMinor) continue;
    gridLines.push({ x1: x0, y1: y, x2: x1, y2: y, major });
  }

  const preview = draft ? draftPath(draft.points, draft.cursor, parts) : [];
  const frame = sheetFrame(parts);

  return (
    <div className="relative min-w-0 flex-1 bg-bg">
      <svg
        ref={ref}
        data-canvas=""
        data-fit-x0={frame ? frame.x0 : undefined}
        data-fit-y0={frame ? frame.y0 : undefined}
        data-fit-x1={frame ? frame.x1 : undefined}
        data-fit-y1={frame ? frame.y1 : undefined}
        className={cn(
          "h-full w-full touch-none",
          tool === "wire" && "cursor-crosshair",
          tool === "probe" && "cursor-crosshair",
          tool === "pan" && "cursor-grab",
          tool === "select" && "cursor-default",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      >
        <g data-camera="" suppressHydrationWarning transform={`translate(${panX} ${panY}) scale(${zoom})`}>
          <g shapeRendering="crispEdges">
            {gridLines.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="white"
                strokeOpacity={line.major ? 0.14 : 0.05}
                strokeWidth={1 / zoom}
              />
            ))}
          </g>

          {wires.map((wire) => {
            const poly = wirePolyline(wire, parts);
            if (poly.length < 2) return null;
            const active = selected?.kind === "wire" && selected.id === wire.id;
            return (
              <polyline
                key={wire.id}
                points={poly.map((p) => `${p.x * GRID},${p.y * GRID}`).join(" ")}
                fill="none"
                className="stroke-accent"
                strokeWidth={(active ? 2.6 : 1.6) / zoom}
                strokeLinejoin="miter"
                strokeLinecap="square"
                opacity={active ? 1 : 0.92}
              />
            );
          })}

          {preview.length > 1 ? (
            <polyline
              points={preview.map((p) => `${p.x * GRID},${p.y * GRID}`).join(" ")}
              fill="none"
              className="stroke-accent"
              strokeWidth={1.5 / zoom}
              strokeDasharray={`${5 / zoom} ${4 / zoom}`}
              strokeLinejoin="miter"
            />
          ) : null}

          {wires.map((wire) => {
            const poly = wirePolyline(wire, parts);
            if (poly.length < 2) return null;
            const netId = poly.map((p) => graph.pointNet.get(pointKey(p))).find((id) => id && probeColor.has(id));
            const color = netId ? probeColor.get(netId) : undefined;
            if (!color) return null;
            return (
              <polyline
                key={`probe-${wire.id}`}
                points={poly.map((p) => `${p.x * GRID},${p.y * GRID}`).join(" ")}
                fill="none"
                stroke={color}
                strokeWidth={3.4 / zoom}
                strokeLinejoin="miter"
                strokeLinecap="square"
              />
            );
          })}

          {graph.nets.map((net) => {
            const color = probeColor.get(net.id);
            if (!color || net.ground) return null;
            return (
              <g key={`probe-net-${net.id}`}>
                {net.pins.map((pin) => {
                  const part = parts.find((item) => item.id === pin.partId);
                  if (!part) return null;
                  const pins = worldPins(part);
                  const self = pins.find((item) => item.id === pin.pin);
                  if (!self) return null;
                  const others = pins.filter((item) => item.id !== pin.pin);
                  const cx = others.length ? others.reduce((sum, item) => sum + item.x, 0) / others.length : self.x + 1;
                  const cy = others.length ? others.reduce((sum, item) => sum + item.y, 0) / others.length : self.y;
                  const len = Math.hypot(cx - self.x, cy - self.y) || 1;
                  const x1 = self.x * GRID;
                  const y1 = self.y * GRID;
                  const reach = 0.72 * GRID;
                  return (
                    <g key={`${pin.partId}:${pin.pin}`}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x1 + ((cx - self.x) / len) * reach}
                        y2={y1 + ((cy - self.y) / len) * reach}
                        stroke={color}
                        strokeWidth={3.2 / zoom}
                        strokeLinecap="square"
                      />
                      <circle cx={x1} cy={y1} r={4.4 / zoom} fill={color} />
                    </g>
                  );
                })}
                <text
                  x={net.at.x * GRID}
                  y={net.at.y * GRID - 14 / zoom}
                  textAnchor="middle"
                  fontSize={11 / zoom}
                  fontFamily="JetBrains Mono, ui-monospace, monospace"
                  fill={color}
                >
                  V({net.id})
                </text>
              </g>
            );
          })}

          {junctions.map((p) => (
            <circle key={`${p.x},${p.y}`} cx={p.x * GRID} cy={p.y * GRID} r={3.1 / zoom} className="fill-accent" />
          ))}

          {parts.map((part) => (
            <PartGlyph
              key={part.id}
              part={part}
              zoom={zoom}
              selected={selected?.kind === "part" && selected.id === part.id}
              hovered={hover === part.id}
              showPins={tool === "wire" || tool === "probe" || (selected?.kind === "part" && selected.id === part.id) || hover === part.id}
            />
          ))}

          {placing ? (
            <g
              transform={`translate(${placing.x * GRID} ${placing.y * GRID}) rotate(${placing.rot})`}
              className="text-accent"
              opacity={0.85}
            >
              <SymbolShape type={placing.type} strokeWidth={1.6 / zoom} />
            </g>
          ) : null}
        </g>
      </svg>
      {parts.length === 0 && !placing ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-sm">Empty sheet</p>
            <p className="mt-1 text-xs text-muted">Drag a part from the library</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PartGlyph({
  part,
  zoom,
  selected,
  hovered,
  showPins,
}: {
  part: Part;
  zoom: number;
  selected: boolean;
  hovered: boolean;
  showPins: boolean;
}) {
  const pins = worldPins(part);
  const px = pins.map(toPx);
  const cx = px.reduce((s, p) => s + p.x, 0) / px.length;
  const cy = px.reduce((s, p) => s + p.y, 0) / px.length;
  const value = partValueLabel(part.type, part.params);
  const s = 5 / zoom;
  return (
    <g className={selected ? "text-accent" : hovered ? "text-fg" : "text-fg"}>
      <g transform={`translate(${part.x * GRID} ${part.y * GRID}) rotate(${part.rot})`} opacity={selected ? 1 : 0.92}>
        <SymbolShape type={part.type} strokeWidth={(selected ? 1.9 : 1.45) / zoom} />
      </g>
      {showPins
        ? pins.map((pin) => (
            <rect
              key={pin.id}
              x={pin.x * GRID - s / 2}
              y={pin.y * GRID - s / 2}
              width={s}
              height={s}
              className={selected || showPins ? "fill-accent" : "fill-fg"}
            />
          ))
        : null}
      {zoom >= 0.45 && part.type !== "GND" ? (
        <g className="pointer-events-none">
          <text
            x={cx}
            y={cy - 14 / zoom}
            textAnchor="middle"
            fontSize={11 / zoom}
            fontFamily="JetBrains Mono, ui-monospace, monospace"
            className="fill-fg"
          >
            {part.id}
          </text>
          {value ? (
            <text
              x={cx}
              y={cy + 18 / zoom}
              textAnchor="middle"
              fontSize={10 / zoom}
              fontFamily="JetBrains Mono, ui-monospace, monospace"
              className={selected ? "fill-accent" : "fill-muted"}
            >
              {value}
            </text>
          ) : null}
        </g>
      ) : null}
    </g>
  );
}
