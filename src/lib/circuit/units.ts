const WORD_SUFFIX: Array<[RegExp, number]> = [
  [/^meg$/i, 1e6],
  [/^t$/i, 1e12],
  [/^g$/i, 1e9],
  [/^k$/i, 1e3],
  [/^m$/i, 1e-3],
  [/^u$|^µ$|^μ$/i, 1e-6],
  [/^n$/i, 1e-9],
  [/^p$/i, 1e-12],
  [/^f$/i, 1e-15],
];

export function parseSpiceNumber(input: string): number {
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
  for (const [re, scale] of WORD_SUFFIX) {
    if (re.test(suf)) return num * scale;
  }
  throw new Error(`Unknown suffix in “${input}”`);
}

function trimNum(n: number): string {
  const abs = Math.abs(n);
  const digits = abs >= 100 ? 1 : abs >= 10 ? 2 : 3;
  return n.toFixed(digits).replace(/\.?0+$/, "");
}

const PREFIX: Record<number, string> = {
  12: "T",
  9: "G",
  6: "M",
  3: "k",
  0: "",
  [-3]: "m",
  [-6]: "µ",
  [-9]: "n",
  [-12]: "p",
  [-15]: "f",
};

export function formatEng(n: number, unit = ""): string {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-18) return unit ? `0 ${unit}` : "0";
  let exp = Math.floor(Math.log10(Math.abs(n)) / 3) * 3;
  if (exp > 12) exp = 12;
  if (exp < -15) exp = -15;
  const p = PREFIX[exp];
  if (p === undefined) {
    const text = n.toExponential(3);
    return unit ? `${text} ${unit}` : text;
  }
  const scaled = n / 10 ** exp;
  const text = trimNum(scaled);
  if (!unit) return `${text}${p}`;
  return p ? `${text} ${p}${unit}` : `${text} ${unit}`;
}

export function formatTick(n: number): string {
  if (!Number.isFinite(n)) return "";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1e4 || abs < 1e-2) return formatEng(n);
  if (abs >= 100) return n.toFixed(0);
  if (abs >= 10) return trimNum(Number(n.toFixed(2)));
  return trimNum(Number(n.toFixed(3)));
}
