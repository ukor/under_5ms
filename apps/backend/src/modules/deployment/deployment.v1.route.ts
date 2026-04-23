import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	HttpErrorResponseDto,
	HttpResponseDto,
} from "@aka/shared_types/http_response";
import {
	TriggerDeploymentWithGitRequestPayload,
	TriggerDeploymentResponse,
} from "@aka/shared_types/deployment";
import { httpResponse } from "@aka/relay_bus/http_responder";

export default async function (fastify: FastifyInstance) {
	// ---

	fastify.after(() => {
		fastify.withTypeProvider<ZodTypeProvider>().route({
			method: "POST",
			url: "/v1/deploy",
			schema: {
				summary: "create deployment from a git url",
				description: "allow user to trigger deployment from a git url",
				tags: ["deploy"],
				body: TriggerDeploymentWithGitRequestPayload,
				response: {
					200: TriggerDeploymentResponse,
					"3xx": HttpErrorResponseDto,
					"4xx": HttpErrorResponseDto,
					"5xx": HttpErrorResponseDto,
				},
			},
			handler: async (
				request: FastifyRequest<{
					Body: TriggerDeploymentWithGitRequestPayload;
				}>,
				reply: FastifyReply,
			) => {
				// ---

				return httpResponse<Record<string, unknown>>(reply, {}, 201);
			},
		});
	});

	fastify.after(() => {
		fastify.withTypeProvider<ZodTypeProvider>().route({
			method: "GET",
			url: "/v1/deployment",
			schema: {
				summary: "return a list of deployment",
				description: "return a list of deployment and there status",
				tags: ["order"],
				response: {
					200: HttpResponseDto,
					"3xx": HttpErrorResponseDto,
					"4xx": HttpErrorResponseDto,
					"5xx": HttpErrorResponseDto,
				},
			},
			handler: async (request: FastifyRequest, reply: FastifyReply) => {
				// ---

				return httpResponse<unknown>(reply, {
					customerId: "dummy",
					productId: "dummy",
				});
			},
		});
	});
}
