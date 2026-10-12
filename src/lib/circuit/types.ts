export type CompType =
  | "R"
  | "C"
  | "L"
  | "V"
  | "I"
  | "D"
  | "QNPN"
  | "QPNP"
  | "MN"
  | "MP"
  | "GND";

export type Rotation = 0 | 90 | 180 | 270;

export type Part = {
  id: string;
  type: CompType;
  x: number;
  y: number;
  rot: Rotation;
  params: Record<string, string>;
};

export type WirePoint =
  | { kind: "pin"; partId: string; pin: string }
  | { kind: "xy"; x: number; y: number };

export type Wire = {
  id: string;
  points: WirePoint[];
};

export type AnalysisKind = "tran" | "ac" | "dc";

export type SimConfig = {
  analysis: AnalysisKind;
  tstep: string;
  tstop: string;
  acType: "dec" | "oct" | "lin";
  acPts: string;
  fstart: string;
  fstop: string;
  dcSource: string;
  dcStart: string;
  dcStop: string;
  dcStep: string;
};

export type OpRow = {
  name: string;
  value: string;
  detail: string;
};

export type TraceSeries = {
  key: string;
  label: string;
};

export type SimOutput = {
  kind: AnalysisKind;
  xLabel: string;
  yLabel: string;
  rows: Array<{ x: number } & Record<string, number>>;
  phaseRows: Array<{ x: number } & Record<string, number>> | null;
  series: TraceSeries[];
  op: OpRow[];
  notes: string[];
  error?: string;
  elapsedMs: number;
};

export type Snap = {
  parts: Part[];
  wires: Wire[];
};
