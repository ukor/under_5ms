import type { FastifyInstance } from "fastify";

import fp from "fastify-plugin";
import fastifySSE, { SSEPluginOptions } from "@fastify/sse";

export default fp(async function (
	fastify: FastifyInstance,
	_opt: SSEPluginOptions,
) {
	await fastify.register(fastifySSE.default);
});
