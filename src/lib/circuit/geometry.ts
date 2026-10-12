import type { CompType, Part, Rotation, Wire, WirePoint } from "./types.ts";

export const GRID = 20;

export type XY = { x: number; y: number };

export type PinDef = { id: string; x: number; y: number; name: string };

export function pinsOf(type: CompType): PinDef[] {
  switch (type) {
    case "R":
    case "C":
    case "L":
      return [
        { id: "1", x: 0, y: 0, name: "1" },
        { id: "2", x: 4, y: 0, name: "2" },
      ];
    case "V":
      return [
        { id: "n", x: 0, y: 0, name: "−" },
        { id: "p", x: 4, y: 0, name: "+" },
      ];
    case "I":
      return [
        { id: "p", x: 0, y: 0, name: "+" },
        { id: "n", x: 4, y: 0, name: "−" },
      ];
    case "D":
      return [
        { id: "A", x: 0, y: 0, name: "A" },
        { id: "K", x: 4, y: 0, name: "K" },
      ];
    case "GND":
      return [{ id: "g", x: 0, y: 0, name: "0" }];
    case "QNPN":
    case "QPNP":
      return [
        { id: "B", x: 0, y: 2, name: "B" },
        { id: "C", x: 4, y: 0, name: "C" },
        { id: "E", x: 4, y: 4, name: "E" },
      ];
    case "MN":
    case "MP":
      return [
        { id: "G", x: 0, y: 2, name: "G" },
        { id: "D", x: 4, y: 0, name: "D" },
        { id: "S", x: 4, y: 4, name: "S" },
      ];
  }
}

export function rotate(x: number, y: number, rot: Rotation): XY {
  switch (rot) {
    case 0:
      return { x, y };
    case 90:
      return { x: -y, y: x };
    case 180:
      return { x: -x, y: -y };
    case 270:
      return { x: y, y: -x };
  }
}

export function nextRot(rot: Rotation): Rotation {
  return ((rot + 90) % 360) as Rotation;
}

export function sheetFrame(parts: Part[]): { x0: number; y0: number; x1: number; y1: number } | null {
  if (!parts.length) return null;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const part of parts) {
    const pts = part.type === "GND" ? [...worldPins(part), { x: part.x, y: part.y + 1.4 }] : worldPins(part);
    for (const pin of pts) {
      x0 = Math.min(x0, pin.x * GRID - 16);
      y0 = Math.min(y0, pin.y * GRID - 28);
      x1 = Math.max(x1, pin.x * GRID + 16);
      y1 = Math.max(y1, pin.y * GRID + 28);
    }
  }
  return { x0, y0, x1, y1 };
}

export function frameCamera(parts: Part[], width: number, height: number): { panX: number; panY: number; zoom: number } {
  const frame = sheetFrame(parts);
  if (!frame || width < 20 || height < 20) return { panX: 48, panY: 48, zoom: 1 };
  const bw = Math.max(80, frame.x1 - frame.x0);
  const bh = Math.max(80, frame.y1 - frame.y0);
  const zoom = Math.min(2.2, Math.max(0.35, Math.min((width - 96) / bw, (height - 96) / bh)));
  return {
    zoom,
    panX: (width - (frame.x0 + frame.x1) * zoom) / 2,
    panY: (height - (frame.y0 + frame.y1) * zoom) / 2,
  };
}

export function worldPins(part: Part): Array<PinDef & XY> {
  return pinsOf(part.type).map((pin) => {
    const p = rotate(pin.x, pin.y, part.rot);
    return { ...pin, x: part.x + p.x, y: part.y + p.y };
  });
}

export function pinWorld(part: Part, pinId: string): XY | null {
  const pin = worldPins(part).find((p) => p.id === pinId);
  return pin ? { x: pin.x, y: pin.y } : null;
}

export function toPx(p: XY): XY {
  return { x: p.x * GRID, y: p.y * GRID };
}

function resolvePoint(point: WirePoint, parts: Part[]): XY | null {
  if (point.kind === "xy") return { x: point.x, y: point.y };
  const part = parts.find((p) => p.id === point.partId);
  if (!part) return null;
  return pinWorld(part, point.pin);
}

/** Orthogonal polyline in grid units, including the elbow between diagonal anchors. */
export function wirePolyline(wire: Wire, parts: Part[]): XY[] {
  const anchors: XY[] = [];
  for (const point of wire.points) {
    const p = resolvePoint(point, parts);
    if (!p) return [];
    anchors.push(p);
  }
  const out: XY[] = [];
  for (const cur of anchors) {
    const prev = out[out.length - 1];
    if (!prev) {
      out.push(cur);
      continue;
    }
    if (prev.x !== cur.x && prev.y !== cur.y) {
      out.push({ x: cur.x, y: prev.y });
    }
    if (prev.x !== cur.x || prev.y !== cur.y) out.push(cur);
  }
  return out;
}

