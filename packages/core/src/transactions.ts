import type { Field } from "./fields.js";

/**
 * Enumeration for the status of a transaction model.
 */
export type TransactionModelStatus = "ACTIVE" | "INACTIVE";

/**
 * Infers the meta type of a transaction based on its fields.
 */
export type InferTransactionMetaType<TFields extends readonly Field[]> = {
	[K in TFields[number] as K["refId"]]: K["__valueType"];
};

/**
 * Type definition for a transaction in the system.
 */
export type Transaction<TData = Record<string, any>> = {
	id: string;
	modelRefId: string;
	createdAt: Date;
	updatedAt: Date;
	data: TData;
};

/**
 * Type definition for a hook function that operates on a transaction.
 *
 * @param TData - The type of the data contained within the transaction.
 * @returns A promise that resolves to the modified transaction.
 *
 */
export type TransactionHook<TData> = (transaction: Transaction<TData>) => Promise<Transaction<TData>>;

/**
 * Type definition for the hooks associated with a transaction.
 * @param TData - The type of the data contained within the transaction.
 * @returns An object containing arrays of hook functions for various transaction lifecycle events.
 */
export type TransactionHooks<TData = Record<string, any>> = {
	creating?: TransactionHook<TData>[];
	updating?: TransactionHook<TData>[];
	deleting?: TransactionHook<TData>[];
	created?: TransactionHook<TData>[];
	updated?: TransactionHook<TData>[];
	deleted?: TransactionHook<TData>[];
};

/**
 * Type definition for a transaction model in the system.
 *
 * @returns An object representing the transaction model with its metadata, fields, and hooks.
 */
export type TransactionModel = {
	refId: string;
	altId?: string;
	name: string;
	status: TransactionModelStatus;
	fields?: Field[];
	hooks?: TransactionHooks<any>;
	//postingHook: any; // Temporary. Will be a function that returns an array of ledger entries. It must be called after all the hooks.
};

/** Options for defining a transaction model.
 *
 * @param TFields - An array of Field definitions.
 * @returns An object containing the options for the transaction model.
 */
export type TransactionModelOptions<TFields extends readonly Field[]> = {
	refId: string;
	altId?: string;
	name: string;
	status?: TransactionModelStatus;
	fields?: TFields;
	hooks?: TransactionHooks<InferTransactionMetaType<TFields>>;
};

/**
 * Defines a transaction model with the given options.
 *
 * @remarks
 * Sets default status to ACTIVE if not provided.
 *
 * @param options - The options for defining the transaction model.
 * @returns The defined transaction model with its fields.
 */
export function defineTransactionModel<const TFields extends readonly Field[]>(
	options: TransactionModelOptions<TFields>,
): TransactionModel & { fields: TFields } {
	return {
		...options,
		status: options.status ?? "ACTIVE",
		fields: options.fields,
		hooks: options.hooks as unknown as TransactionHooks<any>,
	} as TransactionModel & { fields: TFields };
}
