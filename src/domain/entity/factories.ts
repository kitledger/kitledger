import { faker } from "@faker-js/faker";
import type { EntityModel } from "./types.js";
import { BaseFactory } from "../base/base_factory.js";

export class EntityModelFactory extends BaseFactory<EntityModel> {
	constructor() {
		super(makeEntityModel);
	}
}

const makeEntityModel = (): EntityModel => ({
	id: faker.string.uuid(),
	ref_id: faker.string.alphanumeric(10),
	name: faker.company.name(),
	alt_id: faker.datatype.boolean() ? faker.string.alphanumeric(8) : null,
	active: faker.datatype.boolean(),
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
});
