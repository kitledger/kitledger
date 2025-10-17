import { ApiTokenFactory, SessionFactory, UserFactory } from "../../src/domain/auth/factories.js";
import { system_permissions, users } from "../../src/services/database/schema.js";
import { createSuperUser } from "../../src/domain/auth/user_actions.js";
import { db } from "../../src/services/database/db.js";
import { SYSTEM_ADMIN_PERMISSION } from "../../src/domain/auth/permission_actions.js";
import { assembleSessionJwtPayload, assembleApiTokenJwtPayload, verifyToken, signToken } from "../../src/domain/auth/jwt_actions.js";
import { startSession } from "../../src/domain/auth/session_actions.js";
import { v7 } from "uuid";
import { createToken } from "../../src/domain/auth/token_actions.js";
import { getSessionUserId, getTokenUserId } from "../../src/domain/auth/user_repository.js";
import { hashPassword } from "../../src/domain/auth/utils.js";
import { eq } from "drizzle-orm";
import { describe, it, afterAll, expect } from "vitest";
describe("Auth Domain Tests", () => {
    /*afterAll(async () => {
        // Close up Drizzle DB Connection
        await db.$client.end();
    });*/
    it("User factory creates valid User objects", () => {
        const factory = new UserFactory();
        const users = factory.make(5);
        expect(users.length).toBe(5);
        users.forEach(user => {
            expect(typeof user.id).toBe("string");
            expect(typeof user.email).toBe("string");
            expect(user.email.includes("@")).toBe(true);
            expect(typeof user.password_hash).toBe("string");
        });
    });
    it("Session factory creates valid Session objects", () => {
        const factory = new SessionFactory();
        const sessions = factory.make(3);
        expect(sessions.length).toBe(3);
        sessions.forEach(session => {
            expect(typeof session).toBe("string");
            expect(session.length).toBe(36);
        });
    });
    it("ApiToken factory creates valid ApiToken objects", () => {
        const factory = new ApiTokenFactory();
        const tokens = factory.make(4);
        expect(tokens.length).toBe(4);
        tokens.forEach(token => {
            expect(typeof token.id).toBe("string");
            expect(typeof token.user_id).toBe("string");
            expect(typeof token.name).toBe("string");
            expect(token.revoked_at === null || token.revoked_at instanceof Date).toBe(true);
        });
    });
    it("createSuperUser returns a valid NewSuperUser object", async () => {
        const factory = new UserFactory();
        const fakeUser = factory.make(1)[0];
        if (!fakeUser) {
            throw new Error("Failed to create fake user for super user test");
        }
        const newSuperUser = await createSuperUser(fakeUser.first_name, fakeUser.last_name, fakeUser.email);
        expect(newSuperUser).not.toBeNull();
        expect(typeof newSuperUser?.id).toBe("string");
        expect(newSuperUser?.first_name === fakeUser.first_name).toBe(true);
        expect(newSuperUser?.last_name === fakeUser.last_name).toBe(true);
        expect(newSuperUser?.email === fakeUser.email).toBe(true);
        expect(typeof newSuperUser?.password === "string").toBe(true);
        expect(typeof newSuperUser?.api_token === "string").toBe(true);
        expect(newSuperUser && newSuperUser.api_token.length > 0).toBe(true);
        expect(newSuperUser && newSuperUser.password.length > 0).toBe(true);
        if (newSuperUser === null) {
            throw new Error("Failed to create super user for verification test");
        }
        // Retrieve the user from the database to verify it was created.
        const userFromDb = await db.query.users.findFirst({
            where: eq(users.id, newSuperUser.id),
        });
        expect(userFromDb).not.toBeNull();
        expect(userFromDb?.first_name === newSuperUser.first_name).toBe(true);
        expect(userFromDb?.last_name === newSuperUser.last_name).toBe(true);
        const userEmailFromDb = await db.query.users.findFirst({
            where: eq(users.email, newSuperUser.email),
        });
        expect(userEmailFromDb?.id === newSuperUser.id).toBe(true);
        const systemPermissionFromDbRes = await db.query.system_permissions.findMany({
            where: eq(system_permissions.user_id, newSuperUser.id),
        });
        const systemPermissionFromDb = systemPermissionFromDbRes.map(permission => permission.permission);
        expect(systemPermissionFromDb?.includes(SYSTEM_ADMIN_PERMISSION)).toBe(true);
    });
    it("assembleSessionJwtPayload creates a valid JWT payload", () => {
        const sessionId = "test-session-id";
        const payload = assembleSessionJwtPayload(sessionId);
        expect(payload.jti === sessionId).toBe(true);
        expect(payload.token_type === "SESSION").toBe(true);
        const apiTokenPayload = assembleApiTokenJwtPayload("test-api-token-id");
        expect(apiTokenPayload.jti === "test-api-token-id").toBe(true);
        expect(apiTokenPayload.token_type === "API").toBe(true);
    });
    it("verifyToken and signToken work correctly", async () => {
        const sampleJTI = v7();
        const payload = { jti: sampleJTI, token_type: "TEST" };
        const token = await signToken(payload);
        expect(typeof token === "string" && token.length > 0).toBe(true);
        const verifiedPayload = await verifyToken(token);
        expect(verifiedPayload.jti === payload.jti).toBe(true);
        expect(verifiedPayload.token_type === payload.token_type).toBe(true);
        // Test with an invalid token
        try {
            const invalidToken = v7();
            await verifyToken(invalidToken);
            expect(false).toBe(true);
        }
        catch (error) {
            expect(error instanceof Error).toBe(true);
        }
    });
    it("startSession creates a valid session and retrieves user ID", async () => {
        const factory = new UserFactory();
        const fakeUser = factory.make(1)[0];
        if (!fakeUser) {
            throw new Error("Failed to create fake user for session test");
        }
        // TODO: Refactor to use a regular user creation function once available
        const newSuperUser = await createSuperUser(fakeUser.first_name, fakeUser.last_name, fakeUser.email);
        if (newSuperUser === null) {
            throw new Error("Failed to create super user for session test");
        }
        const sessionId = await startSession(newSuperUser.id);
        expect(typeof sessionId === "string" && sessionId.length > 0).toBe(true);
        const retrievedUserId = await getSessionUserId(sessionId);
        expect(retrievedUserId === newSuperUser.id).toBe(true);
    });
    it("createToken and getTokenUserId work correctly", async () => {
        const user = new UserFactory().make(1)[0];
        if (!user) {
            throw new Error("Failed to create fake user for token test");
        }
        await db.insert(users).values(user);
        const tokenId = await createToken(user.id, "Test Token");
        expect(typeof tokenId === "string" && tokenId.length > 0).toBe(true);
        const retrievedUserId = await getTokenUserId(tokenId);
        expect(retrievedUserId === user.id).toBe(true);
        // Test with a non-existent token
        const nonExistentTokenId = v7();
        const nonExistentUserId = await getTokenUserId(nonExistentTokenId);
        expect(nonExistentUserId).toBeNull();
    });
    it("hashPassword generates a valid hash", async () => {
        const password = "securePassword123";
        const hashedPassword = await hashPassword(password);
        expect(typeof hashedPassword === "string" && hashedPassword.length > 0).toBe(true);
        // Check if the hash is a valid argon2 hash (basic check)
        expect(hashedPassword.startsWith("$argon2id$")).toBe(true);
    });
});
