import type { FastifyInstance } from "fastify";

import fp from "fastify-plugin";
import sensible, { FastifySensibleOptions } from "@fastify/sensible";

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async function (
	fastify: FastifyInstance,
	_opts: FastifySensibleOptions,
) {
	await fastify.register(sensible);
});
