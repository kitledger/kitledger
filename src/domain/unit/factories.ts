import { faker } from "@faker-js/faker";
import type { UnitModel } from "./types.js";
import { BaseFactory } from "../base/base_factory.js";
import {v7} from "uuid";

export class UnitModelFactory extends BaseFactory<UnitModel> {
	constructor() {
		super(makeUnitModel);
	}
}

const makeUnitModel = (): UnitModel => ({
	id: v7(),
	ref_id: v7(),
	name: faker.science.unit().name,
	alt_id: faker.datatype.boolean() ? v7() : null,
	active: faker.datatype.boolean(),
	base_unit_id: faker.datatype.boolean() ? faker.string.uuid() : null,
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
});
