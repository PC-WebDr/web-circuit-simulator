import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CikoaMed.mjs";
import { t as authMiddleware } from "./middleware-UpC2Kf1P.mjs";
import { m as spiceNetlist } from "./netlist-y3OInw0w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/circuits.functions-DqsababI.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var ANALYSIS = /* @__PURE__ */ new Set([
	"tran",
	"ac",
	"dc"
]);
function cleanName(name) {
	if (typeof name !== "string") throw new Error("Name the circuit before saving.");
	const trimmed = name.replace(/\s+/g, " ").trim().slice(0, 80);
	if (!trimmed) throw new Error("Name the circuit before saving.");
	return trimmed;
}
function asSheet(parts, wires, sim) {
	if (!Array.isArray(parts) || !Array.isArray(wires) || !sim || typeof sim !== "object") throw new Error("Circuit data is incomplete.");
	if (parts.length > 500 || wires.length > 1e3) throw new Error("Circuit is too large to save.");
	const raw = sim;
	if (!ANALYSIS.has(raw.analysis)) throw new Error("Unknown analysis.");
	return {
		parts,
		wires,
		sim: raw
	};
}
function readSheet(value) {
	const parsed = typeof value === "string" ? JSON.parse(value) : value;
	if (!parsed || typeof parsed !== "object") throw new Error("Stored schematic is unreadable.");
	const row = parsed;
	return asSheet(row.parts, row.wires, row.sim);
}
function flag(value) {
	return value === true || value === "t" || value === "true" || value === 1;
}
function card(row) {
	return {
		id: row.id,
		name: row.name,
		isPublic: flag(row.isPublic),
		createdAt: String(row.createdAt)
	};
}
var listPublicCircuits_createServerFn_handler = createServerRpc({
	id: "e154a946ea8a4c978b2a7cf4c9bd9cea850ce51767dc6a69ce810cfaf3231e26",
	name: "listPublicCircuits",
	filename: "src/lib/circuits.functions.ts"
}, (opts) => listPublicCircuits.__executeServer(opts));
var listPublicCircuits = createServerFn({ method: "GET" }).handler(listPublicCircuits_createServerFn_handler, async () => {
	return (await (await getSql())`
    select id, name, is_public as "isPublic", created_at::text as "createdAt"
    from circuits
    where is_public = true
    order by created_at desc
    limit 60
  `).map(card);
});
var listMine_createServerFn_handler = createServerRpc({
	id: "b880b60f01ec82561a19d56ce0a047bd0cf4a642eb08ff554e4c7bda572e9e53",
	name: "listMine",
	filename: "src/lib/circuits.functions.ts"
}, (opts) => listMine.__executeServer(opts));
var listMine = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMine_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, name, is_public as "isPublic", created_at::text as "createdAt"
      from circuits
      where user_id = ${context.userId}
      order by created_at desc
      limit 60
    `).map(card);
});
var loadPublic_createServerFn_handler = createServerRpc({
	id: "ab107859fa8738be27af2bf261355343b3be597599e810b6c5e50f963c852125",
	name: "loadPublic",
	filename: "src/lib/circuits.functions.ts"
}, (opts) => loadPublic.__executeServer(opts));
var loadPublic = createServerFn({ method: "POST" }).validator((data) => {
	if (!data || typeof data.id !== "string" || data.id.length > 80) throw new Error("Missing circuit.");
	return { id: data.id };
}).handler(loadPublic_createServerFn_handler, async ({ data }) => {
	const row = (await (await getSql())`
      select id, name, is_public as "isPublic", schematic_data::text as schematic
      from circuits
      where id = ${data.id} and is_public = true
      limit 1
    `)[0];
	if (!row) throw new Error("That circuit is not public.");
	const sheet = readSheet(row.schematic);
	return {
		id: row.id,
		name: row.name,
		isPublic: true,
		...sheet
	};
});
var loadMine_createServerFn_handler = createServerRpc({
	id: "6ef05cc9ac5817b5fb6a4da257fd5783ecad607a6806a0f5a27036d30ec65f56",
	name: "loadMine",
	filename: "src/lib/circuits.functions.ts"
}, (opts) => loadMine.__executeServer(opts));
var loadMine = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data || typeof data.id !== "string" || data.id.length > 80) throw new Error("Missing circuit.");
	return { id: data.id };
}).handler(loadMine_createServerFn_handler, async ({ data, context }) => {
	const row = (await (await getSql())`
      select id, name, is_public as "isPublic", schematic_data::text as schematic
      from circuits
      where id = ${data.id} and user_id = ${context.userId}
      limit 1
    `)[0];
	if (!row) throw new Error("Circuit not found.");
	const sheet = readSheet(row.schematic);
	return {
		id: row.id,
		name: row.name,
		isPublic: flag(row.isPublic),
		...sheet
	};
});
var saveCircuit_createServerFn_handler = createServerRpc({
	id: "99f4bd10894bcaefdc0f7f66645834cf1ae1d6c070417e1ef54f1d548d6de289",
	name: "saveCircuit",
	filename: "src/lib/circuits.functions.ts"
}, (opts) => saveCircuit.__executeServer(opts));
var saveCircuit = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(saveCircuit_createServerFn_handler, async ({ data, context }) => {
	const name = cleanName(data.name);
	const sheet = asSheet(data.parts, data.wires, data.sim);
	const isPublic = Boolean(data.isPublic);
	const netlist = spiceNetlist(sheet.parts, sheet.wires, sheet.sim).slice(0, 2e4);
	const payload = JSON.stringify(sheet);
	const sql = await getSql();
	const userId = context.userId;
	if (data.id) {
		if (typeof data.id !== "string" || data.id.length > 80) throw new Error("Bad circuit id.");
		if (!(await sql`
        update circuits
        set name = ${name},
            schematic_data = ${payload}::jsonb,
            netlist_text = ${netlist},
            is_public = ${isPublic},
            updated_at = now()
        where id = ${data.id} and user_id = ${userId}
        returning id
      `)[0]) throw new Error("Circuit not found.");
		return {
			id: data.id,
			name,
			isPublic
		};
	}
	const id = crypto.randomUUID();
	await sql`
      insert into circuits (id, user_id, name, schematic_data, netlist_text, is_public)
      values (${id}, ${userId}, ${name}, ${payload}::jsonb, ${netlist}, ${isPublic})
    `;
	return {
		id,
		name,
		isPublic
	};
});
var setCircuitPublic_createServerFn_handler = createServerRpc({
	id: "45d5d7e2e47814b340724a0d187e7025d904ac2b8f2ecbe1a1c7f180a532b985",
	name: "setCircuitPublic",
	filename: "src/lib/circuits.functions.ts"
}, (opts) => setCircuitPublic.__executeServer(opts));
var setCircuitPublic = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(setCircuitPublic_createServerFn_handler, async ({ data, context }) => {
	if (!data || typeof data.id !== "string") throw new Error("Missing circuit.");
	const isPublic = Boolean(data.isPublic);
	if (!(await (await getSql())`
      update circuits
      set is_public = ${isPublic}, updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
      returning id
    `)[0]) throw new Error("Circuit not found.");
	return {
		id: data.id,
		isPublic
	};
});
//#endregion
export { listMine_createServerFn_handler, listPublicCircuits_createServerFn_handler, loadMine_createServerFn_handler, loadPublic_createServerFn_handler, saveCircuit_createServerFn_handler, setCircuitPublic_createServerFn_handler };
