export const balance_types = ['debit', 'credit'] as const;
export type BalanceType = typeof balance_types[number];
