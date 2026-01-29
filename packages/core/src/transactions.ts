import type { Field } from "./fields.js";

export enum TransactionModelStatus {
	ACTIVE,
	INACTIVE,
}

export type InferTransactionMetaType<TFields extends readonly Field[]> = {
	[K in TFields[number] as K["refId"]]: K["__valueType"];
};

export type Transaction<TData = Record<string, any>> = {
	id: string;
	modelRefId: string;
	createdAt: Date;
	updatedAt: Date;
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
	refId: string;
	altId?: string;
	name: string;
	status: TransactionModelStatus;
	fields?: Field[];
	hooks?: TransactionHooks<any>;
	//postingHook: any; // Temporary. Will be a function that returns an array of ledger entries. It must be called after all the hooks. 
};

export type TransactionModelOptions<TFields extends readonly Field[]> = {
	refId: string;
	altId?: string;
	name: string;
	status?: TransactionModelStatus;
	fields?: TFields;
	hooks?: TransactionHooks<InferTransactionMetaType<TFields>>;
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
