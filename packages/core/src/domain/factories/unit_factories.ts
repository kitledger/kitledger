import { faker } from "@faker-js/faker";
import { UnitModel } from "../types/unit_model_types.js";
import { BaseFactory } from "../factories/base_factory.js";
import { v7 as generate } from "uuid";

export class UnitModelFactory extends BaseFactory<UnitModel> {
	constructor() {
		super(makeUnitModel);
	}
}

const makeUnitModel = (): UnitModel => ({
	id: generate(),
	ref_id: generate(),
	name: faker.science.unit().name,
	alt_id: faker.datatype.boolean() ? generate() : null,
	active: faker.datatype.boolean(),
	base_unit_id: faker.datatype.boolean() ? faker.string.uuid() : null,
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
});
