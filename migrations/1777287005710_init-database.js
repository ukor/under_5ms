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
	pgm.createTable(
		"deployments",
		{
			id: { type: "bigserial", primaryKey: true },
			deployment_id: { type: "varchar(255)", notNull: true },
			status: { type: "varchar(50)", notNull: true },
			buildTag: { type: "varchar(32)", notNull: true },
			created_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("current_timestamp"),
			},
			updated_at: {
				type: "timestamp",
				notNull: true,
				default: pgm.func("current_timestamp"),
			},
		},
		{
			ifNotExists: true,
		},
	);

	pgm.createIndex("deployments", "deployment_id");

	pgm.addConstraint("deployments", "status_check", {
		check: "status IN ('pending', 'running', 'success', 'failed')",
	});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
	pgm.dropConstraint("deployments", "status_check");
	pgm.dropIndex("deployments", "deployment_id");
	pgm.dropTable("deployments");
};
