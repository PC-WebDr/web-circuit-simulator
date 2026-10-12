import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { _ as wirePolyline, a as hitPart, c as netAt, d as pointKey, f as sheetFrame, g as viewRef, h as toPx, i as frameCamera, l as nextRot, m as spiceNetlist, n as elbow, o as hitPin, p as snapSegmentPoint, r as extractNets, s as hitWire, t as clientToGrid, u as pinKey, v as worldPins } from "./netlist-y3OInw0w.mjs";
import { n as SignedOut, r as UserButton, t as SignedIn } from "./gates-DveRf_en.mjs";
import { a as saveCircuit, i as loadPublic, o as setCircuitPublic, r as loadMine } from "./circuits.functions-B9Yv8Iow.mjs";
import { _ as Expand, a as Trash2, b as ChevronDown, c as Save, d as PanelLeft, f as MousePointer2, g as FileText, h as Globe, l as RotateCw, m as Hand, n as ZoomOut, o as Spline, p as Info, r as X, s as Search, t as ZoomIn, u as Play, v as Crosshair, y as CircuitBoard } from "../_libs/lucide-react.mjs";
import { n as Route$3 } from "./router-CRuSZMYt.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as CartesianGrid, c as Legend, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-COKO7XcI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATALOG = [
	{
		id: "passives",
		label: "Passives",
		items: [
			{
				type: "R",
				name: "Resistor",
				hint: "R",
				keys: [
					"resistor",
					"r",
					"ohm"
				]
			},
			{
				type: "C",
				name: "Capacitor",
				hint: "C",
				keys: [
					"capacitor",
					"c",
					"farad"
				]
			},
			{
				type: "L",
				name: "Inductor",
				hint: "L",
				keys: [
					"inductor",
					"l",
					"henry"
				]
			}
		]
	},
	{
		id: "sources",
		label: "Sources",
		items: [
			{
				type: "V",
				name: "Voltage",
				hint: "DC · AC · SIN · PULSE",
				keys: [
					"voltage",
					"v",
					"dc",
					"ac",
					"sine",
					"sin",
					"pulse"
				]
			},
			{
				type: "I",
				name: "Current",
				hint: "DC · AC · SIN · PULSE",
				keys: [
					"current",
					"i",
					"source"
				]
			},
			{
				type: "GND",
				name: "Ground",
				hint: "Node 0",
				keys: [
					"ground",
					"gnd",
					"0",
					"earth"
				]
			}
		]
	},
	{
		id: "semiconductors",
		label: "Semiconductors",
		items: [
			{
				type: "D",
				name: "Diode",
				hint: "Shockley",
				keys: ["diode", "d"]
			},
			{
				type: "QNPN",
				name: "NPN BJT",
				hint: "Q · NPN",
				keys: [
					"npn",
					"bjt",
					"q",
					"transistor"
				]
			},
			{
				type: "QPNP",
				name: "PNP BJT",
				hint: "Q · PNP",
				keys: [
					"pnp",
					"bjt",
					"q",
					"transistor"
				]
			},
			{
				type: "MN",
				name: "NMOS",
				hint: "M · NMOS",
				keys: [
					"nmos",
					"mosfet",
					"m",
					"nfet"
				]
			},
			{
				type: "MP",
				name: "PMOS",
				hint: "M · PMOS",
				keys: [
					"pmos",
					"mosfet",
					"m",
					"pfet"
				]
			}
		]
	}
];
function idPrefix(type) {
	if (type === "QNPN" || type === "QPNP") return "Q";
	if (type === "MN" || type === "MP") return "M";
	if (type === "GND") return "GND";
	return type;
}
function defaultParams(type) {
	switch (type) {
		case "R": return { value: "1k" };
		case "C": return { value: "1u" };
		case "L": return { value: "1m" };
		case "V": return {
			src: "DC",
			dc: "5",
			acmag: "0",
			acphase: "0",
			vo: "0",
			va: "5",
			freq: "1k",
			td: "0",
			theta: "0",
			phase: "0",
			v1: "0",
			v2: "5",
			ptd: "0",
			ptr: "1u",
			ptf: "1u",
			pw: "1m",
			per: "2m"
		};
		case "I": return {
			src: "DC",
			dc: "1m",
			acmag: "0",
			acphase: "0",
			vo: "0",
			va: "1m",
			freq: "1k",
			td: "0",
			theta: "0",
			phase: "0",
			v1: "0",
			v2: "1m",
			ptd: "0",
			ptr: "1u",
			ptf: "1u",
			pw: "1m",
			per: "2m"
		};
		case "D": return {
			is: "1e-14",
			n: "1"
		};
		case "QNPN":
		case "QPNP": return {
			bf: "100",
			is: "1e-16",
			vaf: "100"
		};
		case "MN": return {
			vto: "1",
			kp: "200u",
			w: "10u",
			l: "1u"
		};
		case "MP": return {
			vto: "-1",
			kp: "80u",
			w: "10u",
			l: "1u"
		};
		case "GND": return {};
	}
}
var TRACE_COLORS = [
	"var(--color-trace)",
	"var(--color-trace-2)",
	"var(--color-trace-3)",
	"var(--color-trace-4)"
];
function partValueLabel(type, params) {
	if (type === "R" || type === "C" || type === "L") return params.value ?? "";
	if (type === "D") return "D";
	if (type === "QNPN") return "NPN";
	if (type === "QPNP") return "PNP";
	if (type === "MN") return "NMOS";
	if (type === "MP") return "PMOS";
	if (type === "GND") return "";
	const src = params.src ?? "DC";
	if (src === "DC") return params.dc ?? "";
	if (src === "SIN") return `SIN ${params.va ?? ""}`;
	if (src === "PULSE") return `PULSE ${params.v2 ?? ""}`;
	return `AC ${params.acmag ?? ""}`;
}
var baseSim = () => ({
	analysis: "tran",
	tstep: "10u",
	tstop: "3m",
	acType: "dec",
	acPts: "20",
	fstart: "10",
	fstop: "1Meg",
	dcSource: "V1",
	dcStart: "0",
	dcStop: "10",
	dcStep: "0.5"
});
function vParams(over) {
	return {
		...defaultParams("V"),
		...over
	};
}
var EXAMPLES = [
	{
		id: "diode",
		name: "Diode half-wave",
		blurb: "1 kHz sine, 1N4148, 1k load",
		parts: [
			{
				id: "V1",
				type: "V",
				x: 4,
				y: 6,
				rot: 0,
				params: vParams({
					src: "SIN",
					vo: "0",
					va: "5",
					freq: "1k",
					dc: "0",
					acmag: "0"
				})
			},
			{
				id: "D1",
				type: "D",
				x: 8,
				y: 6,
				rot: 0,
				params: {
					is: "2.52n",
					n: "1.75"
				}
			},
			{
				id: "R1",
				type: "R",
				x: 12,
				y: 6,
				rot: 90,
				params: { value: "1k" }
			},
			{
				id: "GND1",
				type: "GND",
				x: 4,
				y: 6,
				rot: 0,
				params: {}
			},
			{
				id: "GND2",
				type: "GND",
				x: 12,
				y: 10,
				rot: 0,
				params: {}
			}
		],
		wires: [],
		sim: {
			...baseSim(),
			analysis: "tran",
			tstep: "50u",
			tstop: "3m"
		}
	},
	{
		id: "cmos",
		name: "CMOS inverter",
		blurb: "5 V pulse into a PMOS / NMOS pair",
		parts: [
			{
				id: "VDD",
				type: "V",
				x: 8,
				y: 2,
				rot: 0,
				params: vParams({
					src: "DC",
					dc: "5",
					acmag: "0"
				})
			},
			{
				id: "Vin",
				type: "V",
				x: 4,
				y: 10,
				rot: 0,
				params: vParams({
					src: "PULSE",
					v1: "0",
					v2: "5",
					ptd: "0.5m",
					ptr: "10u",
					ptf: "10u",
					pw: "1m",
					per: "2m",
					dc: "0",
					acmag: "0"
				})
			},
			{
				id: "MP1",
				type: "MP",
				x: 16,
				y: 6,
				rot: 180,
				params: {
					vto: "-1",
					kp: "80u",
					w: "10u",
					l: "1u"
				}
			},
			{
				id: "MN1",
				type: "MN",
				x: 8,
				y: 8,
				rot: 0,
				params: {
					vto: "1",
					kp: "200u",
					w: "10u",
					l: "1u"
				}
			},
			{
				id: "GND1",
				type: "GND",
				x: 8,
				y: 2,
				rot: 0,
				params: {}
			},
			{
				id: "GND2",
				type: "GND",
				x: 4,
				y: 10,
				rot: 0,
				params: {}
			},
			{
				id: "GND3",
				type: "GND",
				x: 12,
				y: 12,
				rot: 0,
				params: {}
			}
		],
		wires: [{
			id: "W1",
			points: [{
				kind: "xy",
				x: 12,
				y: 6
			}, {
				kind: "xy",
				x: 12,
				y: 8
			}]
		}, {
			id: "W2",
			points: [
				{
					kind: "xy",
					x: 16,
					y: 4
				},
				{
					kind: "xy",
					x: 16,
					y: 10
				},
				{
					kind: "xy",
					x: 8,
					y: 10
				}
			]
		}],
		sim: {
			...baseSim(),
			analysis: "tran",
			tstep: "20u",
			tstop: "4m"
		}
	},
	{
		id: "rc",
		name: "RC low-pass",
		blurb: "1 kHz sine into 1k / 100n",
		parts: [
			{
				id: "V1",
				type: "V",
				x: 6,
				y: 8,
				rot: 0,
				params: vParams({
					src: "SIN",
					vo: "0",
					va: "5",
					freq: "1k",
					dc: "0",
					acmag: "5",
					acphase: "0"
				})
			},
			{
				id: "R1",
				type: "R",
				x: 10,
				y: 8,
				rot: 0,
				params: { value: "1k" }
			},
			{
				id: "C1",
				type: "C",
				x: 14,
				y: 8,
				rot: 90,
				params: { value: "100n" }
			},
			{
				id: "GND1",
				type: "GND",
				x: 6,
				y: 8,
				rot: 0,
				params: {}
			},
			{
				id: "GND2",
				type: "GND",
				x: 14,
				y: 12,
				rot: 0,
				params: {}
			}
		],
		wires: [],
		sim: {
			...baseSim(),
			analysis: "tran",
			tstep: "10u",
			tstop: "2.25m"
		}
	},
	{
		id: "rlc",
		name: "Series RLC",
		blurb: "Step into 47Ω / 10mH / 100n",
		parts: [
			{
				id: "V1",
				type: "V",
				x: 4,
				y: 6,
				rot: 0,
				params: vParams({
					src: "PULSE",
					v1: "0",
					v2: "5",
					ptd: "0",
					ptr: "1u",
					ptf: "1u",
					pw: "10m",
					per: "20m",
					dc: "0",
					acmag: "1"
				})
			},
			{
				id: "R1",
				type: "R",
				x: 8,
				y: 6,
				rot: 0,
				params: { value: "47" }
			},
			{
				id: "L1",
				type: "L",
				x: 12,
				y: 6,
				rot: 0,
				params: { value: "10m" }
			},
			{
				id: "C1",
				type: "C",
				x: 16,
				y: 6,
				rot: 90,
				params: { value: "100n" }
			},
			{
				id: "GND1",
				type: "GND",
				x: 4,
				y: 6,
				rot: 0,
				params: {}
			},
			{
				id: "GND2",
				type: "GND",
				x: 16,
				y: 10,
				rot: 0,
				params: {}
			}
		],
		wires: [],
		sim: {
			...baseSim(),
			analysis: "tran",
			tstep: "4u",
			tstop: "2m"
		}
	},
	{
		id: "divider",
		name: "Voltage divider",
		blurb: "10 V across 1k / 2k",
		parts: [
			{
				id: "V1",
				type: "V",
				x: 4,
				y: 6,
				rot: 0,
				params: vParams({
					src: "DC",
					dc: "10",
					acmag: "1"
				})
			},
			{
				id: "R1",
				type: "R",
				x: 8,
				y: 6,
				rot: 0,
				params: { value: "1k" }
			},
			{
				id: "R2",
				type: "R",
				x: 12,
				y: 6,
				rot: 90,
				params: { value: "2k" }
			},
			{
				id: "GND1",
				type: "GND",
				x: 4,
				y: 6,
				rot: 0,
				params: {}
			},
			{
				id: "GND2",
				type: "GND",
				x: 12,
				y: 10,
				rot: 0,
				params: {}
			}
		],
		wires: [],
		sim: {
			...baseSim(),
			analysis: "dc",
			dcSource: "V1",
			dcStart: "0",
			dcStop: "10",
			dcStep: "0.5"
		}
	},
	{
		id: "blank",
		name: "Blank sheet",
		blurb: "Empty grid",
		parts: [],
		wires: [],
		sim: baseSim()
	}
];
function getExample(id) {
	const found = EXAMPLES.find((e) => e.id === id);
	if (!found) throw new Error(`Unknown example ${id}`);
	return {
		...found,
		parts: structuredClone(found.parts),
		wires: structuredClone(found.wires),
		sim: structuredClone(found.sim)
	};
}
var WORD_SUFFIX = [
	[/^meg$/i, 1e6],
	[/^t$/i, 0xe8d4a51000],
	[/^g$/i, 1e9],
	[/^k$/i, 1e3],
	[/^m$/i, .001],
	[/^u$|^µ$|^μ$/i, 1e-6],
	[/^n$/i, 1e-9],
	[/^p$/i, 1e-12],
	[/^f$/i, 1e-15]
];
function parseSpiceNumber(input) {
	let s = input.trim().replace(/\s+/g, "").replace(/Ω/g, "");
	if (!s) throw new Error("Empty value");
	s = s.replace(/(ohms|ohm|farads|farad|henries|henry|volts|volt|amps|amp)$/i, "");
	s = s.replace(/([a-zA-Zµμ])[fFhHvVaA]$/, "$1");
	const m = s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)([a-zA-Zµμ]*)$/i);
	if (!m) throw new Error(`Cannot parse “${input}”`);
	const num = Number(m[1]);
	if (!Number.isFinite(num)) throw new Error(`Cannot parse “${input}”`);
	const suf = m[2] ?? "";
	if (!suf) return num;
	for (const [re, scale] of WORD_SUFFIX) if (re.test(suf)) return num * scale;
	throw new Error(`Unknown suffix in “${input}”`);
}
function trimNum(n) {
	const abs = Math.abs(n);
	const digits = abs >= 100 ? 1 : abs >= 10 ? 2 : 3;
	return n.toFixed(digits).replace(/\.?0+$/, "");
}
var PREFIX = {
	12: "T",
	9: "G",
	6: "M",
	3: "k",
	0: "",
	[-3]: "m",
	[-6]: "µ",
	[-9]: "n",
	[-12]: "p",
	[-15]: "f"
};
function formatEng(n, unit = "") {
	if (!Number.isFinite(n)) return "—";
	if (Math.abs(n) < 1e-18) return unit ? `0 ${unit}` : "0";
	let exp = Math.floor(Math.log10(Math.abs(n)) / 3) * 3;
	if (exp > 12) exp = 12;
	if (exp < -15) exp = -15;
	const p = PREFIX[exp];
	if (p === void 0) {
		const text = n.toExponential(3);
		return unit ? `${text} ${unit}` : text;
	}
	const text = trimNum(n / 10 ** exp);
	if (!unit) return `${text}${p}`;
	return p ? `${text} ${p}${unit}` : `${text} ${unit}`;
}
function formatTick(n) {
	if (!Number.isFinite(n)) return "";
	if (n === 0) return "0";
	const abs = Math.abs(n);
	if (abs >= 1e4 || abs < .01) return formatEng(n);
	if (abs >= 100) return n.toFixed(0);
	if (abs >= 10) return trimNum(Number(n.toFixed(2)));
	return trimNum(Number(n.toFixed(3)));
}
var VT = .02585165;
var GMIN = 1e-9;
var LSHORT = 1e6;
var SolveError = class extends Error {};
function fail(message) {
	throw new SolveError(message);
}
function num(part, key, fallback) {
	const raw = part.params[key];
	if (raw === void 0 || raw.trim() === "") {
		if (fallback !== void 0) return fallback;
		fail(`${part.id} is missing ${key}`);
	}
	try {
		return parseSpiceNumber(raw);
	} catch (err) {
		fail(`${part.id}: ${err instanceof Error ? err.message : "bad value"}`);
	}
}
function positive(part, key, label) {
	const v = num(part, key);
	if (!(v > 0) || !Number.isFinite(v)) fail(`${part.id} ${label} must be positive`);
	return v;
}
function dcLevel(part) {
	const src = part.params.src ?? "DC";
	if (src === "SIN") return num(part, "vo", 0);
	if (src === "PULSE") return num(part, "v1", 0);
	return num(part, "dc", 0);
}
function waveAt(part, t) {
	const src = part.params.src ?? "DC";
	if (src === "SIN") {
		const vo = num(part, "vo", 0);
		const va = num(part, "va", 0);
		const freq = num(part, "freq", 0);
		const td = num(part, "td", 0);
		const theta = num(part, "theta", 0);
		const phase = num(part, "phase", 0) * Math.PI / 180;
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
		if (tr > 0 && x < tr) return v1 + (v2 - v1) * x / tr;
		if (x < tr + pw) return v2;
		if (tf > 0 && x < tr + pw + tf) return v2 + (v1 - v2) * (x - tr - pw) / tf;
		return v1;
	}
	return num(part, "dc", 0);
}
function acPhasor(part) {
	const mag = num(part, "acmag", 0);
	const phase = num(part, "acphase", 0) * Math.PI / 180;
	return {
		re: mag * Math.cos(phase),
		im: mag * Math.sin(phase)
	};
}
function buildIndex(parts, pinNet) {
	const ids = /* @__PURE__ */ new Set();
	for (const id of pinNet.values()) if (id !== "0") ids.add(id);
	const node = /* @__PURE__ */ new Map();
	let row = 0;
	for (const id of [...ids].sort((a, b) => a.localeCompare(b, "en", { numeric: true }))) node.set(id, row++);
	const branch = /* @__PURE__ */ new Map();
	for (const part of parts) if (part.type === "V") branch.set(part.id, row++);
	return {
		node,
		branch,
		n: row
	};
}
function at(index, net) {
	if (net === "0") return -1;
	const i = index.node.get(net);
	if (i === void 0) fail(`Missing node ${net}`);
	return i;
}
function netId(pinNet, part, pin) {
	const id = pinNet.get(pinKey(part.id, pin));
	if (!id) fail(`${part.id} pin ${pin} has no net`);
	return id;
}
function zeros(n) {
	return Array.from({ length: n }, () => Array(n).fill(0));
}
function solveReal(A, b) {
	const n = b.length;
	const M = A.map((row, i) => [...row, b[i] ?? 0]);
	for (let k = 0; k < n; k++) {
		let piv = k;
		for (let i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[piv][k])) piv = i;
		if (piv !== k) {
			const swap = M[k];
			M[k] = M[piv];
			M[piv] = swap;
		}
		const diag = M[k][k];
		if (!Number.isFinite(diag) || Math.abs(diag) < 1e-14) fail("Singular matrix. Add a ground, and check for floating nodes or voltage-source loops.");
		for (let i = k + 1; i < n; i++) {
			const f = M[i][k] / diag;
			if (f === 0) continue;
			for (let j = k; j <= n; j++) M[i][j] -= f * M[k][j];
		}
	}
	const x = Array(n).fill(0);
	for (let i = n - 1; i >= 0; i--) {
		let s = M[i][n];
		for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j];
		const diag = M[i][i];
		if (Math.abs(diag) < 1e-14) fail("Singular matrix. Add a ground, and check for floating nodes or voltage-source loops.");
		x[i] = s / diag;
	}
	return x;
}
function cAbs(a) {
	return Math.hypot(a.re, a.im);
}
function cMul(a, b) {
	return {
		re: a.re * b.re - a.im * b.im,
		im: a.re * b.im + a.im * b.re
	};
}
function cDiv(a, b) {
	const d = b.re * b.re + b.im * b.im;
	if (d < 1e-30) fail("Singular matrix. Add a ground, and check for floating nodes or voltage-source loops.");
	return {
		re: (a.re * b.re + a.im * b.im) / d,
		im: (a.im * b.re - a.re * b.im) / d
	};
}
function solveComplex(A, b) {
	const n = b.length;
	const M = A.map((row, i) => [...row.map((c) => ({ ...c })), { ...b[i] ?? {
		re: 0,
		im: 0
	} }]);
	for (let k = 0; k < n; k++) {
		let piv = k;
		for (let i = k + 1; i < n; i++) if (cAbs(M[i][k]) > cAbs(M[piv][k])) piv = i;
		if (piv !== k) {
			const swap = M[k];
			M[k] = M[piv];
			M[piv] = swap;
		}
		const diag = M[k][k];
		if (cAbs(diag) < 1e-14) fail("Singular matrix. Add a ground, and check for floating nodes or voltage-source loops.");
		for (let i = k + 1; i < n; i++) {
			const f = cDiv(M[i][k], diag);
			for (let j = k; j <= n; j++) {
				const prod = cMul(f, M[k][j]);
				const cell = M[i][j];
				cell.re -= prod.re;
				cell.im -= prod.im;
			}
		}
	}
	const x = Array.from({ length: n }, () => ({
		re: 0,
		im: 0
	}));
	for (let i = n - 1; i >= 0; i--) {
		const s = { ...M[i][n] ?? {
			re: 0,
			im: 0
		} };
		for (let j = i + 1; j < n; j++) {
			const prod = cMul(M[i][j], x[j]);
			s.re -= prod.re;
			s.im -= prod.im;
		}
		x[i] = cDiv(s, M[i][i]);
	}
	return x;
}
function stampG(A, a, b, g) {
	if (a >= 0) A[a][a] += g;
	if (b >= 0) BumpOff(A, b, g);
	if (a >= 0 && b >= 0) {
		A[a][b] -= g;
		A[b][a] -= g;
	}
}
function BumpOff(A, b, g) {
	A[b][b] += g;
}
function stampGC(A, a, b, g) {
	const add = (i, j, s) => {
		if (i < 0 || j < 0) return;
		A[i][j].re += s * g.re;
		A[i][j].im += s * g.im;
	};
	add(a, a, 1);
	add(b, b, 1);
	add(a, b, -1);
	add(b, a, -1);
}
function rhsAdd(b, i, v) {
	if (i >= 0) b[i] += v;
}
function voltageOf(x, index, net) {
	if (net === "0") return 0;
	const i = index.node.get(net);
	if (i === void 0) return 0;
	return x[i] ?? 0;
}
function stampReal(parts, pinNet, index, opts) {
	const n = index.n;
	const A = zeros(n);
	const b = Array(n).fill(0);
	for (let i = 0; i < index.node.size; i++) A[i][i] += GMIN;
	for (const part of parts) if (part.type === "R") {
		const g = 1 / positive(part, "value", "resistance");
		stampG(A, at(index, netId(pinNet, part, "1")), at(index, netId(pinNet, part, "2")), g);
	} else if (part.type === "C") {
		if (opts.mode !== "tran") continue;
		const g = positive(part, "value", "capacitance") / opts.dt;
		const na = netId(pinNet, part, "1");
		const nb = netId(pinNet, part, "2");
		const a = at(index, na);
		const c = at(index, nb);
		stampG(A, a, c, g);
		const vp = opts.prev ? voltageOf(opts.prev, index, na) - voltageOf(opts.prev, index, nb) : 0;
		rhsAdd(b, a, g * vp);
		rhsAdd(b, c, -g * vp);
	} else if (part.type === "L") {
		const l = positive(part, "value", "inductance");
		const na = netId(pinNet, part, "1");
		const nb = netId(pinNet, part, "2");
		const a = at(index, na);
		const c = at(index, nb);
		if (opts.mode === "tran") {
			stampG(A, a, c, opts.dt / l);
			const ip = opts.iL.get(part.id) ?? 0;
			rhsAdd(b, a, -ip);
			rhsAdd(b, c, ip);
		} else stampG(A, a, c, LSHORT);
	} else if (part.type === "V") {
		const np = netId(pinNet, part, "p");
		const nn = netId(pinNet, part, "n");
		if (np === nn) {
			const e = opts.force.has(part.id) ? opts.force.get(part.id) : opts.mode === "tran" ? waveAt(part, opts.t) : dcLevel(part);
			if (Math.abs(e) > 1e-9) fail(`${part.id} is shorted and its voltage is not zero`);
			const br = index.branch.get(part.id);
			if (br !== void 0) A[br][br] += 1;
			continue;
		}
		const ip = at(index, np);
		const inn = at(index, nn);
		const br = index.branch.get(part.id);
		if (br === void 0) fail(`Missing branch for ${part.id}`);
		if (ip >= 0) A[ip][br] -= 1;
		if (inn >= 0) A[inn][br] += 1;
		if (ip >= 0) A[br][ip] += 1;
		if (inn >= 0) A[br][inn] -= 1;
		const e = opts.force.has(part.id) ? opts.force.get(part.id) : opts.mode === "tran" ? waveAt(part, opts.t) : dcLevel(part);
		b[br] += e;
	} else if (part.type === "I") {
		const ip = at(index, netId(pinNet, part, "p"));
		const inn = at(index, netId(pinNet, part, "n"));
		const e = opts.force.has(part.id) ? opts.force.get(part.id) : opts.mode === "tran" ? waveAt(part, opts.t) : dcLevel(part);
		rhsAdd(b, ip, -e);
		rhsAdd(b, inn, e);
	} else if (part.type === "D" && opts.diodes) {
		const is = positive(part, "is", "Is");
		const vt = positive(part, "n", "N") * VT;
		const vd = opts.vd.get(part.id) ?? 0;
		const arg = Math.min(Math.max(vd / vt, -40), 40);
		const ex = Math.exp(arg);
		const id = is * (ex - 1);
		const gd = Math.max(is / vt * ex, 0);
		const ieq = id - gd * vd;
		const a = at(index, netId(pinNet, part, "A"));
		const k = at(index, netId(pinNet, part, "K"));
		stampG(A, a, k, gd);
		rhsAdd(b, a, -ieq);
		rhsAdd(b, k, ieq);
	} else if (part.type === "MN" || part.type === "MP") {
		const g = mosConductance(part, opts.vgs.get(part.id) ?? 0);
		stampG(A, at(index, netId(pinNet, part, "D")), at(index, netId(pinNet, part, "S")), g);
	}
	return {
		A,
		b
	};
}
function limitDiode(vd, prev, is, nfac) {
	const vt = Math.max(nfac, .1) * VT;
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
function diodeDrop(part, x, index, pinNet) {
	return voltageOf(x, index, netId(pinNet, part, "A")) - voltageOf(x, index, netId(pinNet, part, "K"));
}
function mosVgs(part, x, index, pinNet) {
	return voltageOf(x, index, netId(pinNet, part, "G")) - voltageOf(x, index, netId(pinNet, part, "S"));
}
/** Switch-level MOSFET: a conductance between drain and source, iterated with Vgs. */
function mosConductance(part, vgs) {
	const nmos = part.type === "MN";
	const vto = num(part, "vto", nmos ? 1 : -1);
	const beta = positive(part, "kp", "Kp") * (positive(part, "w", "W") / positive(part, "l", "L"));
	if (!(nmos ? vgs > vto : vgs < vto)) return 1e-9;
	const vov = Math.abs(nmos ? vgs - vto : vto - vgs);
	return Math.min(.2, Math.max(1e-6, beta * Math.max(vov, .2)));
}
function limitStep(next, prev) {
	const delta = next - prev;
	if (delta > 2) return prev + 2;
	if (delta < -2) return prev - 2;
	return next;
}
function solveOperating(parts, pinNet, index, opts) {
	const diodes = parts.filter((p) => p.type === "D");
	const mos = parts.filter((p) => p.type === "MN" || p.type === "MP");
	const vd = /* @__PURE__ */ new Map();
	const vgs = /* @__PURE__ */ new Map();
	if (opts.warm) {
		for (const d of diodes) vd.set(d.id, diodeDrop(d, opts.warm, index, pinNet));
		for (const m of mos) vgs.set(m.id, mosVgs(m, opts.warm, index, pinNet));
	}
	let x = opts.warm ? [...opts.warm] : Array(index.n).fill(0);
	const nonlinear = diodes.length + mos.length > 0;
	const rounds = nonlinear ? 50 : 1;
	for (let iter = 0; iter < rounds; iter++) {
		const { A, b } = stampReal(parts, pinNet, index, {
			...opts,
			vd,
			vgs,
			diodes: diodes.length > 0
		});
		const next = solveReal(A, b);
		let jump = 0;
		for (let i = 0; i < next.length; i++) jump = Math.max(jump, Math.abs(next[i] - (x[i] ?? 0)));
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
		if (iter === rounds - 1 && (vdJump > .001 || vgsJump > .01)) fail("Device iteration did not converge. Check the bias and try a series resistor.");
	}
	return x;
}
function inductorCurrents(parts, pinNet, index, x, mode, dt, prevI) {
	const next = /* @__PURE__ */ new Map();
	for (const part of parts) {
		if (part.type !== "L") continue;
		const l = positive(part, "value", "inductance");
		const v = voltageOf(x, index, netId(pinNet, part, "1")) - voltageOf(x, index, netId(pinNet, part, "2"));
		if (mode === "dc") next.set(part.id, LSHORT * v);
		else next.set(part.id, (prevI.get(part.id) ?? 0) + dt / l * v);
	}
	return next;
}
function pinDetail(net) {
	if (net.ground) return "ground";
	return net.pins.map((p) => `${p.partId}:${p.pin}`).join(" ");
}
function signalNets(nets) {
	return nets.filter((n) => !n.ground).sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
}
function finish(kind, xLabel, yLabel, rows, phaseRows, series, op, notes, t0) {
	return {
		kind,
		xLabel,
		yLabel,
		rows,
		phaseRows,
		series,
		op,
		notes,
		elapsedMs: Math.max(0, performance.now() - t0)
	};
}
function blank(kind, message, t0) {
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
		elapsedMs: Math.max(0, performance.now() - t0)
	};
}
function unbounded(x) {
	return x.some((v) => !Number.isFinite(v) || Math.abs(v) > 1e8);
}
function opFrom(nets, parts, pinNet, index, x, iL) {
	const rows = [];
	for (const net of signalNets(nets)) rows.push({
		name: net.id,
		value: formatEng(voltageOf(x, index, net.id), "V"),
		detail: pinDetail(net)
	});
	for (const part of parts) if (part.type === "V") {
		const br = index.branch.get(part.id);
		const i = br === void 0 ? 0 : x[br] ?? 0;
		rows.push({
			name: `I(${part.id})`,
			value: formatEng(i, "A"),
			detail: "out of the + terminal"
		});
	} else if (part.type === "L") rows.push({
		name: `I(${part.id})`,
		value: formatEng(iL.get(part.id) ?? 0, "A"),
		detail: "pin 1 → pin 2"
	});
	else if (part.type === "D") {
		const is = positive(part, "is", "Is");
		const nfac = positive(part, "n", "N");
		const vd = diodeDrop(part, x, index, pinNet);
		const arg = Math.min(Math.max(vd / (nfac * VT), -40), 40);
		const id = is * (Math.exp(arg) - 1);
		rows.push({
			name: `I(${part.id})`,
			value: formatEng(id, "A"),
			detail: "anode → cathode"
		});
	}
	return rows;
}
function seriesFor(nets) {
	return signalNets(nets).map((net) => ({
		key: net.id,
		label: net.id
	}));
}
function pushRow(rows, x, nets, index, sol) {
	const row = { x };
	for (const net of signalNets(nets)) row[net.id] = voltageOf(sol, index, net.id);
	rows.push(row);
}
function prepare(parts, wires) {
	if (!parts.length) fail("The sheet is empty. Drop a source, a part, and a ground.");
	const graph = extractNets(parts, wires);
	if (!graph.nets.some((n) => n.ground)) fail("Add a ground. The solver needs node 0.");
	const ignored = parts.filter((p) => p.type === "QNPN" || p.type === "QPNP");
	const notes = [];
	if (ignored.length) notes.push(`${ignored.map((p) => p.id).join(", ")} ${ignored.length === 1 ? "is" : "are"} in the netlist only. This engine solves R, L, C, sources, diodes, and switch-level MOSFETs.`);
	const index = buildIndex(parts, graph.pinNet);
	if (index.n === 0) fail("Nothing to solve. Every pin is sitting on ground.");
	return {
		graph,
		index,
		notes
	};
}
function runTran(parts, wires, sim, t0) {
	const { graph, index, notes } = prepare(parts, wires);
	let dt = num({
		id: ".tran",
		type: "R",
		x: 0,
		y: 0,
		rot: 0,
		params: { value: sim.tstep }
	}, "value");
	const stop = num({
		id: ".tran",
		type: "R",
		x: 0,
		y: 0,
		rot: 0,
		params: { value: sim.tstop }
	}, "value");
	if (!(stop > 0)) fail("Tstop must be positive");
	if (!(dt > 0)) fail("Tstep must be positive");
	let steps = Math.round(stop / dt);
	if (steps > 2e3) {
		steps = 2e3;
		dt = stop / steps;
		notes.push(`Tstep coarsened to ${formatEng(dt, "s")} so the run stays within 2000 points.`);
	}
	if (steps < 1) steps = 1;
	const force = /* @__PURE__ */ new Map();
	let x = solveOperating(parts, graph.pinNet, index, {
		mode: "dc",
		dt,
		t: 0,
		prev: null,
		iL: /* @__PURE__ */ new Map(),
		force,
		warm: null
	});
	if (unbounded(x)) notes.push("A node voltage is enormous. Something is probably floating.");
	let iL = inductorCurrents(parts, graph.pinNet, index, x, "dc", dt, /* @__PURE__ */ new Map());
	const rows = [];
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
			warm: x
		});
		iL = inductorCurrents(parts, graph.pinNet, index, next, "tran", dt, iL);
		x = next;
		pushRow(rows, t, graph.nets, index, x);
	}
	if (unbounded(x)) notes.push("A node voltage is enormous. Something is probably floating.");
	return finish("tran", "Time (s)", "Voltage (V)", rows, null, seriesFor(graph.nets), opFrom(graph.nets, parts, graph.pinNet, index, x, iL), notes, t0);
}
function runDc(parts, wires, sim, t0) {
	const { graph, index, notes } = prepare(parts, wires);
	const source = parts.find((p) => p.id === sim.dcSource && (p.type === "V" || p.type === "I"));
	if (!source) fail("Pick a voltage or current source to sweep.");
	const start = num({
		id: ".dc",
		type: "R",
		x: 0,
		y: 0,
		rot: 0,
		params: { value: sim.dcStart }
	}, "value");
	const stop = num({
		id: ".dc",
		type: "R",
		x: 0,
		y: 0,
		rot: 0,
		params: { value: sim.dcStop }
	}, "value");
	let step = num({
		id: ".dc",
		type: "R",
		x: 0,
		y: 0,
		rot: 0,
		params: { value: sim.dcStep }
	}, "value");
	if (step === 0) fail("DC step cannot be zero");
	if ((stop - start) * step < 0) step = -step;
	let count = Math.floor(Math.abs((stop - start) / step) + 1.0000001);
	if (count > 500) {
		count = 500;
		step = (stop - start) / 499;
		notes.push("DC step coarsened so the sweep stays within 500 points.");
	}
	const rows = [];
	let x = Array(index.n).fill(0);
	let iL = /* @__PURE__ */ new Map();
	for (let i = 0; i < count; i++) {
		const value = i === count - 1 ? stop : start + i * step;
		const force = /* @__PURE__ */ new Map([[source.id, value]]);
		x = solveOperating(parts, graph.pinNet, index, {
			mode: "dc",
			dt: 0,
			t: 0,
			prev: null,
			iL: /* @__PURE__ */ new Map(),
			force,
			warm: x
		});
		iL = inductorCurrents(parts, graph.pinNet, index, x, "dc", 0, iL);
		pushRow(rows, value, graph.nets, index, x);
	}
	const unit = source.type === "V" ? "V" : "A";
	return finish("dc", `${source.id} (${unit})`, "Voltage (V)", rows, null, seriesFor(graph.nets), opFrom(graph.nets, parts, graph.pinNet, index, x, iL), notes, t0);
}
function runAc(parts, wires, sim, t0) {
	const { graph, index, notes } = prepare(parts, wires);
	const fstart = num({
		id: ".ac",
		type: "R",
		x: 0,
		y: 0,
		rot: 0,
		params: { value: sim.fstart }
	}, "value");
	const fstop = num({
		id: ".ac",
		type: "R",
		x: 0,
		y: 0,
		rot: 0,
		params: { value: sim.fstop }
	}, "value");
	const pts = Math.round(num({
		id: ".ac",
		type: "R",
		x: 0,
		y: 0,
		rot: 0,
		params: { value: sim.acPts }
	}, "value"));
	if (!(fstart > 0) || !(fstop > 0)) fail("AC frequencies must be positive");
	const lo = Math.min(fstart, fstop);
	const hi = Math.max(fstart, fstop);
	const freqs = makeFreqs(sim.acType, Math.max(pts, 1), lo, hi);
	if (freqs.length > 400) notes.push("AC sweep was capped at 400 points.");
	const used = freqs.slice(0, 400);
	if (!parts.filter((p) => (p.type === "V" || p.type === "I") && Math.abs(num(p, "acmag", 0)) > 0).length) notes.push("No source has an AC magnitude, so every trace sits at zero. Set AC mag on the stimulus.");
	const opX = solveOperating(parts, graph.pinNet, index, {
		mode: "dc",
		dt: 0,
		t: 0,
		prev: null,
		iL: /* @__PURE__ */ new Map(),
		force: /* @__PURE__ */ new Map(),
		warm: null
	});
	const gd = /* @__PURE__ */ new Map();
	for (const d of parts) {
		if (d.type !== "D") continue;
		const is = positive(d, "is", "Is");
		const nfac = positive(d, "n", "N");
		const vd = diodeDrop(d, opX, index, graph.pinNet);
		const arg = Math.min(Math.max(vd / (nfac * VT), -40), 40);
		gd.set(d.id, Math.max(is / (nfac * VT) * Math.exp(arg), 0));
	}
	const mg = /* @__PURE__ */ new Map();
	for (const part of parts) {
		if (part.type !== "MN" && part.type !== "MP") continue;
		mg.set(part.id, mosConductance(part, mosVgs(part, opX, index, graph.pinNet)));
	}
	const rows = [];
	const phaseRows = [];
	const n = index.n;
	for (const f of used) {
		const w = 2 * Math.PI * f;
		const A = Array.from({ length: n }, () => Array.from({ length: n }, () => ({
			re: 0,
			im: 0
		})));
		const b = Array.from({ length: n }, () => ({
			re: 0,
			im: 0
		}));
		for (let i = 0; i < index.node.size; i++) A[i][i].re += GMIN;
		for (const part of parts) if (part.type === "R") stampGC(A, at(index, netId(graph.pinNet, part, "1")), at(index, netId(graph.pinNet, part, "2")), {
			re: 1 / positive(part, "value", "resistance"),
			im: 0
		});
		else if (part.type === "C") stampGC(A, at(index, netId(graph.pinNet, part, "1")), at(index, netId(graph.pinNet, part, "2")), {
			re: 0,
			im: w * positive(part, "value", "capacitance")
		});
		else if (part.type === "L") stampGC(A, at(index, netId(graph.pinNet, part, "1")), at(index, netId(graph.pinNet, part, "2")), {
			re: 0,
			im: -1 / (w * positive(part, "value", "inductance"))
		});
		else if (part.type === "D") stampGC(A, at(index, netId(graph.pinNet, part, "A")), at(index, netId(graph.pinNet, part, "K")), {
			re: gd.get(part.id) ?? 0,
			im: 0
		});
		else if (part.type === "MN" || part.type === "MP") stampGC(A, at(index, netId(graph.pinNet, part, "D")), at(index, netId(graph.pinNet, part, "S")), {
			re: mg.get(part.id) ?? 1e-9,
			im: 0
		});
		else if (part.type === "V") {
			const np = netId(graph.pinNet, part, "p");
			const nn = netId(graph.pinNet, part, "n");
			const ph = acPhasor(part);
			if (np === nn) {
				if (cAbs(ph) > 1e-12) fail(`${part.id} is shorted and its AC voltage is not zero`);
				const br = index.branch.get(part.id);
				if (br !== void 0) A[br][br].re += 1;
				continue;
			}
			const ip = at(index, np);
			const inn = at(index, nn);
			const br = index.branch.get(part.id);
			if (br === void 0) fail(`Missing branch for ${part.id}`);
			if (ip >= 0) A[ip][br].re -= 1;
			if (inn >= 0) A[inn][br].re += 1;
			if (ip >= 0) A[br][ip].re += 1;
			if (inn >= 0) A[br][inn].re -= 1;
			b[br].re += ph.re;
			b[br].im += ph.im;
		} else if (part.type === "I") {
			const ip = at(index, netId(graph.pinNet, part, "p"));
			const inn = at(index, netId(graph.pinNet, part, "n"));
			const ph = acPhasor(part);
			if (ip >= 0) {
				b[ip].re -= ph.re;
				b[ip].im -= ph.im;
			}
			if (inn >= 0) {
				b[inn].re += ph.re;
				b[inn].im += ph.im;
			}
		}
		const sol = solveComplex(A, b);
		const row = { x: f };
		const prow = { x: f };
		for (const net of signalNets(graph.nets)) {
			const i = index.node.get(net.id);
			const ph = i === void 0 ? {
				re: 0,
				im: 0
			} : sol[i];
			const mag = Math.max(cAbs(ph), 1e-12);
			row[net.id] = 20 * Math.log10(mag);
			prow[net.id] = Math.atan2(ph.im, ph.re) * 180 / Math.PI;
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
	const op = [];
	const magRow = rows[mid];
	const phRow = phaseRows[mid];
	if (magRow && phRow) for (const net of signalNets(graph.nets)) op.push({
		name: net.id,
		value: `${magRow[net.id]?.toFixed(2) ?? "0"} dB`,
		detail: `${phRow[net.id]?.toFixed(1) ?? "0"}° at ${formatEng(magRow.x, "Hz")} · ${pinDetail(net)}`
	});
	return finish("ac", "Frequency (Hz)", "Magnitude (dB)", rows, phaseRows, seriesFor(graph.nets), op, notes, t0);
}
function makeFreqs(type, pts, lo, hi) {
	if (Math.abs(hi - lo) / hi < 1e-9) return [lo];
	if (type === "lin") {
		const n = Math.min(Math.max(pts, 2), 400);
		return Array.from({ length: n }, (_, i) => lo + (hi - lo) * i / (n - 1));
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
function simulate(parts, wires, sim) {
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
var STORAGE_KEY = "volta.sheet.v1";
function nextId(parts, type) {
	const prefix = idPrefix(type);
	const re = new RegExp(`^${prefix}(\\d+)$`);
	let n = 0;
	for (const part of parts) {
		const match = part.id.match(re);
		if (match) n = Math.max(n, Number(match[1]));
	}
	return `${prefix}${n + 1}`;
}
function nextWireId(wires) {
	let n = 0;
	for (const wire of wires) {
		const match = wire.id.match(/^W(\d+)$/);
		if (match) n = Math.max(n, Number(match[1]));
	}
	return `W${n + 1}`;
}
function snapOf(parts, wires) {
	return {
		parts: structuredClone(parts),
		wires: structuredClone(wires)
	};
}
function seededProbes(parts, wires) {
	const nets = extractNets(parts, wires).nets.filter((net) => !net.ground);
	const last = nets[nets.length - 1];
	return last ? [last.id] : [];
}
var demo = getExample("rc");
var demoResult = simulate(demo.parts, demo.wires, demo.sim);
if (!demoResult.error) demoResult.elapsedMs = 0;
var useCircuit = create((set, get) => ({
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
	setTool: (tool) => set({
		tool,
		wireDraft: tool === "wire" ? get().wireDraft : null
	}),
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
		set({ placing: {
			...placing,
			rot: nextRot(placing.rot)
		} });
	},
	panBy: (dx, dy) => set({
		panX: get().panX + dx,
		panY: get().panY + dy
	}),
	zoomAt: (sx, sy, factor) => {
		const { zoom, panX, panY } = get();
		const next = Math.min(6, Math.max(.25, zoom * factor));
		const wx = (sx - panX) / zoom;
		const wy = (sy - panY) / zoom;
		set({
			zoom: next,
			panX: sx - wx * next,
			panY: sy - wy * next
		});
	},
	fit: (width, height) => {
		set(frameCamera(get().parts, width, height));
	},
	select: (selected) => set({ selected }),
	openEdit: (id) => set({
		editingId: id,
		selected: {
			kind: "part",
			id
		}
	}),
	closeEdit: () => set({ editingId: null }),
	place: (type, x, y, rot) => {
		const { parts, wires, past, revision } = get();
		const id = nextId(parts, type);
		const part = {
			id,
			type,
			x,
			y,
			rot,
			params: defaultParams(type)
		};
		set({
			parts: [...parts, part],
			selected: {
				kind: "part",
				id
			},
			past: [...past, snapOf(parts, wires)].slice(-80),
			future: [],
			revision: revision + 1,
			wireDraft: null,
			sheet: get().sheet
		});
	},
	movePart: (id, x, y) => {
		const part = get().parts.find((p) => p.id === id);
		if (!part || part.x === x && part.y === y) return;
		set({
			parts: get().parts.map((p) => p.id === id ? {
				...p,
				x,
				y
			} : p),
			revision: get().revision + 1
		});
	},
	remember: (snap) => {
		const { parts, wires, past } = get();
		if (JSON.stringify(snap.parts) === JSON.stringify(parts) && JSON.stringify(snap.wires) === JSON.stringify(wires)) return;
		set({
			past: [...past, snap].slice(-80),
			future: []
		});
	},
	rotateSelected: () => {
		const { selected, parts, wires, past, revision } = get();
		if (selected?.kind !== "part") return;
		set({
			parts: parts.map((p) => p.id === selected.id ? {
				...p,
				rot: nextRot(p.rot)
			} : p),
			past: [...past, snapOf(parts, wires)].slice(-80),
			future: [],
			revision: revision + 1
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
				revision: revision + 1
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
			revision: revision + 1
		});
	},
	duplicate: () => {
		const { selected, parts, wires, past, revision } = get();
		if (selected?.kind !== "part") return;
		const src = parts.find((p) => p.id === selected.id);
		if (!src) return;
		const id = nextId(parts, src.type);
		const copy = {
			...structuredClone(src),
			id,
			x: src.x + 2,
			y: src.y + 2
		};
		set({
			parts: [...parts, copy],
			selected: {
				kind: "part",
				id
			},
			past: [...past, snapOf(parts, wires)].slice(-80),
			future: [],
			revision: revision + 1
		});
	},
	setPartParams: (id, params) => {
		const { parts, wires, past, revision } = get();
		set({
			parts: parts.map((p) => p.id === id ? {
				...p,
				params: { ...params }
			} : p),
			past: [...past, snapOf(parts, wires)].slice(-80),
			future: [],
			revision: revision + 1,
			editingId: null
		});
	},
	startDraft: (point) => set({
		wireDraft: {
			points: [point],
			cursor: null
		},
		tool: "wire"
	}),
	addDraftPoint: (point) => {
		const draft = get().wireDraft;
		if (!draft) return;
		const last = draft.points[draft.points.length - 1];
		if (last && last.kind === "xy" && point.kind === "xy" && last.x === point.x && last.y === point.y) return;
		set({ wireDraft: {
			...draft,
			points: [...draft.points, point]
		} });
	},
	setDraftCursor: (x, y) => {
		const draft = get().wireDraft;
		if (!draft || draft.cursor?.x === x && draft.cursor?.y === y) return;
		set({ wireDraft: {
			...draft,
			cursor: {
				x,
				y
			}
		} });
	},
	popDraft: () => {
		const draft = get().wireDraft;
		if (!draft) return;
		if (draft.points.length <= 1) set({ wireDraft: null });
		else set({ wireDraft: {
			...draft,
			points: draft.points.slice(0, -1)
		} });
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
			wires: [...wires, {
				id,
				points
			}],
			selected: {
				kind: "wire",
				id
			},
			wireDraft: null,
			past: [...past, snapOf(parts, wires)].slice(-80),
			future: [],
			revision: revision + 1
		});
	},
	setSim: (patch) => set({
		sim: {
			...get().sim,
			...patch
		},
		revision: get().revision + 1
	}),
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
			revision: revision + 1
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
			revision: revision + 1
		});
		if (viewRef.width > 0) get().fit(viewRef.width, viewRef.height);
	},
	setCloud: (id, name, isPublic) => set({
		cloudId: id,
		sheet: name,
		cloudPublic: isPublic,
		notice: id ? "Saved to your account." : null
	}),
	setNotice: (notice) => set({ notice }),
	run: () => {
		const { parts, wires, sim, revision } = get();
		set({
			result: simulate(parts, wires, sim),
			resultRev: revision,
			showResults: true
		});
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
			revision: revision + 1
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
			revision: revision + 1
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
			probes: seededProbes(data.parts, data.wires)
		});
	}
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var g = 20;
function Arrow({ x1, y1, x2, y2 }) {
	const dx = x2 - x1;
	const dy = y2 - y1;
	const len = Math.hypot(dx, dy) || 1;
	const ux = dx / len;
	const uy = dy / len;
	const bx = x2 - ux * 8;
	const by = y2 - uy * 8;
	const px = -uy * 4.5;
	const py = ux * 4.5;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
		points: `${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`,
		fill: "currentColor"
	});
}
function SymbolShape({ type, strokeWidth }) {
	const line = {
		fill: "none",
		stroke: "currentColor",
		strokeWidth,
		strokeLinecap: "square",
		strokeLinejoin: "miter"
	};
	if (type === "R") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		...line,
		d: `M 0 0 H ${.55 * g} L ${.9 * g} ${-.48 * g} L ${1.45 * g} ${.48 * g} L ${2 * g} ${-.48 * g} L ${2.55 * g} ${.48 * g} L ${3.1 * g} ${-.48 * g} L ${3.45 * g} 0 H ${4 * g}`
	});
	if (type === "C") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		...line,
		d: `M 0 0 H ${1.68 * g} M ${1.68 * g} ${-.82 * g} V ${.82 * g} M ${2.32 * g} ${-.82 * g} V ${2.32 * g * 0 + .82 * g} M ${2.32 * g} 0 H ${4 * g}`
	});
	if (type === "L") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		...line,
		d: `M 0 0 H ${.4 * g} C ${.4 * g} ${-.82 * g} ${1.25 * g} ${-.82 * g} ${1.25 * g} 0 C ${1.25 * g} ${-.82 * g} ${2.1 * g} ${-.82 * g} ${2.1 * g} 0 C ${2.1 * g} ${-.82 * g} ${2.95 * g} ${-.82 * g} ${2.95 * g} 0 C ${2.95 * g} ${-.82 * g} ${3.6 * g} ${-.82 * g} ${3.6 * g} 0 H ${4 * g}`
	});
	if (type === "V") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...line,
			d: `M 0 0 H ${1.28 * g} M ${2.72 * g} 0 H ${4 * g}`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			...line,
			cx: 2 * g,
			cy: 0,
			r: .72 * g
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...line,
			d: `M ${1.48 * g} 0 H ${1.78 * g} M ${2.22 * g} ${-.16 * g} H ${2.54 * g} M ${2.38 * g} ${-.32 * g} V 0`
		})
	] });
	if (type === "I") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...line,
			d: `M 0 0 H ${1.28 * g} M ${2.72 * g} 0 H ${4 * g} M ${1.45 * g} 0 H ${2.35 * g}`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			...line,
			cx: 2 * g,
			cy: 0,
			r: .72 * g
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
			x1: 1.7 * g,
			y1: 0,
			x2: 2.5 * g,
			y2: 0
		})
	] });
	if (type === "D") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		...line,
		d: `M 0 0 H ${1.5 * g} M ${2.55 * g} 0 H ${4 * g} M ${2.55 * g} ${-.72 * g} V ${.72 * g}`
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
		points: `${1.5 * g},${-.72 * g} ${2.55 * g},0 ${1.5 * g},${.72 * g}`,
		fill: "currentColor"
	})] });
	if (type === "GND") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		...line,
		d: `M 0 0 V ${.5 * g} M ${-.72 * g} ${.5 * g} H ${.72 * g} M ${-.46 * g} ${.86 * g} H ${.46 * g} M ${-.22 * g} ${1.2 * g} H ${.22 * g}`
	});
	if (type === "QNPN" || type === "QPNP") {
		const tipX = type === "QNPN" ? 2.55 * g : 2.05 * g;
		const tipY = type === "QNPN" ? 3.48 * g : 3.15 * g;
		const tailX = type === "QNPN" ? 1.9 * g : 2.55 * g;
		const tailY = type === "QNPN" ? 3.05 * g : 3.5 * g;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...line,
			d: `M 0 ${2 * g} H ${1.5 * g} M ${1.5 * g} ${.7 * g} V ${3.3 * g} M ${1.5 * g} ${1.15 * g} L ${3.05 * g} 0 H ${4 * g} M ${1.5 * g} ${2.85 * g} L ${3.15 * g} ${4 * g} H ${4 * g}`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
			x1: tailX,
			y1: tailY,
			x2: tipX,
			y2: tipY
		})] });
	}
	const pmos = type === "MP";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			...line,
			d: `M 0 ${2 * g} H ${pmos ? .95 * g : 1.2 * g} M ${1.2 * g} ${.75 * g} V ${3.25 * g} M ${1.62 * g} ${.85 * g} V ${1.55 * g} M ${1.62 * g} ${2.45 * g} V ${3.15 * g} M ${1.62 * g} ${1.15 * g} L ${3.05 * g} 0 H ${4 * g} M ${1.62 * g} ${2.85 * g} L ${3.15 * g} ${4 * g} H ${4 * g}`
		}),
		pmos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			...line,
			cx: 1.08 * g,
			cy: 2 * g,
			r: .16 * g
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
			x1: pmos ? 2.15 * g : 1.85 * g,
			y1: pmos ? 3.35 * g : 3.15 * g,
			x2: pmos ? 1.85 * g : 2.35 * g,
			y2: pmos ? 3.15 * g : 3.5 * g
		})
	] });
}
function MiniSymbol({ type }) {
	const transistor = type === "QNPN" || type === "QPNP" || type === "MN" || type === "MP";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: type === "GND" ? "-18 -2 36 32" : transistor ? "-2 -2 84 84" : "-2 -18 84 36",
		className: transistor || type === "GND" ? "h-8 w-8" : "h-6 w-10",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
			className: "text-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SymbolShape, {
				type,
				strokeWidth: 1.7
			})
		})
	});
}
function isTyping(target) {
	const tag = target instanceof HTMLElement ? target.tagName : "";
	return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}
