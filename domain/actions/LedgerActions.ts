import { db } from '../../infrastructure/database/db.ts';
import { uom_types, ledgers } from '../../infrastructure/database/schema.ts';
import z from 'zod';
import { eq, or, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { valueIsAvailable } from '../../infrastructure/database/validation.ts';
import { validate as validateUuid } from 'uuid';

export type Ledger = InferSelectModel<typeof ledgers>;
export type NewLedger = InferInsertModel<typeof ledgers>;
export type UpdateLedger = Pick<
	NewLedger,
	'ref_id' | 'alt_id' | 'name' | 'description' | 'active'
>;

async function nameIsAvailable(name: string) {
	return await valueIsAvailable(ledgers, 'name', name);
}

async function refIdIsAvailable(ref_id: string) {
	return await valueIsAvailable(ledgers, 'ref_id', ref_id);
}

async function altIdIsAvailable(alt_id: string) {
	return await valueIsAvailable(ledgers, 'alt_id', alt_id);
}

export async function validateCreation(data: NewLedger) {
	const validation_schema = z.object({
		id: z.string().uuid(),
		ref_id: z.string()
			.max(64, { message: 'Ref ID must be less than 64 characters' })
			.refine(refIdIsAvailable, {
				message: 'Ref ID already exists',
			}),
		alt_id: z.string()
			.max(64, { message: 'Alt ID must be less than 64 characters' })
			.refine(altIdIsAvailable, {
				message: 'Alt ID already exists',
			})
			.optional()
			.nullable(),
		name: z.string()
			.max(255, { message: 'Name must be less than 255 characters' })
			.refine(nameIsAvailable, {
				message: 'Name already exists',
			}),
		description: z.string().optional().nullable(),
		uom_type_id: z.string()
			.transform(async (uom_type_id, ctx) => {
				const is_uuid = validateUuid(uom_type_id);

				const filters = is_uuid
					? {
						where: eq(uom_types.id, uom_type_id),
					}
					: {
						where: or(
							eq(uom_types.ref_id, uom_type_id),
							eq(uom_types.alt_id, uom_type_id),
						),
					};

				const existing_uom_type = await db.query.uom_types.findFirst(
					filters,
				);

				if (!existing_uom_type) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Invalid UOM type ID ${uom_type_id}`,
					});

					return z.NEVER;
				}

				return existing_uom_type.id;
			}).optional(),
		active: z.boolean().optional().nullable(),
	});

	return await validation_schema.safeParseAsync(data);
}

export async function create(data: NewLedger) {
	return await db.insert(ledgers).values(data).returning();
}
