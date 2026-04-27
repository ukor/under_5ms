import { DeploymentStatus } from "@aka/shared_types/deployment";
import { PostgresDb } from "@fastify/postgres";

export class DeploymentRepository {
	constructor(private readonly database: PostgresDb) {}

	async create(deploymentId: string, buildTag: string) {
		// ---

		const query = `INSERT INTO deployments(deployment_id, build_tag, status, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id`;

		const result = await this.database.query(query, [
			deploymentId,
			buildTag,
			DeploymentStatus.enum.pending,
		]);

		console.log(result);

		return 1;
	}

	async getDeployments() {
		const query = `SELECT FROM deployments WHERE id > 1`;

		const result = await this.database.query(query);

		console.log("SELECT result:-", result);
	}
}
