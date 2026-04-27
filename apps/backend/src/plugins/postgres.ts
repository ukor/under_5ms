import type { FastifyInstance } from "fastify";

import fp from "fastify-plugin";
import fastifyPostgres, { PostgresPluginOptions } from "@fastify/postgres";
import { appConfig } from "../configs/index.js";

export default fp(async function (
	fastify: FastifyInstance,
	_opt: PostgresPluginOptions,
) {
	await fastify.register(fastifyPostgres, {
		password: appConfig.PG_PASSWORD,
		user: appConfig.PG_USER,
		database: appConfig.PG_DB,
		host: appConfig.PG_HOST,
	});
});
