import { FastifyReply, FastifyRequest } from "fastify";
import {
	hasZodFastifySchemaValidationErrors,
	isResponseSerializationError,
	ZodFastifySchemaValidationError,
} from "fastify-type-provider-zod";
// import * as jose from "jose";
import { HttpErrorResponseDto } from "./http_response";
import { ZodIssue } from "zod/v4";
import console from "node:console";

// - https://developer.mozilla.org/en-US/docs/Web/HTTP
export type ErrorName =
	| "CONFLICT"
	| "WARNING"
	| "NOT_PROCESSED"
	| "SERVER_ERROR"
	| "USER_ERROR"
	| "BAD_REQUEST"
	| "VALIDATION_ERROR"
	| "AUTHENTICATION_ERROR"
	| "AUTHORIZATION_ERROR"
	| "NOT_FOUND"
	| "DATABASE_ERROR"
	| "NOT_IMPLEMENTED"
	| "PAYMENT_ERROR"
	| "PERMISSION_ERROR"
	| "UNPROCESSED_ERROR"
	| "TIME_OUT";

export const criticalErrors = [
	"SERVER_ERROR",
	"TIME_OUT",
	"DATABASE_ERROR",
	"NOT_IMPLEMENTED",
	"ReferenceError",
	"MongoError",
	"BSONError",
];

export const defaultErrorMessage = (name: ErrorName) => {
	switch (name) {
		case "WARNING":
		case "NOT_PROCESSED":
			return "Unable to process request";
		case "BAD_REQUEST":
		case "USER_ERROR":
		case "VALIDATION_ERROR":
			return "Bad request. Check that you are sending the right data.";
		case "AUTHENTICATION_ERROR":
			return "Invalid authentication credentials";
		case "AUTHORIZATION_ERROR":
			return "Your session has expired. Try login again";
		case "NOT_FOUND":
			return "The resources you request for was not found.";
		case "PAYMENT_ERROR":
			return "There was error processing your payment.";
		case "SERVER_ERROR":
		case "DATABASE_ERROR":
			return "We messed up on our end. We are working to fix this.";
		case "NOT_IMPLEMENTED":
			return "We do not currently support this functionality. We are working on it.";
		case "PERMISSION_ERROR":
			return "You don't have the nessecary permission to perform this action.";
		case "UNPROCESSED_ERROR":
			return "Payment was not processed";
		case "TIME_OUT":
			return "A timeout occured. Try again or check your internet connection";
		default:
			return "Something went wrong reach out to suport for help.";
	}
};

const errorCode = (name: ErrorName) => {
	switch (name) {
		case "WARNING":
		case "NOT_PROCESSED":
		case "VALIDATION_ERROR":
			return 422;
		case "USER_ERROR":
		case "BAD_REQUEST":
			return 400;
		case "AUTHENTICATION_ERROR":
		case "AUTHORIZATION_ERROR":
			return 401;
		case "NOT_FOUND":
			return 404;
		case "PAYMENT_ERROR":
			return 402;
		case "CONFLICT":
			return 409;
		case "DATABASE_ERROR":
		case "SERVER_ERROR":
			return 500;
		case "NOT_IMPLEMENTED":
			return 501;
		case "PERMISSION_ERROR":
			return 403;
		case "TIME_OUT":
			return 408;
		default:
			return 400;
	}
};

export class Exception extends Error {
	// ---
	public readonly name: string;

	public readonly httpCode: number;

	public readonly isOperational: boolean;

