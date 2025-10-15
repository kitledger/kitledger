import { db } from "../../services/database/db.ts";
import { sessions } from "../../services/database/schema.ts";
import { sessionConfig } from "../../config.ts";
import { randomUUIDv7 } from "bun";

export async function startSession(userId: string): Promise<string> {
	const sessionId = randomUUIDv7();

	await db.insert(sessions).values({
		id: sessionId,
		user_id: userId,
		expires_at: new Date(Date.now() + (sessionConfig.ttl * 1000)),
		created_at: new Date(),
	});

	return sessionId;
}
