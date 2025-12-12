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

export type TransactionModel = {
	ref_id: string,
	alt_id?: string,
	name: string,
	status: TransactionModelStatus
};

export function defineTransactionModel(options: TransactionModelOptions) :TransactionModel {
	const transactionModel: TransactionModel = {
		...options,
		status: options.status ?? TransactionModelStatus.ACTIVE
	};
	return transactionModel;
}