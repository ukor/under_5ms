import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import {
	deployer,
	startDeployment,
	stopDeployment,
} from "../services/deployment_logs.service.js";

export default async function (fastify: FastifyInstance) {
	// ---

	fastify.after(() => {
		fastify.route({
			method: "GET",
			url: "/v1/deployment-logs",
			sse: true,

			handler: async (request: FastifyRequest, reply: FastifyReply) => {
				// ---

				// TODO: - pass the git or files through SHA256 for deploymentId
				// deploymentId should not come from the client

				const deploymentId = "123";

				const controller = startDeployment(deploymentId);

				// Handles tab close -
				// I notice the server crashes when the client HOT-RELOAD
				// TODO: test this functionality in production
				request.raw.on("close", () => {
					stopDeployment(deploymentId);
				});

				return reply.sse.send(deployer(deploymentId, controller.signal));
			},
		});
	});
}
