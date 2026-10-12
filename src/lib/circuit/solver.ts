import { extractNets, pinKey, type Net } from "./nets.ts";
import type { AnalysisKind, OpRow, Part, SimConfig, SimOutput, TraceSeries, Wire } from "./types.ts";
import { formatEng, parseSpiceNumber } from "./units.ts";

const VT = 0.02585165;
const GMIN = 1e-9;
const LSHORT = 1e6;

type CNum = { re: number; im: number };

class SolveError extends Error {}

function fail(message: string): never {
  throw new SolveError(message);
}

function num(part: Part, key: string, fallback?: number): number {
  const raw = part.params[key];
  if (raw === undefined || raw.trim() === "") {
    if (fallback !== undefined) return fallback;
    fail(`${part.id} is missing ${key}`);
  }
  try {
    return parseSpiceNumber(raw);
  } catch (err) {
    fail(`${part.id}: ${err instanceof Error ? err.message : "bad value"}`);
  }
}

function positive(part: Part, key: string, label: string): number {
  const v = num(part, key);
  if (!(v > 0) || !Number.isFinite(v)) fail(`${part.id} ${label} must be positive`);
  return v;
}

function dcLevel(part: Part): number {
  const src = part.params.src ?? "DC";
  if (src === "SIN") return num(part, "vo", 0);
  if (src === "PULSE") return num(part, "v1", 0);
  return num(part, "dc", 0);
}

function waveAt(part: Part, t: number): number {
  const src = part.params.src ?? "DC";
  if (src === "SIN") {
    const vo = num(part, "vo", 0);
    const va = num(part, "va", 0);
    const freq = num(part, "freq", 0);
    const td = num(part, "td", 0);
    const theta = num(part, "theta", 0);
    const phase = (num(part, "phase", 0) * Math.PI) / 180;
    if (t < td) return vo;
    const dt = t - td;
    return vo + va * Math.exp(-theta * dt) * Math.sin(2 * Math.PI * freq * dt + phase);
  }
  if (src === "PULSE") {
    const v1 = num(part, "v1", 0);
    const v2 = num(part, "v2", 0);
    const td = num(part, "ptd", 0);
    const tr = num(part, "ptr", 0);
    const tf = num(part, "ptf", 0);
    const pw = num(part, "pw", 0);
    const per = num(part, "per", 0);
    if (t < td) return v1;
    let x = t - td;
    if (per > 0) x = x % per;
    if (tr > 0 && x < tr) return v1 + ((v2 - v1) * x) / tr;
    if (x < tr + pw) return v2;
    if (tf > 0 && x < tr + pw + tf) return v2 + ((v1 - v2) * (x - tr - pw)) / tf;
    return v1;
  }
  return num(part, "dc", 0);
}

function acPhasor(part: Part): CNum {
  const mag = num(part, "acmag", 0);
  const phase = (num(part, "acphase", 0) * Math.PI) / 180;
  return { re: mag * Math.cos(phase), im: mag * Math.sin(phase) };
}

type Index = {
  node: Map<string, number>;
  branch: Map<string, number>;
  n: number;
};

function buildIndex(parts: Part[], pinNet: Map<string, string>): Index {
  const ids = new Set<string>();
  for (const id of pinNet.values()) if (id !== "0") ids.add(id);
  const node = new Map<string, number>();
  let row = 0;
  for (const id of [...ids].sort((a, b) => a.localeCompare(b, "en", { numeric: true }))) {
    node.set(id, row++);
  }
  const branch = new Map<string, number>();
  for (const part of parts) {
    if (part.type === "V") branch.set(part.id, row++);
  }
  return { node, branch, n: row };
}

function at(index: Index, net: string): number {
  if (net === "0") return -1;
  const i = index.node.get(net);
  if (i === undefined) fail(`Missing node ${net}`);
  return i;
}

function netId(pinNet: Map<string, string>, part: Part, pin: string): string {
  const id = pinNet.get(pinKey(part.id, pin));
  if (!id) fail(`${part.id} pin ${pin} has no net`);
  return id;
}

function zeros(n: number): number[][] {
  return Array.from({ length: n }, () => Array<number>(n).fill(0));
}

