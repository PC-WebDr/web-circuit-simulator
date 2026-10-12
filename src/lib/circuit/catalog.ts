import type { CompType } from "./types.ts";

export type CatalogItem = {
  type: CompType;
  name: string;
  hint: string;
  keys: string[];
};

export type CatalogGroup = {
  id: string;
  label: string;
  items: CatalogItem[];
};

export const CATALOG: CatalogGroup[] = [
  {
    id: "passives",
    label: "Passives",
    items: [
      { type: "R", name: "Resistor", hint: "R", keys: ["resistor", "r", "ohm"] },
      { type: "C", name: "Capacitor", hint: "C", keys: ["capacitor", "c", "farad"] },
      { type: "L", name: "Inductor", hint: "L", keys: ["inductor", "l", "henry"] },
    ],
  },
  {
    id: "sources",
    label: "Sources",
    items: [
      {
        type: "V",
        name: "Voltage",
        hint: "DC · AC · SIN · PULSE",
        keys: ["voltage", "v", "dc", "ac", "sine", "sin", "pulse"],
      },
      {
        type: "I",
        name: "Current",
        hint: "DC · AC · SIN · PULSE",
        keys: ["current", "i", "source"],
      },
      { type: "GND", name: "Ground", hint: "Node 0", keys: ["ground", "gnd", "0", "earth"] },
    ],
  },
  {
    id: "semiconductors",
    label: "Semiconductors",
    items: [
      { type: "D", name: "Diode", hint: "Shockley", keys: ["diode", "d"] },
      { type: "QNPN", name: "NPN BJT", hint: "Q · NPN", keys: ["npn", "bjt", "q", "transistor"] },
      { type: "QPNP", name: "PNP BJT", hint: "Q · PNP", keys: ["pnp", "bjt", "q", "transistor"] },
      { type: "MN", name: "NMOS", hint: "M · NMOS", keys: ["nmos", "mosfet", "m", "nfet"] },
      { type: "MP", name: "PMOS", hint: "M · PMOS", keys: ["pmos", "mosfet", "m", "pfet"] },
    ],
  },
];

export function idPrefix(type: CompType): string {
  if (type === "QNPN" || type === "QPNP") return "Q";
  if (type === "MN" || type === "MP") return "M";
  if (type === "GND") return "GND";
  return type;
}

export function defaultParams(type: CompType): Record<string, string> {
  switch (type) {
    case "R":
      return { value: "1k" };
    case "C":
      return { value: "1u" };
    case "L":
      return { value: "1m" };
    case "V":
      return {
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
        per: "2m",
      };
    case "I":
      return {
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
        per: "2m",
      };
    case "D":
      return { is: "1e-14", n: "1" };
    case "QNPN":
    case "QPNP":
      return { bf: "100", is: "1e-16", vaf: "100" };
    case "MN":
      return { vto: "1", kp: "200u", w: "10u", l: "1u" };
    case "MP":
      return { vto: "-1", kp: "80u", w: "10u", l: "1u" };
    case "GND":
      return {};
  }
}

export const TRACE_COLORS = ["var(--color-trace)", "var(--color-trace-2)", "var(--color-trace-3)", "var(--color-trace-4)"];

export function partValueLabel(type: CompType, params: Record<string, string>): string {
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

export type FieldDef = { key: string; label: string; placeholder?: string };

export function passiveField(type: CompType): FieldDef | null {
  if (type === "R") return { key: "value", label: "Resistance", placeholder: "1k" };
  if (type === "C") return { key: "value", label: "Capacitance", placeholder: "1u" };
  if (type === "L") return { key: "value", label: "Inductance", placeholder: "1m" };
  return null;
}
