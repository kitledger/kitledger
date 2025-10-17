import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as v from "valibot";
import type { InferOutput } from "valibot";
import { accounts, ledgers } from "../../services/database/schema.js";

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

export type LedgerInsert = InferInsertModel<typeof ledgers>;
export type Ledger = InferSelectModel<typeof ledgers>;
export type LedgerCreateData = InferOutput<typeof LedgerCreateSchema>;
