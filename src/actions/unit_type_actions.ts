import { db } from "../services/database/db.js";
import { unit_types } from "../services/database/schema.js";
import z from "zod";
import { NewUnitType } from "../types/index.js";
import { valueIsAvailable } from "../services/database/validation.js";

/**
 * Check if the name is available
 */
async function nameIsAvailable(name: string) {
	return await valueIsAvailable(unit_types, "name", name);
}

/**
 * Check if the ref_id is available
 */
async function refIdIsAvailable(ref_id: string) {
	return await valueIsAvailable(unit_types, "ref_id", ref_id);
}

/**
 * Check if the alt_id is available
 */
async function altIdIsAvailable(alt_id: string) {
	return await valueIsAvailable(unit_types, "alt_id", alt_id);
}

export async function validateCreation(data: NewUnitType) {
	const validationSchema = z.object({
		id: z.string().uuid(),
		ref_id: z.string().max(64, { message: "Ref ID must be less than 64 characters" }).refine(refIdIsAvailable, {
			message: "Ref ID already exists",
		}),
		alt_id: z
			.string()
			.max(64, { message: "Alt ID must be less than 64 characters" })
			.refine(altIdIsAvailable, {
				message: "Alt ID already exists",
			})
			.optional()
			.nullable(),
		name: z.string().max(255, { message: "Name must be less than 255 characters" }).refine(nameIsAvailable, {
			message: "Name already exists",
		}),
		active: z.boolean().optional().nullable(),
	});

	return await validationSchema.safeParseAsync(data);
}

/**
 * Create a new UOM type
 */
export async function create(data: NewUnitType) {
	return await db.insert(unit_types).values(data).returning();
}
