import { getDbInstance } from "../services/database/db.js";
import { kl_core_ledgers, kl_core_unit_types } from "../services/database/schema.js";
import z from "zod";
import { eq, or } from "drizzle-orm";
import { valueIsAvailable } from "../services/database/validation.js";
import { validate as validateUuid } from "uuid";
import { type NewLedger } from "../types/index.js";

/**
 * Check if the name is available
 * @param name
 * @returns Promise<boolean>
 */
async function nameIsAvailable(name: string) {
	return await valueIsAvailable(kl_core_ledgers, "name", name);
}

/**
 * Check if the ref_id is available
 * @param ref_id
 * @returns Promise<boolean>
 */
async function refIdIsAvailable(ref_id: string) {
	return await valueIsAvailable(kl_core_ledgers, "ref_id", ref_id);
}

/**
 * Check if the alt_id is available
 * @param alt_id
 * @returns Promise<boolean>
 */
async function altIdIsAvailable(alt_id: string) {
	return await valueIsAvailable(kl_core_ledgers, "alt_id", alt_id);
}

/**
 * Validate the creation of a new ledger
 * @param data
 * @returns Promise<z.infer<typeof validationSchema>>
 */
export async function validateCreation(data: NewLedger) {
	const db = getDbInstance();
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
		description: z.string().optional().nullable(),
		unit_type_id: z
			.string()
			.transform(async (unit_type_id, ctx) => {
				const is_uuid = validateUuid(unit_type_id);

				const filters = is_uuid
					? {
							where: eq(kl_core_unit_types.id, unit_type_id),
						}
					: {
							where: or(eq(kl_core_unit_types.ref_id, unit_type_id), eq(kl_core_unit_types.alt_id, unit_type_id)),
						};

				const existing_uom_type = await db.query.kl_core_unit_types.findFirst(filters);

				if (!existing_uom_type) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Invalid UOM type ID ${unit_type_id}`,
					});

					return z.NEVER;
				}

				return existing_uom_type.id;
			})
			.optional(),
		active: z.boolean().optional().nullable(),
	});

	return await validationSchema.safeParseAsync(data);
}

/**
 * Create a new ledger
 * @param data
 * @returns Promise<InferSelectModel<typeof ledgers>>
 */
export async function create(data: NewLedger) {
	const db = getDbInstance();
	return await db.insert(kl_core_ledgers).values(data).returning();
}
