export enum TransactionModelStatus {
    ACTIVE,
    INACTIVE,
    FROZEN
}

export type Transaction<T = Record<string, any>> = {
    id: string;
    model_ref_id: string;
    created_at: Date;
    updated_at: Date;
    data: T;
}

export type TransactionPipe<T> = (
    transaction: Transaction<T>
) => Promise<Transaction<T> | void>;

export type TransactionListener<T> = (
    transaction: Readonly<Transaction<T>>
) => Promise<void>;

export type TransactionModel<T = Record<string, any>> = {
    ref_id: string;
    alt_id?: string;
    name: string;
    status: TransactionModelStatus;
    hooks?: {
        // "Before" hooks are Pipes
        creating?: TransactionPipe<T>[]; 
        updating?: TransactionPipe<T>[]; 

        // "After" hooks are Listeners
        created?: TransactionListener<T>[];
        updated?: TransactionListener<T>[];
    };
};

export type TransactionModelOptions = {
	ref_id: string,
	alt_id?: string,
	name: string,
	status?: TransactionModelStatus
};

export function defineTransactionModel(options: TransactionModelOptions) :TransactionModel {
	const transactionModel: TransactionModel = {
		...options,
		status: options.status ?? TransactionModelStatus.ACTIVE
	};
	return transactionModel;
}