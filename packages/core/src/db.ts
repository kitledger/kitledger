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

export type KitledgerDbOptions = {
	url: string;
	ssl?: boolean;
	max?: number;
	migrationsTable?: string;
	migrationsSchema?: string;
	autoMigrate?: boolean;
};

export type KitledgerDb = PostgresJsDatabase<typeof schema> & {
	$client: postgres.Sql<{}>;
};

export async function runMigrations(db: KitledgerDb, migrationsTable: string, migrationsSchema: string) {
	const migrationsPath = resolve(__dirname, "../dist/migrations");

	await migrate(db, {
		migrationsFolder: migrationsPath,
		migrationsTable: migrationsTable,
		migrationsSchema: migrationsSchema,
	});
}

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
			if(!msg.message.includes("skipping"))
			{
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

export type QueryResultRow = v.InferInput<typeof QueryResultRowSchema>;

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

export const QueryResultSchema = v.array(QueryResultRowSchema);

/**
 * Utility function to parse boolean filter values from strings or booleans to be used in queries and filters.
 * @param value
 * @returns
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
