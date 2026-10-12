import { hitPart, hitPin, hitWire, pinWorld, pinsOf, pointOnAxisSegment, wirePolyline, worldPins, GRID, type XY } from "./geometry.ts";
import type { Part, Wire } from "./types.ts";

export type NetPin = { partId: string; pin: string };

export type Net = {
  id: string;
  ground: boolean;
  pins: NetPin[];
  at: XY;
};

export type NetlistGraph = {
  nets: Net[];
  pinNet: Map<string, string>;
  pointNet: Map<string, string>;
  junctions: XY[];
};

export function pinKey(partId: string, pin: string): string {
  return `${partId}:${pin}`;
}

export function pointKey(p: XY): string {
  return `${p.x},${p.y}`;
}

class UnionFind {
  private parent = new Map<string, string>();

  add(key: string) {
    if (!this.parent.has(key)) this.parent.set(key, key);
  }

  find(key: string): string {
    this.add(key);
    let x = key;
    while (this.parent.get(x) !== x) x = this.parent.get(x)!;
    let y = key;
    while (y !== x) {
      const next = this.parent.get(y)!;
      this.parent.set(y, x);
      y = next;
    }
    return x;
  }

  union(a: string, b: string) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.parent.set(ra, rb);
  }
}

export function extractNets(parts: Part[], wires: Wire[]): NetlistGraph {
  const uf = new UnionFind();
  const points: XY[] = [];
  const seen = new Set<string>();

  const addPoint = (p: XY) => {
    const k = pointKey(p);
    if (seen.has(k)) return;
    seen.add(k);
    points.push(p);
    uf.add(k);
  };

  const pinAt: Array<{ part: Part; pin: string; at: XY }> = [];
  for (const part of parts) {
    for (const pin of pinsOf(part.type)) {
      const at = pinWorld(part, pin.id);
      if (!at) continue;
      pinAt.push({ part, pin: pin.id, at });
      addPoint(at);
    }
  }

  const polylines = wires.map((wire) => wirePolyline(wire, parts));
  for (const poly of polylines) {
    for (const p of poly) addPoint(p);
  }

  const atomic = (a: XY, b: XY): Array<[XY, XY]> => {
    if (a.x !== b.x && a.y !== b.y) return [[a, b]];
    const on = points.filter((p) => pointOnAxisSegment(a, b, p));
    on.sort((p, q) => (a.x === b.x ? p.y - q.y : p.x - q.x));
    const uniq: XY[] = [];
    for (const p of on) {
      const prev = uniq[uniq.length - 1];
      if (!prev || prev.x !== p.x || prev.y !== p.y) uniq.push(p);
    }
    const segs: Array<[XY, XY]> = [];
    for (let i = 1; i < uniq.length; i++) segs.push([uniq[i - 1]!, uniq[i]!]);
    return segs;
  };

  const segments: Array<[XY, XY]> = [];
  for (const poly of polylines) {
    for (let i = 1; i < poly.length; i++) {
      const segs = atomic(poly[i - 1]!, poly[i]!);
      for (const seg of segs) {
        uf.union(pointKey(seg[0]), pointKey(seg[1]));
        segments.push(seg);
      }
    }
  }

  const groups = new Map<string, { pins: NetPin[]; at: XY; ground: boolean }>();
  for (const pin of pinAt) {
    const root = uf.find(pointKey(pin.at));
    let group = groups.get(root);
    if (!group) {
      group = { pins: [], at: pin.at, ground: false };
      groups.set(root, group);
    }
    group.pins.push({ partId: pin.part.id, pin: pin.pin });
    if (pin.at.y < group.at.y || (pin.at.y === group.at.y && pin.at.x < group.at.x)) {
      group.at = pin.at;
    }
    if (pin.part.type === "GND") group.ground = true;
  }

  const ordered = [...groups.entries()].sort((a, b) => a[1].at.y - b[1].at.y || a[1].at.x - b[1].at.x);
  const signal: Array<{ root: string; net: Net }> = [];
  const grounded: NetPin[] = [];
  let groundAt: XY | null = null;
  let idx = 1;
  for (const [root, group] of ordered) {
    if (group.ground) {
      grounded.push(...group.pins);
      if (
        !groundAt ||
        group.at.y < groundAt.y ||
        (group.at.y === groundAt.y && group.at.x < groundAt.x)
      ) {
        groundAt = group.at;
      }
    } else {
      signal.push({
        root,
        net: { id: `n${idx++}`, ground: false, pins: group.pins, at: group.at },
      });
    }
  }

  const nets: Net[] = [];
  const rootToId = new Map<string, string>();
  if (groundAt) {
    nets.push({ id: "0", ground: true, pins: grounded, at: groundAt });
    for (const [root, group] of ordered) {
      if (group.ground) rootToId.set(root, "0");
    }
  }
  for (const item of signal) {
    nets.push(item.net);
    rootToId.set(item.root, item.net.id);
  }

  const pinNet = new Map<string, string>();
  for (const net of nets) {
    for (const pin of net.pins) pinNet.set(pinKey(pin.partId, pin.pin), net.id);
  }

  const pointNet = new Map<string, string>();
  for (const key of seen) {
    const id = rootToId.get(uf.find(key));
    if (id) pointNet.set(key, id);
  }

  const degree = new Map<string, number>();
  const bump = (p: XY) => {
    const k = pointKey(p);
    degree.set(k, (degree.get(k) ?? 0) + 1);
  };
  for (const [a, b] of segments) {
    if (a.x === b.x && a.y === b.y) continue;
    bump(a);
    bump(b);
  }
  for (const pin of pinAt) bump(pin.at);

  const junctions: XY[] = [];
  for (const [k, d] of degree) {
    if (d >= 3) {
      const [xs, ys] = k.split(",");
      junctions.push({ x: Number(xs), y: Number(ys) });
    }
  }

  return { nets, pinNet, pointNet, junctions };
}

/** Net under a cursor, in world pixels. Ground is "0". */
export function netAt(parts: Part[], wires: Wire[], wx: number, wy: number, zoom: number): string | null {
  const graph = extractNets(parts, wires);
  const pin = hitPin(parts, wx, wy, zoom);
  if (pin) {
    const id = graph.pinNet.get(pinKey(pin.partId, pin.pin));
    if (id) return id;
  }
  const wire = hitWire(wires, parts, wx, wy, zoom);
  if (wire) {
    for (const p of wirePolyline(wire, parts)) {
      const id = graph.pointNet.get(pointKey(p));
      if (id) return id;
    }
  }
  const part = hitPart(parts, wx, wy, zoom);
  if (!part) return null;
  let bestId: string | null = null;
  let bestD = Infinity;
  for (const pin of worldPins(part)) {
    const id = graph.pinNet.get(pinKey(part.id, pin.id));
    if (!id) continue;
    const d = Math.hypot(wx - pin.x * GRID, wy - pin.y * GRID);
    if (d < bestD) {
      bestD = d;
      bestId = id;
    }
  }
  return bestId;
}
