import { test, expect } from "vitest";
import { auth } from "../../src/services/http/middleware/auth_middleware.js";
import {} from "hono";
import { serverConfig } from "../../src/config.js";
test("Hono Auth middleware returns 401 for missing token", async () => {
    const c = {
        req: {
            header: () => null,
        },
        json: (body, status) => {
            expect(status).toBe(401);
            expect(body.error).toBe("Unauthorized");
        },
        env: {},
        finalized: false,
        get: () => undefined,
        set: () => { },
    };
    await auth(c, async () => { });
});
test("CORS Server Configuration is set correctly", () => {
    expect(serverConfig.cors).toBeDefined();
    expect(serverConfig.cors.allowMethods?.includes("GET")).toBe(true);
    expect(serverConfig.cors.allowHeaders?.includes("Authorization")).toBe(true);
    expect(serverConfig.cors.maxAge && serverConfig.cors.maxAge >= 3600).toBe(true);
    expect(serverConfig.cors.credentials).toBe(false);
});
