import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { spiceNetlist } from "@/lib/circuit/netlist";
import type { Part, SimConfig, Wire } from "@/lib/circuit/types";
import { getSql } from "@/lib/db";

export type CircuitCard = {
  id: string;
  name: string;
  isPublic: boolean;
  createdAt: string;
};

export type CloudCircuit = {
  id: string;
  name: string;
  isPublic: boolean;
  parts: Part[];
  wires: Wire[];
  sim: SimConfig;
};

type SaveBody = {
  id?: string;
  name: string;
  parts: Part[];
  wires: Wire[];
  sim: SimConfig;
  isPublic: boolean;
};

const ANALYSIS = new Set(["tran", "ac", "dc"]);

function cleanName(name: unknown): string {
  if (typeof name !== "string") throw new Error("Name the circuit before saving.");
  const trimmed = name.replace(/\s+/g, " ").trim().slice(0, 80);
  if (!trimmed) throw new Error("Name the circuit before saving.");
  return trimmed;
}

function asSheet(parts: unknown, wires: unknown, sim: unknown): { parts: Part[]; wires: Wire[]; sim: SimConfig } {
  if (!Array.isArray(parts) || !Array.isArray(wires) || !sim || typeof sim !== "object") {
    throw new Error("Circuit data is incomplete.");
  }
  if (parts.length > 500 || wires.length > 1000) throw new Error("Circuit is too large to save.");
  const raw = sim as SimConfig;
  if (!ANALYSIS.has(raw.analysis)) throw new Error("Unknown analysis.");
  return { parts: parts as Part[], wires: wires as Wire[], sim: raw };
}

function readSheet(value: unknown): { parts: Part[]; wires: Wire[]; sim: SimConfig } {
  const parsed = typeof value === "string" ? (JSON.parse(value) as unknown) : value;
  if (!parsed || typeof parsed !== "object") throw new Error("Stored schematic is unreadable.");
  const row = parsed as { parts?: unknown; wires?: unknown; sim?: unknown };
  return asSheet(row.parts, row.wires, row.sim);
}

function flag(value: unknown): boolean {
  return value === true || value === "t" || value === "true" || value === 1;
}

function card(row: { id: string; name: string; isPublic: unknown; createdAt: string }): CircuitCard {
  return { id: row.id, name: row.name, isPublic: flag(row.isPublic), createdAt: String(row.createdAt) };
}

export const listPublicCircuits = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ id: string; name: string; isPublic: unknown; createdAt: string }>`
    select id, name, is_public as "isPublic", created_at::text as "createdAt"
    from circuits
    where is_public = true
    order by created_at desc
    limit 60
  `;
  return rows.map(card);
});

export const listMine = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ id: string; name: string; isPublic: unknown; createdAt: string }>`
      select id, name, is_public as "isPublic", created_at::text as "createdAt"
      from circuits
      where user_id = ${context.userId}
      order by created_at desc
      limit 60
    `;
    return rows.map(card);
  });

export const loadPublic = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => {
    if (!data || typeof data.id !== "string" || data.id.length > 80) throw new Error("Missing circuit.");
    return { id: data.id };
  })
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: string; name: string; isPublic: unknown; schematic: string }>`
      select id, name, is_public as "isPublic", schematic_data::text as schematic
      from circuits
      where id = ${data.id} and is_public = true
      limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("That circuit is not public.");
    const sheet = readSheet(row.schematic);
    return { id: row.id, name: row.name, isPublic: true, ...sheet } satisfies CloudCircuit;
  });

export const loadMine = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => {
    if (!data || typeof data.id !== "string" || data.id.length > 80) throw new Error("Missing circuit.");
    return { id: data.id };
  })
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const rows = await sql<{ id: string; name: string; isPublic: unknown; schematic: string }>`
      select id, name, is_public as "isPublic", schematic_data::text as schematic
      from circuits
      where id = ${data.id} and user_id = ${context.userId}
      limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("Circuit not found.");
    const sheet = readSheet(row.schematic);
    return { id: row.id, name: row.name, isPublic: flag(row.isPublic), ...sheet } satisfies CloudCircuit;
  });

export const saveCircuit = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: SaveBody) => data)
  .handler(async ({ data, context }) => {
    const name = cleanName(data.name);
    const sheet = asSheet(data.parts, data.wires, data.sim);
    const isPublic = Boolean(data.isPublic);
    const netlist = spiceNetlist(sheet.parts, sheet.wires, sheet.sim).slice(0, 20000);
    const payload = JSON.stringify(sheet);
    const sql = await getSql();
    const userId = context.userId;

    if (data.id) {
      if (typeof data.id !== "string" || data.id.length > 80) throw new Error("Bad circuit id.");
      const updated = await sql<{ id: string }>`
        update circuits
        set name = ${name},
            schematic_data = ${payload}::jsonb,
            netlist_text = ${netlist},
            is_public = ${isPublic},
            updated_at = now()
        where id = ${data.id} and user_id = ${userId}
        returning id
      `;
      if (!updated[0]) throw new Error("Circuit not found.");
      return { id: data.id, name, isPublic };
    }

    const id = crypto.randomUUID();
    await sql`
      insert into circuits (id, user_id, name, schematic_data, netlist_text, is_public)
      values (${id}, ${userId}, ${name}, ${payload}::jsonb, ${netlist}, ${isPublic})
    `;
    return { id, name, isPublic };
  });

export const setCircuitPublic = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: string; isPublic: boolean }) => data)
  .handler(async ({ data, context }) => {
    if (!data || typeof data.id !== "string") throw new Error("Missing circuit.");
    const isPublic = Boolean(data.isPublic);
    const sql = await getSql();
    const rows = await sql<{ id: string }>`
      update circuits
      set is_public = ${isPublic}, updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
      returning id
    `;
    if (!rows[0]) throw new Error("Circuit not found.");
    return { id: data.id, isPublic };
  });
