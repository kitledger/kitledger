import { sign, verify } from "hono/jwt";
import { type JWTPayload } from "hono/utils/jwt/types";
import { authConfig } from "../../config.js";

export enum TokenType {
	SESSION = "SESSION",
	API = "API",
}

export async function verifyToken(token: string): Promise<JWTPayload> {
	const currentSecret = authConfig.secret;

	try {
		const decoded = await verify(token, currentSecret, authConfig.jwtAlgorithm);
		return decoded;
	}
	catch (currentSecretError) {
		const pastSecrets = authConfig.pastSecrets || [];

		if (pastSecrets.length > 0) {
			try {
				const decodedFromPast = await Promise.any(
					pastSecrets.map(async (pastSecret) => {
						try {
							const decoded = await verify(token, pastSecret, authConfig.jwtAlgorithm);
							return decoded;
						}
						catch (err) {
							console.warn(
								`Failed to verify token with past secrets (${
									err instanceof Error ? err.message : String(err)
								}`,
							);
							throw err;
						}
					}),
				);
				return decodedFromPast;
			}
			catch (aggregateError) {
				console.warn("All past secret verifications failed:", (aggregateError as AggregateError).errors);
			}
		}

		console.error("Token verification ultimately failed:", currentSecretError);
		throw new Error("Invalid or expired token.");
	}
}

export async function signToken(payload: JWTPayload): Promise<string> {
	const currentSecret = authConfig.secret;

	try {
		const token = await sign(payload, currentSecret, authConfig.jwtAlgorithm);
		return token;
	}
	catch (error) {
		console.error("Failed to sign token:", error);
		throw new Error("Token signing failed.");
	}
}

export function assembleApiTokenJwtPayload(tokenId: string): JWTPayload {
	return {
		jti: tokenId,
		token_type: TokenType.API,
	};
}

export function assembleSessionJwtPayload(sessionId: string): JWTPayload {
	return {
		jti: sessionId,
		token_type: TokenType.SESSION,
	};
}
