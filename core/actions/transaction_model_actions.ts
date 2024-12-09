import { db } from '../services/postgres/db.ts';
import { transaction_models } from '../services/postgres/schema.ts';
import z from 'zod';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { valueIsAvailable } from '../services/postgres/validation.ts';

export type TransactionModel = InferSelectModel<typeof transaction_models>;
export type NewTransactionModel = InferInsertModel<typeof transaction_models>;

/**
 * Check if the name is available
 * @param name 
 * @returns Promise<boolean>
 */
async function nameIsAvailable(name: string) :Promise<boolean> {
	return await valueIsAvailable(transaction_models, 'name', name);
}

/**
 * Check if the ref_id is available
 * @param ref_id 
 * @returns :Promise<boolean>
 */
async function refIdIsAvailable(ref_id: string) :Promise<boolean> {
	return await valueIsAvailable(transaction_models, 'ref_id', ref_id);
}

/**
 * Check if the alt_id is available
 * @param alt_id 
 * @returns :Promise<boolean>
 */
async function altIdIsAvailable(alt_id: string) :Promise<boolean> {
	return await valueIsAvailable(transaction_models, 'alt_id', alt_id);
}

/**
 * Validate the creation of a new transaction model
 * @param data
 * @returns Promise<z.infer<typeof validationSchema>>
 */
export async function validateCreation(data: NewTransactionModel) {
	const validationSchema = z.object({
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

	return await validationSchema.safeParseAsync(data);
}

/**
 * Create a new transaction model
 * @param data 
 */
export async function create(data: NewTransactionModel) {
	return await db.insert(transaction_models).values(data).returning();
}