import { ConditionGroup, Query, QuerySchema } from "@kitledger/query";
import { PgTable } from "drizzle-orm/pg-core";
import { getTableName } from "drizzle-orm";
import { parseValibotIssues, ValidationResult } from "./validation.js";
import {
	db,
	defaultLimit,
	defaultOffset,
	GetOperationResult,
	maxLimit,
	QueryResultRow,
	QueryResultSchema } from "./db.js";
import * as v from "valibot";
import knex, { Knex } from "knex";

/**
 * Maximum allowed nesting depth for filter groups to prevent overly complex queries.
 */
const MAX_NESTING_DEPTH = 5;

/**
 * Use valibot to validate and parse the incoming query parameters.
 * @param params
 * @returns
 */
function validateQueryParams(params: Query): ValidationResult<Query> {
	const result = v.safeParse(QuerySchema, params);

	if (!result.success) {
		return { success: false, errors: parseValibotIssues(result.issues) };
	}

	return { success: true, data: result.output };
}

/**
 * Prepares and executes a query against the specified table using the provided parameters.
 * @param table
 * @param params
 * @returns
 */
export async function executeQuery(table: PgTable, params: Query): Promise<GetOperationResult<QueryResultRow>> {
	const validationResult = validateQueryParams(params);
	const parsedParams = validationResult.success ? validationResult.data : null;

	if (!validationResult.success || !parsedParams) {
		console.error("Validation errors", validationResult.errors);
		return {
			data: [],
			count: 0,
			offset: 0,
			limit: 0,
			errors: validationResult.errors?.map((e) => ({ field: e.path || undefined, message: e.message })),
		};
	}

	try {
		const knexBuilder = knex({ client: "pg" });

		const limit = Math.min(parsedParams.limit ?? defaultLimit, maxLimit);
		const offset = parsedParams.offset ?? defaultOffset;

		const { sql, bindings } = buildQuery(knexBuilder, getTableName(table), params, limit, offset)
			.toSQL()
			.toNative();

		console.log("Executing query:", sql, bindings);

		const queryResult = await db.$client.unsafe(sql, bindings as string[]);

		console.log("Query result:", queryResult);

		const parsedQueryResult = v.safeParse(QueryResultSchema, queryResult);

		if (!parsedQueryResult.success) {
			console.error("Failed to parse query result", parsedQueryResult.issues);
			throw new Error("Failed to parse query result");
		}

		return {
			data: parsedQueryResult.output,
			count: parsedQueryResult.output.length ?? 0,
			offset: offset,
			limit: limit,
		};
	}
	catch (error) {
		return {
			data: [],
			count: 0,
			offset: 0,
			limit: 0,
			errors: [{ message: error instanceof Error ? error.message : "Query execution error" }],
		};
	}
}

/**
 * Recursively applies filters from a ConditionGroup to a Knex query builder.
 * @param queryBuilder
 * @param filterGroup
 * @param depth
 */
function applyFilters(queryBuilder: Knex.QueryBuilder, filterGroup: ConditionGroup, depth: number) {
	if (depth > MAX_NESTING_DEPTH) {
		throw new Error(`Query nesting depth exceeds the maximum of ${MAX_NESTING_DEPTH}.`);
	}

	// Use a nested 'where' to group conditions with parentheses, e.g., WHERE ( ... )
	queryBuilder.where(function () {
		for (const filter of filterGroup.conditions) {
			// Determine the chaining method (.where or .orWhere)
			const connector = filterGroup.connector;
			const method = filterGroup.connector === "or" ? "orWhere" : "where";

			// If the filter is another group, recurse
			if ("connector" in filter) {
				this[method](function () {
					// Pass the nested group directly and increment the depth
					applyFilters(this, filter, depth + 1);
				});
				continue;
			}

			// Apply the specific filter condition
			const { column, operator, value } = filter;
			switch (operator) {
				case "in": {
					const caseMethod = connector === "or" ? "orWhereIn" : "whereIn";
					this[caseMethod](column, value);
					break;
				}

				case "not_in": {
					const caseMethod = connector === "or" ? "orWhereNotIn" : "whereNotIn";
					this[caseMethod](column, value);
					break;
				}

				case "empty": {
					const caseMethod = connector === "or" ? "orWhereNull" : "whereNull";
					this[caseMethod](column);
					break;
				}

				case "not_empty": {
					const caseMethod = connector === "or" ? "orWhereNotNull" : "whereNotNull";
					this[caseMethod](column);
					break;
				}
				// Handles =, !=, >, <, etc.
				default: {
					this[method](column, operator, value);
					break;
				}
			}
		}
	});
}

