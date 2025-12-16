import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { timestamp } from "drizzle-orm/pg-core";
import * as v from "valibot";
import postgres from "postgres";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import * as schema from "./schema.js";

type DbOptions = {
    url: string;
    ssl?: boolean;
    max?: number;
	migrations_table?: string;
	migrations_schema?: string;
};

export type KitledgerDb = PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
}

async function runMigrations(db: KitledgerDb, migrationsTable: string, migrationsSchema: string) {
    await migrate(db, {
        migrationsFolder: "./migrations",
        migrationsTable: migrationsTable,
        migrationsSchema: migrationsSchema,
    });
}

export async function initializeDatabase(options: DbOptions) {
	const dbConfig: DbOptions = {
		url: options.url,
		ssl: options.ssl ? options.ssl : false,
		max: options.max ? options.max : 10
	};
	const db = drizzle({
		connection: dbConfig,
		schema: schema,
	});

	const migrationsTable = options.migrations_table || "schema_history";
	const migrationsSchema = options.migrations_schema || "public";

	await runMigrations(db, migrationsTable, migrationsSchema);

	return db;
}

/**
 * Common database helper for timestamps
 */
export const timestamps = {
	created_at: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: "date" }),
};

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
	v.union(
		[
			v.string(),
			v.number(),
			v.boolean(),
			v.date(),
			v.null(),
			v.record(
				v.string(),
				v.union(
					[
						v.string(),
						v.number(),
						v.boolean(),
						v.date(),
						v.null(),
					],
				),
			),
		],
	),
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