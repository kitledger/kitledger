import { workerPool } from "../../src/services/workers/pool.ts";
import { availableWorkerTasks } from "../../src/services/workers/worker.ts";
import { expect, test } from "bun:test";
import { randomUUIDv7 } from "bun";

test("Worker pool can add and run tasks", async () => {

	const passwordToHash = randomUUIDv7();

	const result = await workerPool.execute(passwordToHash, availableWorkerTasks.HASH_PASSWORD) as string | undefined;

	expect(typeof result).toBe("string");
	expect(result?.length).toBeGreaterThan(0);
	expect(result?.startsWith("$argon2id$")).toBe(true);
});