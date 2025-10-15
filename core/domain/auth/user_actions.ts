import { db } from "../../services/database/db.ts";
import { randomBytes } from "node:crypto";
import { randomUUIDv7 } from "bun";
import { SYSTEM_ADMIN_PERMISSION } from "./permission_actions.ts";
import { createToken } from "./token_actions.ts";
import { assembleApiTokenJwtPayload, signToken } from "./jwt_actions.ts";
import { workerPool } from "../../services/workers/pool.ts";
import { availableWorkerTasks } from "../../services/workers/worker.ts";
import { type User } from "./types.ts";
import { system_permissions, users } from "../../services/database/schema.ts";

export type NewSuperUser = Pick<User, "id" | "first_name" | "last_name" | "email"> & {
	password: string;
	api_token: string;
};

export async function createSuperUser(
	firstName: string,
	lastName: string,
	email: string,
): Promise<NewSuperUser | null> {
	const newSuperUser: NewSuperUser | null = await db.transaction(async (tx) => {
		try {
			/**
			 * generate a random password.
			 */
			const password = randomBytes(20).toString("hex");
			let passwordHash = null;

			try {
				passwordHash = await workerPool.execute(password, availableWorkerTasks.HASH_PASSWORD);
			}
			catch (error) {
				console.error("Error hashing password:", error);
				passwordHash = null;
			}

			if (!passwordHash) {
				throw new Error("Failed to hash password");
			}

			const userId = randomUUIDv7();
			const newUser = await tx
				.insert(users)
				.values({
					id: userId,
					first_name: firstName,
					last_name: lastName,
					email: email,
					password_hash: passwordHash as string,
					created_at: new Date(),
				})
				.returning();

			if (!newUser[0]) {
				throw new Error("Failed to create user");
			}

			await tx.insert(system_permissions).values({
				id: randomUUIDv7(),
				user_id: newUser[0].id,
				permission: SYSTEM_ADMIN_PERMISSION,
			});

			return {
				id: newUser[0].id,
				first_name: firstName,
				last_name: lastName,
				email: email,
				password: password,
				api_token: "",
			};
		}
		catch (error) {
			console.error("Error creating super user:", error);
			tx.rollback();
			return null;
		}
	});

	// Create API token for the new super user, using the encapsulated function.

	if (!newSuperUser) {
		return null;
	}

	const tokenName = `${firstName} ${lastName} Super User Token`.slice(0, 64);
	const apiToken = await createToken(newSuperUser.id, tokenName);

	if (!apiToken) {
		console.error("Failed to create API token for super user");
	}

	newSuperUser.api_token = await signToken(assembleApiTokenJwtPayload(apiToken));

	return newSuperUser;
}
