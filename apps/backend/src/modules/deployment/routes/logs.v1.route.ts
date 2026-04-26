import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { gitDeploymentSimulation } from "../services/deployment_logs.service.js";

export default async function (fastify: FastifyInstance) {
	// ---

	fastify.after(() => {
		fastify.route({
			method: "GET",
			url: "/v1/deployment-logs",
			sse: true,

			handler: async (
				request: FastifyRequest<{ Querystring: { deploymentId: string } }>,
				reply: FastifyReply,
			) => {
				// ---
				try {
					// TODO: - pass the git or files through SHA256 for deploymentId
					// deploymentId should not come from the client

					const deploymentId = request.query.deploymentId;
					console.log({ deploymentId });

					// const controller = startDeployment(deploymentId);

					// Handles tab close -
					// I notice the server crashes when the client HOT-RELOAD
					// TODO: test this functionality in production
					request.raw.on("close", () => {
						// stopDeployment(deploymentId);
					});

					// return reply.sse.send(deployer(deploymentId, controller.signal));
					return reply.sse.send(gitDeploymentSimulation(deploymentId));
				} catch (error) {
					await reply.sse.send({
						id: "0",
						event: "error",
						data: {
							messageId: `0.0`,
							content: String(error),
							timestamp: new Date(),
						},
					});
				}
			},
		});
	});
}
