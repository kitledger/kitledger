import { faker } from "@faker-js/faker";
import type { UnitModel } from "./types.ts";
import { BaseFactory } from "../base/base_factory.ts";
import { randomUUIDv7 } from "bun";

export class UnitModelFactory extends BaseFactory<UnitModel> {
	constructor() {
		super(makeUnitModel);
	}
}

const makeUnitModel = (): UnitModel => ({
	id: randomUUIDv7(),
	ref_id: randomUUIDv7(),
	name: faker.science.unit().name,
	alt_id: faker.datatype.boolean() ? randomUUIDv7() : null,
	active: faker.datatype.boolean(),
	base_unit_id: faker.datatype.boolean() ? faker.string.uuid() : null,
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
});
