import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { v7 } from "uuid";

import { type KitledgerDb } from "./db.js";
import {
	api_tokens,
	permission_assignments,
	permissions,
	roles,
	system_permissions,
	user_roles,
	users,
	sessions,
} from "./schema.js";

export type ApiTokenInsert = InferInsertModel<typeof api_tokens>;
export type ApiToken = InferSelectModel<typeof api_tokens>;

export type PermissionAssignmentInsert = InferInsertModel<typeof permission_assignments>;
export type PermissionAssignment = InferSelectModel<typeof permission_assignments>;

export type PermissionInsert = InferInsertModel<typeof permissions>;
export type Permission = InferSelectModel<typeof permissions>;

export type RoleInsert = InferInsertModel<typeof roles>;
export type Role = InferSelectModel<typeof roles>;

export type SystemPermissionInsert = InferInsertModel<typeof system_permissions>;
export type SystemPermission = InferSelectModel<typeof system_permissions>;

export type UserInsert = InferInsertModel<typeof users>;
export type User = InferSelectModel<typeof users>;

export type UserRoleInsert = InferInsertModel<typeof user_roles>;
export type UserRole = InferSelectModel<typeof user_roles>;

export type AppUser = Omit<User, "password_hash"> & {
	roles: Role[];
	permissions: Permission[];
	system_permissions: SystemPermission[];
};

const SYSTEM_PERMISSION_PREFIX = "KL_";
export const SYSTEM_ADMIN_PERMISSION = `${SYSTEM_PERMISSION_PREFIX}SYSTEM_ADMIN`;

export async function startSession(
	db: KitledgerDb,
	userId: string,
	sessionConfig: SessionConfigOptions,
): Promise<string> {
	const sessionId = v7();

	await db.insert(sessions).values({
		id: sessionId,
		user_id: userId,
		expires_at: new Date(Date.now() + sessionConfig.ttl * 1000),
		created_at: new Date(),
	});

	return sessionId;
}

export async function createToken(db: KitledgerDb, userId: string, name?: string | null): Promise<string> {
	const tokenId = v7();

	await db.insert(api_tokens).values({
		id: tokenId,
		user_id: userId,
		name: name ?? "API Token",
		revoked_at: null,
	});

	return tokenId;
}

export type AuthConfigOptions = {
	secret: string;
	pastSecrets: string[];
	jwtAlgorithm: "HS256";
};

export type SessionConfigOptions = {
	cookieName: string;
	ttl: number;
};
