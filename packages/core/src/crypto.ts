import { hash, verify } from "@node-rs/argon2";

export function hashPassword(input: string): Promise<string> {
	const hashOptions = {
		type: 2, // argon2id
		memoryCost: 65536, // 64 MiB
		timeCost: 5, // 5 iterations
		parallelism: 1,
	};

	return hash(input, hashOptions);
}

export function verifyPassword(hashStr: string, input: string): Promise<boolean> {
	return verify(hashStr, input);
}