/**
 * Builds a Knex query object from a QueryOptions configuration.
 * @param kx - The Knex instance.
 * @param tableName - The name of the table to query.
 * @param options - The QueryOptions object.
 * @returns A Knex QueryBuilder instance.
 */
export function buildQuery(
	kx: Knex,
	tableName: string,
	options: Query,
	limit: number,
	offset: number,
): Knex.QueryBuilder {
	let query: Knex.QueryBuilder;
	let fromClause: string = tableName;

	// 1. Process Recursive CTE (now with hardcoded conventions)
	if (options.recursive) {
		// Hardcoded conventions for simplicity
		const cteName = "hierarchy";
		const parentKey = "id";
		const childKey = "parent_id";

		fromClause = cteName; // The rest of the query will select FROM the CTE result.

		const { direction, startWith } = options.recursive;

		// Build the "anchor" query that finds the starting records.
		const anchorBuilder = kx.from(tableName).where((qb) => applyFilters(qb, startWith, 1));
		const { sql: anchorSql, bindings: anchorBindings } = anchorBuilder.toSQL().toNative();

		// Determine the join direction based on 'ancestors' or 'descendants'
		const [joinFrom, joinTo] = direction === "ancestors"
			? [`t."${parentKey}"`, `h."${childKey}"`] // To find a parent, match table's PK to hierarchy's FK
			: [`t."${childKey}"`, `h."${parentKey}"`]; // To find children, match table's FK to hierarchy's PK

		const cteBodySql = `
            (${anchorSql})
            UNION ALL
            SELECT t.*
            FROM "${tableName}" AS t
            JOIN "${cteName}" AS h ON ${joinFrom} = ${joinTo}
        `;

		query = kx.withRecursive(cteName, kx.raw(cteBodySql, anchorBindings)).from(fromClause);
	}
	else {
		query = kx(fromClause);
	}

	// 2. Process Joins
	if (options.joins?.length) {
		options.joins.forEach((join) => {
			// Handle table aliasing (e.g., 'users as u')
			const tableToJoin = join.as ? `${join.table} as ${join.as}` : join.table;

			switch (join.type) {
				case "inner":
					query.innerJoin(tableToJoin, join.onLeft, join.onRight);
					break;
				case "left":
					query.leftJoin(tableToJoin, join.onLeft, join.onRight);
					break;
				case "right":
					query.rightJoin(tableToJoin, join.onLeft, join.onRight);
					break;
				case "full_outer":
					query.fullOuterJoin(tableToJoin, join.onLeft, join.onRight);
					break;
			}
		});
	}

	// 3. Process Columns (SELECT)
	const selections = options.select.map((col) => {
		if (typeof col === "string") {
			return col;
		}
		if ("func" in col) {
			// Use knex.raw for aggregate functions to prevent SQL injection
			return kx.raw(`${col.func.toUpperCase()}(??) as ??`, [col.column, col.as]);
		}
		// Handle aliasing
		return col.as ? `${col.column} as ${col.as}` : col.column;
	});
	query.select(selections);

	// 4. Process Filters (WHERE), starting with depth 1
	options.where.forEach((group) => applyFilters(query, group, 1));

	// 5. Process Group By
	if (options.groupBy?.length) {
		query.groupBy(options.groupBy);
	}

	// 6. Process Sorts (ORDER BY)
	if (options.orderBy?.length) {
		// Knex's orderBy can take an array of objects directly
		query.orderBy(options.orderBy.map((s) => ({ column: s.column, order: s.direction })));
	}

	// 7. Process Limit
	query.limit(limit);

	// 8. Process Offset
	query.offset(offset);

	return query;
}