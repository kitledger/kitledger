import { createMiddleware } from "hono/factory";
import { TokenType, verifyToken } from "../../../domain/auth/jwt_actions.js";
import { getSessionUserId, getTokenUserId } from "../../../domain/auth/user_repository.js";

export const auth = createMiddleware(async (c, next) => {
	const raw_token = c.req.header("Authorization")?.replace("Bearer ", "");

	// Return early if no token is provided.
	if (!raw_token) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	try {
		const token = await verifyToken(raw_token);

		if (!token || !token.token_type) {
			throw new Error("Token type is missing or invalid.");
		}

		switch (String(token.token_type).toUpperCase() as TokenType) {
			case TokenType.SESSION: {
				if (!token.jti) {
					throw new Error("Invalid session ID.");
				}
				const sessionUserId = await getSessionUserId(String(token.jti));

				if (!sessionUserId) {
					throw new Error("Invalid session ID.");
				}
				// Handle session token logic here
				c.set("user", sessionUserId);
				break;
			}
			case TokenType.API: {
				if (!token.jti) {
					throw new Error("Invalid token ID.");
				}
				const tokenUserId = await getTokenUserId(String(token.jti));

				if (!tokenUserId) {
					throw new Error("Invalid token ID.");
				}

				c.set("user", tokenUserId);

				// Handle integration token logic here
				break;
			}
			default: {
				throw new Error("Invalid token type.");
			}
		}
	}
	catch (error) {
		console.error("Token verification failed:", error);

		// Try to get the error message from the error object, otherwise use a generic message.
		const errorMessage = error instanceof Error ? error.message : "Unauthorized";

		return c.json({ error: errorMessage }, 401);
	}

	await next();
});
