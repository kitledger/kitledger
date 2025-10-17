import { workerPool } from "../../src/services/workers/pool.js";
import { availableWorkerTasks } from "../../src/services/workers/worker.js";
import { expect, test } from "vitest";
import { v7 } from "uuid";
test("Worker pool can add and run tasks", async () => {
    const passwordToHash = v7();
    const result = await workerPool.execute(passwordToHash, availableWorkerTasks.HASH_PASSWORD);
    expect(typeof result).toBe("string");
    expect(result?.length).toBeGreaterThan(0);
    expect(result?.startsWith("$argon2id$")).toBe(true);
});