function solveReal(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i] ?? 0]);
  for (let k = 0; k < n; k++) {
    let piv = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(M[i]![k]!) > Math.abs(M[piv]![k]!)) piv = i;
    }
    if (piv !== k) {
      const swap = M[k]!;
      M[k] = M[piv]!;
      M[piv] = swap;
    }
    const diag = M[k]![k]!;
    if (!Number.isFinite(diag) || Math.abs(diag) < 1e-14) {
      fail("Singular matrix. Add a ground, and check for floating nodes or voltage-source loops.");
    }
    for (let i = k + 1; i < n; i++) {
      const f = M[i]![k]! / diag;
      if (f === 0) continue;
      for (let j = k; j <= n; j++) M[i]![j]! -= f * M[k]![j]!;
    }
  }
  const x = Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i]![n]!;
    for (let j = i + 1; j < n; j++) s -= M[i]![j]! * x[j]!;
    const diag = M[i]![i]!;
    if (Math.abs(diag) < 1e-14) {
      fail("Singular matrix. Add a ground, and check for floating nodes or voltage-source loops.");
    }
    x[i] = s / diag;
  }
  return x;
}

function cAbs(a: CNum): number {
  return Math.hypot(a.re, a.im);
}

function cMul(a: CNum, b: CNum): CNum {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

function cDiv(a: CNum, b: CNum): CNum {
  const d = b.re * b.re + b.im * b.im;
  if (d < 1e-30) {
    fail("Singular matrix. Add a ground, and check for floating nodes or voltage-source loops.");
  }
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
}

function solveComplex(A: CNum[][], b: CNum[]): CNum[] {
  const n = b.length;
  const M = A.map((row, i) => [...row.map((c) => ({ ...c })), { ...(b[i] ?? { re: 0, im: 0 }) }]);
  for (let k = 0; k < n; k++) {
    let piv = k;
    for (let i = k + 1; i < n; i++) {
      if (cAbs(M[i]![k]!) > cAbs(M[piv]![k]!)) piv = i;
    }
    if (piv !== k) {
      const swap = M[k]!;
      M[k] = M[piv]!;
      M[piv] = swap;
    }
    const diag = M[k]![k]!;
    if (cAbs(diag) < 1e-14) {
      fail("Singular matrix. Add a ground, and check for floating nodes or voltage-source loops.");
    }
    for (let i = k + 1; i < n; i++) {
      const f = cDiv(M[i]![k]!, diag);
      for (let j = k; j <= n; j++) {
        const prod = cMul(f, M[k]![j]!);
        const cell = M[i]![j]!;
        cell.re -= prod.re;
        cell.im -= prod.im;
      }
    }
  }
  const x: CNum[] = Array.from({ length: n }, () => ({ re: 0, im: 0 }));
  for (let i = n - 1; i >= 0; i--) {
    const s = { ...(M[i]![n] ?? { re: 0, im: 0 }) };
    for (let j = i + 1; j < n; j++) {
      const prod = cMul(M[i]![j]!, x[j]!);
      s.re -= prod.re;
      s.im -= prod.im;
    }
    x[i] = cDiv(s, M[i]![i]!);
  }
  return x;
}

function stampG(A: number[][], a: number, b: number, g: number) {
  if (a >= 0) A[a]![a]! += g;
  if (b >= 0) BumpOff(A, b, g);
  if (a >= 0 && b >= 0) {
    A[a]![b]! -= g;
    A[b]![a]! -= g;
  }
}

function BumpOff(A: number[][], b: number, g: number) {
  A[b]![b]! += g;
}

function stampGC(A: CNum[][], a: number, b: number, g: CNum) {
  const add = (i: number, j: number, s: number) => {
    if (i < 0 || j < 0) return;
    A[i]![j]!.re += s * g.re;
    A[i]![j]!.im += s * g.im;
  };
  add(a, a, 1);
  add(b, b, 1);
  add(a, b, -1);
  add(b, a, -1);
}

function rhsAdd(b: number[], i: number, v: number) {
  if (i >= 0) b[i]! += v;
}

function voltageOf(x: number[], index: Index, net: string): number {
  if (net === "0") return 0;
  const i = index.node.get(net);
  if (i === undefined) return 0;
  return x[i] ?? 0;
}

type StampOpts = {
  mode: "dc" | "tran";
  dt: number;
  t: number;
  prev: number[] | null;
  iL: Map<string, number>;
  vd: Map<string, number>;
  vgs: Map<string, number>;
  force: Map<string, number>;
  diodes: boolean;
};

function stampReal(
  parts: Part[],
  pinNet: Map<string, string>,
  index: Index,
  opts: StampOpts,
): { A: number[][]; b: number[] } {
  const n = index.n;
  const A = zeros(n);
  const b = Array<number>(n).fill(0);
  for (let i = 0; i < index.node.size; i++) A[i]![i]! += GMIN;

  for (const part of parts) {
    if (part.type === "R") {
      const g = 1 / positive(part, "value", "resistance");
      const a = at(index, netId(pinNet, part, "1"));
      const c = at(index, netId(pinNet, part, "2"));
      stampG(A, a, c, g);
    } else if (part.type === "C") {
      if (opts.mode !== "tran") continue;
      const cval = positive(part, "value", "capacitance");
      const g = cval / opts.dt;
      const na = netId(pinNet, part, "1");
      const nb = netId(pinNet, part, "2");
      const a = at(index, na);
      const c = at(index, nb);
      stampG(A, a, c, g);
      const vp = opts.prev
        ? voltageOf(opts.prev, index, na) - voltageOf(opts.prev, index, nb)
        : 0;
      rhsAdd(b, a, g * vp);
      rhsAdd(b, c, -g * vp);
    } else if (part.type === "L") {
      const l = positive(part, "value", "inductance");
      const na = netId(pinNet, part, "1");
      const nb = netId(pinNet, part, "2");
      const a = at(index, na);
      const c = at(index, nb);
      if (opts.mode === "tran") {
        const g = opts.dt / l;
        stampG(A, a, c, g);
        const ip = opts.iL.get(part.id) ?? 0;
        rhsAdd(b, a, -ip);
        rhsAdd(b, c, ip);
      } else {
        stampG(A, a, c, LSHORT);
      }
    } else if (part.type === "V") {
      const np = netId(pinNet, part, "p");
      const nn = netId(pinNet, part, "n");
      if (np === nn) {
        const e = opts.force.has(part.id)
          ? opts.force.get(part.id)!
          : opts.mode === "tran"
            ? waveAt(part, opts.t)
            : dcLevel(part);
        if (Math.abs(e) > 1e-9) fail(`${part.id} is shorted and its voltage is not zero`);
        const br = index.branch.get(part.id);
        if (br !== undefined) A[br]![br]! += 1;
        continue;
      }
      const ip = at(index, np);
      const inn = at(index, nn);
      const br = index.branch.get(part.id);
      if (br === undefined) fail(`Missing branch for ${part.id}`);
      if (ip >= 0) A[ip]![br]! -= 1;
      if (inn >= 0) A[inn]![br]! += 1;
      if (ip >= 0) A[br]![ip]! += 1;
      if (inn >= 0) A[br]![inn]! -= 1;
      const e = opts.force.has(part.id)
        ? opts.force.get(part.id)!
        : opts.mode === "tran"
          ? waveAt(part, opts.t)
          : dcLevel(part);
      b[br]! += e;
    } else if (part.type === "I") {
      const ip = at(index, netId(pinNet, part, "p"));
      const inn = at(index, netId(pinNet, part, "n"));
      const e = opts.force.has(part.id)
        ? opts.force.get(part.id)!
        : opts.mode === "tran"
          ? waveAt(part, opts.t)
          : dcLevel(part);
      rhsAdd(b, ip, -e);
      rhsAdd(b, inn, e);
    } else if (part.type === "D" && opts.diodes) {
      const is = positive(part, "is", "Is");
      const nfac = positive(part, "n", "N");
      const vt = nfac * VT;
      const vd = opts.vd.get(part.id) ?? 0;
      const arg = Math.min(Math.max(vd / vt, -40), 40);
      const ex = Math.exp(arg);
      const id = is * (ex - 1);
      const gd = Math.max((is / vt) * ex, 0);
      const ieq = id - gd * vd;
      const a = at(index, netId(pinNet, part, "A"));
      const k = at(index, netId(pinNet, part, "K"));
      stampG(A, a, k, gd);
      rhsAdd(b, a, -ieq);
      rhsAdd(b, k, ieq);
    } else if (part.type === "MN" || part.type === "MP") {
      const g = mosConductance(part, opts.vgs.get(part.id) ?? 0);
      const d = at(index, netId(pinNet, part, "D"));
      const s = at(index, netId(pinNet, part, "S"));
      stampG(A, d, s, g);
    }
  }
  return { A, b };
}

function limitDiode(vd: number, prev: number, is: number, nfac: number): number {
  const vt = Math.max(nfac, 0.1) * VT;
  const vcrit = vt * Math.log(Math.max(vt / (Math.SQRT2 * Math.max(is, 1e-30)), 1.0000001));
  if (vd > vcrit && Math.abs(vd - prev) > 2 * vt) {
    if (prev > 0) {
      const arg = 1 + (vd - prev) / vt;
      if (arg > 0) return prev + vt * Math.log(arg);
    }
    return vcrit;
  }
  if (vd < prev - 2) return prev - 2;
  if (vd > prev + 2 && vd > vcrit) return prev + 2;
  return vd;
}

function diodeDrop(part: Part, x: number[], index: Index, pinNet: Map<string, string>): number {
  const va = voltageOf(x, index, netId(pinNet, part, "A"));
  const vk = voltageOf(x, index, netId(pinNet, part, "K"));
  return va - vk;
}

function mosVgs(part: Part, x: number[], index: Index, pinNet: Map<string, string>): number {
  return voltageOf(x, index, netId(pinNet, part, "G")) - voltageOf(x, index, netId(pinNet, part, "S"));
}

/** Switch-level MOSFET: a conductance between drain and source, iterated with Vgs. */
function mosConductance(part: Part, vgs: number): number {
  const nmos = part.type === "MN";
  const vto = num(part, "vto", nmos ? 1 : -1);
  const kp = positive(part, "kp", "Kp");
  const w = positive(part, "w", "W");
  const l = positive(part, "l", "L");
  const beta = kp * (w / l);
  const on = nmos ? vgs > vto : vgs < vto;
  if (!on) return 1e-9;
  const vov = Math.abs(nmos ? vgs - vto : vto - vgs);
  return Math.min(0.2, Math.max(1e-6, beta * Math.max(vov, 0.2)));
}

function limitStep(next: number, prev: number): number {
  const delta = next - prev;
  if (delta > 2) return prev + 2;
  if (delta < -2) return prev - 2;
  return next;
}

function solveOperating(
  parts: Part[],
  pinNet: Map<string, string>,
  index: Index,
  opts: Omit<StampOpts, "vd" | "vgs" | "diodes"> & { warm: number[] | null },
): number[] {
  const diodes = parts.filter((p) => p.type === "D");
  const mos = parts.filter((p) => p.type === "MN" || p.type === "MP");
  const vd = new Map<string, number>();
  const vgs = new Map<string, number>();
  if (opts.warm) {
    for (const d of diodes) vd.set(d.id, diodeDrop(d, opts.warm, index, pinNet));
    for (const m of mos) vgs.set(m.id, mosVgs(m, opts.warm, index, pinNet));
  }
  let x = opts.warm ? [...opts.warm] : Array<number>(index.n).fill(0);
  const nonlinear = diodes.length + mos.length > 0;
  const rounds = nonlinear ? 50 : 1;
  for (let iter = 0; iter < rounds; iter++) {
    const { A, b } = stampReal(parts, pinNet, index, { ...opts, vd, vgs, diodes: diodes.length > 0 });
    const next = solveReal(A, b);
    let jump = 0;
    for (let i = 0; i < next.length; i++) jump = Math.max(jump, Math.abs(next[i]! - (x[i] ?? 0)));
    x = next;
    if (!nonlinear) break;
    let vdJump = 0;
    let vgsJump = 0;
    for (const d of diodes) {
      const raw = diodeDrop(d, x, index, pinNet);
      const prev = vd.get(d.id) ?? 0;
      const limited = limitDiode(raw, prev, positive(d, "is", "Is"), positive(d, "n", "N"));
      vd.set(d.id, limited);
      vdJump = Math.max(vdJump, Math.abs(raw - prev));
    }
    for (const m of mos) {
      const raw = mosVgs(m, x, index, pinNet);
      const prev = vgs.get(m.id) ?? 0;
      const limited = limitStep(raw, prev);
      vgs.set(m.id, limited);
      vgsJump = Math.max(vgsJump, Math.abs(raw - prev));
    }
    if (iter > 0 && jump < 1e-7 && vdJump < 1e-6 && vgsJump < 1e-6) break;
    if (iter === rounds - 1 && (vdJump > 1e-3 || vgsJump > 1e-2)) {
      fail("Device iteration did not converge. Check the bias and try a series resistor.");
    }
  }
  return x;
}

function inductorCurrents(
  parts: Part[],
  pinNet: Map<string, string>,
  index: Index,
  x: number[],
  mode: "dc" | "tran",
  dt: number,
  prevI: Map<string, number>,
): Map<string, number> {
  const next = new Map<string, number>();
  for (const part of parts) {
    if (part.type !== "L") continue;
    const l = positive(part, "value", "inductance");
    const v =
      voltageOf(x, index, netId(pinNet, part, "1")) - voltageOf(x, index, netId(pinNet, part, "2"));
    if (mode === "dc") next.set(part.id, LSHORT * v);
    else next.set(part.id, (prevI.get(part.id) ?? 0) + (dt / l) * v);
  }
  return next;
}

function pinDetail(net: Net): string {
  if (net.ground) return "ground";
  return net.pins.map((p) => `${p.partId}:${p.pin}`).join(" ");
}

function signalNets(nets: Net[]): Net[] {
  return nets
    .filter((n) => !n.ground)
    .sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
}

function finish(
  kind: AnalysisKind,
  xLabel: string,
  yLabel: string,
  rows: SimOutput["rows"],
  phaseRows: SimOutput["phaseRows"],
  series: TraceSeries[],
  op: OpRow[],
  notes: string[],
  t0: number,
): SimOutput {
  return {
    kind,
    xLabel,
    yLabel,
    rows,
    phaseRows,
    series,
    op,
    notes,
    elapsedMs: Math.max(0, performance.now() - t0),
  };
}

function blank(kind: AnalysisKind, message: string, t0: number): SimOutput {
  return {
    kind,
    xLabel: "",
    yLabel: "",
    rows: [],
    phaseRows: null,
    series: [],
    op: [],
    notes: [],
    error: message,
    elapsedMs: Math.max(0, performance.now() - t0),
  };
}

function unbounded(x: number[]): boolean {
  return x.some((v) => !Number.isFinite(v) || Math.abs(v) > 1e8);
}

function opFrom(
  nets: Net[],
  parts: Part[],
  pinNet: Map<string, string>,
  index: Index,
  x: number[],
  iL: Map<string, number>,
): OpRow[] {
  const rows: OpRow[] = [];
  for (const net of signalNets(nets)) {
    rows.push({
      name: net.id,
      value: formatEng(voltageOf(x, index, net.id), "V"),
      detail: pinDetail(net),
    });
  }
  for (const part of parts) {
    if (part.type === "V") {
      const br = index.branch.get(part.id);
      const i = br === undefined ? 0 : (x[br] ?? 0);
      rows.push({ name: `I(${part.id})`, value: formatEng(i, "A"), detail: "out of the + terminal" });
    } else if (part.type === "L") {
      rows.push({
        name: `I(${part.id})`,
        value: formatEng(iL.get(part.id) ?? 0, "A"),
        detail: "pin 1 → pin 2",
      });
    } else if (part.type === "D") {
      const is = positive(part, "is", "Is");
      const nfac = positive(part, "n", "N");
      const vd = diodeDrop(part, x, index, pinNet);
      const arg = Math.min(Math.max(vd / (nfac * VT), -40), 40);
      const id = is * (Math.exp(arg) - 1);
      rows.push({ name: `I(${part.id})`, value: formatEng(id, "A"), detail: "anode → cathode" });
    }
  }
  return rows;
}

function seriesFor(nets: Net[]): TraceSeries[] {
  return signalNets(nets).map((net) => ({ key: net.id, label: net.id }));
}

function pushRow(
  rows: SimOutput["rows"],
  x: number,
  nets: Net[],
  index: Index,
  sol: number[],
) {
  const row: { x: number } & Record<string, number> = { x };
  for (const net of signalNets(nets)) row[net.id] = voltageOf(sol, index, net.id);
  rows.push(row);
}

function prepare(parts: Part[], wires: Wire[]) {
  if (!parts.length) fail("The sheet is empty. Drop a source, a part, and a ground.");
  const graph = extractNets(parts, wires);
  if (!graph.nets.some((n) => n.ground)) {
    fail("Add a ground. The solver needs node 0.");
  }
  const ignored = parts.filter((p) => p.type === "QNPN" || p.type === "QPNP");
  const notes: string[] = [];
  if (ignored.length) {
    notes.push(
      `${ignored.map((p) => p.id).join(", ")} ${ignored.length === 1 ? "is" : "are"} in the netlist only. This engine solves R, L, C, sources, diodes, and switch-level MOSFETs.`,
    );
  }
  const index = buildIndex(parts, graph.pinNet);
  if (index.n === 0) fail("Nothing to solve. Every pin is sitting on ground.");
  return { graph, index, notes };
}

function runTran(parts: Part[], wires: Wire[], sim: SimConfig, t0: number): SimOutput {
  const { graph, index, notes } = prepare(parts, wires);
  let dt = num({ id: ".tran", type: "R", x: 0, y: 0, rot: 0, params: { value: sim.tstep } }, "value");
  const stop = num({ id: ".tran", type: "R", x: 0, y: 0, rot: 0, params: { value: sim.tstop } }, "value");
  if (!(stop > 0)) fail("Tstop must be positive");
  if (!(dt > 0)) fail("Tstep must be positive");
  let steps = Math.round(stop / dt);
  if (steps > 2000) {
    steps = 2000;
    dt = stop / steps;
    notes.push(`Tstep coarsened to ${formatEng(dt, "s")} so the run stays within 2000 points.`);
  }
  if (steps < 1) steps = 1;

  const force = new Map<string, number>();
  let x = solveOperating(parts, graph.pinNet, index, {
    mode: "dc",
    dt,
    t: 0,
    prev: null,
    iL: new Map(),
    force,
    warm: null,
  });
  if (unbounded(x)) notes.push("A node voltage is enormous. Something is probably floating.");
  let iL = inductorCurrents(parts, graph.pinNet, index, x, "dc", dt, new Map());
  const rows: SimOutput["rows"] = [];
  pushRow(rows, 0, graph.nets, index, x);

  for (let k = 1; k <= steps; k++) {
    const t = Math.min(stop, k * dt);
    const next = solveOperating(parts, graph.pinNet, index, {
      mode: "tran",
      dt,
      t,
      prev: x,
      iL,
      force,
      warm: x,
    });
    iL = inductorCurrents(parts, graph.pinNet, index, next, "tran", dt, iL);
    x = next;
    pushRow(rows, t, graph.nets, index, x);
  }
  if (unbounded(x)) notes.push("A node voltage is enormous. Something is probably floating.");
  return finish(
    "tran",
    "Time (s)",
    "Voltage (V)",
    rows,
    null,
    seriesFor(graph.nets),
    opFrom(graph.nets, parts, graph.pinNet, index, x, iL),
    notes,
    t0,
  );
}

function runDc(parts: Part[], wires: Wire[], sim: SimConfig, t0: number): SimOutput {
  const { graph, index, notes } = prepare(parts, wires);
  const source = parts.find((p) => p.id === sim.dcSource && (p.type === "V" || p.type === "I"));
  if (!source) fail("Pick a voltage or current source to sweep.");
  const start = num({ id: ".dc", type: "R", x: 0, y: 0, rot: 0, params: { value: sim.dcStart } }, "value");
  const stop = num({ id: ".dc", type: "R", x: 0, y: 0, rot: 0, params: { value: sim.dcStop } }, "value");
  let step = num({ id: ".dc", type: "R", x: 0, y: 0, rot: 0, params: { value: sim.dcStep } }, "value");
  if (step === 0) fail("DC step cannot be zero");
  if ((stop - start) * step < 0) step = -step;
  let count = Math.floor(Math.abs((stop - start) / step) + 1.0000001);
  if (count > 500) {
    count = 500;
    step = (stop - start) / 499;
    notes.push("DC step coarsened so the sweep stays within 500 points.");
  }
  const rows: SimOutput["rows"] = [];
  let x = Array<number>(index.n).fill(0);
  let iL = new Map<string, number>();
  for (let i = 0; i < count; i++) {
    const value = i === count - 1 ? stop : start + i * step;
    const force = new Map<string, number>([[source.id, value]]);
    x = solveOperating(parts, graph.pinNet, index, {
      mode: "dc",
      dt: 0,
      t: 0,
      prev: null,
      iL: new Map(),
      force,
      warm: x,
    });
    iL = inductorCurrents(parts, graph.pinNet, index, x, "dc", 0, iL);
    pushRow(rows, value, graph.nets, index, x);
  }
  const unit = source.type === "V" ? "V" : "A";
  return finish(
    "dc",
    `${source.id} (${unit})`,
    "Voltage (V)",
    rows,
    null,
    seriesFor(graph.nets),
    opFrom(graph.nets, parts, graph.pinNet, index, x, iL),
    notes,
    t0,
  );
}

function runAc(parts: Part[], wires: Wire[], sim: SimConfig, t0: number): SimOutput {
  const { graph, index, notes } = prepare(parts, wires);
  const fstart = num({ id: ".ac", type: "R", x: 0, y: 0, rot: 0, params: { value: sim.fstart } }, "value");
  const fstop = num({ id: ".ac", type: "R", x: 0, y: 0, rot: 0, params: { value: sim.fstop } }, "value");
  const pts = Math.round(num({ id: ".ac", type: "R", x: 0, y: 0, rot: 0, params: { value: sim.acPts } }, "value"));
  if (!(fstart > 0) || !(fstop > 0)) fail("AC frequencies must be positive");
  const lo = Math.min(fstart, fstop);
  const hi = Math.max(fstart, fstop);
  const freqs = makeFreqs(sim.acType, Math.max(pts, 1), lo, hi);
  if (freqs.length > 400) {
    notes.push("AC sweep was capped at 400 points.");
  }
  const used = freqs.slice(0, 400);

  const acSources = parts.filter((p) => (p.type === "V" || p.type === "I") && Math.abs(num(p, "acmag", 0)) > 0);
  if (!acSources.length) {
    notes.push("No source has an AC magnitude, so every trace sits at zero. Set AC mag on the stimulus.");
  }

  const opX = solveOperating(parts, graph.pinNet, index, {
    mode: "dc",
    dt: 0,
    t: 0,
    prev: null,
    iL: new Map(),
    force: new Map(),
    warm: null,
  });
  const gd = new Map<string, number>();
  for (const d of parts) {
    if (d.type !== "D") continue;
    const is = positive(d, "is", "Is");
    const nfac = positive(d, "n", "N");
    const vd = diodeDrop(d, opX, index, graph.pinNet);
    const arg = Math.min(Math.max(vd / (nfac * VT), -40), 40);
    gd.set(d.id, Math.max((is / (nfac * VT)) * Math.exp(arg), 0));
  }
  const mg = new Map<string, number>();
  for (const part of parts) {
    if (part.type !== "MN" && part.type !== "MP") continue;
    mg.set(part.id, mosConductance(part, mosVgs(part, opX, index, graph.pinNet)));
  }

  const rows: SimOutput["rows"] = [];
  const phaseRows: SimOutput["rows"] = [];
  const n = index.n;
  for (const f of used) {
    const w = 2 * Math.PI * f;
    const A: CNum[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => ({ re: 0, im: 0 })));
    const b: CNum[] = Array.from({ length: n }, () => ({ re: 0, im: 0 }));
    for (let i = 0; i < index.node.size; i++) A[i]![i]!.re += GMIN;

    for (const part of parts) {
      if (part.type === "R") {
        const a = at(index, netId(graph.pinNet, part, "1"));
        const c = at(index, netId(graph.pinNet, part, "2"));
        stampGC(A, a, c, { re: 1 / positive(part, "value", "resistance"), im: 0 });
      } else if (part.type === "C") {
        const a = at(index, netId(graph.pinNet, part, "1"));
        const c = at(index, netId(graph.pinNet, part, "2"));
        stampGC(A, a, c, { re: 0, im: w * positive(part, "value", "capacitance") });
      } else if (part.type === "L") {
        const a = at(index, netId(graph.pinNet, part, "1"));
        const c = at(index, netId(graph.pinNet, part, "2"));
        const l = positive(part, "value", "inductance");
        stampGC(A, a, c, { re: 0, im: -1 / (w * l) });
      } else if (part.type === "D") {
        const a = at(index, netId(graph.pinNet, part, "A"));
        const k = at(index, netId(graph.pinNet, part, "K"));
        stampGC(A, a, k, { re: gd.get(part.id) ?? 0, im: 0 });
      } else if (part.type === "MN" || part.type === "MP") {
        const d = at(index, netId(graph.pinNet, part, "D"));
        const s = at(index, netId(graph.pinNet, part, "S"));
        stampGC(A, d, s, { re: mg.get(part.id) ?? 1e-9, im: 0 });
      } else if (part.type === "V") {
        const np = netId(graph.pinNet, part, "p");
        const nn = netId(graph.pinNet, part, "n");
        const ph = acPhasor(part);
        if (np === nn) {
          if (cAbs(ph) > 1e-12) fail(`${part.id} is shorted and its AC voltage is not zero`);
          const br = index.branch.get(part.id);
          if (br !== undefined) A[br]![br]!.re += 1;
          continue;
        }
        const ip = at(index, np);
        const inn = at(index, nn);
        const br = index.branch.get(part.id);
        if (br === undefined) fail(`Missing branch for ${part.id}`);
        if (ip >= 0) A[ip]![br]!.re -= 1;
        if (inn >= 0) A[inn]![br]!.re += 1;
        if (ip >= 0) A[br]![ip]!.re += 1;
        if (inn >= 0) A[br]![inn]!.re -= 1;
        b[br]!.re += ph.re;
        b[br]!.im += ph.im;
      } else if (part.type === "I") {
        const ip = at(index, netId(graph.pinNet, part, "p"));
        const inn = at(index, netId(graph.pinNet, part, "n"));
        const ph = acPhasor(part);
        if (ip >= 0) {
          b[ip]!.re -= ph.re;
          b[ip]!.im -= ph.im;
        }
        if (inn >= 0) {
          b[inn]!.re += ph.re;
          b[inn]!.im += ph.im;
        }
      }
    }

    const sol = solveComplex(A, b);
    const row: { x: number } & Record<string, number> = { x: f };
    const prow: { x: number } & Record<string, number> = { x: f };
    for (const net of signalNets(graph.nets)) {
      const i = index.node.get(net.id);
      const ph = i === undefined ? { re: 0, im: 0 } : sol[i]!;
      const mag = Math.max(cAbs(ph), 1e-12);
      row[net.id] = 20 * Math.log10(mag);
      prow[net.id] = (Math.atan2(ph.im, ph.re) * 180) / Math.PI;
    }
    rows.push(row);
    phaseRows.push(prow);
  }

  const midF = Math.sqrt(lo * hi);
  let mid = 0;
  let best = Infinity;
  used.forEach((f, i) => {
    const d = Math.abs(Math.log(f) - Math.log(midF));
    if (d < best) {
      best = d;
      mid = i;
    }
  });
  const op: OpRow[] = [];
  const magRow = rows[mid];
  const phRow = phaseRows[mid];
  if (magRow && phRow) {
    for (const net of signalNets(graph.nets)) {
      op.push({
        name: net.id,
        value: `${magRow[net.id]?.toFixed(2) ?? "0"} dB`,
        detail: `${phRow[net.id]?.toFixed(1) ?? "0"}° at ${formatEng(magRow.x, "Hz")} · ${pinDetail(net)}`,
      });
    }
  }

  return finish("ac", "Frequency (Hz)", "Magnitude (dB)", rows, phaseRows, seriesFor(graph.nets), op, notes, t0);
}

