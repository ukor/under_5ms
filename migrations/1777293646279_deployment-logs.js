/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
	pgm.addConstraint("deployments", "deployments_unique_deployment_id", {
		unique: "deployment_id",
	});

	pgm.createTable(
		"deployment_logs",
		{
			id: { type: "bigserial", primaryKey: true },
			deployment_id: {
				type: "varchar(255)",
				notNull: true,
			},
			message: { type: "text", notNull: true },
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("current_timestamp"),
			},
		},
		{
			ifNotExists: true,
		},
	);

	pgm.createIndex("deployment_logs", "deployment_id");

	pgm.addConstraint("deployment_logs", "fk_deployment_id", {
		foreignKeys: {
			columns: "deployment_id",
			references: '"deployments"("deployment_id")',
			onDelete: "CASCADE",
		},
	});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
	pgm.dropConstraint("deployment_logs", "fk_deployment_id");
	pgm.dropIndex("deployment_logs", "deployment_id");
	pgm.dropTable("deployment_logs");
	pgm.dropConstraint("deployments", "deployments_unique_deployment_id");
};
