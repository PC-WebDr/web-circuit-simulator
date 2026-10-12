//#region node_modules/.nitro/vite/services/ssr/assets/netlist-y3OInw0w.js
function pinsOf(type) {
	switch (type) {
		case "R":
		case "C":
		case "L": return [{
			id: "1",
			x: 0,
			y: 0,
			name: "1"
		}, {
			id: "2",
			x: 4,
			y: 0,
			name: "2"
		}];
		case "V": return [{
			id: "n",
			x: 0,
			y: 0,
			name: "−"
		}, {
			id: "p",
			x: 4,
			y: 0,
			name: "+"
		}];
		case "I": return [{
			id: "p",
			x: 0,
			y: 0,
			name: "+"
		}, {
			id: "n",
			x: 4,
			y: 0,
			name: "−"
		}];
		case "D": return [{
			id: "A",
			x: 0,
			y: 0,
			name: "A"
		}, {
			id: "K",
			x: 4,
			y: 0,
			name: "K"
		}];
		case "GND": return [{
			id: "g",
			x: 0,
			y: 0,
			name: "0"
		}];
		case "QNPN":
		case "QPNP": return [
			{
				id: "B",
				x: 0,
				y: 2,
				name: "B"
			},
			{
				id: "C",
				x: 4,
				y: 0,
				name: "C"
			},
			{
				id: "E",
				x: 4,
				y: 4,
				name: "E"
			}
		];
		case "MN":
		case "MP": return [
			{
				id: "G",
				x: 0,
				y: 2,
				name: "G"
			},
			{
				id: "D",
				x: 4,
				y: 0,
				name: "D"
			},
			{
				id: "S",
				x: 4,
				y: 4,
				name: "S"
			}
		];
	}
}
function rotate(x, y, rot) {
	switch (rot) {
		case 0: return {
			x,
			y
		};
		case 90: return {
			x: -y,
			y: x
		};
		case 180: return {
			x: -x,
			y: -y
		};
		case 270: return {
			x: y,
			y: -x
		};
	}
}
function nextRot(rot) {
	return (rot + 90) % 360;
}
function sheetFrame(parts) {
	if (!parts.length) return null;
	let x0 = Infinity;
	let y0 = Infinity;
	let x1 = -Infinity;
	let y1 = -Infinity;
	for (const part of parts) {
		const pts = part.type === "GND" ? [...worldPins(part), {
			x: part.x,
			y: part.y + 1.4
		}] : worldPins(part);
		for (const pin of pts) {
			x0 = Math.min(x0, pin.x * 20 - 16);
			y0 = Math.min(y0, pin.y * 20 - 28);
			x1 = Math.max(x1, pin.x * 20 + 16);
			y1 = Math.max(y1, pin.y * 20 + 28);
		}
	}
	return {
		x0,
		y0,
		x1,
		y1
	};
}
function frameCamera(parts, width, height) {
	const frame = sheetFrame(parts);
	if (!frame || width < 20 || height < 20) return {
		panX: 48,
		panY: 48,
		zoom: 1
	};
	const bw = Math.max(80, frame.x1 - frame.x0);
	const bh = Math.max(80, frame.y1 - frame.y0);
	const zoom = Math.min(2.2, Math.max(.35, Math.min((width - 96) / bw, (height - 96) / bh)));
	return {
		zoom,
		panX: (width - (frame.x0 + frame.x1) * zoom) / 2,
		panY: (height - (frame.y0 + frame.y1) * zoom) / 2
	};
}
function worldPins(part) {
	return pinsOf(part.type).map((pin) => {
		const p = rotate(pin.x, pin.y, part.rot);
		return {
			...pin,
			x: part.x + p.x,
			y: part.y + p.y
		};
	});
}
function pinWorld(part, pinId) {
	const pin = worldPins(part).find((p) => p.id === pinId);
	return pin ? {
		x: pin.x,
		y: pin.y
	} : null;
}
function toPx(p) {
	return {
		x: p.x * 20,
		y: p.y * 20
	};
}
function resolvePoint(point, parts) {
	if (point.kind === "xy") return {
		x: point.x,
		y: point.y
	};
	const part = parts.find((p) => p.id === point.partId);
	if (!part) return null;
	return pinWorld(part, point.pin);
}
/** Orthogonal polyline in grid units, including the elbow between diagonal anchors. */
function wirePolyline(wire, parts) {
	const anchors = [];
	for (const point of wire.points) {
		const p = resolvePoint(point, parts);
		if (!p) return [];
		anchors.push(p);
	}
	const out = [];
	for (const cur of anchors) {
		const prev = out[out.length - 1];
		if (!prev) {
			out.push(cur);
			continue;
		}
		if (prev.x !== cur.x && prev.y !== cur.y) out.push({
			x: cur.x,
			y: prev.y
		});
		if (prev.x !== cur.x || prev.y !== cur.y) out.push(cur);
	}
	return out;
}
function elbow(a, b, horizFirst) {
	if (a.x === b.x || a.y === b.y) return [a, b];
	return horizFirst ? [
		a,
		{
			x: b.x,
			y: a.y
		},
		b
	] : [
		a,
		{
			x: a.x,
			y: b.y
		},
		b
	];
}
function distToSeg(px, py, ax, ay, bx, by) {
	const dx = bx - ax;
	const dy = by - ay;
	const l2 = dx * dx + dy * dy;
	if (l2 === 0) return Math.hypot(px - ax, py - ay);
	let t = ((px - ax) * dx + (py - ay) * dy) / l2;
	t = Math.max(0, Math.min(1, t));
	return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function partAnchorHit(part, wx, wy, zoom) {
	const thresh = 12 / zoom;
	if (part.type === "GND") {
		const pin = toPx(worldPins(part)[0]);
		const tip = rotate(0, 1.35, part.rot);
		const end = {
			x: pin.x + tip.x * 20,
			y: pin.y + tip.y * 20
		};
		return distToSeg(wx, wy, pin.x, pin.y, end.x, end.y) <= thresh + 6 / zoom;
	}
	const pins = worldPins(part).map(toPx);
	if (pins.length === 2) {
		const [a, b] = pins;
		return distToSeg(wx, wy, a.x, a.y, b.x, b.y) <= thresh;
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
function hitPin(parts, wx, wy, zoom) {
	const r = 14 / zoom;
	let best = null;
	let bestD = r;
	for (const part of parts) for (const pin of worldPins(part)) {
		const p = toPx(pin);
		const d = Math.hypot(wx - p.x, wy - p.y);
		if (d <= bestD) {
			bestD = d;
			best = {
				partId: part.id,
				pin: pin.id,
				x: pin.x,
				y: pin.y
			};
		}
	}
	return best;
}
function hitPart(parts, wx, wy, zoom) {
	const hits = parts.filter((p) => partAnchorHit(p, wx, wy, zoom));
	if (!hits.length) return null;
	hits.sort((a, b) => {
		const ac = worldPins(a)[0];
		const bc = worldPins(b)[0];
		return Math.hypot(wx - ac.x * 20, wy - ac.y * 20) - Math.hypot(wx - bc.x * 20, wy - bc.y * 20);
	});
	return hits[0] ?? null;
}
function hitWire(wires, parts, wx, wy, zoom) {
	const thresh = 8 / zoom;
	let best = null;
	let bestD = thresh;
	for (const wire of wires) {
		const poly = wirePolyline(wire, parts).map(toPx);
		for (let i = 1; i < poly.length; i++) {
			const a = poly[i - 1];
			const b = poly[i];
			const d = distToSeg(wx, wy, a.x, a.y, b.x, b.y);
			if (d < bestD) {
				bestD = d;
				best = wire;
			}
		}
	}
	return best;
}
function pointOnAxisSegment(a, b, p) {
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
function snapSegmentPoint(wires, parts, grid) {
	for (const wire of wires) {
		const poly = wirePolyline(wire, parts);
		for (let i = 1; i < poly.length; i++) {
			const a = poly[i - 1];
			const b = poly[i];
			if (pointOnAxisSegment(a, b, grid)) return grid;
		}
	}
	return null;
}
var viewRef = {
	panX: 80,
	panY: 48,
	zoom: 1.25,
	left: 0,
	top: 0,
	width: 0,
	height: 0
};
function clientToWorld(clientX, clientY) {
	const { left, top, width, height, panX, panY, zoom } = viewRef;
	if (!width || !height) return null;
	const sx = clientX - left;
	const sy = clientY - top;
	if (sx < 0 || sy < 0 || sx > width || sy > height) return null;
	return {
		x: (sx - panX) / zoom,
		y: (sy - panY) / zoom
	};
}
function clientToGrid(clientX, clientY) {
	const w = clientToWorld(clientX, clientY);
	if (!w) return null;
	return {
		x: Math.round(w.x / 20),
		y: Math.round(w.y / 20)
	};
}
function pinKey(partId, pin) {
	return `${partId}:${pin}`;
}
function pointKey(p) {
	return `${p.x},${p.y}`;
}
var UnionFind = class {
	parent = /* @__PURE__ */ new Map();
	add(key) {
		if (!this.parent.has(key)) this.parent.set(key, key);
	}
	find(key) {
		this.add(key);
		let x = key;
		while (this.parent.get(x) !== x) x = this.parent.get(x);
		let y = key;
		while (y !== x) {
			const next = this.parent.get(y);
			this.parent.set(y, x);
			y = next;
		}
		return x;
	}
	union(a, b) {
		const ra = this.find(a);
		const rb = this.find(b);
		if (ra !== rb) this.parent.set(ra, rb);
	}
};
function extractNets(parts, wires) {
	const uf = new UnionFind();
	const points = [];
	const seen = /* @__PURE__ */ new Set();
	const addPoint = (p) => {
		const k = pointKey(p);
		if (seen.has(k)) return;
		seen.add(k);
		points.push(p);
		uf.add(k);
	};
	const pinAt = [];
	for (const part of parts) for (const pin of pinsOf(part.type)) {
		const at = pinWorld(part, pin.id);
		if (!at) continue;
		pinAt.push({
			part,
			pin: pin.id,
			at
		});
		addPoint(at);
	}
	const polylines = wires.map((wire) => wirePolyline(wire, parts));
	for (const poly of polylines) for (const p of poly) addPoint(p);
	const atomic = (a, b) => {
		if (a.x !== b.x && a.y !== b.y) return [[a, b]];
		const on = points.filter((p) => pointOnAxisSegment(a, b, p));
		on.sort((p, q) => a.x === b.x ? p.y - q.y : p.x - q.x);
		const uniq = [];
		for (const p of on) {
			const prev = uniq[uniq.length - 1];
			if (!prev || prev.x !== p.x || prev.y !== p.y) uniq.push(p);
		}
		const segs = [];
		for (let i = 1; i < uniq.length; i++) segs.push([uniq[i - 1], uniq[i]]);
		return segs;
	};
	const segments = [];
	for (const poly of polylines) for (let i = 1; i < poly.length; i++) {
		const segs = atomic(poly[i - 1], poly[i]);
		for (const seg of segs) {
			uf.union(pointKey(seg[0]), pointKey(seg[1]));
			segments.push(seg);
		}
	}
	const groups = /* @__PURE__ */ new Map();
	for (const pin of pinAt) {
		const root = uf.find(pointKey(pin.at));
		let group = groups.get(root);
		if (!group) {
			group = {
				pins: [],
				at: pin.at,
				ground: false
			};
			groups.set(root, group);
		}
		group.pins.push({
			partId: pin.part.id,
			pin: pin.pin
		});
		if (pin.at.y < group.at.y || pin.at.y === group.at.y && pin.at.x < group.at.x) group.at = pin.at;
		if (pin.part.type === "GND") group.ground = true;
	}
	const ordered = [...groups.entries()].sort((a, b) => a[1].at.y - b[1].at.y || a[1].at.x - b[1].at.x);
	const signal = [];
	const grounded = [];
	let groundAt = null;
	let idx = 1;
	for (const [root, group] of ordered) if (group.ground) {
		grounded.push(...group.pins);
		if (!groundAt || group.at.y < groundAt.y || group.at.y === groundAt.y && group.at.x < groundAt.x) groundAt = group.at;
	} else signal.push({
		root,
		net: {
			id: `n${idx++}`,
			ground: false,
			pins: group.pins,
			at: group.at
		}
	});
	const nets = [];
	const rootToId = /* @__PURE__ */ new Map();
	if (groundAt) {
		nets.push({
			id: "0",
			ground: true,
			pins: grounded,
			at: groundAt
		});
		for (const [root, group] of ordered) if (group.ground) rootToId.set(root, "0");
	}
	for (const item of signal) {
		nets.push(item.net);
		rootToId.set(item.root, item.net.id);
	}
	const pinNet = /* @__PURE__ */ new Map();
	for (const net of nets) for (const pin of net.pins) pinNet.set(pinKey(pin.partId, pin.pin), net.id);
	const pointNet = /* @__PURE__ */ new Map();
	for (const key of seen) {
		const id = rootToId.get(uf.find(key));
		if (id) pointNet.set(key, id);
	}
	const degree = /* @__PURE__ */ new Map();
	const bump = (p) => {
		const k = pointKey(p);
		degree.set(k, (degree.get(k) ?? 0) + 1);
	};
	for (const [a, b] of segments) {
		if (a.x === b.x && a.y === b.y) continue;
		bump(a);
		bump(b);
	}
	for (const pin of pinAt) bump(pin.at);
	const junctions = [];
	for (const [k, d] of degree) if (d >= 3) {
		const [xs, ys] = k.split(",");
		junctions.push({
			x: Number(xs),
			y: Number(ys)
		});
	}
	return {
		nets,
		pinNet,
		pointNet,
		junctions
	};
}
/** Net under a cursor, in world pixels. Ground is "0". */
function netAt(parts, wires, wx, wy, zoom) {
	const graph = extractNets(parts, wires);
	const pin = hitPin(parts, wx, wy, zoom);
	if (pin) {
		const id = graph.pinNet.get(pinKey(pin.partId, pin.pin));
		if (id) return id;
	}
	const wire = hitWire(wires, parts, wx, wy, zoom);
	if (wire) for (const p of wirePolyline(wire, parts)) {
		const id = graph.pointNet.get(pointKey(p));
		if (id) return id;
	}
	const part = hitPart(parts, wx, wy, zoom);
	if (!part) return null;
	let bestId = null;
	let bestD = Infinity;
	for (const pin of worldPins(part)) {
		const id = graph.pinNet.get(pinKey(part.id, pin.id));
		if (!id) continue;
		const d = Math.hypot(wx - pin.x * 20, wy - pin.y * 20);
		if (d < bestD) {
			bestD = d;
			bestId = id;
		}
	}
	return bestId;
}
function nodeOf(map, partId, pin) {
	return map.get(pinKey(partId, pin)) ?? "?";
}
function sourceCard(part) {
	const p = part.params;
	const src = p.src ?? "DC";
	if (src === "SIN") return `DC ${p.vo ?? "0"} SIN(${p.vo ?? "0"} ${p.va ?? "0"} ${p.freq ?? "0"} ${p.td ?? "0"} ${p.theta ?? "0"} ${p.phase ?? "0"}) AC ${p.acmag ?? "0"} ${p.acphase ?? "0"}`;
	if (src === "PULSE") return `DC ${p.v1 ?? "0"} PULSE(${p.v1 ?? "0"} ${p.v2 ?? "0"} ${p.ptd ?? "0"} ${p.ptr ?? "0"} ${p.ptf ?? "0"} ${p.pw ?? "0"} ${p.per ?? "0"})`;
	if (src === "AC") return `DC ${p.dc ?? "0"} AC ${p.acmag ?? "0"} ${p.acphase ?? "0"}`;
	return `DC ${p.dc ?? "0"}`;
}
function analysisCard(sim) {
	if (sim.analysis === "tran") return `.tran ${sim.tstep} ${sim.tstop}`;
	if (sim.analysis === "ac") return `.ac ${sim.acType} ${sim.acPts} ${sim.fstart} ${sim.fstop}`;
	return `.dc ${sim.dcSource || "V1"} ${sim.dcStart} ${sim.dcStop} ${sim.dcStep}`;
}
function spiceNetlist(parts, wires, sim) {
	const { pinNet, nets } = extractNets(parts, wires);
	const lines = ["* VOLTA schematic"];
	if (!nets.some((n) => n.ground)) lines.push("* warning: no ground — node 0 is missing");
	lines.push("");
	const devices = [...parts].filter((p) => p.type !== "GND").sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
	const models = [];
	for (const part of devices) {
		const p = part.params;
		if (part.type === "R" || part.type === "C" || part.type === "L") lines.push(`${part.id} ${nodeOf(pinNet, part.id, "1")} ${nodeOf(pinNet, part.id, "2")} ${p.value ?? "1"}`);
		else if (part.type === "V") lines.push(`${part.id} ${nodeOf(pinNet, part.id, "p")} ${nodeOf(pinNet, part.id, "n")} ${sourceCard(part)}`);
		else if (part.type === "I") lines.push(`${part.id} ${nodeOf(pinNet, part.id, "p")} ${nodeOf(pinNet, part.id, "n")} ${sourceCard(part)}`);
		else if (part.type === "D") {
			const model = `D_${part.id}`;
			lines.push(`${part.id} ${nodeOf(pinNet, part.id, "A")} ${nodeOf(pinNet, part.id, "K")} ${model}`);
			models.push(`.model ${model} D(Is=${p.is ?? "1e-14"} N=${p.n ?? "1"})`);
		} else if (part.type === "QNPN" || part.type === "QPNP") {
			const model = `Q_${part.id}`;
			const kind = part.type === "QNPN" ? "NPN" : "PNP";
			lines.push(`${part.id} ${nodeOf(pinNet, part.id, "C")} ${nodeOf(pinNet, part.id, "B")} ${nodeOf(pinNet, part.id, "E")} ${model}`);
			models.push(`.model ${model} ${kind}(Bf=${p.bf ?? "100"} Is=${p.is ?? "1e-16"} Vaf=${p.vaf ?? "100"})`);
		} else if (part.type === "MN" || part.type === "MP") {
			const model = `M_${part.id}`;
			const kind = part.type === "MN" ? "NMOS" : "PMOS";
			const s = nodeOf(pinNet, part.id, "S");
			lines.push(`${part.id} ${nodeOf(pinNet, part.id, "D")} ${nodeOf(pinNet, part.id, "G")} ${s} ${s} ${model}`);
			models.push(`.model ${model} ${kind}(Vto=${p.vto ?? "1"} Kp=${p.kp ?? "200u"} W=${p.w ?? "10u"} L=${p.l ?? "1u"})`);
		}
	}
	if (models.length) {
		lines.push("");
		lines.push(...models);
	}
	lines.push("");
	lines.push(analysisCard(sim));
	lines.push(".end");
	lines.push("");
	return lines.join("\n");
}
//#endregion
export { wirePolyline as _, hitPart as a, netAt as c, pointKey as d, sheetFrame as f, viewRef as g, toPx as h, frameCamera as i, nextRot as l, spiceNetlist as m, elbow as n, hitPin as o, snapSegmentPoint as p, extractNets as r, hitWire as s, clientToGrid as t, pinKey as u, worldPins as v };