function makeFreqs(type: SimConfig["acType"], pts: number, lo: number, hi: number): number[] {
  if (Math.abs(hi - lo) / hi < 1e-9) return [lo];
  if (type === "lin") {
    const n = Math.min(Math.max(pts, 2), 400);
    return Array.from({ length: n }, (_, i) => lo + ((hi - lo) * i) / (n - 1));
  }
  const per = Math.min(Math.max(pts, 1), 80);
  const decades = Math.log10(hi / lo);
  const octaves = Math.log2(hi / lo);
  const span = type === "dec" ? decades * per : octaves * per;
  const count = Math.min(Math.max(Math.ceil(span), 1), 399);
  return Array.from({ length: count + 1 }, (_, i) => {
    const t = i / count;
    return type === "dec" ? lo * 10 ** (decades * t) : lo * 2 ** (octaves * t);
  });
}

export function simulate(parts: Part[], wires: Wire[], sim: SimConfig): SimOutput {
  const t0 = performance.now();
  try {
    if (sim.analysis === "tran") return runTran(parts, wires, sim, t0);
    if (sim.analysis === "ac") return runAc(parts, wires, sim, t0);
    return runDc(parts, wires, sim, t0);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Simulation failed";
    return blank(sim.analysis, message, t0);
  }
}
