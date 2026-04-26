import type { AxiosResponse } from "axios";
import type {
	DeploymentsResponse,
	TriggerDeploymentResponse,
	TriggerDeploymentResponsePayload,
	TriggerDeploymentWithGitRequestPayload,
} from "@aka/shared_types/deployment";
import apigateway from "./api_gateway.service";

/**
 * Allow a user to trigger a deployment using a git repository
 *
 * */
export async function startDeploymentWithGit(
	arg: TriggerDeploymentWithGitRequestPayload,
): Promise<TriggerDeploymentResponsePayload> {
	// ---

	const { data } = await apigateway.post<
		TriggerDeploymentWithGitRequestPayload,
		AxiosResponse<TriggerDeploymentResponse>,
		TriggerDeploymentWithGitRequestPayload
	>("/v1/deploy/git", arg);

	if (data.isError) {
		throw new Error(data.detail);
	}

	return data.result;
}

/**
 * Allow user trigger a deployment by uploading a folder
 *
 * */
export async function startDeploymentWithUpload(
	arg: TriggerDeploymentWithGitRequestPayload,
): Promise<TriggerDeploymentResponsePayload> {
	// ---

	const response = await apigateway.post<
		any,
		TriggerDeploymentResponse,
		TriggerDeploymentWithGitRequestPayload
	>("/v1/deploy/upload", arg);

	if (response.isError) {
		throw new Error(data.detail);
	}

	return response.result;
}

/**
 * Return a list of all deployment/builds
 * */
export async function getDeployments(arg: {}) {
	const response = await apigateway.get<
		DeploymentsResponse,
		DeploymentsResponse,
		unknown
	>("/v1/deployments", { params: arg });

	return response.result;
}

/**
 * Allow use to cancel an active deployment
 *
 * TODO:
 * Nice to have
 * */
export async function stopDeployment(arg: { deploymentId: string }) {
	const response = await apigateway.patch("/v1/deploy/stop", arg);

	return response.data;
}
