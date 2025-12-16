import {
	EntityModel,
	EntityModelCreateData,
	EntityModelCreateSchema,
	EntityModelInsert,
} from "../types/entity_model_types.js";
import * as v from "valibot";
import {
	parseValibotIssues,
	ValidationError,
	ValidationFailure,
	ValidationResult,
	ValidationSuccess,
} from "../utils/validation.js";
import { db } from "../../services/database/db.js";
import { entity_models } from "../../services/database/schema.js";
import { eq } from "drizzle-orm";
import { v7 } from "uuid";

async function refIdAlreadyExists(refId: string): Promise<boolean> {
	const results = await db.query.entity_models.findMany({
		where: eq(entity_models.ref_id, refId),
		columns: { id: true },
	});
	return results.length > 0;
}

async function altIdAlreadyExists(altId: string | null): Promise<boolean> {
	if (!altId) {
		return false;
	}
	const results = await db.query.entity_models.findMany({
		where: eq(entity_models.alt_id, altId),
		columns: { id: true },
	});
	return results.length > 0;
}

async function validateEntityModelCreate(
	data: EntityModelCreateData,
): Promise<ValidationResult<EntityModelCreateData>> {
	const result = v.safeParse(EntityModelCreateSchema, data);
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

export async function createEntityModel(
	data: EntityModelCreateData,
): Promise<ValidationSuccess<EntityModel> | ValidationFailure<EntityModelCreateData>> {
	const validation = await validateEntityModelCreate(data);

	if (!validation.success || !validation.data) {
		return {
			success: false,
			data: data,
			errors: validation.errors,
		};
	}

	const insert_data: EntityModelInsert = {
		id: v7(),
		...validation.data,
	};

	const result = await db.insert(entity_models).values(insert_data).returning();

	if (result.length === 0) {
		return {
			success: false,
			data: validation.data,
			errors: [{
				type: "data",
				path: null,
				message: "Failed to create entity model.",
			}],
		};
	}

	return {
		success: true,
		data: result[0],
	};
}
