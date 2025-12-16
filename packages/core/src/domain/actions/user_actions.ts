import { db } from "../../services/database/db.js";
import { randomBytes } from "node:crypto";
import { v7 } from "uuid";
import { SYSTEM_ADMIN_PERMISSION } from "./permission_actions.js";
import { createToken } from "./token_actions.js";
import { assembleApiTokenJwtPayload, signToken } from "./jwt_actions.js";
import { type User } from "../types/auth_types.js";
import { system_permissions, users } from "../../services/database/schema.js";
import { eq, and, isNotNull } from "drizzle-orm";
import { hashPassword } from "../utils/crypto.js";

export type NewSuperUser = Pick<User, "id" | "first_name" | "last_name" | "email"> & {
	password: string;
	api_token: string;
};

export async function createSuperUser(
	firstName: string,
	lastName: string,
	email: string,
	overrideExisting = false,
): Promise<NewSuperUser | null> {
	const newSuperUser: NewSuperUser | null = await db.transaction(async (tx) => {

		// Check if a super user exists, regardless of email.
		const existingAdmin = await tx
			.select()
			.from(system_permissions)
			.where(
				and(
					isNotNull(system_permissions.user_id),
					eq(system_permissions.permission, SYSTEM_ADMIN_PERMISSION)
				),
			)
			.limit(1);

		if (existingAdmin.length > 0 && !overrideExisting) {
			console.error("A super user already exists. Aborting creation.");
			return null;
		}

		try {
			/**
			 * generate a random password.
			 */
			const password = randomBytes(20).toString("hex");
			let passwordHash: string | null = null;

			try {
				passwordHash = await hashPassword(password);
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
