import os from "node:os";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import {
	HttpErrorResponseDto,
	httpResponse,
	HttpResponseDto,
} from "@aka/shared_types/http_response";

const QueryType = z.any();

type QueryType = z.infer<typeof QueryType>;

export default async function (fastify: FastifyInstance) {
	// ---

	fastify.after(() => {
		fastify.withTypeProvider<ZodTypeProvider>().all("/__/health", {
			schema: {
				summary: "Health check",
				querystring: QueryType,
				description: "Check health status of services",
				tags: ["health"],
				response: {
					"2xx": HttpResponseDto,
					"3xx": HttpErrorResponseDto,
					"4xx": HttpErrorResponseDto,
					"5xx": HttpErrorResponseDto,
				},
			},

			handler: async (
				request: FastifyRequest<{ Querystring: QueryType }>,
				reply: FastifyReply,
			) => {
				const reqPayload = request.query;

				console.log(reqPayload);

				return httpResponse<unknown>(reply, {
					q: reqPayload,
					method: request.method,
					// path: request.routerPath,
					hostname: request.hostname,
					dateTime: new Date(),
					protocol: request.protocol,
					ip: request.ip,
					ips: {
						requestIps: request.ips,
						// i: ip.getInternal(),
						// p: ip.getPublic(),
					},
					id: request.id,
					params: request.params,
					url: request.url,
					os_hostname: os.hostname(),
				});
			},
		});
	});
}