	constructor(name: ErrorName, description?: string) {
		if (description === void 0) {
			description = defaultErrorMessage(name);
		}
		super(description);

		Object.setPrototypeOf(this, new.target.prototype);

		this.name = name;
		this.httpCode = errorCode(name);
		this.isOperational = !criticalErrors.includes(name);

		Error.captureStackTrace(this);
	}
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors
 */
function isJavascriptError(error: any): boolean {
	return (
		error instanceof ReferenceError ||
		error instanceof TypeError ||
		error instanceof URIError ||
		error instanceof RangeError ||
		error instanceof SyntaxError
	);
}

export function parseZodErrorV2(errors: ZodIssue[]): string[] {
	// ---

	const e = errors.map((e: { message: any; path: any[] }) => {
		// ---

		return `${e.message} at ${e.path.join(".")}`;
	});

	return e;
}

export function zodErrorsToString(rawMessages: string[]) {
	// ---

	return `- ${rawMessages.join(", -")}`;
}

export function fastifyErrorHandler(
	error: any,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	// ---

	console.error(error);
	const result: HttpErrorResponseDto = {
		type: "about:blank",
		title: "",
		detail: "",
		invalidParams: [],
		context: "",
		description: null,
		isError: true,
		result: undefined,
	};

	// console.log('error handler  >>>', error, '<<< error handler', error instanceof errorCodes.FST_ERR_VALIDATION, '<< error instanceof ZodError');

	if (hasZodFastifySchemaValidationErrors(error)) {
		request.log.error(error, "Zod schema validation error");
		// NOTE: zodIssues are arrays - it is imporatant that will info the client
		// about all the path with validation error.
		// I also think that messages should be an array
		// check the RFC for error specifications

		result.invalidParams = error.validation.map(
			(e: ZodFastifySchemaValidationError): string => {
				// ---

				if (e.message) {
					return e.message;
				}

				return e.keyword;
			},
		);

		const zodMessage =
			result.invalidParams.length > 0 ? result.invalidParams[0] : "";

		result.detail = zodMessage;
		result.description = result.invalidParams.join(" -- ");
		result.title = "VALIDATION_ERROR";

		return reply.code(errorCode("VALIDATION_ERROR")).send(result);
	}

	if (isResponseSerializationError(error)) {
		// ---

		request.log.error(error, "Zod response serialization error");
		const zodMessages = parseZodErrorV2(error.cause.issues);

		const zodMessage = zodMessages.length > 0 ? zodMessages[0] : "";

		result.invalidParams = zodMessages;
		result.detail = zodMessage;
		result.description = zodErrorsToString(zodMessages);
		result.title = "BAD_REQUEST";

		return reply.code(errorCode("BAD_REQUEST")).send(result);
	}

	if (isJavascriptError(error)) {
		request.log.error(error);

		result.detail =
			"Something went wrong on our end. We are working to fix this issue. [lng 0]";
		result.description = String(error);
		result.title = "SERVER_ERROR";

		return reply.status(errorCode("SERVER_ERROR")).send(result);
	}

	// if (error instanceof jose.errors.JOSEError) {
	// 	result.detail =
	// 		"[Authentication] Your session must have expired. Try loging in again [a-0]";
	// 	result.description = String(error);
	// 	result.title = "AUTHORIZATION_ERROR";
	//
	// 	return reply.status(errorCode("AUTHORIZATION_ERROR")).send(result);
	// }

	if (error instanceof Exception) {
		// console.log('instanceof Exception <<<<<<');
		//

		const err = error as Exception;

		result.detail = err.message;
		result.description = String(error);
		result.title = "SERVER_ERROR";

		if (criticalErrors.includes(error.name)) {
			result.detail =
				err.message ??
				"[Critical] Something went wrong on our end. We are working to fix this issue.[c-0]";
			result.description =
				String(err.cause) ??
				"The server has expererience a critical error. We are aware and working to fix this.";

			request.log.error(error);

			return reply.status(err.httpCode).send(result);
		}

		return reply.status(err.httpCode).send(result);
	}

	request.log.error(error, "random error");
	result.description = error instanceof Error ? error.message : String(error);
	result.detail =
		"[Uknown Error] - Oops you should not be seeing this. Try again later. ";
	result.title = "SERVER_ERROR";

	const statusCode503 = parseInt(String(error?.code ?? "503")) || 503;

	return reply.status(statusCode503).send(result);
}
