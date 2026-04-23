import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import type { FastifyInstance } from "fastify";

import path from "node:path";
import AutoLoad from "@fastify/autoload";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import { corsOptions } from "./configs/cors.config.js";
import { helmetOptions } from "./configs/helmet.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* eslint-disable-next-line */
export interface AppOptions {}

// Pass --options via CLI arguments in command to enable these options.
export const options = {};

export async function app(fastify: FastifyInstance, opts: AppOptions) {
	await fastify.register(cors, corsOptions);
	fastify.register(helmet, helmetOptions);

	await fastify.register(AutoLoad, {
		dir: path.join(__dirname, "plugins"),
		options: Object.assign({}, opts),
	});

	fastify.register(AutoLoad, {
		dir: path.join(__dirname, "modules"),
		maxDepth: 5,
		dirNameRoutePrefix: false,
		matchFilter: (path: string) => {
			return path.endsWith(".route.js") || path.endsWith(".route.ts");
		},
		options: Object.assign({}, opts),
	});
}
