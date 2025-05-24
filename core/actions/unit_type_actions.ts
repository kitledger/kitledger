import { getDbInstance } from "../services/database/db.js";
import { kl_core_unit_types } from "../services/database/schema.js";
import z from "zod";
import { type NewUnitType } from "../types/index.js";
import { valueIsAvailable } from "../services/database/validation.js";

/**
 * Check if the name is available
 * @param name
 * @returns Promise<boolean>
 */
async function nameIsAvailable(name: string) {
	return await valueIsAvailable(kl_core_unit_types, "name", name);
}

/**
 * Check if the ref_id is available
 * @param ref_id
 * @returns Promise<boolean>
 */
async function refIdIsAvailable(ref_id: string) {
	return await valueIsAvailable(kl_core_unit_types, "ref_id", ref_id);
}

/**
 * Check if the alt_id is available
 * @param alt_id
 * @returns Promise<boolean>
 */
async function altIdIsAvailable(alt_id: string) {
	return await valueIsAvailable(kl_core_unit_types, "alt_id", alt_id);
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
 * @param data
 * @returns Promise<UnitType>
 */
export async function create(data: NewUnitType) {
	const db = getDbInstance();
	return await db.insert(kl_core_unit_types).values(data).returning();
}
