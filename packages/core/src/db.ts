import { drizzle } from "drizzle-orm/postgres-js";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import * as v from "valibot";

import * as schema from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Options for configuring the Kitledger database connection.
 *
 * @remarks
 * Includes parameters for connection URL, SSL, connection pool size,
 * migrations table and schema, and auto-migration setting.
 */
export type KitledgerDbOptions = {
	url: string;
	ssl?: boolean;
	max?: number;
	migrationsTable?: string;
	migrationsSchema?: string;
	autoMigrate?: boolean;
};

/**
 * Database instance type for Kitledger, extending PostgresJsDatabase with the defined schema.
 *
 * @remarks
 * Includes a reference to the underlying Postgres client.
 */
export type KitledgerDb = PostgresJsDatabase<typeof schema> & {
	$client: postgres.Sql<{}>;
};

/*
 * Runs database migrations using the specified migrations table and schema.
 *
 * @param db - The Kitledger database instance.
 * @param migrationsTable - The name of the migrations table.
 * @param migrationsSchema - The schema where the migrations table is located.
 * @returns A promise that resolves when migrations are complete.
 */
export async function runMigrations(db: KitledgerDb, migrationsTable: string, migrationsSchema: string) {
	const migrationsPath = resolve(__dirname, "../dist/migrations");

	await migrate(db, {
		migrationsFolder: migrationsPath,
		migrationsTable: migrationsTable,
		migrationsSchema: migrationsSchema,
	});
}

/**
 * Initializes the Kitledger database with the provided options.
 *
 * @remarks
 * Sets up the database connection, applies migrations automatically if enabled,
 * and returns the initialized database instance.
 *
 * @param options - Configuration options for the database connection.
 * @returns A promise that resolves to the initialized Kitledger database instance.
 */
export async function initializeDatabase(options: KitledgerDbOptions): Promise<KitledgerDb> {
	const dbConfig: KitledgerDbOptions = {
		url: options.url,
		ssl: options.ssl ? options.ssl : false,
		max: options.max ? options.max : 10,
		autoMigrate: options.autoMigrate ?? true,
	};
	const queryClient = postgres(dbConfig.url, {
		ssl: dbConfig.ssl,
		max: dbConfig.max,
		onnotice: (msg) => {
			/**
			 * Ignore notices about skipping already applied migrations
			 */
			if (!msg.message.includes("skipping")) {
				console.log("Kitledger Postgres notice:", msg);
			}
		},
	});
	const db = drizzle({
		client: queryClient,
		schema: schema,
	});

	const migrationsTable = options.migrationsTable || "schema_history";
	const migrationsSchema = options.migrationsSchema || "public";

	/**
	 * Auto-migrate database schema if enabled
	 */
	if (dbConfig.autoMigrate) {
		await runMigrations(db, migrationsTable, migrationsSchema);
	}

	return db;
}

/**
 * Supported operation types for get operations.
 */
export enum GetOperationType {
	FILTER = "filter",
	SEARCH = "search",
	QUERY = "query",
}

/**
 * Parameters for filter operations, including optional limit and offset.
 */
export type FilterOperationParameters = Record<string, string> & {
	limit?: number;
	offset?: number;
};

/**
 * Result structure for get operations, including data array and optional limit and offset.
 */
export type GetOperationResult<T> = {
	data: T[];
	count: number;
	limit?: number;
	offset?: number;
	errors?: { field?: string; message: string }[];
};

/**
 * Type definition for a single row in a query result.
 */
export type QueryResultRow = v.InferInput<typeof QueryResultRowSchema>;

/**
 * Schema definition for a single row in a query result.
 */
export const QueryResultRowSchema = v.record(
	v.string(),
	v.union([
		v.string(),
		v.number(),
		v.boolean(),
		v.date(),
		v.null(),
		v.record(v.string(), v.union([v.string(), v.number(), v.boolean(), v.date(), v.null()])),
	]),
);

/**
 * Schema definition for an array of query result rows.
 */
export const QueryResultSchema = v.array(QueryResultRowSchema);

/**
 * Utility function to parse boolean filter values from strings or booleans to be used in queries and filters.
 * @param value The value to parse, which can be a string or a boolean.
 * @returns The parsed boolean value, or null if the input is not a valid boolean string.
 */
export function parseBooleanFilterValue(value: string | boolean): boolean | null {
	if (typeof value === "boolean") {
		return value;
	}
	const lowerValue = value.toLowerCase();
	if (lowerValue === "true") {
		return true;
	}
	if (lowerValue === "false") {
		return false;
	}
	return null;
}

/**
 * String constant representing a wildcard for boolean filters.
 */
export const ANY = "any";

/**
 * Default value for pagination limit.
 */
export const defaultLimit = 100;

/**
 * Maximum allowable value for pagination limit.
 */
export const maxLimit = 1000;

/**
 * Default value for pagination offset.
 */
export const defaultOffset = 0;
