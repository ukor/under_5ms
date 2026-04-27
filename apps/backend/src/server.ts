"use strict";

import "dotenv/config";

import Fastify from "fastify";
import closeWithGrace from "close-with-grace";
import { app } from "./app.js";
import { appConfig } from "./configs/index.js";
import { fastifyErrorHandler } from "@aka/shared_types/exception";

const host = appConfig.HOST ?? "localhost";
const port = appConfig.PORT_BACKEND ? Number(appConfig.PORT_BACKEND) : 3012;

const server = Fastify({
	logger: true,

	pluginTimeout: 90000,
	connectionTimeout: 60000,
	requestTimeout: 60000,
});

server.register(app);

server.setErrorHandler(fastifyErrorHandler);

closeWithGrace(
	{ delay: 20000 },
	async function (opt: {
		err?: Error;
		signal?: closeWithGrace.Signals;
		manual?: boolean;
	}) {
		if (opt.err) {
			server.log.error(opt.err);
		}
		await server.close();
	},
);

server.listen({ port, host }, (error: unknown) => {
	if (error) {
		server.log.error(error);
		process.exit(1);
	} else {
		console.log(`[ listening ] http://${host}:${port}`);
		console.log(`[ listening ] http://${host}:${port}/__api-docs`);
	}
});
