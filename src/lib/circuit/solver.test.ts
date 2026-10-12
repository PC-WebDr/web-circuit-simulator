import assert from "node:assert/strict";
import test from "node:test";
import { getExample } from "./examples.ts";
import { simulate } from "./solver.ts";
import { parseSpiceNumber } from "./units.ts";
import type { Part, SimConfig } from "./types.ts";

test("spice suffixes", () => {
  const near = (input: string, expected: number) => {
    assert.ok(Math.abs(parseSpiceNumber(input) - expected) / expected < 1e-9, input);
  };
  near("1k", 1000);
  near("4.7k", 4700);
  near("1Meg", 1e6);
  near("1m", 1e-3);
  near("10u", 1e-5);
  near("100n", 1e-7);
  near("1e-14", 1e-14);
  near("2kΩ", 2000);
});

test("voltage divider is 2/3", () => {
  const ex = getExample("divider");
  const out = simulate(ex.parts, ex.wires, { ...ex.sim, analysis: "tran", tstep: "1m", tstop: "1m" });
  assert.equal(out.error, undefined);
  const last = out.rows[out.rows.length - 1]!;
  const v1 = Object.entries(last).find(([k, v]) => k !== "x" && Math.abs(v - 10) < 1e-6);
  const v2 = Object.entries(last).find(([k, v]) => k !== "x" && Math.abs(v - 20 / 3) < 1e-4);
  assert.ok(v1, `expected a 10 V node, got ${JSON.stringify(last)}`);
  assert.ok(v2, `expected 6.666 V, got ${JSON.stringify(last)}`);
});

test("RC backward Euler matches one step", () => {
  const v: Part = {
    id: "V1",
    type: "V",
    x: 0,
    y: 0,
    rot: 0,
    params: {
      src: "PULSE",
      dc: "0",
      acmag: "0",
      acphase: "0",
      vo: "0",
      va: "0",
      freq: "0",
      td: "0",
      theta: "0",
      phase: "0",
      v1: "0",
      v2: "5",
      ptd: "0",
      ptr: "0",
      ptf: "0",
      pw: "1",
      per: "2",
    },
  };
  const r: Part = { id: "R1", type: "R", x: 4, y: 0, rot: 0, params: { value: "1k" } };
  const c: Part = { id: "C1", type: "C", x: 8, y: 0, rot: 90, params: { value: "1u" } };
  const g1: Part = { id: "GND1", type: "GND", x: 0, y: 0, rot: 0, params: {} };
  const g2: Part = { id: "GND2", type: "GND", x: 8, y: 4, rot: 0, params: {} };
  const sim: SimConfig = {
    analysis: "tran",
    tstep: "100u",
    tstop: "100u",
    acType: "dec",
    acPts: "10",
    fstart: "10",
    fstop: "1k",
    dcSource: "V1",
    dcStart: "0",
    dcStop: "1",
    dcStep: "1",
  };
  const out = simulate([v, r, c, g1, g2], [], sim);
  assert.equal(out.error, undefined);
  assert.equal(out.rows[0]!.x, 0);
  const last = out.rows[out.rows.length - 1]!;
  const values = Object.entries(last)
    .filter(([k]) => k !== "x")
    .map(([, v]) => v);
  assert.ok(values.some((v) => Math.abs(v - 5) < 1e-6), `source node missing ${JSON.stringify(last)}`);
  assert.ok(
    values.some((v) => Math.abs(v - 0.454545) < 2e-3),
    `BE step missing ${JSON.stringify(last)}`,
  );
});

test("RC low-pass attenuates the sine", () => {
  const ex = getExample("rc");
  const out = simulate(ex.parts, ex.wires, ex.sim);
  assert.equal(out.error, undefined);
  let maxIn = 0;
  let maxOut = 0;
  for (const row of out.rows) {
    const vals = Object.entries(row)
      .filter(([k]) => k !== "x")
      .map(([, v]) => Math.abs(v))
      .sort((a, b) => b - a);
    maxIn = Math.max(maxIn, vals[0] ?? 0);
    maxOut = Math.max(maxOut, vals[1] ?? 0);
  }
  assert.ok(maxIn > 4.5, `input peak ${maxIn}`);
  assert.ok(maxOut > 3 && maxOut < maxIn - 0.2, `output peak ${maxOut} input ${maxIn}`);
});

test("AC low-pass is -3 dB at fc relative to the source", () => {
  const ex = getExample("rc");
  const fc = 1 / (2 * Math.PI * 1e3 * 100e-9);
  const out = simulate(ex.parts, ex.wires, {
    ...ex.sim,
    analysis: "ac",
    acType: "lin",
    acPts: "1",
    fstart: String(fc),
    fstop: String(fc),
  });
  assert.equal(out.error, undefined);
  const row = out.rows[0]!;
  const vals = Object.entries(row)
    .filter(([k]) => k !== "x")
    .map(([, v]) => v)
    .sort((a, b) => b - a);
  assert.ok(Math.abs((vals[1] ?? 0) - (vals[0] ?? 0) + 3.0103) < 0.15, JSON.stringify(row));
});

