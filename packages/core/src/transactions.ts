import type { Field } from "./fields.js";

export enum TransactionModelStatus {
	ACTIVE,
	INACTIVE,
	FROZEN,
}

export type Transaction = {
	id: string;
	model_ref_id: string;
	created_at: Date;
	updated_at: Date;
	data: Record<string, any>;
};

export type TransactionHook = (transaction: Transaction) => Promise<Transaction>;
export type TransactionHooks = {
	creating?: TransactionHook[];
	updating?: TransactionHook[];
	deleting?: TransactionHook[];
	created?: TransactionHook[];
	updated?: TransactionHook[];
	deleted?: TransactionHook[];
};

export type TransactionModel = {
	ref_id: string;
	alt_id?: string;
	name: string;
	status: TransactionModelStatus;
	fields?: Field[];
	hooks?: TransactionHooks;
};

export type TransactionModelOptions = {
	ref_id: string;
	alt_id?: string;
	name: string;
	status?: TransactionModelStatus;
	fields?: Field[];
	hooks?: TransactionHooks;
};

export function defineTransactionModel(options: TransactionModelOptions): TransactionModel {
	const transactionModel: TransactionModel = {
		...options,
		status: options.status ?? TransactionModelStatus.ACTIVE,
	};
	return transactionModel;
}
