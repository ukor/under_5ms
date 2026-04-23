import { isProduction, NODE_ENV } from "./index.js";

const connectSrc = ["'self'"];
if (!isProduction(NODE_ENV)) {
	connectSrc.push("http://localhost:*");
}

export const helmetOptions = {
	global: true,
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			connectSrc,
			imgSrc: ["'self'", "data:", "https:"],
		},
	},
};
