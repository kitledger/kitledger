import { db } from "../../services/database/db.js";
import { api_tokens } from "../../services/database/schema.js";
import { v7 } from "uuid";

export async function createToken(userId: string, name?: string | null): Promise<string> {
	const tokenId = v7();

	await db.insert(api_tokens).values({
		id: tokenId,
		user_id: userId,
		name: name ?? "API Token",
		revoked_at: null,
	});

	return tokenId;
}