function draftPath(points, cursor, parts) {
	const base = wirePolyline({
		id: "draft",
		points
	}, parts);
	if (!cursor || !base.length) return base;
	const last = base[base.length - 1];
	if (last.x === cursor.x && last.y === cursor.y) return base;
	const horiz = Math.abs(cursor.x - last.x) >= Math.abs(cursor.y - last.y);
	return [...base, ...elbow(last, cursor, horiz).slice(1)];
}
function CanvasView() {
	const ref = (0, import_react.useRef)(null);
	const space = (0, import_react.useRef)(false);
	const drag = (0, import_react.useRef)(null);
	const [size, setSize] = (0, import_react.useState)({
		w: 800,
		h: 600
	});
	const [hover, setHover] = (0, import_react.useState)(null);
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
	const fitted = (0, import_react.useRef)(false);
	(0, import_react.useLayoutEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const measure = () => {
			const rect = el.getBoundingClientRect();
			viewRef.left = rect.left;
			viewRef.top = rect.top;
			viewRef.width = rect.width;
			viewRef.height = rect.height;
			setSize({
				w: rect.width,
				h: rect.height
			});
			if (!fitted.current && rect.width > 40 && rect.height > 40 && !localStorage.getItem("volta.sheet.v1")) {
				fitted.current = true;
				useCircuit.getState().fit(rect.width, rect.height);
			}
		};
		measure();
		const obs = new ResizeObserver(measure);
		obs.observe(el);
		return () => obs.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const onWheel = (e) => {
			e.preventDefault();
			const rect = el.getBoundingClientRect();
			useCircuit.getState().zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * .0011));
		};
		el.addEventListener("wheel", onWheel, { passive: false });
		return () => el.removeEventListener("wheel", onWheel);
	}, []);
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			if (e.code === "Space" && !isTyping(e.target)) {
				e.preventDefault();
				space.current = true;
			}
		};
		const up = (e) => {
			if (e.code === "Space") space.current = false;
		};
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
		};
	}, []);
	function worldOf(clientX, clientY) {
		const rect = ref.current?.getBoundingClientRect();
		const { panX: px, panY: py, zoom: z } = useCircuit.getState();
		return {
			x: (clientX - (rect?.left ?? 0) - px) / z,
			y: (clientY - (rect?.top ?? 0) - py) / z
		};
	}
	function gridOf(clientX, clientY) {
		const w = worldOf(clientX, clientY);
		return {
			x: Math.round(w.x / 20),
			y: Math.round(w.y / 20)
		};
	}
	function onPointerDown(e) {
		if (e.button === 2) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		const state = useCircuit.getState();
		const world = worldOf(e.clientX, e.clientY);
		const grid = gridOf(e.clientX, e.clientY);
		state.setCursor(grid);
		if (e.button === 1 || state.tool === "pan" || space.current) {
			drag.current = {
				kind: "pan",
				sx: e.clientX,
				sy: e.clientY,
				panX: state.panX,
				panY: state.panY
			};
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
				if (pin) state.startDraft({
					kind: "pin",
					partId: pin.partId,
					pin: pin.pin
				});
				else if (onSeg) state.startDraft({
					kind: "xy",
					x: onSeg.x,
					y: onSeg.y
				});
				return;
			}
			if (pin) {
				state.commitWire([...state.wireDraft.points, {
					kind: "pin",
					partId: pin.partId,
					pin: pin.pin
				}]);
				return;
			}
			if (onSeg) {
				state.commitWire([...state.wireDraft.points, {
					kind: "xy",
					x: onSeg.x,
					y: onSeg.y
				}]);
				return;
			}
			state.addDraftPoint({
				kind: "xy",
				x: grid.x,
				y: grid.y
			});
			return;
		}
		const part = hitPart(state.parts, world.x, world.y, state.zoom);
		if (part) {
			state.select({
				kind: "part",
				id: part.id
			});
			drag.current = {
				kind: "move",
				id: part.id,
				ox: part.x,
				oy: part.y,
				gx: grid.x,
				gy: grid.y,
				beforeParts: structuredClone(state.parts),
				beforeWires: structuredClone(state.wires)
			};
			return;
		}
		const wire = hitWire(state.wires, state.parts, world.x, world.y, state.zoom);
		if (wire) {
			state.select({
				kind: "wire",
				id: wire.id
			});
			return;
		}
		state.select(null);
		drag.current = {
			kind: "pan",
			sx: e.clientX,
			sy: e.clientY,
			panX: state.panX,
			panY: state.panY
		};
	}
	function onPointerMove(e) {
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
		if (current?.kind === "move") useCircuit.getState().remember({
			parts: current.beforeParts,
			wires: current.beforeWires
		});
	}
	function onDoubleClick(e) {
		const state = useCircuit.getState();
		const world = worldOf(e.clientX, e.clientY);
		const part = hitPart(state.parts, world.x, world.y, state.zoom);
		if (part && part.type !== "GND") state.openEdit(part.id);
		else if (part) state.openEdit(part.id);
	}
	function onContextMenu(e) {
		e.preventDefault();
		const state = useCircuit.getState();
		const world = worldOf(e.clientX, e.clientY);
		const part = hitPart(state.parts, world.x, world.y, state.zoom);
		if (!part) return;
		state.openEdit(part.id);
	}
	const x0 = -panX / zoom - 20;
	const y0 = -panY / zoom - 20;
	const x1 = (size.w - panX) / zoom + 20;
	const y1 = (size.h - panY) / zoom + 20;
	const graph = extractNets(parts, wires);
	const junctions = graph.junctions;
	const probeColor = new Map(probes.map((id, i) => [id, TRACE_COLORS[i % TRACE_COLORS.length]]));
	const showMinor = zoom >= .55 && (x1 - x0) / 20 < 220;
	const gridLines = [];
	const startX = Math.floor(x0 / 20) * 20;
	const startY = Math.floor(y0 / 20) * 20;
	for (let x = startX; x <= x1; x += 20) {
		const major = Math.round(x / 20) % 5 === 0;
		if (!major && !showMinor) continue;
		gridLines.push({
			x1: x,
			y1: y0,
			x2: x,
			y2: y1,
			major
		});
	}
	for (let y = startY; y <= y1; y += 20) {
		const major = Math.round(y / 20) % 5 === 0;
		if (!major && !showMinor) continue;
		gridLines.push({
			x1: x0,
			y1: y,
			x2: x1,
			y2: y,
			major
		});
	}
	const preview = draft ? draftPath(draft.points, draft.cursor, parts) : [];
	const frame = sheetFrame(parts);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-w-0 flex-1 bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			ref,
			"data-canvas": "",
			"data-fit-x0": frame ? frame.x0 : void 0,
			"data-fit-y0": frame ? frame.y0 : void 0,
			"data-fit-x1": frame ? frame.x1 : void 0,
			"data-fit-y1": frame ? frame.y1 : void 0,
			className: cn("h-full w-full touch-none", tool === "wire" && "cursor-crosshair", tool === "probe" && "cursor-crosshair", tool === "pan" && "cursor-grab", tool === "select" && "cursor-default"),
			onPointerDown,
			onPointerMove,
			onPointerUp,
			onDoubleClick,
			onContextMenu,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				"data-camera": "",
				suppressHydrationWarning: true,
				transform: `translate(${panX} ${panY}) scale(${zoom})`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
						shapeRendering: "crispEdges",
						children: gridLines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: line.x1,
							y1: line.y1,
							x2: line.x2,
							y2: line.y2,
							stroke: "white",
							strokeOpacity: line.major ? .14 : .05,
							strokeWidth: 1 / zoom
						}, i))
					}),
					wires.map((wire) => {
						const poly = wirePolyline(wire, parts);
						if (poly.length < 2) return null;
						const active = selected?.kind === "wire" && selected.id === wire.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
							points: poly.map((p) => `${p.x * 20},${p.y * 20}`).join(" "),
							fill: "none",
							className: "stroke-accent",
							strokeWidth: (active ? 2.6 : 1.6) / zoom,
							strokeLinejoin: "miter",
							strokeLinecap: "square",
							opacity: active ? 1 : .92
						}, wire.id);
					}),
					preview.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
						points: preview.map((p) => `${p.x * 20},${p.y * 20}`).join(" "),
						fill: "none",
						className: "stroke-accent",
						strokeWidth: 1.5 / zoom,
						strokeDasharray: `${5 / zoom} ${4 / zoom}`,
						strokeLinejoin: "miter"
					}) : null,
					wires.map((wire) => {
						const poly = wirePolyline(wire, parts);
						if (poly.length < 2) return null;
						const netId = poly.map((p) => graph.pointNet.get(pointKey(p))).find((id) => id && probeColor.has(id));
						const color = netId ? probeColor.get(netId) : void 0;
						if (!color) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
							points: poly.map((p) => `${p.x * 20},${p.y * 20}`).join(" "),
							fill: "none",
							stroke: color,
							strokeWidth: 3.4 / zoom,
							strokeLinejoin: "miter",
							strokeLinecap: "square"
						}, `probe-${wire.id}`);
					}),
					graph.nets.map((net) => {
						const color = probeColor.get(net.id);
						if (!color || net.ground) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [net.pins.map((pin) => {
							const part = parts.find((item) => item.id === pin.partId);
							if (!part) return null;
							const pins = worldPins(part);
							const self = pins.find((item) => item.id === pin.pin);
							if (!self) return null;
							const others = pins.filter((item) => item.id !== pin.pin);
							const cx = others.length ? others.reduce((sum, item) => sum + item.x, 0) / others.length : self.x + 1;
							const cy = others.length ? others.reduce((sum, item) => sum + item.y, 0) / others.length : self.y;
							const len = Math.hypot(cx - self.x, cy - self.y) || 1;
							const x1 = self.x * 20;
							const y1 = self.y * 20;
							const reach = .72 * 20;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1,
								y1,
								x2: x1 + (cx - self.x) / len * reach,
								y2: y1 + (cy - self.y) / len * reach,
								stroke: color,
								strokeWidth: 3.2 / zoom,
								strokeLinecap: "square"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: x1,
								cy: y1,
								r: 4.4 / zoom,
								fill: color
							})] }, `${pin.partId}:${pin.pin}`);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: net.at.x * 20,
							y: net.at.y * 20 - 14 / zoom,
							textAnchor: "middle",
							fontSize: 11 / zoom,
							fontFamily: "JetBrains Mono, ui-monospace, monospace",
							fill: color,
							children: [
								"V(",
								net.id,
								")"
							]
						})] }, `probe-net-${net.id}`);
					}),
					junctions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: p.x * 20,
						cy: p.y * 20,
						r: 3.1 / zoom,
						className: "fill-accent"
					}, `${p.x},${p.y}`)),
					parts.map((part) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartGlyph, {
						part,
						zoom,
						selected: selected?.kind === "part" && selected.id === part.id,
						hovered: hover === part.id,
						showPins: tool === "wire" || tool === "probe" || selected?.kind === "part" && selected.id === part.id || hover === part.id
					}, part.id)),
					placing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
						transform: `translate(${placing.x * 20} ${placing.y * 20}) rotate(${placing.rot})`,
						className: "text-accent",
						opacity: .85,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SymbolShape, {
							type: placing.type,
							strokeWidth: 1.6 / zoom
						})
					}) : null
				]
			})
		}), parts.length === 0 && !placing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 grid place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: "Empty sheet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted",
					children: "Drag a part from the library"
				})]
			})
		}) : null]
	});
}
function PartGlyph({ part, zoom, selected, hovered, showPins }) {
	const pins = worldPins(part);
	const px = pins.map(toPx);
	const cx = px.reduce((s, p) => s + p.x, 0) / px.length;
	const cy = px.reduce((s, p) => s + p.y, 0) / px.length;
	const value = partValueLabel(part.type, part.params);
	const s = 5 / zoom;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		className: selected ? "text-accent" : hovered ? "text-fg" : "text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
				transform: `translate(${part.x * 20} ${part.y * 20}) rotate(${part.rot})`,
				opacity: selected ? 1 : .92,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SymbolShape, {
					type: part.type,
					strokeWidth: (selected ? 1.9 : 1.45) / zoom
				})
			}),
			showPins ? pins.map((pin) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: pin.x * 20 - s / 2,
				y: pin.y * 20 - s / 2,
				width: s,
				height: s,
				className: selected || showPins ? "fill-accent" : "fill-fg"
			}, pin.id)) : null,
			zoom >= .45 && part.type !== "GND" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				className: "pointer-events-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: cx,
					y: cy - 14 / zoom,
					textAnchor: "middle",
					fontSize: 11 / zoom,
					fontFamily: "JetBrains Mono, ui-monospace, monospace",
					className: "fill-fg",
					children: part.id
				}), value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: cx,
					y: cy + 18 / zoom,
					textAnchor: "middle",
					fontSize: 10 / zoom,
					fontFamily: "JetBrains Mono, ui-monospace, monospace",
					className: selected ? "fill-accent" : "fill-muted",
					children: value
				}) : null]
			}) : null
		]
	});
}
function NetlistDrawer() {
	const open = useCircuit((s) => s.netlistOpen);
	const parts = useCircuit((s) => s.parts);
	const wires = useCircuit((s) => s.wires);
	const sim = useCircuit((s) => s.sim);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const text = (0, import_react.useMemo)(() => spiceNetlist(parts, wires, sim), [
		parts,
		wires,
		sim
	]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "absolute inset-y-0 right-0 z-20 flex w-80 max-w-full flex-col border-l border-border bg-surface max-lg:w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex h-11 shrink-0 items-center justify-between border-b border-border px-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm",
				children: "Netlist"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-8 px-2 text-xs text-muted",
					onClick: () => {
						navigator.clipboard?.writeText(text).then(() => {
							setCopied(true);
							window.setTimeout(() => setCopied(false), 1200);
						});
					},
					children: copied ? "Copied" : "Copy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close netlist",
					className: "inline-flex size-8 items-center justify-center",
					onClick: () => useCircuit.getState().toggleNetlist(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "min-h-0 flex-1 overflow-auto p-3 font-mono text-xs leading-5 text-fg",
			children: text
		})]
	});
}
var NAMES = {
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
	GND: "Ground"
};
var SOURCE_FIELDS = {
	DC: [
		{
			key: "dc",
			label: "DC"
		},
		{
			key: "acmag",
			label: "AC mag"
		},
		{
			key: "acphase",
			label: "AC phase"
		}
	],
	AC: [
		{
			key: "dc",
			label: "DC"
		},
		{
			key: "acmag",
			label: "AC mag"
		},
		{
			key: "acphase",
			label: "AC phase"
		}
	],
	SIN: [
		{
			key: "vo",
			label: "Voff"
		},
		{
			key: "va",
			label: "Vamp"
		},
		{
			key: "freq",
			label: "Freq"
		},
		{
			key: "td",
			label: "Td"
		},
		{
			key: "theta",
			label: "Theta"
		},
		{
			key: "phase",
			label: "Phase"
		},
		{
			key: "acmag",
			label: "AC mag"
		},
		{
			key: "acphase",
			label: "AC phase"
		}
	],
	PULSE: [
		{
			key: "v1",
			label: "V1"
		},
		{
			key: "v2",
			label: "V2"
		},
		{
			key: "ptd",
			label: "Td"
		},
		{
			key: "ptr",
			label: "Tr"
		},
		{
			key: "ptf",
			label: "Tf"
		},
		{
			key: "pw",
			label: "Ton"
		},
		{
			key: "per",
			label: "Period"
		}
	]
};
function PropertiesDialog() {
	const editingId = useCircuit((s) => s.editingId);
	const part = useCircuit((s) => s.parts).find((p) => p.id === editingId) ?? null;
	const [draft, setDraft] = (0, import_react.useState)({});
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (part) {
			setDraft({ ...part.params });
			setError("");
		}
	}, [part]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: Boolean(part),
		onOpenChange: (open) => {
			if (!open) useCircuit.getState().closeEdit();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "volta-overlay fixed inset-0 z-50 bg-black/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "volta-pop fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-border bg-surface p-4 outline-none",
			children: part ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					const next = { ...draft };
					if ((part.type === "V" || part.type === "I") && next.src === "SIN" && (next.acmag === "0" || !next.acmag)) next.acmag = next.va || "0";
					const message = validate(part.type, next);
					if (message) {
						setError(message);
						return;
					}
					useCircuit.getState().setPartParams(part.id, next);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-mono text-sm text-accent",
							children: part.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "mt-1 text-sm text-fg",
							children: NAMES[part.type]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
							type: "button",
							className: "inline-flex size-9 items-center justify-center text-muted",
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}),
					part.type === "GND" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "Ground is node 0. It has no parameters."
					}) : null,
					part.type === "R" || part.type === "C" || part.type === "L" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Param, {
							label: part.type === "R" ? "Resistance" : part.type === "C" ? "Capacitance" : "Inductance",
							value: draft.value ?? "",
							onChange: (value) => setDraft((d) => ({
								...d,
								value
							}))
						})
					}) : null,
					part.type === "V" || part.type === "I" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: [
								"DC",
								"SIN",
								"PULSE",
								"AC"
							].map((src) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDraft((d) => ({
									...d,
									src
								})),
								className: cn("h-8 border border-border px-3 font-mono text-xs", (draft.src ?? "DC") === src ? "border-accent text-accent" : "text-muted"),
								children: src
							}, src))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-2 gap-3",
							children: (SOURCE_FIELDS[draft.src ?? "DC"] ?? SOURCE_FIELDS.DC).map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Param, {
								label: field.label,
								value: draft[field.key] ?? "",
								onChange: (value) => setDraft((d) => ({
									...d,
									[field.key]: value
								}))
							}, field.key))
						})]
					}) : null,
					part.type === "D" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Param, {
							label: "Is",
							value: draft.is ?? "",
							onChange: (is) => setDraft((d) => ({
								...d,
								is
							}))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Param, {
							label: "N",
							value: draft.n ?? "",
							onChange: (n) => setDraft((d) => ({
								...d,
								n
							}))
						})]
					}) : null,
					part.type === "QNPN" || part.type === "QPNP" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Param, {
								label: "Bf",
								value: draft.bf ?? "",
								onChange: (bf) => setDraft((d) => ({
									...d,
									bf
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Param, {
								label: "Is",
								value: draft.is ?? "",
								onChange: (is) => setDraft((d) => ({
									...d,
									is
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Param, {
								label: "Vaf",
								value: draft.vaf ?? "",
								onChange: (vaf) => setDraft((d) => ({
									...d,
									vaf
								}))
							})
						]
					}) : null,
					part.type === "MN" || part.type === "MP" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Param, {
								label: "Vto",
								value: draft.vto ?? "",
								onChange: (vto) => setDraft((d) => ({
									...d,
									vto
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Param, {
								label: "Kp",
								value: draft.kp ?? "",
								onChange: (kp) => setDraft((d) => ({
									...d,
									kp
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Param, {
								label: "W",
								value: draft.w ?? "",
								onChange: (w) => setDraft((d) => ({
									...d,
									w
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Param, {
								label: "L",
								value: draft.l ?? "",
								onChange: (l) => setDraft((d) => ({
									...d,
									l
								}))
							})
						]
					}) : null,
					part.type === "QNPN" || part.type === "QPNP" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: "Written into the SPICE netlist. The numeric engine leaves BJTs open."
					}) : null,
					part.type === "MN" || part.type === "MP" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: "Switch-level model. Drain to source conducts once Vgs crosses Vto."
					}) : null,
					part.type === "D" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: "Shockley diode, solved with Newton-Raphson."
					}) : null,
					part.type !== "GND" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: "Suffixes: k, Meg, m, u, n, p."
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-10 px-3 text-sm text-danger",
							onClick: () => useCircuit.getState().deleteSelected(),
							children: "Delete"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
								type: "button",
								className: "h-10 border border-border px-3 text-sm",
								children: "Cancel"
							}), part.type === "GND" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "h-10 bg-accent px-3 text-sm font-medium text-bg",
								children: "Apply"
							})]
						})]
					})
				]
			}) : null
		})] })
	});
}
function Param({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "h-10 w-full border border-border bg-bg px-2 font-mono text-sm text-fg outline-none",
			autoComplete: "off"
		})]
	});
}
function validate(type, params) {
	const keys = type === "R" || type === "C" || type === "L" ? ["value"] : type === "D" ? ["is", "n"] : type === "QNPN" || type === "QPNP" ? [
		"bf",
		"is",
		"vaf"
	] : type === "MN" || type === "MP" ? [
		"vto",
		"kp",
		"w",
		"l"
	] : type === "V" || type === "I" ? (SOURCE_FIELDS[params.src ?? "DC"] ?? []).map((f) => f.key) : [];
	for (const key of keys) try {
		const n = parseSpiceNumber(params[key] ?? "");
		if ((type === "R" || type === "C" || type === "L" || key === "is" || key === "n") && !(n > 0)) return `${key} must be positive`;
	} catch (err) {
		return err instanceof Error ? err.message : "Bad value";
	}
	return "";
}
var KIND = {
	tran: "Transient",
	ac: "AC analysis",
	dc: "DC sweep"
};
function ResultsPanel() {
	const result = useCircuit((s) => s.result);
	const show = useCircuit((s) => s.showResults);
	const revision = useCircuit((s) => s.revision);
	const resultRev = useCircuit((s) => s.resultRev);
	const probes = useCircuit((s) => s.probes);
	const [mode, setMode] = (0, import_react.useState)("mag");
	if (!show || !result) return null;
	const stale = resultRev !== revision;
	const rows = mode === "phase" && result.phaseRows ? result.phaseRows : result.rows;
	const yLabel = mode === "phase" ? "Phase (deg)" : result.yLabel;
	const shown = probes.flatMap((id, i) => {
		const series = result.series.find((item) => item.key === id);
		if (!series) return [];
		return [{
			...series,
			label: `V(${series.key})`,
			color: TRACE_COLORS[i % TRACE_COLORS.length]
		}];
	});
	const chips = result.op.filter((row) => probes.includes(row.name) || row.name.startsWith("I("));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("flex shrink-0 flex-col border-t border-border bg-surface", result.error ? "min-h-24" : "h-56 max-lg:h-44"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex h-9 shrink-0 items-center gap-3 px-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm",
					children: KIND[result.kind] ?? "Result"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs text-muted",
					children: result.error ? "failed" : shown.length ? `${yLabel} · ${shown.length} ${shown.length === 1 ? "trace" : "traces"} · ${result.rows.length} pts${result.elapsedMs > 0 ? ` · ${Math.round(result.elapsedMs)} ms` : ""}` : "no probes"
				}),
				stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "out of date"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [
						probes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-7 px-2 text-xs text-muted",
							onClick: () => useCircuit.getState().clearProbes(),
							children: "Clear traces"
						}) : null,
						result.phaseRows && !result.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("h-7 px-2 text-xs", mode === "mag" ? "bg-elevated text-fg" : "text-muted"),
								onClick: () => setMode("mag"),
								children: "Magnitude"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("h-7 px-2 text-xs", mode === "phase" ? "bg-elevated text-fg" : "text-muted"),
								onClick: () => setMode("phase"),
								children: "Phase"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Hide plot",
							className: "inline-flex size-8 items-center justify-center text-muted",
							onClick: () => useCircuit.getState().toggleResults(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})
					]
				})
			]
		}), result.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-3 pb-3 text-sm text-danger",
			children: result.error
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto px-3 pb-2",
				children: chips.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					title: row.detail,
					className: "shrink-0 border border-border px-2 py-1 font-mono text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: row.name.startsWith("I(") ? row.name : `V(${row.name})`
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: row.value
						})
					]
				}, row.name))
			}),
			result.notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-3 pb-1 text-xs text-muted",
				children: note
			}, note)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 px-2 pb-2",
				children: shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-full place-items-center text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Probe a pin or wire to plot its voltage."
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: rows,
						margin: {
							top: 8,
							right: 12,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-border)",
								strokeDasharray: "0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "x",
								type: "number",
								scale: result.kind === "ac" ? "log" : "linear",
								domain: ["dataMin", "dataMax"],
								tickCount: 6,
								tickFormatter: formatTick,
								stroke: "var(--color-muted)",
								tick: {
									fill: "var(--color-muted)",
									fontSize: 11,
									fontFamily: "JetBrains Mono, ui-monospace, monospace"
								},
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tickFormatter: formatTick,
								stroke: "var(--color-muted)",
								tick: {
									fill: "var(--color-muted)",
									fontSize: 11,
									fontFamily: "JetBrains Mono, ui-monospace, monospace"
								},
								tickLine: false,
								axisLine: false,
								width: 52
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopeTip, {}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								wrapperStyle: {
									fontFamily: "JetBrains Mono, ui-monospace, monospace",
									fontSize: 11
								},
								onClick: (entry) => {
									const key = String(entry.dataKey ?? "");
									if (key) useCircuit.getState().toggleProbe(key);
								}
							}),
							shown.map((series) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "linear",
								dataKey: series.key,
								name: series.label,
								stroke: series.color,
								strokeWidth: 1.75,
								dot: false,
								isAnimationActive: false
							}, series.key))
						]
					})
				})
			})
		] })]
	});
}
function ScopeTip({ active, payload, label }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-border bg-bg px-2 py-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono text-xs text-muted",
			children: formatTick(Number(label))
		}), payload.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "font-mono text-xs",
			style: { color: item.color },
			children: [
				String(item.dataKey),
				" ",
				formatTick(Number(item.value))
			]
		}, String(item.dataKey)))]
	});
}
function Sidebar() {
	const open = useCircuit((s) => s.sidebarOpen);
	const [armed, setArmed] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [groups, setGroups] = (0, import_react.useState)({
		passives: true,
		sources: true,
		semiconductors: true
	});
	(0, import_react.useLayoutEffect)(() => {
		if (window.matchMedia("(max-width: 1023px)").matches) useCircuit.getState().setSidebar(false);
		setArmed(true);
	}, []);
	const q = query.trim().toLowerCase();
	const filtered = CATALOG.map((group) => ({
		...group,
		items: group.items.filter((item) => !q || item.name.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q) || item.keys.some((key) => key.includes(q)))
	})).filter((group) => group.items.length > 0);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("z-20 flex w-64 shrink-0 flex-col border-r border-border bg-surface max-lg:absolute max-lg:inset-y-0 max-lg:left-0", !armed && "max-lg:hidden"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex h-10 items-center gap-2 border border-border bg-bg px-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "size-4 text-muted",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search parts",
						className: "h-full w-full bg-transparent text-sm text-fg outline-none placeholder:text-subtle",
						"aria-label": "Search parts"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 py-6 text-sm text-muted",
					children: "No parts match."
				}) : filtered.map((group) => {
					const expanded = q ? true : groups[group.id] !== false;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex h-11 w-full items-center justify-between px-3 text-left text-sm text-muted",
							"aria-expanded": expanded,
							onClick: () => setGroups((prev) => ({
								...prev,
								[group.id]: !expanded
							})),
							children: [group.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 transition-transform duration-150", expanded ? "rotate-0" : "-rotate-90") })]
						}), expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "pb-2",
							children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								draggable: false,
								title: "Drag onto the sheet",
								onPointerDown: (e) => beginPlace(e, item.type),
								className: "flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-elevated",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-11 w-12 shrink-0 place-items-center border border-border bg-bg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniSymbol, { type: item.type })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm text-fg",
										children: item.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate font-mono text-xs text-muted",
										children: item.hint
									})]
								})]
							}) }, item.type))
						}) : null]
					}, group.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-t border-border px-3 py-3 text-xs text-muted",
				children: "Drag a part onto the grid. Right-click it to edit."
			})
		]
	});
}
function beginPlace(e, type) {
	if (e.button !== 0) return;
	e.preventDefault();
	const move = (ev) => {
		const grid = clientToGrid(ev.clientX, ev.clientY);
		if (!grid) {
			useCircuit.setState({ placing: null });
			return;
		}
		const current = useCircuit.getState().placing;
		useCircuit.setState({ placing: {
			type,
			x: grid.x,
			y: grid.y,
			rot: current?.type === type ? current.rot : 0
		} });
	};
	const up = (ev) => {
		window.removeEventListener("pointermove", move);
		window.removeEventListener("pointerup", up);
		const grid = clientToGrid(ev.clientX, ev.clientY);
		const placing = useCircuit.getState().placing;
		useCircuit.setState({ placing: null });
		if (grid && placing) useCircuit.getState().place(placing.type, grid.x, grid.y, placing.rot);
	};
	window.addEventListener("pointermove", move);
	window.addEventListener("pointerup", up);
}
var TOOLS = [
	{
		id: "select",
		label: "Select",
		key: "V",
		icon: MousePointer2
	},
	{
		id: "wire",
		label: "Wire",
		key: "W",
		icon: Spline
	},
	{
		id: "probe",
		label: "Probe",
		key: "P",
		icon: Crosshair
	},
	{
		id: "pan",
		label: "Pan",
		key: "H",
		icon: Hand
	}
];
function Toolbar() {
	const tool = useCircuit((s) => s.tool);
	const sim = useCircuit((s) => s.sim);
	const parts = useCircuit((s) => s.parts);
	const selected = useCircuit((s) => s.selected);
	const zoom = useCircuit((s) => s.zoom);
	const netlistOpen = useCircuit((s) => s.netlistOpen);
	const selectedPart = selected?.kind === "part" ? parts.find((p) => p.id === selected.id) : null;
	const exampleRef = (0, import_react.useRef)(null);
	const sources = parts.filter((p) => p.type === "V" || p.type === "I");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "shrink-0 border-b border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-14 items-center gap-1 overflow-x-auto px-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex size-11 shrink-0 items-center justify-center text-fg",
					"aria-label": "Toggle library",
					onClick: () => useCircuit.getState().toggleSidebar(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mr-2 flex shrink-0 items-center gap-2 pr-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircuitBoard, {
						className: "size-4 text-accent",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium tracking-tight",
						children: "VOLTA"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex shrink-0 items-center gap-1 border-l border-border pl-2",
					children: TOOLS.map((item) => {
						const Icon = item.icon;
						const active = tool === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: `${item.label} (${item.key})`,
							"aria-label": item.label,
							"aria-pressed": active,
							onClick: () => useCircuit.getState().setTool(item.id),
							className: cn("inline-flex size-11 items-center justify-center border border-transparent text-fg", active && "border-border bg-elevated text-accent"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
						}, item.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-1 border-l border-border pl-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Rotate",
							disabled: !selectedPart,
							onClick: () => useCircuit.getState().rotateSelected(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Delete",
							disabled: !selected,
							onClick: () => useCircuit.getState().deleteSelected(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						}),
						selectedPart ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 shrink-0 border border-border px-3 text-sm",
							onClick: () => useCircuit.getState().openEdit(selectedPart.id),
							children: "Edit"
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-1 border-l border-border pl-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Zoom out",
							onClick: () => useCircuit.getState().zoomAt(viewRef.width / 2, viewRef.height / 2, 1 / 1.15),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "w-12 text-center font-mono text-xs text-muted",
							children: [Math.round(zoom * 100), "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Zoom in",
							onClick: () => useCircuit.getState().zoomAt(viewRef.width / 2, viewRef.height / 2, 1.15),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Fit",
							onClick: () => useCircuit.getState().fit(viewRef.width, viewRef.height),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Expand, { className: "size-4" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex shrink-0 items-center gap-1 pl-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": netlistOpen,
							onClick: () => useCircuit.getState().toggleNetlist(),
							className: cn("inline-flex h-11 items-center gap-2 border border-transparent px-3 text-sm", netlistOpen && "border-border bg-elevated text-accent"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), "Netlist"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Shortcuts",
							className: "inline-flex size-11 items-center justify-center",
							onClick: () => useCircuit.getState().toggleHelp(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "inline-flex h-9 items-center border border-border px-3 text-sm",
							children: "Sign in"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) })
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-12 items-center gap-2 overflow-x-auto border-t border-border px-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					ref: exampleRef,
					"aria-label": "Load example",
					defaultValue: "",
					className: "h-8 shrink-0 border border-border bg-bg px-2 text-sm text-fg",
					onChange: (e) => {
						const id = e.target.value;
						if (!id) return;
						if (EXAMPLES.some((ex) => ex.id === id)) useCircuit.getState().loadExample(id);
						e.target.value = "";
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Examples"
					}), EXAMPLES.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: ex.id,
						children: ex.name
					}, ex.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudControls, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					"aria-label": "Simulation type",
					value: sim.analysis,
					className: "h-8 shrink-0 border border-border bg-bg px-2 text-sm text-fg",
					onChange: (e) => {
						const analysis = e.target.value;
						if (analysis === "tran" || analysis === "ac" || analysis === "dc") useCircuit.getState().setSim({ analysis });
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "tran",
							children: "Transient (.tran)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ac",
							children: "AC Analysis (.ac)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "dc",
							children: "DC Sweep (.dc)"
						})
					]
				}),
				sim.analysis === "tran" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tstep",
					value: sim.tstep,
					onChange: (tstep) => useCircuit.getState().setSim({ tstep })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tstop",
					value: sim.tstop,
					onChange: (tstop) => useCircuit.getState().setSim({ tstop })
				})] }) : null,
				sim.analysis === "ac" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "AC sweep",
						value: sim.acType,
						className: "h-8 shrink-0 border border-border bg-bg px-2 text-sm text-fg",
						onChange: (e) => {
							const acType = e.target.value;
							if (acType === "dec" || acType === "oct" || acType === "lin") useCircuit.getState().setSim({ acType });
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "dec",
								children: "DEC"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "oct",
								children: "OCT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "lin",
								children: "LIN"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Pts",
						value: sim.acPts,
						onChange: (acPts) => useCircuit.getState().setSim({ acPts })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Fstart",
						value: sim.fstart,
						onChange: (fstart) => useCircuit.getState().setSim({ fstart })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Fstop",
						value: sim.fstop,
						onChange: (fstop) => useCircuit.getState().setSim({ fstop })
					})
				] }) : null,
				sim.analysis === "dc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex shrink-0 items-center gap-2 text-xs text-muted",
						children: ["Source", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							"aria-label": "Sweep source",
							value: sources.some((s) => s.id === sim.dcSource) ? sim.dcSource : sources[0]?.id ?? "",
							className: "h-8 border border-border bg-bg px-2 font-mono text-xs text-fg",
							onChange: (e) => useCircuit.getState().setSim({ dcSource: e.target.value }),
							children: [sources.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "None"
							}) : null, sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s.id,
								children: s.id
							}, s.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Start",
						value: sim.dcStart,
						onChange: (dcStart) => useCircuit.getState().setSim({ dcStart })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Stop",
						value: sim.dcStop,
						onChange: (dcStop) => useCircuit.getState().setSim({ dcStop })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Step",
						value: sim.dcStep,
						onChange: (dcStep) => useCircuit.getState().setSim({ dcStep })
					})
				] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => useCircuit.getState().run(),
					className: "ml-auto inline-flex h-9 shrink-0 items-center gap-2 bg-accent px-3 text-sm font-medium text-bg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Run"]
				})
			]
		})]
	});
}
function IconButton({ label, disabled, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		title: label,
		"aria-label": label,
		disabled,
		onClick,
		className: "inline-flex size-11 items-center justify-center text-fg disabled:opacity-30",
		children
	});
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex shrink-0 items-center gap-2 text-xs text-muted",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "h-8 w-20 border border-border bg-bg px-2 font-mono text-xs text-fg outline-none",
			"aria-label": label
		})]
	});
}
function CloudControls() {
	const sheet = useCircuit((s) => s.sheet);
	const cloudId = useCircuit((s) => s.cloudId);
	const cloudPublic = useCircuit((s) => s.cloudPublic);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)(sheet);
	const [isPublic, setIsPublic] = (0, import_react.useState)(cloudPublic);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function save() {
		const state = useCircuit.getState();
		setBusy(true);
		setError(null);
		try {
			const saved = await saveCircuit({ data: {
				id: state.cloudId ?? void 0,
				name,
				parts: state.parts,
				wires: state.wires,
				sim: state.sim,
				isPublic
			} });
			useCircuit.getState().setCloud(saved.id, saved.name, saved.isPublic);
			setOpen(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Save failed");
		} finally {
			setBusy(false);
		}
	}
	async function togglePublic() {
		const state = useCircuit.getState();
		if (!state.cloudId) {
			setName(state.sheet);
			setIsPublic(true);
			setOpen(true);
			return;
		}
		setBusy(true);
		try {
			const next = !state.cloudPublic;
			const saved = await setCircuitPublic({ data: {
				id: state.cloudId,
				isPublic: next
			} });
			useCircuit.getState().setCloud(saved.id, state.sheet, saved.isPublic);
		} catch (err) {
			useCircuit.getState().setNotice(err instanceof Error ? err.message : "Could not update sharing");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/explore",
			className: "inline-flex h-8 shrink-0 items-center gap-1 border border-border px-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-3.5" }), "Explore"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SignedIn, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "inline-flex h-8 shrink-0 items-center gap-1 border border-border px-2 text-sm",
			onClick: () => {
				const state = useCircuit.getState();
				setName(state.sheet);
				setIsPublic(state.cloudPublic);
				setError(null);
				setOpen(true);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-3.5" }), cloudId ? "Update" : "Save"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			disabled: busy,
			className: "inline-flex h-8 shrink-0 items-center border border-border px-2 text-sm disabled:opacity-50",
			onClick: () => void togglePublic(),
			children: cloudPublic ? "Make private" : "Make public"
		})] }),
		open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-black/70 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "w-full max-w-sm border border-border bg-surface p-4",
				onSubmit: (e) => {
					e.preventDefault();
					save();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Save to your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-xs text-muted",
						children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "mt-1 h-10 w-full border border-border bg-bg px-2 text-sm text-fg outline-none",
							"aria-label": "Circuit name"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: isPublic,
							onChange: (e) => setIsPublic(e.target.checked)
						}), "Public — anyone can load it from Explore"]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-10 border border-border px-3 text-sm",
							onClick: () => setOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy,
							className: "h-10 bg-accent px-3 text-sm font-medium text-bg disabled:opacity-50",
							children: busy ? "Saving…" : "Save"
						})]
					})
				]
			})
		}) : null
	] });
}
var SHORTCUTS = [
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
	["Space", "Pan while held"]
];
function typing(target) {
	const tag = target instanceof HTMLElement ? target.tagName : "";
	return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}
