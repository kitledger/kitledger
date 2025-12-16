import { db } from "./db.js";
import { api_tokens, sessions, users } from "./schema.js";
import { and, eq, gt, isNull } from "drizzle-orm";
import { verifyPassword } from "./crypto.js";
import type { AppUser, Role, Permission } from "./auth.js";

export async function getSessionUserId(sessionId: string): Promise<string | null> {
	const session = await db.query.sessions.findFirst({
		where: and(
			eq(sessions.id, sessionId),
			gt(sessions.expires_at, new Date()),
		),
		columns: {
			user_id: true,
		},
	});
	return session ? session.user_id : null;
}

export async function getTokenUserId(tokenId: string): Promise<string | null> {
	const token = await db.query.api_tokens.findFirst({
		where: and(eq(api_tokens.id, tokenId), isNull(api_tokens.revoked_at)),
		columns: {
			user_id: true,
		},
	});

	if (token) {
		return token.user_id;
	}
	else {
		return null;
	}
}

export async function validateUserCredentials(
	email: string,
	password: string,
): Promise<{ id: string; first_name: string; last_name: string; email: string } | null> {
	const user = await db.query.users.findFirst({
		where: eq(users.email, email),
		columns: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			password_hash: true,
		},
	});

	if (!user || !user.password_hash) {
		return null;
	}

	const validPassword = await verifyPassword(user.password_hash, password);

	if (validPassword) {
		return {
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
		};
	}
	else {
		return null;
	}
}

export async function getAuthUser(userId: string): Promise<AppUser | null> {

    // 1. Fetch the user and all related data in one go.
    // This requires the `userRelations` to be correctly defined (see below).
    const userProfile = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
            password_hash: false, // Exclude the password hash
        },
        with: {
            // Fetch system permissions (requires relation)
            system_permissions: true,
            // Fetch direct permission assignments
            permissions: {
                with: {
                    permission: true, // Include the actual permission details
                },
            },
            // Fetch user_roles
            roles: {
                with: {
                    // For each user_role, fetch the role
                    role: {
                        with: {
                            // For each role, fetch its permission assignments
                            permissions: {
                                with: {
                                    permission: true, // Include the permission details
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!userProfile) {
        return null;
    }

    // 2. Process the nested data to match the AppUser type

    // Get the final list of Role objects
    const userRoles: Role[] = userProfile.roles.map(
        (userRole) => userRole.role,
    );

    // Use a Map to deduplicate permissions
    const permissionMap = new Map<string, Permission>();

    // Add permissions from roles
    for (const userRole of userProfile.roles) {
        for (const permAssignment of userRole.role.permissions) {
            if (permAssignment.permission) {
                permissionMap.set(
                    permAssignment.permission.id,
                    permAssignment.permission,
                );
            }
        }
    }

    // Add/overwrite with direct permissions
    for (const permAssignment of userProfile.permissions) {
        if (permAssignment.permission) {
            permissionMap.set(
                permAssignment.permission.id,
                permAssignment.permission,
            );
        }
    }

    // Convert the map back to an array
    const allPermissions = Array.from(permissionMap.values());

    // 3. Construct the final AppUser object
    const appUser: AppUser = {
        ...userProfile,
        roles: userRoles,
        permissions: allPermissions,
        system_permissions: userProfile.system_permissions,
    };

    return appUser;
}

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
