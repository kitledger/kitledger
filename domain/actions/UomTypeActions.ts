import { db } from '../../infrastructure/database/db.ts';
import { uom_types } from '../../infrastructure/database/schema.ts';
import z from 'zod';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { valueIsAvailable } from '../../infrastructure/database/validation.ts';

export type UomType = InferSelectModel<typeof uom_types>;
export type NewUomType = InferInsertModel<typeof uom_types>;

async function nameIsAvailable(name: string) {
	return await valueIsAvailable(uom_types, 'name', name);
}

async function refIdIsAvailable(ref_id: string) {
	return await valueIsAvailable(uom_types, 'ref_id', ref_id);
}

async function altIdIsAvailable(alt_id: string) {
	return await valueIsAvailable(uom_types, 'alt_id', alt_id);
}

export async function validateCreation(data: NewUomType) {
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
		active: z.boolean().optional().nullable(),
	});

	return await validation_schema.safeParseAsync(data);
}

export async function create(data: NewUomType) {
	return await db.insert(uom_types).values(data).returning();
}