test("series RLC step overshoots", () => {
  const ex = getExample("rlc");
  const out = simulate(ex.parts, ex.wires, ex.sim);
  assert.equal(out.error, undefined);
  let peak = 0;
  for (const row of out.rows) {
    for (const [k, v] of Object.entries(row)) {
      if (k !== "x") peak = Math.max(peak, v);
    }
  }
  assert.ok(peak > 6, `expected ring above 6 V, peak ${peak}`);
});

test("diode plus resistor forward drop", () => {
  const v: Part = {
    id: "V1",
    type: "V",
    x: 0,
    y: 0,
    rot: 0,
    params: {
      src: "DC",
      dc: "5",
      acmag: "0",
      acphase: "0",
      vo: "0",
      va: "0",
      freq: "1",
      td: "0",
      theta: "0",
      phase: "0",
      v1: "0",
      v2: "0",
      ptd: "0",
      ptr: "1u",
      ptf: "1u",
      pw: "1m",
      per: "2m",
    },
  };
  const r: Part = { id: "R1", type: "R", x: 4, y: 0, rot: 0, params: { value: "1k" } };
  const d: Part = { id: "D1", type: "D", x: 8, y: 0, rot: 0, params: { is: "1e-14", n: "1" } };
  const g1: Part = { id: "GND1", type: "GND", x: 0, y: 0, rot: 0, params: {} };
  const g2: Part = { id: "GND2", type: "GND", x: 12, y: 0, rot: 0, params: {} };
  const sim: SimConfig = {
    analysis: "tran",
    tstep: "1m",
    tstop: "1m",
    acType: "dec",
    acPts: "2",
    fstart: "10",
    fstop: "100",
    dcSource: "V1",
    dcStart: "0",
    dcStop: "5",
    dcStep: "1",
  };
  const out = simulate([v, r, d, g1, g2], [], sim);
  assert.equal(out.error, undefined, out.error);
  const last = out.rows[out.rows.length - 1]!;
  const vals = Object.entries(last)
    .filter(([k]) => k !== "x")
    .map(([, v]) => v);
  assert.ok(vals.some((v) => Math.abs(v - 5) < 1e-3));
  assert.ok(
    vals.some((v) => v > 0.6 && v < 0.8),
    `diode drop not in range ${JSON.stringify(last)}`,
  );
});

test("missing ground is reported", () => {
  const ex = getExample("divider");
  const parts = ex.parts.filter((p) => p.type !== "GND");
  const out = simulate(parts, [], ex.sim);
  assert.match(out.error ?? "", /ground/i);
});

function rowAt(rows: Array<{ x: number } & Record<string, number>>, t: number) {
  return rows.reduce((best, row) => (Math.abs(row.x - t) < Math.abs(best.x - t) ? row : best));
}

test("half-wave rectifier clips the negative half", () => {
  const ex = getExample("diode");
  const out = simulate(ex.parts, ex.wires, ex.sim);
  assert.equal(out.error, undefined, out.error);
  const peak = rowAt(out.rows, 250e-6);
  const peakVals = Object.entries(peak)
    .filter(([k]) => k !== "x")
    .map(([, v]) => v);
  assert.ok(peakVals.some((v) => Math.abs(v - 5) < 0.15), JSON.stringify(peak));
  assert.ok(
    peakVals.some((v) => v > 3.8 && v < 4.8),
    JSON.stringify(peak),
  );
  const neg = rowAt(out.rows, 750e-6);
  const negVals = Object.entries(neg)
    .filter(([k]) => k !== "x")
    .map(([, v]) => v);
  assert.ok(negVals.some((v) => v < -4), JSON.stringify(neg));
  assert.ok(negVals.some((v) => Math.abs(v) < 0.05), JSON.stringify(neg));
});

test("CMOS inverter output swings with the pulse", () => {
  const ex = getExample("cmos");
  const out = simulate(ex.parts, ex.wires, ex.sim);
  assert.equal(out.error, undefined, out.error);
  const lowIn = rowAt(out.rows, 0);
  const highIn = rowAt(out.rows, 1e-3);
  const keys = Object.keys(lowIn).filter((k) => k !== "x");
  const fell = keys.filter((k) => (lowIn[k] ?? 0) > 4.5 && (highIn[k] ?? 0) < 0.3);
  const stayed = keys.filter((k) => (lowIn[k] ?? 0) > 4.5 && (highIn[k] ?? 0) > 4.5);
  const rose = keys.filter((k) => (lowIn[k] ?? 0) < 0.2 && (highIn[k] ?? 0) > 4.5);
  assert.equal(fell.length, 1, JSON.stringify({ lowIn, highIn }));
  assert.ok(stayed.length >= 1, JSON.stringify({ lowIn, highIn }));
  assert.equal(rose.length, 1, JSON.stringify({ lowIn, highIn }));
});
