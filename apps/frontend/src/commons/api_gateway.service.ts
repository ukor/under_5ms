import Axios from "axios";

export const endpoints: Record<string, string> = Object.freeze({
	default: "http://localhost/api",
	local: "http://127.0.0.1:3012",
	// development: 'http://localhost:40025',
	docker: "http://localhost/api",
});

const mode = import.meta.env.MODE;

export const getApiEndpoint = () => {
	const baseUrl =
		endpoints[mode] || import.meta.env.VITE_BASE_URL || endpoints["default"];

	console.log({
		env: mode,
		baseUrl,
	});

	return baseUrl;
};

const AxiosInstance = Axios.create({
	baseURL: getApiEndpoint(),
	headers: {
		"Content-Type": "application/json",
	},
	validateStatus: (status) => {
		// Treat 404 as success with empty payload
		return (status >= 200 && status < 300) || status === 404;
	},
});

AxiosInstance.interceptors.request.use(
	function (config) {
		return config;
	},
	function (error) {
		return Promise.reject(error);
	},
);

AxiosInstance.interceptors.response.use(
	(response) => {
		const { status, data } = response;
		if (data.isError && !((status >= 200 && status < 300) || status === 404)) {
			return Promise.reject(
				response?.data?.message ?? "There was a fatal error from our end.",
			);
		}
		return data;
	},
	(error) => {
		if (error.response) {
			const { status, statusText, data } = error.response;
			console.log(status, statusText);
			if (data) {
				return Promise.reject(data?.message ?? statusText);
			}

			return Promise.reject("Error form axios interceptor");
		}
		return Promise.reject(error?.message ?? "Timeout exceeded");
	},
);

export default AxiosInstance;
