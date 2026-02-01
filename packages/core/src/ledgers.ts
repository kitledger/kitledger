import type { UnitModel } from "./units.js";

/**
 * Ledger definitions and utilities.
 *
 * @remarks
 * This module provides type definitions and functions for defining ledgers in the system.
 */
export type Ledger = {
	refId: string;
	name: string;
	description?: string;
	status: LedgerStatus;
	baseUnitModel: string;
};

export enum LedgerStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
}

/**
 * Options for defining a ledger.
 *
 * @param refId - The reference ID of the ledger.
 * @param name - The name of the ledger.
 * @param description - An optional description of the ledger.
 * @param active - An optional flag indicating if the ledger is active. Defaults to true.
 * @returns An object containing the options for the ledger.
 */
export type LedgerOptions = {
	refId: string;
	name: string;
	description?: string;
	status?: LedgerStatus;
};

/**
 * Defines a ledger with the given options.
 * @param options - The options for defining the ledger.
 * @returns The defined ledger.
 */
export function defineLedger(options: LedgerOptions, baseUnitModel: UnitModel): Ledger {
	return {
		...options,
		status: options.status ?? LedgerStatus.ACTIVE,
		baseUnitModel: baseUnitModel.refId,
	};
}
