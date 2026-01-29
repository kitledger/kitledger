import type { Field } from "./fields.js";

export enum UnitModelStatus {
	ACTIVE,
	INACTIVE,
}

export type InferUnitMetaType<TFields extends readonly Field[]> = {
	[K in TFields[number] as K["refId"]]: K["__valueType"];
};

export type Unit<TData = Record<string, any>> = {
	id: string;
	modelRefId: string;
	createdAt: Date;
	updatedAt: Date;
	data: TData;
};

export type UnitHook<TData> = (unit: Unit<TData>) => Promise<Unit<TData>>;
export type UnitHooks<TData = Record<string, any>> = {
	creating?: UnitHook<TData>[];
	updating?: UnitHook<TData>[];
	deleting?: UnitHook<TData>[];
	created?: UnitHook<TData>[];
	updated?: UnitHook<TData>[];
	deleted?: UnitHook<TData>[];
};

export type UnitModel = {
	refId: string;
	altId?: string;
	name: string;
	status: UnitModelStatus;
	fields?: Field[];
	hooks?: UnitHooks<any>;
};

export type UnitModelOptions<TFields extends readonly Field[]> = {
	refId: string;
	altId?: string;
	name: string;
	status?: UnitModelStatus;
	fields?: TFields;
	hooks?: UnitHooks<InferUnitMetaType<TFields>>;
};

export function defineUnitModel<const TFields extends readonly Field[]>(
	options: UnitModelOptions<TFields>,
): UnitModel & { fields: TFields } {
	return {
		...options,
		status: options.status ?? UnitModelStatus.ACTIVE,
		fields: options.fields,
		hooks: options.hooks as unknown as UnitHooks<any>,
	} as UnitModel & { fields: TFields };
}
