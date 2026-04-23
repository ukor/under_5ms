import z from "zod";
import { HttpResponseDto } from "./http_response";

export const DeploymentStatus = z.enum([
	"pending",
	"building",
	"deploying",
	"running",
	"failed",
]);
export type DeploymentStatus = z.infer<typeof DeploymentStatus>;

export const TriggerDeploymentWithGit = z.object({
	url: z.string().url().describe("Git URL"),
});

export const TriggerDeploymentWithGitRequestPayload =
	TriggerDeploymentWithGit.extend({});

export type TriggerDeploymentWithGitRequestPayload = z.infer<
	typeof TriggerDeploymentWithGitRequestPayload
>;

export const TriggerDeploymentResponsePayload = z.object({
	status: DeploymentStatus,
	deploymentId: z.string(),
});

export type TriggerDeploymentResponsePayload = z.infer<
	typeof TriggerDeploymentResponsePayload
>;

export const TriggerDeploymentResponse = HttpResponseDto.extend({
	result: TriggerDeploymentResponsePayload,
});

export type TriggerDeploymentResponse = z.infer<
	typeof TriggerDeploymentResponse
>;
z.globalRegistry.add(TriggerDeploymentResponse, {
	id: "TriggerDeploymentResponse",
});