export function elbow(a: XY, b: XY, horizFirst: boolean): XY[] {
  if (a.x === b.x || a.y === b.y) return [a, b];
  return horizFirst ? [a, { x: b.x, y: a.y }, b] : [a, { x: a.x, y: b.y }, b];
}

export function distToSeg(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

export function partAnchorHit(part: Part, wx: number, wy: number, zoom: number): boolean {
  const thresh = 12 / zoom;
  if (part.type === "GND") {
    const pin = toPx(worldPins(part)[0]!);
    const tip = rotate(0, 1.35, part.rot);
    const end = { x: pin.x + tip.x * GRID, y: pin.y + tip.y * GRID };
    return distToSeg(wx, wy, pin.x, pin.y, end.x, end.y) <= thresh + 6 / zoom;
  }
  const pins = worldPins(part).map(toPx);
  if (pins.length === 2) {
    const [a, b] = pins;
    return distToSeg(wx, wy, a!.x, a!.y, b!.x, b!.y) <= thresh;
  }
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const p of pins) {
    x0 = Math.min(x0, p.x);
    y0 = Math.min(y0, p.y);
    x1 = Math.max(x1, p.x);
    y1 = Math.max(y1, p.y);
  }
  const pad = 8 / zoom;
  return wx >= x0 - pad && wx <= x1 + pad && wy >= y0 - pad && wy <= y1 + pad;
}

export type PinHit = { partId: string; pin: string; x: number; y: number };

export function hitPin(parts: Part[], wx: number, wy: number, zoom: number): PinHit | null {
  const r = 14 / zoom;
  let best: PinHit | null = null;
  let bestD = r;
  for (const part of parts) {
    for (const pin of worldPins(part)) {
      const p = toPx(pin);
      const d = Math.hypot(wx - p.x, wy - p.y);
      if (d <= bestD) {
        bestD = d;
        best = { partId: part.id, pin: pin.id, x: pin.x, y: pin.y };
      }
    }
  }
  return best;
}

export function hitPart(parts: Part[], wx: number, wy: number, zoom: number): Part | null {
  const hits = parts.filter((p) => partAnchorHit(p, wx, wy, zoom));
  if (!hits.length) return null;
  hits.sort((a, b) => {
    const ac = worldPins(a)[0]!;
    const bc = worldPins(b)[0]!;
    const da = Math.hypot(wx - ac.x * GRID, wy - ac.y * GRID);
    const db = Math.hypot(wx - bc.x * GRID, wy - bc.y * GRID);
    return da - db;
  });
  return hits[0] ?? null;
}

export function hitWire(wires: Wire[], parts: Part[], wx: number, wy: number, zoom: number): Wire | null {
  const thresh = 8 / zoom;
  let best: Wire | null = null;
  let bestD = thresh;
  for (const wire of wires) {
    const poly = wirePolyline(wire, parts).map(toPx);
    for (let i = 1; i < poly.length; i++) {
      const a = poly[i - 1]!;
      const b = poly[i]!;
      const d = distToSeg(wx, wy, a.x, a.y, b.x, b.y);
      if (d < bestD) {
        bestD = d;
        best = wire;
      }
    }
  }
  return best;
}

export function pointOnAxisSegment(a: XY, b: XY, p: XY): boolean {
  if (a.x === b.x && p.x === a.x) {
    const y1 = Math.min(a.y, b.y);
    const y2 = Math.max(a.y, b.y);
    return p.y >= y1 && p.y <= y2;
  }
  if (a.y === b.y && p.y === a.y) {
    const x1 = Math.min(a.x, b.x);
    const x2 = Math.max(a.x, b.x);
    return p.x >= x1 && p.x <= x2;
  }
  return false;
}

export function snapSegmentPoint(wires: Wire[], parts: Part[], grid: XY): XY | null {
  for (const wire of wires) {
    const poly = wirePolyline(wire, parts);
    for (let i = 1; i < poly.length; i++) {
      const a = poly[i - 1]!;
      const b = poly[i]!;
      if (pointOnAxisSegment(a, b, grid)) return grid;
    }
  }
  return null;
}

export const viewRef = {
  panX: 80,
  panY: 48,
  zoom: 1.25,
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};

export function clientToWorld(clientX: number, clientY: number): XY | null {
  const { left, top, width, height, panX, panY, zoom } = viewRef;
  if (!width || !height) return null;
  const sx = clientX - left;
  const sy = clientY - top;
  if (sx < 0 || sy < 0 || sx > width || sy > height) return null;
  return { x: (sx - panX) / zoom, y: (sy - panY) / zoom };
}

export function clientToGrid(clientX: number, clientY: number): XY | null {
  const w = clientToWorld(clientX, clientY);
  if (!w) return null;
  return { x: Math.round(w.x / GRID), y: Math.round(w.y / GRID) };
}
