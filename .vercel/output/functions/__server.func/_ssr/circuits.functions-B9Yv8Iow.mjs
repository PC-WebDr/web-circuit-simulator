import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-UpC2Kf1P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/circuits.functions-B9Yv8Iow.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listPublicCircuits = createServerFn({ method: "GET" }).handler(createSsrRpc("e154a946ea8a4c978b2a7cf4c9bd9cea850ce51767dc6a69ce810cfaf3231e26"));
var listMine = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b880b60f01ec82561a19d56ce0a047bd0cf4a642eb08ff554e4c7bda572e9e53"));
var loadPublic = createServerFn({ method: "POST" }).validator((data) => {
	if (!data || typeof data.id !== "string" || data.id.length > 80) throw new Error("Missing circuit.");
	return { id: data.id };
}).handler(createSsrRpc("ab107859fa8738be27af2bf261355343b3be597599e810b6c5e50f963c852125"));
var loadMine = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data || typeof data.id !== "string" || data.id.length > 80) throw new Error("Missing circuit.");
	return { id: data.id };
}).handler(createSsrRpc("6ef05cc9ac5817b5fb6a4da257fd5783ecad607a6806a0f5a27036d30ec65f56"));
var saveCircuit = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("99f4bd10894bcaefdc0f7f66645834cf1ae1d6c070417e1ef54f1d548d6de289"));
var setCircuitPublic = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("45d5d7e2e47814b340724a0d187e7025d904ac2b8f2ecbe1a1c7f180a532b985"));
//#endregion
export { saveCircuit as a, loadPublic as i, listPublicCircuits as n, setCircuitPublic as o, loadMine as r, listMine as t };