function VoltaApp({ circuitId, mine }) {
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const persist = () => {
			let last = "";
			return useCircuit.subscribe((state) => {
				const payload = {
					v: 1,
					parts: state.parts,
					wires: state.wires,
					sim: state.sim,
					panX: state.panX,
					panY: state.panY,
					zoom: state.zoom,
					sheet: state.sheet,
					cloudId: state.cloudId,
					cloudPublic: state.cloudPublic
				};
				const text = JSON.stringify(payload);
				if (text === last) return;
				last = text;
				localStorage.setItem(STORAGE_KEY, text);
			});
		};
		if (circuitId) {
			(mine ? loadMine({ data: { id: circuitId } }) : loadPublic({ data: { id: circuitId } })).then((row) => {
				if (cancelled) return;
				useCircuit.getState().applyRemote(row);
				const canvas = document.querySelector("[data-canvas]");
				if (canvas) {
					const rect = canvas.getBoundingClientRect();
					useCircuit.getState().fit(rect.width, rect.height);
				}
			}).catch(() => {
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
				const data = JSON.parse(raw);
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
		if (window.matchMedia("(max-width: 1023px)").matches) useCircuit.getState().setSidebar(false);
		const unsub = persist();
		return () => {
			cancelled = true;
			unsub();
		};
	}, [circuitId, mine]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
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
			if (e.key === "?" || e.shiftKey && e.key === "/") {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toolbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-h-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-1 flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CanvasView, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsPanel, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetlistDrawer, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertiesDialog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelpDialog, {})
		]
	});
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
	const hint = tool === "wire" ? "Click a pin, then another. Click the grid to drop a corner." : tool === "probe" ? "Click a pin or wire to plot its voltage. Click again to remove it." : tool === "pan" ? "Drag to pan. Scroll to zoom." : "Drag a part. Right-click it to edit the SPICE value.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "flex h-8 shrink-0 items-center gap-4 overflow-x-auto border-t border-border bg-bg px-3 font-mono text-xs text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 text-fg",
				children: sheet
			}),
			cloudId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 text-accent",
				children: cloudPublic ? "public" : "private"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "shrink-0",
				children: [
					"X ",
					cursor ? cursor.x : "–",
					"\xA0\xA0Y ",
					cursor ? cursor.y : "–"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "shrink-0",
				children: [Math.round(zoom * 100), "%"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "shrink-0",
				children: [
					parts.length,
					" ",
					parts.length === 1 ? "part" : "parts",
					" · ",
					wires.length,
					" ",
					wires.length === 1 ? "wire" : "wires",
					" · ",
					nets,
					" ",
					nets === 1 ? "net" : "nets"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 text-subtle",
				children: notice ?? hint
			})
		]
	});
}
function HelpDialog() {
	const open = useCircuit((s) => s.helpOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => {
			if (!next && useCircuit.getState().helpOpen) useCircuit.getState().toggleHelp();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "volta-overlay fixed inset-0 z-50 bg-black/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "volta-pop fixed top-1/2 left-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-border bg-surface p-4 outline-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-sm font-medium",
						children: "Shortcuts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
						className: "inline-flex size-9 items-center justify-center text-muted",
						"aria-label": "Close shortcuts",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "sr-only",
					children: "Keyboard shortcuts for the schematic editor."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-4 grid grid-cols-[8rem_1fr] gap-y-2 text-sm",
					children: SHORTCUTS.map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "contents",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "font-mono text-xs text-accent",
							children: key
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-muted",
							children: label
						})]
					}, key))
				})
			]
		})] })
	});
}
function Home() {
	const { circuit, mine } = Route$3.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoltaApp, {
		circuitId: circuit || void 0,
		mine: mine === "1"
	});
}
//#endregion
export { Home as component };
