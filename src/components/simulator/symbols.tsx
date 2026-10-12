import type { CompType } from "@/lib/circuit/types";
import { GRID } from "@/lib/circuit/geometry";

const g = GRID;

function Arrow({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x2 - ux * 8;
  const by = y2 - uy * 8;
  const px = -uy * 4.5;
  const py = ux * 4.5;
  return <polygon points={`${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`} fill="currentColor" />;
}

export function SymbolShape({ type, strokeWidth }: { type: CompType; strokeWidth: number }) {
  const sw = strokeWidth;
  const line = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: sw,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
  };

  if (type === "R") {
    return (
      <path
        {...line}
        d={`M 0 0 H ${0.55 * g} L ${0.9 * g} ${-0.48 * g} L ${1.45 * g} ${0.48 * g} L ${2 * g} ${-0.48 * g} L ${2.55 * g} ${0.48 * g} L ${3.1 * g} ${-0.48 * g} L ${3.45 * g} 0 H ${4 * g}`}
      />
    );
  }
  if (type === "C") {
    return (
      <path
        {...line}
        d={`M 0 0 H ${1.68 * g} M ${1.68 * g} ${-0.82 * g} V ${0.82 * g} M ${2.32 * g} ${-0.82 * g} V ${2.32 * g * 0 + 0.82 * g} M ${2.32 * g} 0 H ${4 * g}`}
      />
    );
  }
  if (type === "L") {
    return (
      <path
        {...line}
        d={`M 0 0 H ${0.4 * g} C ${0.4 * g} ${-0.82 * g} ${1.25 * g} ${-0.82 * g} ${1.25 * g} 0 C ${1.25 * g} ${-0.82 * g} ${2.1 * g} ${-0.82 * g} ${2.1 * g} 0 C ${2.1 * g} ${-0.82 * g} ${2.95 * g} ${-0.82 * g} ${2.95 * g} 0 C ${2.95 * g} ${-0.82 * g} ${3.6 * g} ${-0.82 * g} ${3.6 * g} 0 H ${4 * g}`}
      />
    );
  }
  if (type === "V") {
    return (
      <g>
        <path {...line} d={`M 0 0 H ${1.28 * g} M ${2.72 * g} 0 H ${4 * g}`} />
        <circle {...line} cx={2 * g} cy={0} r={0.72 * g} />
        <path {...line} d={`M ${1.48 * g} 0 H ${1.78 * g} M ${2.22 * g} ${-0.16 * g} H ${2.54 * g} M ${2.38 * g} ${-0.32 * g} V 0`} />
      </g>
    );
  }
  if (type === "I") {
    return (
      <g>
        <path {...line} d={`M 0 0 H ${1.28 * g} M ${2.72 * g} 0 H ${4 * g} M ${1.45 * g} 0 H ${2.35 * g}`} />
        <circle {...line} cx={2 * g} cy={0} r={0.72 * g} />
        <Arrow x1={1.7 * g} y1={0} x2={2.5 * g} y2={0} />
      </g>
    );
  }
  if (type === "D") {
    return (
      <g>
        <path {...line} d={`M 0 0 H ${1.5 * g} M ${2.55 * g} 0 H ${4 * g} M ${2.55 * g} ${-0.72 * g} V ${0.72 * g}`} />
        <polygon points={`${1.5 * g},${-0.72 * g} ${2.55 * g},0 ${1.5 * g},${0.72 * g}`} fill="currentColor" />
      </g>
    );
  }
  if (type === "GND") {
    return (
      <path
        {...line}
        d={`M 0 0 V ${0.5 * g} M ${-0.72 * g} ${0.5 * g} H ${0.72 * g} M ${-0.46 * g} ${0.86 * g} H ${0.46 * g} M ${-0.22 * g} ${1.2 * g} H ${0.22 * g}`}
      />
    );
  }
  if (type === "QNPN" || type === "QPNP") {
    const tipX = type === "QNPN" ? 2.55 * g : 2.05 * g;
    const tipY = type === "QNPN" ? 3.48 * g : 3.15 * g;
    const tailX = type === "QNPN" ? 1.9 * g : 2.55 * g;
    const tailY = type === "QNPN" ? 3.05 * g : 3.5 * g;
    return (
      <g>
        <path
          {...line}
          d={`M 0 ${2 * g} H ${1.5 * g} M ${1.5 * g} ${0.7 * g} V ${3.3 * g} M ${1.5 * g} ${1.15 * g} L ${3.05 * g} 0 H ${4 * g} M ${1.5 * g} ${2.85 * g} L ${3.15 * g} ${4 * g} H ${4 * g}`}
        />
        <Arrow x1={tailX} y1={tailY} x2={tipX} y2={tipY} />
      </g>
    );
  }

  const pmos = type === "MP";
  return (
    <g>
      <path
        {...line}
        d={`M 0 ${2 * g} H ${pmos ? 0.95 * g : 1.2 * g} M ${1.2 * g} ${0.75 * g} V ${3.25 * g} M ${1.62 * g} ${0.85 * g} V ${1.55 * g} M ${1.62 * g} ${2.45 * g} V ${3.15 * g} M ${1.62 * g} ${1.15 * g} L ${3.05 * g} 0 H ${4 * g} M ${1.62 * g} ${2.85 * g} L ${3.15 * g} ${4 * g} H ${4 * g}`}
      />
      {pmos ? <circle {...line} cx={1.08 * g} cy={2 * g} r={0.16 * g} /> : null}
      <Arrow
        x1={pmos ? 2.15 * g : 1.85 * g}
        y1={pmos ? 3.35 * g : 3.15 * g}
        x2={pmos ? 1.85 * g : 2.35 * g}
        y2={pmos ? 3.15 * g : 3.5 * g}
      />
    </g>
  );
}

export function MiniSymbol({ type }: { type: CompType }) {
  const transistor = type === "QNPN" || type === "QPNP" || type === "MN" || type === "MP";
  const box = type === "GND" ? "-18 -2 36 32" : transistor ? "-2 -2 84 84" : "-2 -18 84 36";
  return (
    <svg viewBox={box} className={transistor || type === "GND" ? "h-8 w-8" : "h-6 w-10"} aria-hidden="true">
      <g className="text-fg">
        <SymbolShape type={type} strokeWidth={1.7} />
      </g>
    </svg>
  );
}
