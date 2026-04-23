import { FastifyInstance } from "fastify";

import fp from "fastify-plugin";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

import {
	jsonSchemaTransform,
	jsonSchemaTransformObject,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { appConfig } from "../configs/index.js";

export default fp(async function (fastify: FastifyInstance) {
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	fastify.register(fastifySwagger, {
		openapi: {
			openapi: "3.0.0",
			info: {
				title: "Open API Specification",
				description: "",
				version: "1.0.0",
			},
			servers: [
				{
					url: `http://localhost:${appConfig.PORT}`,
					description: "Local environment base URL",
				},
			],
		},
		transform: jsonSchemaTransform,
		transformObject: jsonSchemaTransformObject,
	});

	fastify.get("/__docs/openapi", {}, async (_request, reply) => {
		reply.send(fastify.swagger());
	});

	fastify.register(fastifySwaggerUI, {
		routePrefix: "/__api-docs",
		logLevel: "error",
		theme: { title: "Api Spec" },
		uiConfig: {
			deepLinking: true,
			tagsSorter: "alpha",
			persistAuthorization: true,
		},
	});
});
