import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { ZodTypeProvider } from "fastify-type-provider-zod";
import { HttpErrorResponseDto } from "@aka/shared_types/http_response";
import {
	TriggerDeploymentWithGitRequestPayload,
	TriggerDeploymentResponse,
	TriggerDeploymentResponsePayload,
	DeploymentStatus,
	DeploymentsResponse,
} from "@aka/shared_types/deployment";
import { httpResponse } from "@aka/relay_bus/http_responder";

export default async function (fastify: FastifyInstance) {
	// ---

	fastify.after(() => {
		fastify.withTypeProvider<ZodTypeProvider>().route({
			method: "POST",
			url: "/v1/deploy/git",
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
				_request: FastifyRequest<{
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
			method: "POST",
			url: "/v1/deploy/upload",
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
				_request: FastifyRequest<{
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
		fastify.route({
			method: "GET",
			url: "/v1/deployments",
			schema: {
				summary: "create deployment from a git url",
				description: "allow user to fetch all deployment",
				tags: ["deploy"],
				response: {
					200: DeploymentsResponse,
					"3xx": HttpErrorResponseDto,
					"4xx": HttpErrorResponseDto,
					"5xx": HttpErrorResponseDto,
				},
			},

			handler: async (_request: FastifyRequest, reply: FastifyReply) => {
				// ---

				return httpResponse<TriggerDeploymentResponsePayload[]>(reply, [
					{
						status: DeploymentStatus.enum.pending,
						deploymentId: "1",
					},
					{
						status: DeploymentStatus.enum.pending,
						deploymentId: "2",
					},
					{
						status: DeploymentStatus.enum.running,
						deploymentId: "3",
					},
					{
						status: DeploymentStatus.enum.building,
						deploymentId: "4",
					},
				]);
			},
		});
	});
}
