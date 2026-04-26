import got, { Got, Options, Method } from "got";

export class Http {
	private constructor(private readonly got: Got<Options>) {}

	private static getServiceUrl() {
		return "";
	}

	static init() {
		const options = new Options({
			prefixUrl: Http.getServiceUrl(),
			headers: {
				foo: "foo",
				"x-apigateway": "",
			},
		});
		const instance = got.extend(options);
		return new Http(instance);
	}

	async request<T>(arg: {
		path: string;
		method: Method;
		body?: unknown;
		queryString?: Record<string, any>;
	}): Promise<T> {
		const result = await this.got(arg.path, {
			method: arg.method,
			json: ["get", "GET"].includes(arg.method) ? undefined : arg.body,
			searchParams: arg.queryString,
		}).json<T>();

		return result;
	}
}

// const h = Http.init("order").request();
