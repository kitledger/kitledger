import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { and, eq, or, type SQL, sql } from "drizzle-orm";
import { v7 } from "uuid";
import * as v from "valibot";
import { InferOutput } from "valibot";

import { KitledgerDb } from "./db.js";
import {
	ANY,
	defaultLimit,
	defaultOffset,
	FilterOperationParameters,
	GetOperationResult,
	maxLimit,
	parseBooleanFilterValue,
} from "./db.js";
import { Ledger } from "./ledgers.js";
import { accounts } from "./schema.js";
import {
	parseValibotIssues,
	ValidationError,
	ValidationFailure,
	ValidationResult,
	ValidationSuccess,
} from "./validation.js";

export enum BalanceType {
	DEBIT = "debit",
	CREDIT = "credit",
}

export const AccountCreateSchema = v.object({
	ref_id: v.pipe(v.string(), v.maxLength(64)),
	alt_id: v.nullish(v.pipe(v.string(), v.maxLength(64)), null),
	balance_type: v.enum(BalanceType),
	ledger_id: v.string(),
	parent_id: v.optional(v.nullable(v.string())),
	name: v.pipe(v.string(), v.nonEmpty(), v.maxLength(64)),
	meta: v.nullish(v.record(v.string(), v.union([v.string(), v.number(), v.date(), v.boolean(), v.null()])), null),
	active: v.nullish(v.boolean(), true),
	created_at: v.optional(v.date()),
	updated_at: v.optional(v.nullable(v.date())),
});

export type AccountInsert = InferInsertModel<typeof accounts>;
export type Account = InferSelectModel<typeof accounts>;
export type AccountCreateData = InferOutput<typeof AccountCreateSchema>;

/**
 * Procedurally builds and executes a filter query for accounts based on the provided parameters.
 * @param params
 * @returns
 */
export async function filterAccounts(
	db: KitledgerDb,
	ledgers: Ledger[],
	params: FilterOperationParameters,
): Promise<GetOperationResult<Account>> {
	const { limit = defaultLimit, offset = defaultOffset, ...filters } = params;

	const filterConditions: SQL<unknown>[] = [];

	let ledgerId: string | null = null;

	for (const [key, value] of Object.entries(filters)) {
		if (key === accounts.id.name && String(value).length > 0) {
			filterConditions.push(eq(accounts.id, String(value)));
		}

		if (key === accounts.ref_id.name && String(value).length > 0) {
			filterConditions.push(eq(accounts.ref_id, String(value)));
		}

		if (key === accounts.alt_id.name && String(value).length > 0) {
			filterConditions.push(eq(accounts.alt_id, String(value)));
		}

		if (key === accounts.balance_type.name && String(value).length > 0) {
			filterConditions.push(eq(accounts.balance_type, String(value) as BalanceType));
		}

		if (key === accounts.name.name && String(value).length > 0) {
			filterConditions.push(sql`${accounts.name} ILIKE ${"%" + String(value) + "%"}`);
		}

		if (key === accounts.ledger_id.name && String(value).length > 0) {
			ledgerId = await findLedgerId(ledgers, String(value));
			if (ledgerId) {
				filterConditions.push(eq(accounts.ledger_id, ledgerId));
			}
		}

		if (key === accounts.active.name && String(value).length > 0) {
			if (value === ANY) {
				continue;
			}
			const booleanValue = parseBooleanFilterValue(String(value));
			if (booleanValue !== null) {
				filterConditions.push(eq(accounts.active, booleanValue));
			}
		}

		if (key === accounts.parent_id.name && String(value).length > 0) {
			const parentAccount = await findParentAccount(db, String(value), null);
			if (parentAccount) {
				filterConditions.push(eq(accounts.parent_id, parentAccount.id));
			} else {
				filterConditions.push(eq(sql`${accounts.parent_id}::text`, value));
			}
		}
	}

	// Default to only active accounts if no active filter is provided
	if (!Object.keys(filters).includes(accounts.active.name)) {
		filterConditions.push(eq(accounts.active, true));
	}

	const results = await db
		.select()
		.from(accounts)
		.where(and(...filterConditions))
		.limit(Math.min(limit, maxLimit))
		.offset(offset);

	return {
		data: results,
		limit: Math.min(limit, maxLimit),
		offset: offset,
		count: results.length,
	};
}

