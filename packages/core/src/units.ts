import type { Field } from "./fields.js";

export enum UnitModelStatus {
	ACTIVE,
	INACTIVE,
}

export type InferUnitMetaType<TFields extends readonly Field[]> = {
	[K in TFields[number] as K["ref_id"]]: K["__primitive_type"];
};

export type Unit<TData = Record<string, any>> = {
	id: string;
	model_ref_id: string;
	created_at: Date;
	updated_at: Date;
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
	ref_id: string;
	alt_id?: string;
	name: string;
	status: UnitModelStatus;
	fields?: Field[];
	hooks?: UnitHooks<any>;
};

export type UnitModelOptions<TFields extends readonly Field[]> = {
	ref_id: string;
	alt_id?: string;
	name: string;
	status?: UnitModelStatus;
	fields?: TFields;
	hooks?: UnitHooks<InferUnitMetaType<TFields>>;
};

export function defineUnitModel<const TFields extends readonly Field[]>(options: UnitModelOptions<TFields>): UnitModel {
	const unitModel: UnitModel = {
		...options,
		status: options.status ?? UnitModelStatus.ACTIVE,
		fields: options.fields as unknown as Field[],
		hooks: options.hooks as unknown as UnitHooks<any>,
	};
	return unitModel;
}
