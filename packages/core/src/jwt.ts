import { SignJWT, jwtVerify, type JWTPayload } from "jose";

import { AuthConfigOptions } from "./auth.js";

export enum TokenType {
	SESSION = "SESSION",
	API = "API",
}

const encodeSecret = (secret: string) => new TextEncoder().encode(secret);

export async function verifyToken(authConfig: AuthConfigOptions, token: string): Promise<JWTPayload> {
	const currentSecret = authConfig.secret;

	try {
		const { payload } = await jwtVerify(token, encodeSecret(currentSecret), {
			algorithms: [authConfig.jwtAlgorithm],
		});
		return payload;
	} catch (currentSecretError) {
		const pastSecrets = authConfig.pastSecrets || [];

		if (pastSecrets.length > 0) {
			try {
				const decodedFromPast = await Promise.any(
					pastSecrets.map(async (pastSecret) => {
						try {
							const { payload } = await jwtVerify(token, encodeSecret(pastSecret), {
								algorithms: [authConfig.jwtAlgorithm],
							});
							return payload;
						} catch (err) {
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
			} catch (aggregateError) {
				console.warn("All past secret verifications failed:", (aggregateError as AggregateError).errors);
			}
		}

		console.error("Token verification ultimately failed:", currentSecretError);
		throw new Error("Invalid or expired token.");
	}
}

export async function signToken(authConfig: AuthConfigOptions, payload: JWTPayload): Promise<string> {
	const currentSecret = authConfig.secret;

	try {
		const token = await new SignJWT(payload)
			.setProtectedHeader({ alg: authConfig.jwtAlgorithm })
			.sign(encodeSecret(currentSecret));
		return token;
	} catch (error) {
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
