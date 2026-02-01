import { faker } from "@faker-js/faker";
import { v7 } from "uuid";

import { Account, BalanceType } from "./accounts.js";
import { ApiToken, Permission, PermissionAssignment, Role, SystemPermission, User, UserRole } from "./auth.js";

/**
 * A generic factory function to create an array of items.
 * @param factory A function that creates a single item.
 * @param count The number of items to create.
 * @returns An array of created items.
 */
export const factory = <T>(factory: () => T, count: number): T[] => {
	return Array.from({ length: count }, factory);
};

export class BaseFactory<T> {
	private factory: () => T;

	constructor(factory: () => T) {
		this.factory = factory;
	}

	public make(count: number): T[] {
		return factory(this.factory, count);
	}
}

export class ApiTokenFactory extends BaseFactory<ApiToken> {
	constructor() {
		super(makeApiToken);
	}
}

export class PermissionFactory extends BaseFactory<Permission> {
	constructor() {
		super(makePermission);
	}
}

export class PermissionAssignmentFactory extends BaseFactory<PermissionAssignment> {
	constructor() {
		super(makePermissionAssignment);
	}
}

export class RoleFactory extends BaseFactory<Role> {
	constructor() {
		super(makeRole);
	}
}

export class SessionFactory extends BaseFactory<string> {
	constructor() {
		super(makeSession);
	}
}

export class SystemPermissionFactory extends BaseFactory<SystemPermission> {
	constructor() {
		super(makeSystemPermission);
	}
}

export class UserFactory extends BaseFactory<User> {
	constructor() {
		super(makeUser);
	}
}

export class UserRoleFactory extends BaseFactory<UserRole> {
	constructor() {
		super(makeUserRole);
	}
}

const makeApiToken = (): ApiToken => ({
	id: faker.string.uuid(),
	user_id: faker.string.uuid(),
	name: faker.lorem.word(),
	revoked_at: faker.datatype.boolean() ? faker.date.recent() : null,
});

const makePermissionAssignment = (): PermissionAssignment => ({
	id: faker.string.uuid(),
	permission_id: faker.string.uuid(),
	user_id: faker.datatype.boolean() ? faker.string.uuid() : null,
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
	role_id: faker.datatype.boolean() ? faker.string.uuid() : null,
});

const makePermission = (): Permission => ({
	id: faker.string.uuid(),
	name: `can_${faker.word.verb()}_${faker.word.noun()}`,
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
	description: faker.lorem.sentence(),
});

const makeRole = (): Role => ({
	id: faker.string.uuid(),
	name: faker.person.jobTitle(),
	description: faker.lorem.sentence(),
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
});

const makeSession = (): string => v7();

const makeSystemPermission = (): SystemPermission => ({
	id: faker.string.uuid(),
	permission: `system:${faker.word.noun()}:${faker.word.verb()}`,
	user_id: faker.string.uuid(),
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
});

const makeUser = (): User => {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	return {
		id: faker.string.uuid(),
		first_name: firstName,
		last_name: lastName,
		email: faker.internet.email({ firstName, lastName }),
		password_hash: faker.internet.password({ length: 60 }),
		created_at: faker.date.past(),
		updated_at: faker.date.recent(),
	};
};

const makeUserRole = (): UserRole => ({
	id: faker.string.uuid(),
	user_id: faker.string.uuid(),
	role_id: faker.string.uuid(),
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
});

export class AccountFactory extends BaseFactory<Account> {
	constructor() {
		super(makeAccount);
	}
}

const makeAccount = (): Account => ({
	id: v7(),
	ref_id: v7(),
	alt_id: v7(),
	name: faker.finance.accountName(),
	balance_type: faker.helpers.arrayElement(Object.values(BalanceType)),
	ledger_id: v7(),
	parent_id: v7(),
	active: true,
	created_at: faker.date.past(),
	updated_at: faker.date.recent(),
	meta: {},
});
