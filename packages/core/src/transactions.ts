import type { Field } from "./fields.js";

export enum TransactionModelStatus {
	ACTIVE,
	INACTIVE,
	FROZEN,
}

export type InferTransactionData<TFields extends readonly Field[]> = {
	[K in TFields[number] as K["ref_id"]]: K["__primitive_type"];
};

export type Transaction<TData = Record<string, any>> = {
	id: string;
	model_ref_id: string;
	created_at: Date;
	updated_at: Date;
	data: TData;
};

export type TransactionHook<TData> = (transaction: Transaction<TData>) => Promise<Transaction<TData>>;
export type TransactionHooks<TData = Record<string, any>> = {
	creating?: TransactionHook<TData>[];
	updating?: TransactionHook<TData>[];
	deleting?: TransactionHook<TData>[];
	created?: TransactionHook<TData>[];
	updated?: TransactionHook<TData>[];
	deleted?: TransactionHook<TData>[];
};

export type TransactionModel = {
	ref_id: string;
	alt_id?: string;
	name: string;
	status: TransactionModelStatus;
	fields?: Field[];
	hooks?: TransactionHooks<any>;
};

export type TransactionModelOptions<TFields extends readonly Field[]> = {
	ref_id: string;
	alt_id?: string;
	name: string;
	status?: TransactionModelStatus;
	fields?: TFields;
	hooks?: TransactionHooks<InferTransactionData<TFields>>;
};

export function defineTransactionModel<const TFields extends readonly Field[]>(
	options: TransactionModelOptions<TFields>,
): TransactionModel {
	const transactionModel: TransactionModel = {
		...options,
		status: options.status ?? TransactionModelStatus.ACTIVE,
		fields: options.fields as unknown as Field[],
		hooks: options.hooks as unknown as TransactionHooks<any>,
	};
	return transactionModel;
}
