import got, { Got, Options, Method } from "got";
import { ServiceNames, ServiceUrls } from "@aka/shared_types/app_environment";

export class Http {
	private constructor(private readonly got: Got<Options>) {}

	static serviceUrls: ServiceUrls = {
		[ServiceNames.enum.customer]: "http://customer:3013",
		[ServiceNames.enum.order]: "http://order:3014",
		[ServiceNames.enum.payment]: "http://payment:3015",
		[ServiceNames.enum.product]: "http://product:3016",
	};

	private static getServiceUrl(name: ServiceNames) {
		return Http.serviceUrls[name];
	}

	static init(serviceName: ServiceNames) {
		const options = new Options({
			prefixUrl: Http.getServiceUrl(serviceName),
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
