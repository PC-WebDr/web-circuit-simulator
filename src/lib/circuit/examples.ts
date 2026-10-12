import { defaultParams } from "./catalog.ts";
import type { Part, SimConfig, Wire } from "./types.ts";

export type ExampleId = "diode" | "cmos" | "rc" | "rlc" | "divider" | "blank";

export type Example = {
  id: ExampleId;
  name: string;
  blurb: string;
  parts: Part[];
  wires: Wire[];
  sim: SimConfig;
};

const baseSim = (): SimConfig => ({
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
  dcStep: "0.5",
});

function vParams(over: Record<string, string>): Record<string, string> {
  return { ...defaultParams("V"), ...over };
}

export const EXAMPLES: Example[] = [
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
          acmag: "0",
        }),
      },
      { id: "D1", type: "D", x: 8, y: 6, rot: 0, params: { is: "2.52n", n: "1.75" } },
      { id: "R1", type: "R", x: 12, y: 6, rot: 90, params: { value: "1k" } },
      { id: "GND1", type: "GND", x: 4, y: 6, rot: 0, params: {} },
      { id: "GND2", type: "GND", x: 12, y: 10, rot: 0, params: {} },
    ],
    wires: [],
    sim: { ...baseSim(), analysis: "tran", tstep: "50u", tstop: "3m" },
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
        params: vParams({ src: "DC", dc: "5", acmag: "0" }),
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
          acmag: "0",
        }),
      },
      { id: "MP1", type: "MP", x: 16, y: 6, rot: 180, params: { vto: "-1", kp: "80u", w: "10u", l: "1u" } },
      { id: "MN1", type: "MN", x: 8, y: 8, rot: 0, params: { vto: "1", kp: "200u", w: "10u", l: "1u" } },
      { id: "GND1", type: "GND", x: 8, y: 2, rot: 0, params: {} },
      { id: "GND2", type: "GND", x: 4, y: 10, rot: 0, params: {} },
      { id: "GND3", type: "GND", x: 12, y: 12, rot: 0, params: {} },
    ],
    wires: [
      { id: "W1", points: [{ kind: "xy", x: 12, y: 6 }, { kind: "xy", x: 12, y: 8 }] },
      {
        id: "W2",
        points: [
          { kind: "xy", x: 16, y: 4 },
          { kind: "xy", x: 16, y: 10 },
          { kind: "xy", x: 8, y: 10 },
        ],
      },
    ],
    sim: { ...baseSim(), analysis: "tran", tstep: "20u", tstop: "4m" },
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
          acphase: "0",
        }),
      },
      { id: "R1", type: "R", x: 10, y: 8, rot: 0, params: { value: "1k" } },
      { id: "C1", type: "C", x: 14, y: 8, rot: 90, params: { value: "100n" } },
      { id: "GND1", type: "GND", x: 6, y: 8, rot: 0, params: {} },
      { id: "GND2", type: "GND", x: 14, y: 12, rot: 0, params: {} },
    ],
    wires: [],
    sim: { ...baseSim(), analysis: "tran", tstep: "10u", tstop: "2.25m" },
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
          acmag: "1",
        }),
      },
      { id: "R1", type: "R", x: 8, y: 6, rot: 0, params: { value: "47" } },
      { id: "L1", type: "L", x: 12, y: 6, rot: 0, params: { value: "10m" } },
      { id: "C1", type: "C", x: 16, y: 6, rot: 90, params: { value: "100n" } },
      { id: "GND1", type: "GND", x: 4, y: 6, rot: 0, params: {} },
      { id: "GND2", type: "GND", x: 16, y: 10, rot: 0, params: {} },
    ],
    wires: [],
    sim: { ...baseSim(), analysis: "tran", tstep: "4u", tstop: "2m" },
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
        params: vParams({ src: "DC", dc: "10", acmag: "1" }),
      },
      { id: "R1", type: "R", x: 8, y: 6, rot: 0, params: { value: "1k" } },
      { id: "R2", type: "R", x: 12, y: 6, rot: 90, params: { value: "2k" } },
      { id: "GND1", type: "GND", x: 4, y: 6, rot: 0, params: {} },
      { id: "GND2", type: "GND", x: 12, y: 10, rot: 0, params: {} },
    ],
    wires: [],
    sim: {
      ...baseSim(),
      analysis: "dc",
      dcSource: "V1",
      dcStart: "0",
      dcStop: "10",
      dcStep: "0.5",
    },
  },
  {
    id: "blank",
    name: "Blank sheet",
    blurb: "Empty grid",
    parts: [],
    wires: [],
    sim: baseSim(),
  },
];

export function getExample(id: ExampleId): Example {
  const found = EXAMPLES.find((e) => e.id === id);
  if (!found) throw new Error(`Unknown example ${id}`);
  return {
    ...found,
    parts: structuredClone(found.parts),
    wires: structuredClone(found.wires),
    sim: structuredClone(found.sim),
  };
}
