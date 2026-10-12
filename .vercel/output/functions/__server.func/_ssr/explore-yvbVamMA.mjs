import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as SignedOut, t as SignedIn } from "./gates-DveRf_en.mjs";
import { n as listPublicCircuits, t as listMine } from "./circuits.functions-B9Yv8Iow.mjs";
import { y as CircuitBoard } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/explore-yvbVamMA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Explore() {
	const [publicRows, setPublicRows] = (0, import_react.useState)(null);
	const [mine, setMine] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		listPublicCircuits().then((rows) => {
			if (!cancelled) setPublicRows(rows);
		}).catch(() => {
			if (!cancelled) setError("Could not load public circuits.");
		});
		return () => {
			cancelled = true;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex h-14 items-center gap-3 border-b border-border px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-2 text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircuitBoard, {
						className: "size-4 text-accent",
						"aria-hidden": "true"
					}), "VOLTA"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted",
					children: "Explore"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "ml-auto text-sm text-muted",
					children: "Bench"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-medium",
					children: "Community circuits"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Public schematics. Load one onto the grid, probe it, and run it."
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-danger",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardGrid, {
					rows: publicRows,
					mine: false,
					empty: "Nothing public yet. Save a circuit and mark it public."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MineSection, {
					onRows: setMine,
					rows: mine
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-10 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-accent",
							children: "Sign in"
						}),
						" ",
						"to see circuits saved on your account."
					]
				}) })
			]
		})]
	});
}
function MineSection({ rows, onRows }) {
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		listMine().then((next) => {
			if (!cancelled) onRows(next);
		}).catch(() => {
			if (!cancelled) setError("Could not load your circuits.");
		});
		return () => {
			cancelled = true;
		};
	}, [onRows]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-medium",
				children: "Your circuits"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-danger",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardGrid, {
				rows,
				mine: true,
				empty: "You have not saved a circuit yet."
			})
		]
	});
}
function CardGrid({ rows, empty, mine }) {
	if (!rows) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-4 text-sm text-muted",
		children: "Loading…"
	});
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-4 text-sm text-muted",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
		children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-col border border-border bg-surface p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium",
						children: row.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 font-mono text-xs text-muted",
						children: row.isPublic ? "public" : "private"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-mono text-xs text-muted",
					children: row.createdAt.slice(0, 16)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					search: mine ? {
						circuit: row.id,
						mine: "1"
					} : { circuit: row.id },
					className: "mt-4 inline-flex h-9 items-center self-start bg-accent px-3 text-sm font-medium text-bg",
					children: "Load into canvas"
				})
			]
		}, row.id))
	});
}
//#endregion
export { Explore as component };
