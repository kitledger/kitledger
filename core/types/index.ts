import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { accounts, entity_models, ledgers, transaction_models, unit_types } from '../services/database/schema.js';

/**
 * Account types
 */
export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;
export type RefinedNewAccount =
	& Omit<NewAccount, 'ledger_id' | 'balance_type'>
	& {
		ledger_id?: string;
		balance_type?: BalanceType;
	};
export type UpdateAccount = Pick<
	NewAccount,
	'ref_id' | 'alt_id' | 'name' | 'balance_type' | 'meta' | 'active'
>;

/**
 * Balance Types
 */
export enum BalanceType {
	DEBIT = 'DEBIT',
	CREDIT = 'CREDIT',
}

/**
 * Entity Model types
 */
export type EntityModel = InferSelectModel<typeof entity_models>;
export type NewEntityModel = InferInsertModel<typeof entity_models>;

/**
 * Transaction Model types
 */
export type TransactionModel = InferSelectModel<typeof transaction_models>;
export type NewTransactionModel = InferInsertModel<typeof transaction_models>;

/**
 * Ledger types
 */
export type Ledger = InferSelectModel<typeof ledgers>;
export type NewLedger = InferInsertModel<typeof ledgers>;
export type UpdateLedger = Pick<
	NewLedger,
	'ref_id' | 'alt_id' | 'name' | 'description' | 'active'
>;

/**
 * Unit Type types
 */
export type UnitType = InferSelectModel<typeof unit_types>;
export type NewUnitType = InferInsertModel<typeof unit_types>;
