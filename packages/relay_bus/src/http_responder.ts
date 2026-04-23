import { FastifyReply } from "fastify";
import { HttpResponseDto } from "@aka/shared_types/http_response";

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
