import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { killed, lsGenerator } from "../services/deployment_logs.service.js";

export default async function (fastify: FastifyInstance) {
	// ---

	fastify.after(() => {
		fastify.route({
			method: "GET",
			url: "/v1/deployment-logs",
			sse: {
				serializer: (data) => {
					console.log("ddd: ", data);
					return JSON.stringify(data);
				},
			},

			handler: async (request: FastifyRequest, reply: FastifyReply) => {
				// ---

				await reply.sse.send(lsGenerator());

				// Clean up if the user closes the connection early
				request.raw.on("close", killed);
			},
		});
	});
}
