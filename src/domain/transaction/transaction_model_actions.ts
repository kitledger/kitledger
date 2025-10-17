import {
	type TransactionModel,
	type TransactionModelCreateData,
	TransactionModelCreateSchema,
	type TransactionModelInsert,
} from "./types.ts";
import * as v from "valibot";
import {
	parseValibotIssues,
	type ValidationError,
	type ValidationFailure,
	type ValidationResult,
	type ValidationSuccess,
} from "../base/validation.ts";
import { db } from "../../services/database/db.ts";
import { transaction_models } from "../../services/database/schema.ts";
import { eq } from "drizzle-orm";
import {v7} from "uuid";

async function refIdAlreadyExists(refId: string): Promise<boolean> {
	const results = await db.query.transaction_models.findMany({
		where: eq(transaction_models.ref_id, refId),
		columns: { id: true },
	});
	return results.length > 0;
}

async function altIdAlreadyExists(altId: string | null): Promise<boolean> {
	if (!altId) {
		return false;
	}
	const results = await db.query.transaction_models.findMany({
		where: eq(transaction_models.alt_id, altId),
		columns: { id: true },
	});
	return results.length > 0;
}

async function validateTransactionModelCreate(
	data: TransactionModelCreateData,
): Promise<ValidationResult<TransactionModelCreateData>> {
	const result = v.safeParse(TransactionModelCreateSchema, data);
	let success = result.success;

	if (!result.success) {
		return {
			success: false,
			errors: parseValibotIssues(result.issues),
		};
	}

	const errors: ValidationError[] = [];

	const [refIdError, altIdError] = await Promise.all([
		refIdAlreadyExists(data.ref_id),
		altIdAlreadyExists(data.alt_id ?? null),
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

	return {
		success: success,
		data: result.output,
		errors: errors,
	};
}

export async function createTransactionModel(
	data: TransactionModelCreateData,
): Promise<ValidationSuccess<TransactionModel> | ValidationFailure<TransactionModelCreateData>> {
	const validation = await validateTransactionModelCreate(data);

	if (!validation.success || !validation.data) {
		return {
			success: false,
			data: data,
			errors: validation.errors,
		};
	}

	const insert_data: TransactionModelInsert = {
		id: v7(),
		...validation.data,
	};

	const result = await db.insert(transaction_models).values(insert_data).returning();

	if (result.length === 0) {
		return {
			success: false,
			data: validation.data,
			errors: [{
				type: "data",
				path: null,
				message: "Failed to create transaction model.",
			}],
		};
	}

	return {
		success: true,
		data: result[0]!,
	};
}
