import { FastifyReply } from "fastify";
import { z } from "zod";

// - https://www.rfc-editor.org/rfc/rfc7807
export const HttpResponseDto = z.object({
	type: z.string().default("about:blank"),
	title: z.string(),
	isError: z.boolean().default(false),
	detail: z.string(),
	invalidParams: z.array(z.string()),
	context: z
		.string()
		.describe("OK for 2xx range status. ErrorName for other status code."),
	description: z
		.string()
		.nullish()
		.describe(
			"An error message for the developers only. This should be null in production.",
		)
		.default(null),

	result: z.any().nullable(),
});

export type HttpResponseDto = z.infer<typeof HttpResponseDto>;
z.globalRegistry.add(HttpResponseDto, { id: "HttpResponseDto" });

export const HttpErrorResponseDto = HttpResponseDto.extend({
	isError: z.boolean().default(true),
	result: z.any().nullable().default(null),
});

export type HttpErrorResponseDto = z.infer<typeof HttpErrorResponseDto>;
z.globalRegistry.add(HttpErrorResponseDto, { id: "HttpErrorResponseDto" });

export function httpResponse<T>(
	response: FastifyReply,
	data: T,
	statusCode: number = 200,
): FastifyReply {
	const r: HttpResponseDto = {
		type: "about:blank",
		title: "",
		isError: false,
		detail: "",
		invalidParams: [],
		context: "ok",
		description: null,
		result: data,
	};

	return response.code(statusCode).send(r);
}
