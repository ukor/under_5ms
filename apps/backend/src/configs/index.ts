import * as dotenv from "dotenv";
dotenv.config();

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import {
	type Environments,
	environments,
	type EnvironmentKeys,
} from "@aka/shared_types/environment";

const environment = process.env.environment || "stg";

export const NODE_ENV: Environments =
	environments[environment as EnvironmentKeys];

export const isProduction = (environment: Environments): boolean =>
	["production", "prd", "prod"].includes(environment.toLowerCase());

export const isStaging = (environment: Environments): boolean =>
	["stg", "staging"].includes(environment.toLowerCase());

export const isDevelopment = (environment: Environments): boolean =>
	["dev", "development"].includes(environment.toLowerCase());

const host = process.env.HOST || "0.0.0.0";

const close_grace_delay = Number.isNaN(Number(process.env.CLOSE_GRACE_DELAY))
	? 10000
	: Number(process.env.CLOSE_GRACE_DELAY || "10000");

export const appConfig = createEnv({
	runtimeEnv: {
		...process.env,
		HOST: host,
		NODE_ENV: environments[environment as EnvironmentKeys],
		CLOSE_GRACE_DELAY: close_grace_delay,
	},
	server: {
		CLOSE_GRACE_DELAY: z.number().default(10000),
		NODE_ENV: z.string(),
		PORT_BACKEND: z.coerce.number(),
		HOST: z.string(),
		APP_NAME: z.string(),
		PG_USER: z.string(),
		PG_PASSWORD: z.string(),
		PG_DB: z.string(),
		PG_HOST: z.string(),
		MONGO_NAME: z.string(),
		MONGO_PASSWORD: z.string(),
		MONGO_USER: z.string(),
		MONGO_HOST: z.string(),
		// JWT_SECRET: z.string(),
		// JWT_ALGORITHM: z.string(),
		// OTP_SECRET: z.string(),
	},
});
