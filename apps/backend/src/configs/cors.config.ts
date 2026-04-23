import { appConfig } from "./index.js";

function corsURLS(env: string): string[] | boolean {
	const _default = ["http://localhost:4200", "http://localhost:1337"];

	if (!["production", "prod"].includes(env)) {
		return [..._default];
	}

	return _default;
}

corsURLS(appConfig.NODE_ENV);

export const corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200,
	credentials: false,
	methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
	preflightContinue: false,
};
