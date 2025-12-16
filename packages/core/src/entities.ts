export enum EntityModelStatus {
	ACTIVE,
	INACTIVE,
}

export type EntityModelOptions = {
	ref_id: string;
	alt_id?: string;
	name: string;
	status?: EntityModelStatus;
};

export type EntityModel = EntityModelOptions;

export function defineEntityModel(options: EntityModelOptions) {
	return options;
}
