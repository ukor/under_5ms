import {
	DeploymentStatus,
	TriggerDeploymentResponsePayload,
	TriggerDeploymentWithGitRequestPayload,
} from "@aka/shared_types/deployment";
import { DeploymentRepository } from "../repositories/deployment.repository.js";
import { createHash } from "node:crypto";

export class GitDeployService {
	constructor(private readonly deploymentRepository: DeploymentRepository) {}

	async deploy(
		arg: TriggerDeploymentWithGitRequestPayload,
	): Promise<TriggerDeploymentResponsePayload> {
		// ---

		const project = this.fork(arg.url);

		const analysis = this.analyze(project);

		const result = await this.deploymentRepository.create(
			analysis.deploymentId,
			analysis.deploymentId.slice(-7),
		);

		console.log(result);

		return {
			deploymentId: "1222",
			status: DeploymentStatus.enum.pending,
		};
	}

	private fork(url: string) {
		// ---
		// TODO: validate that the url is a valid git URL
		// Check if we have permission to pull the repository
		// clone/pull the repository
		// upload repository to filesystem
		// pass the storage URL to the analyzer

		console.debug(`${url} has been successfully cloned`);
		return url;
	}

	private analyze(projectPath: string) {
		// ---
		// TODO: check what type of project this is
		// ...

		const deploymentId = createHash("sha256")
			.update(projectPath + Date.now())
			.digest("hex");

		return {
			projectType: "typescript",
			packageManager: "pnpm",
			isWorkSpace: true,
			projectPath,
			deploymentId,
			image: {
				tag: "123",
			},
		};
	}
}
