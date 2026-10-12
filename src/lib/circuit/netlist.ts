import { extractNets, pinKey } from "./nets.ts";
import type { Part, SimConfig, Wire } from "./types.ts";

function nodeOf(map: Map<string, string>, partId: string, pin: string): string {
  return map.get(pinKey(partId, pin)) ?? "?";
}

function sourceCard(part: Part): string {
  const p = part.params;
  const src = p.src ?? "DC";
  if (src === "SIN") {
    return `DC ${p.vo ?? "0"} SIN(${p.vo ?? "0"} ${p.va ?? "0"} ${p.freq ?? "0"} ${p.td ?? "0"} ${p.theta ?? "0"} ${p.phase ?? "0"}) AC ${p.acmag ?? "0"} ${p.acphase ?? "0"}`;
  }
  if (src === "PULSE") {
    return `DC ${p.v1 ?? "0"} PULSE(${p.v1 ?? "0"} ${p.v2 ?? "0"} ${p.ptd ?? "0"} ${p.ptr ?? "0"} ${p.ptf ?? "0"} ${p.pw ?? "0"} ${p.per ?? "0"})`;
  }
  if (src === "AC") return `DC ${p.dc ?? "0"} AC ${p.acmag ?? "0"} ${p.acphase ?? "0"}`;
  return `DC ${p.dc ?? "0"}`;
}

function analysisCard(sim: SimConfig): string {
  if (sim.analysis === "tran") return `.tran ${sim.tstep} ${sim.tstop}`;
  if (sim.analysis === "ac") return `.ac ${sim.acType} ${sim.acPts} ${sim.fstart} ${sim.fstop}`;
  return `.dc ${sim.dcSource || "V1"} ${sim.dcStart} ${sim.dcStop} ${sim.dcStep}`;
}

export function spiceNetlist(parts: Part[], wires: Wire[], sim: SimConfig): string {
  const { pinNet, nets } = extractNets(parts, wires);
  const lines: string[] = ["* VOLTA schematic"];
  if (!nets.some((n) => n.ground)) lines.push("* warning: no ground — node 0 is missing");
  lines.push("");

  const devices = [...parts].filter((p) => p.type !== "GND").sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
  const models: string[] = [];

  for (const part of devices) {
    const p = part.params;
    if (part.type === "R" || part.type === "C" || part.type === "L") {
      lines.push(`${part.id} ${nodeOf(pinNet, part.id, "1")} ${nodeOf(pinNet, part.id, "2")} ${p.value ?? "1"}`);
    } else if (part.type === "V") {
      lines.push(`${part.id} ${nodeOf(pinNet, part.id, "p")} ${nodeOf(pinNet, part.id, "n")} ${sourceCard(part)}`);
    } else if (part.type === "I") {
      lines.push(`${part.id} ${nodeOf(pinNet, part.id, "p")} ${nodeOf(pinNet, part.id, "n")} ${sourceCard(part)}`);
    } else if (part.type === "D") {
      const model = `D_${part.id}`;
      lines.push(`${part.id} ${nodeOf(pinNet, part.id, "A")} ${nodeOf(pinNet, part.id, "K")} ${model}`);
      models.push(`.model ${model} D(Is=${p.is ?? "1e-14"} N=${p.n ?? "1"})`);
    } else if (part.type === "QNPN" || part.type === "QPNP") {
      const model = `Q_${part.id}`;
      const kind = part.type === "QNPN" ? "NPN" : "PNP";
      lines.push(
        `${part.id} ${nodeOf(pinNet, part.id, "C")} ${nodeOf(pinNet, part.id, "B")} ${nodeOf(pinNet, part.id, "E")} ${model}`,
      );
      models.push(`.model ${model} ${kind}(Bf=${p.bf ?? "100"} Is=${p.is ?? "1e-16"} Vaf=${p.vaf ?? "100"})`);
    } else if (part.type === "MN" || part.type === "MP") {
      const model = `M_${part.id}`;
      const kind = part.type === "MN" ? "NMOS" : "PMOS";
      const s = nodeOf(pinNet, part.id, "S");
      lines.push(
        `${part.id} ${nodeOf(pinNet, part.id, "D")} ${nodeOf(pinNet, part.id, "G")} ${s} ${s} ${model}`,
      );
      models.push(
        `.model ${model} ${kind}(Vto=${p.vto ?? "1"} Kp=${p.kp ?? "200u"} W=${p.w ?? "10u"} L=${p.l ?? "1u"})`,
      );
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
