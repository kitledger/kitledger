export enum TransactionModelStatus {
	ACTIVE,
	INACTIVE,
	FROZEN
}

export type TransactionModelOptions = {
	ref_id: string,
	alt_id?: string,
	name: string,
	status?: TransactionModelStatus
};

export type TransactionModel = TransactionModelOptions;

export function defineTransactionModel(options: TransactionModelOptions) {
	return options;
}