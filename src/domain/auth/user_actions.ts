import { db } from "../../services/database/db.js";
import { randomBytes } from "node:crypto";
import {v7} from "uuid";
import { SYSTEM_ADMIN_PERMISSION } from "./permission_actions.js";
import { createToken } from "./token_actions.js";
import { assembleApiTokenJwtPayload, signToken } from "./jwt_actions.js";
import { workerPool } from "../../services/workers/pool.js";
import { availableWorkerTasks } from "../../services/workers/worker.js";
import { type User } from "./types.js";
import { system_permissions, users } from "../../services/database/schema.js";

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
				passwordHash = await workerPool?.execute(password, availableWorkerTasks.HASH_PASSWORD);
			}
			catch (error) {
				console.error("Error hashing password:", error);
				passwordHash = null;
			}

			if (!passwordHash) {
				throw new Error("Failed to hash password");
			}

			const userId = v7();
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
				id: v7(),
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