/**
 * Finds the parent account by ID or ref_id or alt_id.
 * Returns the ID of the parent account if found, otherwise returns null.
 */
export async function findParentAccount(
	db: KitledgerDb,
	parentId: string,
	ledgerId?: string | null,
): Promise<Account | null> {
	if (!parentId) {
		return null;
	}
	const parent = await db.query.accounts.findFirst({
		where: and(
			or(eq(sql`${accounts.id}::text`, parentId), eq(accounts.ref_id, parentId), eq(accounts.alt_id, parentId)),
			ledgerId ? eq(accounts.ledger_id, ledgerId) : undefined,
			eq(accounts.active, true),
		),
	});
	return parent ? parent : null;
}

/**
 * Finds the ledger by ID or ref_id or alt_id.
 * @param ledgerId
 * @returns
 */
export async function findLedgerId(ledgers: Ledger[], ledgerId: string): Promise<string | null> {
	const ledger = ledgers.find((l) => l.refId === ledgerId);
	return ledger ? ledger.refId : null;
}

// ACTIONS
async function refIdAlreadyExists(db: KitledgerDb, refId: string): Promise<boolean> {
	const results = await db.query.accounts.findMany({
		where: eq(accounts.ref_id, refId),
		columns: { id: true },
	});
	return results.length > 0;
}

async function altIdAlreadyExists(db: KitledgerDb, altId: string | null): Promise<boolean> {
	if (!altId) {
		return false;
	}
	const results = await db.query.accounts.findMany({
		where: eq(accounts.alt_id, altId),
		columns: { id: true },
	});
	return results.length > 0;
}

async function validateAccountCreate(
	db: KitledgerDb,
	ledgers: Ledger[],
	data: AccountCreateData,
): Promise<ValidationResult<AccountCreateData>> {
	const result = v.safeParse(AccountCreateSchema, data);
	let success = result.success;

	if (!result.success) {
		return { success: false, errors: parseValibotIssues(result.issues) };
	}

	const errors: ValidationError[] = [];

	const [refIdError, altIdError, ledgerId] = await Promise.all([
		refIdAlreadyExists(db, result.output.ref_id),
		altIdAlreadyExists(db, result.output.alt_id ?? null),
		findLedgerId(ledgers, result.output.ledger_id),
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

	if (ledgerId) {
		result.output.ledger_id = ledgerId;
	} else {
		success = false;
		errors.push({
			type: "data",
			path: "ledger_id",
			message: "Invalid ledger ID.",
		});
	}

	if (result.output.parent_id) {
		const parentAccount = await findParentAccount(db, result.output.parent_id, result.output.ledger_id);
		if (parentAccount) {
			result.output.parent_id = result.output.parent_id ? parentAccount.id : null;
			result.output.balance_type = parentAccount.balance_type;
		} else {
			success = false;
			errors.push({
				type: "data",
				path: "parent_id",
				message: "Invalid parent account ID.",
			});
		}
	}

	return { success, data: result.output, errors: errors };
}

export async function createAccount(
	db: KitledgerDb,
	ledgers: Ledger[],
	data: AccountCreateData,
): Promise<ValidationSuccess<Account> | ValidationFailure<AccountCreateData>> {
	const validation = await validateAccountCreate(db, ledgers, data);

	if (!validation.success || !validation.data) {
		return {
			success: false,
			data: data,
			errors: validation.errors,
		};
	}

	const insertData: AccountInsert = {
		id: v7(),
		...validation.data,
	};

	const result = await db.insert(accounts).values(insertData).returning();

	if (result.length === 0) {
		return {
			success: false,
			data: validation.data,
			errors: [
				{
					type: "data",
					path: null,
					message: "Failed to create account.",
				},
			],
		};
	}

	return {
		success: true,
		data: result[0],
	};
}
