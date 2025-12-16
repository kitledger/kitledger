import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { and, eq, or, type SQL, sql } from "drizzle-orm";
import * as v from "valibot";
import { InferOutput } from "valibot";
import { ledgers, unit_models } from "./schema.js";
import { db } from "./db.js";
import {
	ANY,
	defaultLimit,
	defaultOffset,
	FilterOperationParameters,
	GetOperationResult,
	maxLimit,
	parseBooleanFilterValue,
} from "./db.js";

export const LedgerCreateSchema = v.object({
	ref_id: v.pipe(v.string(), v.maxLength(64)),
	alt_id: v.nullish(v.pipe(v.string(), v.maxLength(64)), null),
	name: v.pipe(v.string(), v.nonEmpty(), v.maxLength(64)),
	description: v.nullable(v.pipe(v.string(), v.maxLength(255))),
	unit_model_id: v.string(),
	active: v.nullish(v.boolean(), true),
	created_at: v.optional(v.date()),
	updated_at: v.optional(v.nullable(v.date())),
});
import { ValidationSuccess, ValidationFailure, ValidationResult, parseValibotIssues, ValidationError } from "./validation.js";
import { v7 } from "uuid";

export type LedgerInsert = InferInsertModel<typeof ledgers>;
export type Ledger = InferSelectModel<typeof ledgers>;
export type LedgerCreateData = InferOutput<typeof LedgerCreateSchema>;

export async function findUnitModelId(unitTypeId: string): Promise<string | null> {
	const unitModel = await db.query.unit_models.findFirst({
		where: and(
			or(
				eq(sql`${unit_models.id}::text`, unitTypeId),
				eq(unit_models.ref_id, unitTypeId),
				eq(unit_models.alt_id, unitTypeId),
			),
			eq(unit_models.active, true),
		),
		columns: { id: true },
	});
	return unitModel ? unitModel.id : null;
}

export async function filterLedgers(params: FilterOperationParameters): Promise<GetOperationResult<Ledger>> {
	const { limit = defaultLimit, offset = defaultOffset, ...filters } = params;

	const filterConditions: SQL<unknown>[] = [];

	for (const [key, value] of Object.entries(filters)) {
		if (key === ledgers.id.name && String(value).length > 0) {
			filterConditions.push(eq(ledgers.id, String(value)));
		}

		if (key === ledgers.ref_id.name && String(value).length > 0) {
			filterConditions.push(eq(ledgers.ref_id, String(value)));
		}

		if (key === ledgers.alt_id.name && String(value).length > 0) {
			filterConditions.push(eq(ledgers.alt_id, String(value)));
		}

		if (key === ledgers.name.name && String(value).length > 0) {
			filterConditions.push(sql`${ledgers.name} ILIKE ${"%" + String(value) + "%"}`);
		}

		if (key === ledgers.active.name && String(value).length > 0) {
			if (value === ANY) {
				continue;
			}
			const booleanValue = parseBooleanFilterValue(String(value));
			if (booleanValue !== null) {
				filterConditions.push(eq(ledgers.active, booleanValue));
			}
		}

		if (key === ledgers.unit_model_id.name && String(value).length > 0) {
			const unitModelId = await findUnitModelId(String(value));
			if (unitModelId) {
				filterConditions.push(eq(ledgers.unit_model_id, unitModelId));
			}
		}
	}

	// By default, only return active ledgers unless explicitly filtered otherwise
	if (!Object.keys(filters).includes(ledgers.active.name)) {
		filterConditions.push(eq(ledgers.active, true));
	}

	const results = await db.select().from(ledgers).where(and(...filterConditions))
		.limit(Math.min(limit, maxLimit))
		.offset(offset);

	return {
		data: results,
		limit: Math.min(limit, maxLimit),
		offset: offset,
		count: results.length,
	};
}

async function refIdAlreadyExists(refId: string): Promise<boolean> {
	const results = await db.query.ledgers.findMany({
		where: eq(ledgers.ref_id, refId),
		columns: { id: true },
	});
	return results.length > 0;
}

async function altIdAlreadyExists(altId: string | null): Promise<boolean> {
	if (!altId) {
		return false;
	}
	const results = await db.query.ledgers.findMany({
		where: eq(ledgers.alt_id, altId),
		columns: { id: true },
	});
	return results.length > 0;
}

async function validateLedgerCreate(data: LedgerCreateData): Promise<ValidationResult<LedgerCreateData>> {
	const result = v.safeParse(LedgerCreateSchema, data);
	let success = result.success;

	if (!result.success) {
		return {
			success: false,
			errors: parseValibotIssues(result.issues),
		};
	}

	const errors: ValidationError[] = [];

	const [refIdError, altIdError, unitModelId] = await Promise.all([
		refIdAlreadyExists(data.ref_id),
		altIdAlreadyExists(data.alt_id ?? null),
		findUnitModelId(data.unit_model_id),
	]);

	if (refIdError) {
		success = false;
		errors.push({
			type: "data",
			path: "ref_id",
			message: "Ref ID already exists.",
		});
	}

	if (altIdError) {
		success = false;
		errors.push({
			type: "data",
			path: "alt_id",
			message: "Alt ID already exists.",
		});
	}

	if (unitModelId) {
		result.output.unit_model_id = unitModelId;
	}
	else {
		success = false;
		errors.push({
			type: "data",
			path: "unit_model_id",
			message: "Unit type ID does not exist or is inactive.",
		});
	}

	return {
		success: success,
		data: result.output,
		errors: errors,
	};
}

export async function createLedger(
	data: LedgerCreateData,
): Promise<ValidationSuccess<Ledger> | ValidationFailure<LedgerCreateData>> {
	const validation = await validateLedgerCreate(data);

	if (!validation.success || !validation.data) {
		return {
			success: false,
			data: data,
			errors: validation.errors,
		};
	}

	const insertData: LedgerInsert = {
		id: v7(),
		...validation.data,
	};

	const result = await db.insert(ledgers).values(insertData).returning();

	if (result.length === 0) {
		return {
			success: false,
			data: validation.data,
			errors: [{
				type: "data",
				path: null,
				message: "Failed to create ledger.",
			}],
		};
	}

	return {
		success: true,
		data: result[0],
	};
}
