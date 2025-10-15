import { db } from "../../services/database/db.ts";
import { api_tokens, sessions } from "../../services/database/schema.ts";
import { and, eq, isNull } from "drizzle-orm";

export async function getSessionUserId(sessionId: string): Promise<string | null> {
	const cache = await db.query.sessions.findFirst({
		where: and(eq(sessions.id, sessionId)),
		columns: {
			user_id: true,
		},
	});
	return cache ? cache.user_id : null;
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
