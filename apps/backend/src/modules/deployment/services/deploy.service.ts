import { DeploymentRepository } from "../repositories/deployment.repository.js";

export class DeploymentService {
	constructor(private readonly deploymentRepository: DeploymentRepository) {}

	async getDeployment() {
		await this.deploymentRepository.getDeployments();
	}
}
